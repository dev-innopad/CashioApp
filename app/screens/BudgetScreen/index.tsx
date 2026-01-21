// screens/FinancialReportScreen.tsx
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  // Modal,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AppMainContainer from '../../components/AppMainContainer';
import DatePicker from 'react-native-date-picker';
import {
  TrendingUp,
  Target,
  DollarSign,
  PiggyBank,
  ChevronLeft,
  Bell,
  Check,
  Circle,
  Plus,
  Download,
  Share2,
  Edit2,
  X,
  Calendar,
  Percent,
  Wallet,
} from 'lucide-react-native';
import {_showToast} from '../../services/UIs/ToastConfig';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../../store';
import {
  addGoal,
  updateGoal,
  deleteGoal,
  addFundsToGoal,
  updateFinancialSetting,
  updateMonthlyIncome,
  updateAutoSavePercentage,
} from '../../store/reducers/goalsSlice';
import AppModal from '../../components/AppModal';
import Modal from 'react-native-modal';

interface GoalFormData {
  name: string;
  target: string;
  saved: string;
  color: string;
  deadline: string;
}

const defaultColors = [
  '#F97316',
  '#22D3EE',
  '#86EFAC',
  '#A855F7',
  '#FF6B6B',
  '#4ECDC4',
  '#F4C66A',
  '#8B5CF6',
  '#10B981',
  '#EC4899',
];

export default function FinancialReportScreen({navigation}: any) {
  const dispatch = useDispatch();

  // Get data from Redux
  const expenses = useSelector(
    (state: RootState) => state.userData.expenses || [],
  );
  const categories = useSelector(
    (state: RootState) => state.userData.categories || [],
  );
  const monthlyBudget = useSelector(
    (state: RootState) => state.userData.monthlyBudget || 0,
  );

  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const goals = useSelector((state: RootState) => state.goals.goals);
  const financialSettings = useSelector(
    (state: RootState) => state.goals.financialSettings,
  );
  const monthlyIncome = useSelector(
    (state: RootState) => state.goals.monthlyIncome,
  );
  const autoSavePercentage = useSelector(
    (state: RootState) => state.goals.autoSavePercentage,
  );

  // State for modals and forms
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showAddFundsModal, setShowAddFundsModal] = useState<string | null>(
    null,
  );
  const [showEditGoalModal, setShowEditGoalModal] = useState<string | null>(
    null,
  );
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showAutoSaveModal, setShowAutoSaveModal] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const [newIncome, setNewIncome] = useState(monthlyIncome.toString());
  const [newAutoSave, setNewAutoSave] = useState(autoSavePercentage.toString());

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEditDatePicker, setShowEditDatePicker] = useState(false);

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  };

  // Goal form state
  const [goalFormData, setGoalFormData] = useState<GoalFormData>({
    name: '',
    target: '',
    saved: '',
    color: defaultColors[0],
    deadline: new Date().toISOString().split('T')[0],
  });

  const [editingGoal, setEditingGoal] = useState<any>(null);

  // Calculate dynamic statistics
  const calculateTotals = () => {
    const totalExpense = expenses.reduce(
      (sum: number, exp: any) => sum + (exp.amount || 0),
      0,
    );
    const totalBudget = monthlyBudget || 0;

    // Total saved in goals
    const totalGoalSaved = goals.reduce((sum, goal) => sum + goal.saved, 0);
    const totalGoalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);

    // Monthly savings calculation
    const monthlySavings = monthlyIncome - totalExpense;
    const autoSaveAmount = (monthlyIncome * autoSavePercentage) / 100;

    // Net worth (simplified calculation)
    const netWorth = totalGoalSaved + monthlySavings;

    return {
      totalExpense,
      totalBudget,
      monthlyIncome,
      totalGoalSaved,
      totalGoalTarget,
      monthlySavings,
      autoSaveAmount,
      netWorth,
    };
  };

  const totals = calculateTotals();

  useEffect(() => {
    if (monthlyIncome === 0 || autoSavePercentage === 0) {
      setShowWelcomeModal(true);
    }
  }, []);

  // Calculate goal percentage
  const calculatePercentage = (saved: number, target: number) => {
    if (target === 0) return 0;
    return Math.min(Math.round((saved / target) * 100), 100);
  };

  // Calculate net worth change (simplified - compare with previous month)
  const calculateNetWorthChange = () => {
    // In a real app, you would compare with previous month's data
    // For now, we'll use a random positive change
    return 12.5; // 12.5% increase
  };

  const netWorthChange = calculateNetWorthChange();

  // Handle adding new goal
  const handleAddGoal = () => {
    if (!goalFormData.name.trim() || !goalFormData.target) {
      _showToast('Please fill all required fields', 'error');
      return;
    }

    const target = parseFloat(goalFormData.target);
    const saved = parseFloat(goalFormData.saved) || 0;

    if (isNaN(target) || target <= 0) {
      _showToast('Please enter a valid target amount', 'error');
      return;
    }

    if (saved > target) {
      _showToast('Saved amount cannot exceed target amount', 'error');
      return;
    }

    dispatch(
      addGoal({
        name: goalFormData.name,
        target,
        saved,
        color: goalFormData.color,
        deadline: goalFormData.deadline,
      }),
    );

    _showToast('Goal added successfully', 'success');
    setShowGoalModal(false);
    resetGoalForm();
  };

  // Handle editing goal
  const handleEditGoal = () => {
    if (!editingGoal) return;

    const target = parseFloat(goalFormData.target);
    const saved = parseFloat(goalFormData.saved) || 0;

    if (!goalFormData.name.trim() || isNaN(target) || target <= 0) {
      _showToast('Please fill all required fields', 'error');
      return;
    }

    if (saved > target) {
      _showToast('Saved amount cannot exceed target amount', 'error');
      return;
    }

    dispatch(
      updateGoal({
        ...editingGoal,
        name: goalFormData.name,
        target,
        saved,
        color: goalFormData.color,
        deadline: goalFormData.deadline,
      }),
    );

    _showToast('Goal updated successfully', 'success');
    setShowEditGoalModal(null);
    setEditingGoal(null);
    resetGoalForm();
  };

  // Handle adding funds to goal
  const handleAddFunds = (goalId: string) => {
    const amount = parseFloat(fundAmount);

    if (isNaN(amount) || amount <= 0) {
      _showToast('Please enter a valid amount', 'error');
      return;
    }

    dispatch(addFundsToGoal({goalId, amount}));
    _showToast('Funds added successfully', 'success');
    setShowAddFundsModal(null);
    setFundAmount('');
  };

  // Handle deleting goal
  const handleDeleteGoal = (goalId: string) => {
    Alert.alert('Delete Goal', 'Are you sure you want to delete this goal?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          dispatch(deleteGoal(goalId));
          _showToast('Goal deleted', 'success');
        },
      },
    ]);
  };

  const handleDeletePress = (goalId: string) => {
    setGoalToDelete(goalId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (goalToDelete) {
      dispatch(deleteGoal(goalToDelete));
      _showToast('Goal deleted', 'success');
      setShowDeleteModal(false);
      setGoalToDelete(null);
    }
  };

  // Handle financial setting toggle
  const handleToggleSetting = (id: string, enabled: boolean) => {
    dispatch(updateFinancialSetting({id, enabled: !enabled}));
  };

  // Handle income update
  const handleUpdateIncome = () => {
    const income = parseFloat(newIncome);
    if (isNaN(income) || income <= 0) {
      _showToast('Please enter a valid income amount', 'error');
      return;
    }

    dispatch(updateMonthlyIncome(income));
    _showToast('Monthly income updated', 'success');
    setShowIncomeModal(false);
  };

  // Handle auto-save percentage update
  const handleUpdateAutoSave = () => {
    const percentage = parseFloat(newAutoSave);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      _showToast('Please enter a valid percentage (0-100)', 'error');
      return;
    }

    dispatch(updateAutoSavePercentage(percentage));
    _showToast('Auto-save percentage updated', 'success');
    setShowAutoSaveModal(false);
  };

  // Reset goal form
  const resetGoalForm = () => {
    setGoalFormData({
      name: '',
      target: '',
      saved: '0',
      color: defaultColors[0],
      deadline: new Date().toISOString().split('T')[0],
    });
    setEditingGoal(null);
  };

  // Open edit goal modal
  const openEditGoalModal = (goal: any) => {
    setEditingGoal(goal);
    setGoalFormData({
      name: goal.name,
      target: goal.target.toString(),
      saved: goal.saved.toString(),
      color: goal.color,
      deadline: goal.deadline || new Date().toISOString().split('T')[0],
    });
    setShowEditGoalModal(goal.id);
  };

  // Open add funds modal
  const openAddFundsModal = (goal: any) => {
    setEditingGoal(goal);
    setFundAmount('');
    setShowAddFundsModal(goal.id);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get goal progress color
  const getGoalProgressColor = (percentage: number) => {
    if (percentage >= 100) return '#10B981'; // Green
    if (percentage >= 75) return '#F4C66A'; // Yellow
    if (percentage >= 50) return '#F97316'; // Orange
    return '#FF6B6B'; // Red
  };

  return (
    <AppMainContainer hideTop hideBottom>
      <LinearGradient colors={['#141326', '#24224A']} style={{flex: 1}}>
        <StatusBar barStyle={'light-content'} translucent={false} />
        <SafeAreaView style={{flex: 1}}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <ChevronLeft size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Financial Report</Text>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => _showToast('Export feature coming soon', 'info')}>
              <Download size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            {/* Net Worth Section */}
            <View style={styles.profitSection}>
              <View style={styles.profitHeader}>
                <TrendingUp size={24} color="#F4C66A" />
                <Text style={styles.profitTitle}>Net Worth</Text>
              </View>
              <Text style={styles.profitAmount}>
                {formatCurrency(totals.netWorth)}
              </Text>
              {/* <Text
                style={[
                  styles.profitChange,
                  {color: netWorthChange >= 0 ? '#86EFAC' : '#FF6B6B'},
                ]}>
                {netWorthChange >= 0 ? '+' : ''}
                {netWorthChange}% from last month
              </Text> */}
            </View>

            {/* Monthly Overview */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Monthly Overview</Text>
              <View style={styles.overviewGrid}>
                <TouchableOpacity
                  style={styles.overviewItem}
                  onPress={() => setShowIncomeModal(true)}>
                  <DollarSign size={24} color="#F4C66A" />
                  <Text style={styles.overviewLabel}>Income</Text>
                  <Text style={styles.overviewValue}>
                    {monthlyIncome === 0
                      ? 'Not Set'
                      : formatCurrency(totals.monthlyIncome)}
                  </Text>
                  <Text style={styles.overviewEditHint}>
                    {monthlyIncome === 0 ? 'Set Income' : 'Tap to edit'}
                  </Text>
                </TouchableOpacity>
                <View style={styles.overviewItem}>
                  <TrendingUp size={24} color="#FF6B6B" />
                  <Text style={styles.overviewLabel}>Expenses</Text>
                  <Text style={styles.overviewValue}>
                    {formatCurrency(totals.totalExpense)}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.overviewItem}
                  onPress={() => setShowAutoSaveModal(true)}>
                  <PiggyBank size={24} color="#4ECDC4" />
                  <Text style={styles.overviewLabel}>Auto-Save</Text>
                  <Text style={styles.overviewValue}>
                    {autoSavePercentage === 0
                      ? 'Not Set'
                      : `${autoSavePercentage}%`}
                  </Text>
                  <Text style={styles.overviewEditHint}>
                    {autoSavePercentage === 0 ? 'Set Auto-Save' : 'Tap to edit'}
                  </Text>
                </TouchableOpacity>

                <View style={styles.overviewItem}>
                  <Target size={24} color="#F97316" />
                  <Text style={styles.overviewLabel}>Goal Progress</Text>
                  <Text style={styles.overviewValue}>
                    {goals.length > 0
                      ? calculatePercentage(
                          totals.totalGoalSaved,
                          totals.totalGoalTarget,
                        )
                      : 0}
                    %
                  </Text>
                </View>
              </View>
            </View>

            {/* My Saving Goals */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>My Saving Goals</Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => setShowGoalModal(true)}>
                  <Plus size={20} color="#F4C66A" />
                  <Text style={styles.addButtonText}>Add Goal</Text>
                </TouchableOpacity>
              </View>

              {goals.length === 0 ? (
                <View style={styles.emptyState}>
                  <Target size={72} color="rgba(255, 255, 255, 0.2)" />
                  <Text style={styles.emptyStateTitle}>No Savings Goals</Text>
                  <Text style={styles.emptyStateText}>
                    You haven't created any savings goals yet. Add your first
                    goal to start tracking your savings progress!
                  </Text>
                  <TouchableOpacity
                    style={styles.emptyStateButton}
                    onPress={() => setShowGoalModal(true)}>
                    <Text style={styles.emptyStateButtonText}>
                      Create Your First Goal
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                goals.map(goal => {
                  const percentage = calculatePercentage(
                    goal.saved,
                    goal.target,
                  );
                  const progressColor = getGoalProgressColor(percentage);

                  return (
                    <View key={goal.id} style={styles.goalCard}>
                      <View style={styles.goalHeader}>
                        <View style={styles.goalTitleContainer}>
                          <View
                            style={[
                              styles.goalIcon,
                              {backgroundColor: goal.color},
                            ]}>
                            <Target size={16} color="#000" />
                          </View>
                          <View style={styles.goalInfo}>
                            <Text style={styles.goalName}>{goal.name}</Text>
                            {goal.deadline && (
                              <Text style={styles.goalDeadline}>
                                Target:{' '}
                                {new Date(goal.deadline).toLocaleDateString()}
                              </Text>
                            )}
                          </View>
                        </View>
                        <View style={styles.goalActionsHeader}>
                          <Text
                            style={[
                              styles.goalPercentage,
                              {color: progressColor},
                            ]}>
                            {percentage}%
                          </Text>
                          <TouchableOpacity
                            style={styles.smallActionButton}
                            onPress={() => openEditGoalModal(goal)}>
                            <Edit2 size={16} color="#F4C66A" />
                          </TouchableOpacity>
                        </View>
                      </View>

                      <Text style={styles.goalTarget}>
                        Saved {formatCurrency(goal.saved)} of{' '}
                        {formatCurrency(goal.target)}
                      </Text>

                      <View style={styles.progressBarContainer}>
                        <View style={styles.progressBarBackground}>
                          <View
                            style={[
                              styles.progressBarFill,
                              {
                                width: `${percentage}%`,
                                backgroundColor: progressColor,
                              },
                            ]}
                          />
                        </View>
                      </View>

                      <View style={styles.goalActions}>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => openAddFundsModal(goal)}>
                          <Text style={styles.actionButtonText}>Add Funds</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity
                          style={[styles.actionButton, styles.editButton]}
                          onPress={() => openEditGoalModal(goal)}>
                          <Text style={styles.editButtonText}>Edit</Text>
                        </TouchableOpacity> */}
                        <TouchableOpacity
                          style={[styles.actionButton, styles.deleteButton]}
                          onPress={() => handleDeletePress(goal.id)}>
                          <Text style={styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })
              )}
            </View>

            {/* Financial Settings */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Financial Settings</Text>

              {financialSettings.map(setting => (
                <View key={setting.id} style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <View style={styles.settingLabelContainer}>
                      {setting.enabled ? (
                        <Check size={20} color="#86EFAC" />
                      ) : (
                        <Circle size={20} color="#666" />
                      )}
                      <Text style={styles.settingLabel}>{setting.label}</Text>
                    </View>
                    <Text style={styles.settingValue}>{setting.value}</Text>
                  </View>
                  <Switch
                    value={setting.enabled}
                    onValueChange={() =>
                      handleToggleSetting(setting.id, setting.enabled)
                    }
                    trackColor={{false: '#767577', true: '#86EFAC'}}
                    thumbColor={setting.enabled ? '#fff' : '#f4f3f4'}
                  />
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Add Goal Modal */}
          <Modal
            isVisible={showGoalModal}
            avoidKeyboard={true}
            onModalHide={() => {
              setShowGoalModal(false);
              resetGoalForm();
              setShowDatePicker(false);
            }}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Add New Goal</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setShowGoalModal(false);
                      resetGoalForm();
                    }}>
                    <X size={24} color="#fff" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalForm}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Goal Name</Text>
                    <TextInput
                      style={styles.textInput}
                      value={goalFormData.name}
                      onChangeText={text =>
                        setGoalFormData({...goalFormData, name: text})
                      }
                      placeholder="e.g., New Car"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    />
                  </View>

                  <View style={styles.inputRow}>
                    <View style={[styles.inputContainer, {flex: 1}]}>
                      <Text style={styles.inputLabel}>Target Amount</Text>
                      <View style={styles.amountInput}>
                        <Text style={styles.currencySymbol}>$</Text>
                        <TextInput
                          style={[styles.textInput, {flex: 1}]}
                          value={goalFormData.target}
                          onChangeText={text =>
                            setGoalFormData({...goalFormData, target: text})
                          }
                          placeholder="0"
                          placeholderTextColor="rgba(255, 255, 255, 0.5)"
                          keyboardType="decimal-pad"
                          returnKeyType="done"
                          enablesReturnKeyAutomatically={true}
                          maxLength={6}
                        />
                      </View>
                    </View>

                    <View style={[styles.inputContainer, {flex: 1}]}>
                      <Text style={styles.inputLabel}>Already Saved</Text>
                      <View style={styles.amountInput}>
                        <Text style={styles.currencySymbol}>$</Text>
                        <TextInput
                          style={[styles.textInput, {flex: 1}]}
                          value={goalFormData.saved}
                          onChangeText={text =>
                            setGoalFormData({...goalFormData, saved: text})
                          }
                          placeholder="0"
                          placeholderTextColor="rgba(255, 255, 255, 0.5)"
                          keyboardType="decimal-pad"
                          returnKeyType="done"
                          enablesReturnKeyAutomatically={true}
                          maxLength={6}
                        />
                      </View>
                    </View>
                  </View>

                  {/* Inside Add Goal Modal - Replace the existing Target Date section */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>
                      Target Date (Optional)
                    </Text>
                    <TouchableOpacity
                      onPress={() => setShowDatePicker(true)}
                      style={styles.datePickerButton}
                      activeOpacity={0.7}>
                      <View style={styles.datePickerContent}>
                        <Calendar size={20} color="rgba(255, 255, 255, 0.7)" />
                        <Text
                          style={[
                            styles.dateText,
                            !goalFormData.deadline && styles.placeholderText,
                          ]}>
                          {goalFormData.deadline || 'Select Date'}
                        </Text>
                      </View>
                      <ChevronLeft
                        size={20}
                        color="rgba(255, 255, 255, 0.5)"
                        style={styles.calendarChevron}
                      />
                    </TouchableOpacity>

                    <DatePicker
                      modal
                      open={showDatePicker}
                      date={
                        goalFormData.deadline
                          ? new Date(goalFormData.deadline)
                          : new Date()
                      }
                      mode="date"
                      onConfirm={date => {
                        setShowDatePicker(false);
                        setGoalFormData({
                          ...goalFormData,
                          deadline: formatDate(date),
                        });
                      }}
                      onCancel={() => {
                        setShowDatePicker(false);
                      }}
                      theme={Platform.OS === 'ios' ? 'light' : 'dark'}
                      confirmText="Select"
                      cancelText="Cancel"
                      title="Select Target Date"
                      minimumDate={new Date()} // Optional: Disable past dates
                      maximumDate={new Date(2100, 0, 1)} // Optional: Set max date
                      androidVariant="nativeAndroid"
                    />
                  </View>

                  {/* <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Select Color</Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={styles.colorPicker}>
                      {defaultColors.map(color => (
                        <TouchableOpacity
                          key={color}
                          style={[
                            styles.colorOption,
                            {backgroundColor: color},
                            goalFormData.color === color &&
                              styles.colorOptionSelected,
                          ]}
                          onPress={() =>
                            setGoalFormData({...goalFormData, color})
                          }>
                          {goalFormData.color === color && (
                            <Check size={16} color="#fff" />
                          )}
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View> */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Select Color</Text>

                    <View style={styles.colorPickerContainer}>
                      {/* Left fade gradient */}
                      <LinearGradient
                        colors={['#1F1D3A', 'transparent']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        style={styles.leftFade}
                        pointerEvents="none"
                      />

                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.colorPicker}
                        contentContainerStyle={styles.colorPickerContent}>
                        {defaultColors.map(color => (
                          <TouchableOpacity
                            key={color}
                            style={[
                              styles.colorOption,
                              {backgroundColor: color},
                              goalFormData.color === color &&
                                styles.colorOptionSelected,
                            ]}
                            onPress={() =>
                              setGoalFormData({...goalFormData, color})
                            }>
                            {goalFormData.color === color && (
                              <Check size={16} color="#fff" />
                            )}
                          </TouchableOpacity>
                        ))}
                      </ScrollView>

                      <LinearGradient
                        colors={['transparent', '#1F1D3A']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        style={styles.rightFade}
                        pointerEvents="none"
                      />
                    </View>

                    {/* Scroll hint text */}
                    <Text style={styles.scrollHintText}>
                      Swipe to see more colors
                    </Text>
                  </View>
                </ScrollView>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => {
                      setShowGoalModal(false);
                      resetGoalForm();
                    }}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={handleAddGoal}>
                    <Text style={styles.confirmButtonText}>Add Goal</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Edit Goal Modal */}
          <Modal
            isVisible={!!showEditGoalModal}
            avoidKeyboard={true}
            onModalHide={() => {
              setShowEditGoalModal(null);
              resetGoalForm();
              setShowEditDatePicker(false);
            }}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Edit Goal</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setShowEditGoalModal(null);
                      resetGoalForm();
                    }}>
                    <X size={24} color="#fff" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalForm}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Goal Name</Text>
                    <TextInput
                      style={styles.textInput}
                      value={goalFormData.name}
                      onChangeText={text =>
                        setGoalFormData({...goalFormData, name: text})
                      }
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    />
                  </View>

                  <View style={styles.inputRow}>
                    <View style={[styles.inputContainer, {flex: 1}]}>
                      <Text style={styles.inputLabel}>Target Amount</Text>
                      <View style={styles.amountInput}>
                        <Text style={styles.currencySymbol}>$</Text>
                        <TextInput
                          style={[styles.textInput, {flex: 1}]}
                          value={goalFormData.target}
                          onChangeText={text =>
                            setGoalFormData({...goalFormData, target: text})
                          }
                          keyboardType="decimal-pad"
                          returnKeyType="done"
                          enablesReturnKeyAutomatically={true}
                          maxLength={6}
                        />
                      </View>
                    </View>

                    <View style={[styles.inputContainer, {flex: 1}]}>
                      <Text style={styles.inputLabel}>Already Saved</Text>
                      <View style={styles.amountInput}>
                        <Text style={styles.currencySymbol}>$</Text>
                        <TextInput
                          style={[styles.textInput, {flex: 1}]}
                          value={goalFormData.saved}
                          onChangeText={text =>
                            setGoalFormData({...goalFormData, saved: text})
                          }
                          keyboardType="decimal-pad"
                          returnKeyType="done"
                          enablesReturnKeyAutomatically={true}
                          maxLength={6}
                        />
                      </View>
                    </View>
                  </View>

                  {/* Inside Edit Goal Modal - Replace the existing Target Date section */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>
                      Target Date (Optional)
                    </Text>
                    <TouchableOpacity
                      onPress={() => setShowEditDatePicker(true)}
                      style={styles.datePickerButton}
                      activeOpacity={0.7}>
                      <View style={styles.datePickerContent}>
                        <Calendar size={20} color="rgba(255, 255, 255, 0.7)" />
                        <Text
                          style={[
                            styles.dateText,
                            !goalFormData.deadline && styles.placeholderText,
                          ]}>
                          {goalFormData.deadline || 'Select Date'}
                        </Text>
                      </View>
                      <ChevronLeft
                        size={20}
                        color="rgba(255, 255, 255, 0.5)"
                        style={styles.calendarChevron}
                      />
                    </TouchableOpacity>

                    <DatePicker
                      modal
                      open={showEditDatePicker}
                      date={
                        goalFormData.deadline
                          ? new Date(goalFormData.deadline)
                          : new Date()
                      }
                      mode="date"
                      onConfirm={date => {
                        setShowEditDatePicker(false);
                        setGoalFormData({
                          ...goalFormData,
                          deadline: formatDate(date),
                        });
                      }}
                      onCancel={() => {
                        setShowEditDatePicker(false);
                      }}
                      theme={Platform.OS === 'ios' ? 'light' : 'dark'}
                      confirmText="Select"
                      cancelText="Cancel"
                      title="Select Target Date"
                      minimumDate={new Date()}
                      maximumDate={new Date(2100, 0, 1)}
                      androidVariant="nativeAndroid"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Select Color</Text>

                    <View style={styles.colorPickerContainer}>
                      {/* Left fade gradient */}
                      <LinearGradient
                        colors={['#1F1D3A', 'transparent']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        style={styles.leftFade}
                        pointerEvents="none"
                      />

                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.colorPicker}
                        contentContainerStyle={styles.colorPickerContent}>
                        {defaultColors.map(color => (
                          <TouchableOpacity
                            key={color}
                            style={[
                              styles.colorOption,
                              {backgroundColor: color},
                              goalFormData.color === color &&
                                styles.colorOptionSelected,
                            ]}
                            onPress={() =>
                              setGoalFormData({...goalFormData, color})
                            }>
                            {goalFormData.color === color && (
                              <Check size={16} color="#fff" />
                            )}
                          </TouchableOpacity>
                        ))}
                      </ScrollView>

                      {/* Right fade gradient */}
                      <LinearGradient
                        colors={['transparent', '#1F1D3A']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        style={styles.rightFade}
                        pointerEvents="none"
                      />
                    </View>

                    {/* Scroll hint text */}
                    <Text style={styles.scrollHintText}>
                      Swipe to see more colors
                    </Text>
                  </View>
                </ScrollView>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.deleteButton]}
                    onPress={() => {
                      if (editingGoal) {
                        handleDeleteGoal(editingGoal.id);
                        setShowEditGoalModal(null);
                      }
                    }}>
                    <Text style={styles.deleteButtonText}>Delete Goal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={handleEditGoal}>
                    <Text style={styles.confirmButtonText}>Save Changes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Add Funds Modal */}
          <Modal
            isVisible={!!showAddFundsModal}
            avoidKeyboard={true}
            onModalHide={() => {
              setShowAddFundsModal(null);
              setFundAmount('');
            }}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Add Funds to Goal</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setShowAddFundsModal(null);
                      setFundAmount('');
                    }}>
                    <X size={24} color="#fff" />
                  </TouchableOpacity>
                </View>

                {editingGoal && (
                  <View style={styles.modalForm}>
                    <Text style={styles.goalSummary}>
                      Adding to:{' '}
                      <Text
                        style={{color: editingGoal.color, fontWeight: '600'}}>
                        {editingGoal.name}
                      </Text>
                    </Text>
                    <Text style={styles.goalSummary}>
                      Current: {formatCurrency(editingGoal.saved)} /{' '}
                      {formatCurrency(editingGoal.target)}
                    </Text>

                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Amount to Add</Text>
                      <View style={styles.amountInput}>
                        <Text style={styles.currencySymbol}>$</Text>
                        <TextInput
                          style={[styles.textInput, {flex: 1}]}
                          value={fundAmount}
                          onChangeText={setFundAmount}
                          placeholder="0"
                          placeholderTextColor="rgba(255, 255, 255, 0.5)"
                          keyboardType="decimal-pad"
                          returnKeyType="done"
                          enablesReturnKeyAutomatically={true}
                          maxLength={6}
                        />
                      </View>
                    </View>

                    <Text style={styles.noteText}>
                      Note: You cannot add more than the remaining target
                      amount.
                    </Text>
                  </View>
                )}

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => {
                      setShowAddFundsModal(null);
                      setFundAmount('');
                    }}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={() =>
                      editingGoal && handleAddFunds(editingGoal.id)
                    }>
                    <Text style={styles.confirmButtonText}>Add Funds</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Income Edit Modal */}
          <Modal
            isVisible={showIncomeModal}
            avoidKeyboard={true}
            onModalHide={() => setShowIncomeModal(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Update Monthly Income</Text>
                  <TouchableOpacity onPress={() => setShowIncomeModal(false)}>
                    <X size={24} color="#fff" />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalForm}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Monthly Income</Text>
                    <View style={styles.amountInput}>
                      <Text style={styles.currencySymbol}>$</Text>
                      <TextInput
                        style={[styles.textInput, {flex: 1}]}
                        value={newIncome}
                        onChangeText={setNewIncome}
                        placeholder="0"
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        keyboardType="decimal-pad"
                        maxLength={6}
                        returnKeyType="done"
                        enablesReturnKeyAutomatically={true}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setShowIncomeModal(false)}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={handleUpdateIncome}>
                    <Text style={styles.confirmButtonText}>Update Income</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Auto-Save Edit Modal */}
          <Modal
            isVisible={showAutoSaveModal}
            avoidKeyboard={true}
            onModalHide={() => setShowAutoSaveModal(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    Update Auto-Save Percentage
                  </Text>
                  <TouchableOpacity onPress={() => setShowAutoSaveModal(false)}>
                    <X size={24} color="#fff" />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalForm}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Auto-Save Percentage</Text>
                    <View style={styles.amountInput}>
                      <TextInput
                        style={[styles.textInput, {flex: 1}]}
                        value={newAutoSave}
                        onChangeText={setNewAutoSave}
                        placeholder="0"
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        keyboardType="decimal-pad"
                        maxLength={3}
                        returnKeyType="done"
                        enablesReturnKeyAutomatically={true}
                      />
                      <Text style={styles.currencySymbol}>%</Text>
                    </View>
                    <Text style={styles.noteText}>
                      Percentage of monthly income to automatically save
                    </Text>
                  </View>
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setShowAutoSaveModal(false)}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={handleUpdateAutoSave}>
                    <Text style={styles.confirmButtonText}>Update %</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <Modal isVisible={showWelcomeModal} avoidKeyboard={true}>
            <View style={styles.welcomeModalOverlay}>
              <View style={styles.welcomeModal}>
                {/* Icon */}
                <View style={styles.welcomeIconContainer}>
                  <Target size={40} color="#F4C66A" />
                </View>

                {/* Title */}
                <Text style={styles.welcomeTitle}>
                  Welcome to Financial Goals!
                </Text>
                <Text style={styles.welcomeSubtitle}>
                  Let's set up your financial tracking
                </Text>

                {/* Features list */}
                <View style={styles.welcomeFeatures}>
                  <View style={styles.welcomeFeature}>
                    <View style={styles.welcomeFeatureIcon}>
                      <DollarSign size={18} color="#4CD964" />
                    </View>
                    <Text style={styles.welcomeFeatureText}>
                      Track your monthly income
                    </Text>
                  </View>
                  <View style={styles.welcomeFeature}>
                    <View
                      style={[
                        styles.welcomeFeatureIcon,
                        {backgroundColor: 'rgba(244, 198, 106, 0.1)'},
                      ]}>
                      <PiggyBank size={18} color="#F4C66A" />
                    </View>
                    <Text style={styles.welcomeFeatureText}>
                      Set auto-save percentage
                    </Text>
                  </View>
                  <View style={styles.welcomeFeature}>
                    <View
                      style={[
                        styles.welcomeFeatureIcon,
                        {backgroundColor: 'rgba(247, 115, 22, 0.1)'},
                      ]}>
                      <Target size={18} color="#F97316" />
                    </View>
                    <Text style={styles.welcomeFeatureText}>
                      Create savings goals
                    </Text>
                  </View>
                </View>

                {/* Description */}
                <Text style={styles.welcomeText}>
                  Set up your monthly income and auto-save percentage to start
                  tracking your savings goals effectively.
                </Text>

                {/* Buttons */}
                <View style={styles.welcomeButtons}>
                  {/* <TouchableOpacity
                    style={styles.welcomeButton}
                    onPress={() => {
                      setShowWelcomeModal(false);
                      // setTimeout(() => {
                      //   setShowIncomeModal(true);
                      // }, 500);
                    }}>
                    <Text style={styles.welcomeButtonText}>Get Started →</Text>
                  </TouchableOpacity> */}
                  <TouchableOpacity
                    style={[
                      styles.welcomeButton,
                      styles.welcomeButtonSecondary,
                    ]}
                    onPress={() => setShowWelcomeModal(false)}>
                    <Text style={styles.welcomeButtonSecondaryText}>
                      Understood
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
        <AppModal
          visible={showDeleteModal}
          title="Delete Goal"
          message="Are you sure you want to delete this goal? This action cannot be undone."
          type="warning" // Use warning type for destructive actions
          onClose={() => {
            setShowDeleteModal(false);
            setGoalToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          confirmText="Delete"
          cancelText="Cancel"
        />
      </LinearGradient>
    </AppMainContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    marginBottom: 40,
  },
  scrollContent: {
    paddingBottom: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profitSection: {
    backgroundColor: '#1F1D3A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  profitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  profitTitle: {
    color: '#F4C66A',
    fontSize: 16,
    fontWeight: '600',
  },
  profitAmount: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 8,
  },
  profitChange: {
    fontSize: 14,
    fontWeight: '500',
  },
  sectionContainer: {
    backgroundColor: '#1F1D3A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(244, 198, 106, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#F4C66A',
    fontSize: 14,
    fontWeight: '600',
  },
  goalCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  goalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  goalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  goalInfo: {
    flex: 1,
  },
  goalName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  goalDeadline: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
  },
  goalActionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  goalPercentage: {
    fontSize: 18,
    fontWeight: '700',
  },
  smallActionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalTarget: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginBottom: 12,
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  goalActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  editButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  deleteButtonText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 16,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    color: '#fff',
    fontSize: 16,
  },
  settingValue: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  overviewItem: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  overviewLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  overviewValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  overviewEditHint: {
    color: 'rgba(244, 198, 106, 0.7)',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
  },
  emptyStateTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  emptyStateButton: {
    backgroundColor: '#F4C66A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
  },
  emptyStateButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1F1D3A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  modalForm: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  inputLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    color: '#fff',
    fontSize: 16,
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  currencySymbol: {
    color: '#F4C66A',
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 12,
  },
  colorPicker: {
    flexDirection: 'row',
    marginTop: 8,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorOptionSelected: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  goalSummary: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    marginBottom: 8,
  },
  noteText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#F4C66A',
  },
  confirmButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  // welcome Modal
  // Add these styles to your existing stylesheet in BudgetScreen.tsx

  // If you want a more visually appealing modal with icons:

  welcomeModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeModal: {
    backgroundColor: '#1F1D3A',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(244, 198, 106, 0.3)',
    shadowColor: '#F4C66A',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  welcomeIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(244, 198, 106, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(244, 198, 106, 0.3)',
  },
  welcomeTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    color: '#F4C66A',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  welcomeText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
    paddingHorizontal: 10,
  },
  welcomeFeatures: {
    width: '100%',
    marginBottom: 24,
    gap: 12,
  },
  welcomeFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  welcomeFeatureIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(76, 217, 100, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeFeatureText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    flex: 1,
  },
  welcomeButtons: {
    width: '100%',
    gap: 12,
  },
  welcomeButton: {
    backgroundColor: '#F4C66A',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F4C66A',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  welcomeButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
  welcomeButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: 'transparent',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  welcomeButtonSecondaryText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    fontWeight: '600',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },

  datePickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },

  dateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },

  placeholderText: {
    color: 'rgba(255, 255, 255, 0.5)',
  },

  calendarChevron: {
    transform: [{rotate: '-90deg'}],
    opacity: 0.7,
  },
  datePickerButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderColor: 'rgba(244, 198, 106, 0.3)',
  },
  colorPickerContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  // colorPicker: {
  //   flex: 1,
  // },
  colorPickerContent: {
    paddingHorizontal: 8,
    gap: 12,
  },
  leftFade: {
    position: 'absolute',
    left: 0,
    width: 30,
    height: 60,
    zIndex: 1,
  },
  rightFade: {
    position: 'absolute',
    right: 0,
    width: 30,
    height: 60,
    zIndex: 1,
  },
  scrollHintText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
});
