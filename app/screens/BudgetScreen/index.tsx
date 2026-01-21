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
  Check,
  Circle,
  Plus,
  Download,
  Edit2,
  X,
  Calendar,
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
import {Formik} from 'formik';
import * as Yup from 'yup';

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

// Validation Schemas
export const goalValidationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required('Goal name is required')
    .min(2, 'Goal name must be at least 2 characters'),
  target: Yup.number()
    .required('Target amount is required')
    .positive('Target must be greater than 0')
    .typeError('Please enter a valid number'),
  saved: Yup.number()
    .min(0, 'Saved amount cannot be negative')
    .typeError('Please enter a valid number')
    .test(
      'saved-less-than-target',
      'Saved amount cannot exceed target amount',
      function (value) {
        const {target} = this.parent;
        if (value && target && value > target) {
          return false;
        }
        return true;
      },
    ),
  color: Yup.string().required('Color is required'),
  deadline: Yup.string().optional(),
});

export const fundsValidationSchema = Yup.object().shape({
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be greater than 0')
    .typeError('Please enter a valid number')
    .test('amount-less-than-remaining', function (value) {
      // We'll need to pass the remaining amount as context
      const {remaining} = this.options.context || {};
      if (remaining && value && value > remaining) {
        return this.createError({
          message: `You can only add up to ${formatCurrency(
            remaining,
          )} to reach your target`,
        });
      }
      return true;
    }),
});

const incomeValidationSchema = Yup.object().shape({
  income: Yup.number()
    .required('Income is required')
    .positive('Income must be greater than 0')
    .typeError('Please enter a valid number'),
});

const autoSaveValidationSchema = Yup.object().shape({
  percentage: Yup.number()
    .required('Percentage is required')
    .min(0, 'Percentage cannot be negative')
    .max(100, 'Percentage cannot exceed 100')
    .typeError('Please enter a valid percentage'),
});

// Initial Form Values
const initialGoalValues = {
  name: '',
  target: '',
  saved: '',
  color: defaultColors[0],
  deadline: new Date().toISOString().split('T')[0],
};

const initialFundsValues = {
  amount: '',
};

const initialIncomeValues = {
  income: '',
};

const initialAutoSaveValues = {
  percentage: '',
};

export default function FinancialReportScreen({navigation}: any) {
  const dispatch = useDispatch();

  // Get data from Redux
  const expenses = useSelector(
    (state: RootState) => state.userData.expenses || [],
  );
  const monthlyBudget = useSelector(
    (state: RootState) => state.userData.monthlyBudget || 0,
  );

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

  // State for modals
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showAddFundsModal, setShowAddFundsModal] = useState<string | null>(
    null,
  );
  const [showEditGoalModal, setShowEditGoalModal] = useState<string | null>(
    null,
  );
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationModalData, setValidationModalData] = useState({
    title: '',
    message: '',
    type: 'error' as 'info' | 'warning' | 'error' | 'success',
  });
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showAutoSaveModal, setShowAutoSaveModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEditDatePicker, setShowEditDatePicker] = useState(false);

  const [editingGoal, setEditingGoal] = useState<any>(null);

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Calculate dynamic statistics
  const calculateTotals = () => {
    const totalExpense = expenses.reduce(
      (sum: number, exp: any) => sum + (exp.amount || 0),
      0,
    );
    const totalBudget = monthlyBudget || 0;

    const totalGoalSaved = goals.reduce((sum, goal) => sum + goal.saved, 0);
    const totalGoalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);

    const monthlySavings = monthlyIncome - totalExpense;
    const autoSaveAmount = (monthlyIncome * autoSavePercentage) / 100;
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

  const calculatePercentage = (saved: number, target: number) => {
    if (target === 0) return 0;
    return Math.min(Math.round((saved / target) * 100), 100);
  };

  // Handle adding new goal with Formik
  const handleAddGoal = (values: any, {resetForm}: any) => {
    const target = parseFloat(values.target);
    const saved = parseFloat(values.saved) || 0;

    // if (saved > target) {
    //   setValidationModalData({
    //     title: 'Amount Limit Exceeded',
    //     message: 'Saved amount cannot exceed target amount',
    //     type: 'warning',
    //   });
    //   setShowValidationModal(true);
    //   return;
    // }

    dispatch(
      addGoal({
        name: values.name,
        target,
        saved,
        color: values.color,
        deadline: values.deadline,
      }),
    );

    _showToast('Goal added successfully', 'success');
    setShowGoalModal(false);
    resetForm();
  };

  // Handle editing goal with Formik
  const handleEditGoal = (values: any, {resetForm}: any) => {
    if (!editingGoal) return;

    const target = parseFloat(values.target);
    const saved = parseFloat(values.saved) || 0;

    // if (saved > target) {
    //   setValidationModalData({
    //     title: 'Amount Limit Exceeded',
    //     message:
    //       'Saved amount cannot exceed the target amount. Please adjust your saved amount.',
    //     type: 'warning',
    //   });
    //   setShowValidationModal(true);
    //   return;
    // }

    dispatch(
      updateGoal({
        ...editingGoal,
        name: values.name,
        target,
        saved,
        color: values.color,
        deadline: values.deadline,
      }),
    );

    _showToast('Goal updated successfully', 'success');
    setShowEditGoalModal(null);
    setEditingGoal(null);
    resetForm();
  };

  // Handle adding funds with Formik
  const handleAddFunds = (values: any, {resetForm}: any) => {
    const amount = parseFloat(values.amount);

    // if (editingGoal && editingGoal.saved + amount > editingGoal.target) {
    //   const remaining = editingGoal.target - editingGoal.saved;
    //   setValidationModalData({
    //     title: 'Target Exceeded',
    //     message: `You can only add up to ${formatCurrency(
    //       remaining,
    //     )} to reach your target`,
    //     type: 'warning',
    //   });
    //   setShowValidationModal(true);
    //   return;
    // }

    dispatch(addFundsToGoal({goalId: editingGoal.id, amount}));
    _showToast('Funds added successfully', 'success');
    setShowAddFundsModal(null);
    resetForm();
  };

  // Handle income update with Formik
  const handleUpdateIncome = (values: any) => {
    dispatch(updateMonthlyIncome(parseFloat(values.income)));
    _showToast('Monthly income updated', 'success');
    setShowIncomeModal(false);
  };

  // Handle auto-save update with Formik
  const handleUpdateAutoSave = (values: any) => {
    dispatch(updateAutoSavePercentage(parseFloat(values.percentage)));
    _showToast('Auto-save percentage updated', 'success');
    setShowAutoSaveModal(false);
  };

  // Handle deleting goal
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

  // Open edit goal modal
  const openEditGoalModal = (goal: any) => {
    setEditingGoal(goal);
    setShowEditGoalModal(goal.id);
  };

  // Open add funds modal
  const openAddFundsModal = (goal: any) => {
    setEditingGoal(goal);
    setShowAddFundsModal(goal.id);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get goal progress color
  const getGoalProgressColor = (percentage: number) => {
    if (percentage >= 100) return '#10B981';
    if (percentage >= 75) return '#F4C66A';
    if (percentage >= 50) return '#F97316';
    return '#FF6B6B';
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
                          {/* <TouchableOpacity
                            style={styles.smallActionButton}
                            onPress={() => openEditGoalModal(goal)}>
                            <Edit2 size={16} color="#F4C66A" />
                          </TouchableOpacity> */}
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
                          onPress={() => openEditGoalModal(goal)}>
                          <Text style={styles.actionButtonText}>Edit</Text>
                        </TouchableOpacity>
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

          {/* Add Goal Modal with Formik */}
          <Modal
            isVisible={showGoalModal}
            avoidKeyboard={true}
            onModalHide={() => {
              setShowGoalModal(false);
              setShowDatePicker(false);
            }}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Add New Goal</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setShowGoalModal(false);
                    }}>
                    <X size={24} color="#fff" />
                  </TouchableOpacity>
                </View>

                <Formik
                  initialValues={initialGoalValues}
                  validationSchema={goalValidationSchema}
                  onSubmit={handleAddGoal}>
                  {({
                    values,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    setFieldValue,
                    errors,
                    touched,
                  }) => (
                    <>
                      <ScrollView style={styles.modalForm}>
                        <View style={styles.inputContainer}>
                          <Text style={styles.inputLabel}>Goal Name</Text>
                          <TextInput
                            style={[
                              styles.textInput,
                              errors.name && touched.name && styles.inputError,
                            ]}
                            value={values.name}
                            onChangeText={handleChange('name')}
                            onBlur={handleBlur('name')}
                            placeholder="e.g., New Car"
                            placeholderTextColor="rgba(255, 255, 255, 0.5)"
                          />
                          {errors.name && touched.name && (
                            <Text style={styles.errorText}>{errors.name}</Text>
                          )}
                        </View>

                        <View style={styles.inputRow}>
                          <View style={[styles.inputContainer, {flex: 1}]}>
                            <Text style={styles.inputLabel}>Target Amount</Text>
                            <View
                              style={[
                                styles.amountInput,
                                errors.target &&
                                  touched.target &&
                                  styles.inputErrorBorder,
                              ]}>
                              <Text style={styles.currencySymbol}>$</Text>
                              <TextInput
                                style={[styles.textInput, {flex: 1}]}
                                value={values.target}
                                onChangeText={handleChange('target')}
                                onBlur={handleBlur('target')}
                                placeholder="0"
                                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                keyboardType="decimal-pad"
                                maxLength={6}
                                returnKeyType="done"
                                enablesReturnKeyAutomatically={true}
                              />
                            </View>
                            {errors.target && touched.target && (
                              <Text style={styles.errorText}>
                                {errors.target}
                              </Text>
                            )}
                          </View>

                          <View style={[styles.inputContainer, {flex: 1}]}>
                            <Text style={styles.inputLabel}>Already Saved</Text>
                            <View
                              style={[
                                styles.amountInput,
                                errors.saved &&
                                  touched.saved &&
                                  styles.inputErrorBorder,
                              ]}>
                              <Text style={styles.currencySymbol}>$</Text>
                              <TextInput
                                style={[styles.textInput, {flex: 1}]}
                                value={values.saved}
                                onChangeText={handleChange('saved')}
                                onBlur={handleBlur('saved')}
                                placeholder="0"
                                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                keyboardType="decimal-pad"
                                maxLength={6}
                                returnKeyType="done"
                                enablesReturnKeyAutomatically={true}
                              />
                            </View>
                            {errors.saved && touched.saved && (
                              <Text style={styles.errorText}>
                                {errors.saved}
                              </Text>
                            )}
                          </View>
                        </View>

                        <View style={styles.inputContainer}>
                          <Text style={styles.inputLabel}>
                            Target Date (Optional)
                          </Text>
                          <TouchableOpacity
                            onPress={() => setShowDatePicker(true)}
                            style={styles.datePickerButton}
                            activeOpacity={0.7}>
                            <View style={styles.datePickerContent}>
                              <Calendar
                                size={20}
                                color="rgba(255, 255, 255, 0.7)"
                              />
                              <Text style={styles.dateText}>
                                {values.deadline || 'Select Date'}
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
                              values.deadline
                                ? new Date(values.deadline)
                                : new Date()
                            }
                            mode="date"
                            onConfirm={date => {
                              setShowDatePicker(false);
                              setFieldValue('deadline', formatDate(date));
                            }}
                            onCancel={() => {
                              setShowDatePicker(false);
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
                                    values.color === color &&
                                      styles.colorOptionSelected,
                                  ]}
                                  onPress={() => setFieldValue('color', color)}>
                                  {values.color === color && (
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
                          <Text style={styles.scrollHintText}>
                            Swipe to see more colors
                          </Text>
                        </View>
                      </ScrollView>

                      <View style={styles.modalActions}>
                        <TouchableOpacity
                          style={[styles.modalButton, styles.cancelButton]}
                          onPress={() => setShowGoalModal(false)}>
                          <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.modalButton, styles.confirmButton]}
                          onPress={handleSubmit}>
                          <Text style={styles.confirmButtonText}>Add Goal</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </Formik>
              </View>
            </View>
          </Modal>

          {/* Edit Goal Modal with Formik */}
          <Modal
            isVisible={!!showEditGoalModal}
            avoidKeyboard={true}
            onModalHide={() => {
              setShowEditGoalModal(null);
              setEditingGoal(null);
              setShowEditDatePicker(false);
            }}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Edit Goal</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setShowEditGoalModal(null);
                      setEditingGoal(null);
                    }}>
                    <X size={24} color="#fff" />
                  </TouchableOpacity>
                </View>

                {editingGoal && (
                  <Formik
                    initialValues={{
                      name: editingGoal.name,
                      target: editingGoal.target.toString(),
                      saved: editingGoal.saved.toString(),
                      color: editingGoal.color,
                      deadline:
                        editingGoal.deadline ||
                        new Date().toISOString().split('T')[0],
                    }}
                    validationSchema={goalValidationSchema}
                    onSubmit={handleEditGoal}>
                    {({
                      values,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      setFieldValue,
                      errors,
                      touched,
                    }) => (
                      <>
                        <ScrollView style={styles.modalForm}>
                          <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Goal Name</Text>
                            <TextInput
                              style={[
                                styles.textInput,
                                errors.name &&
                                  touched.name &&
                                  styles.inputError,
                              ]}
                              value={values.name}
                              onChangeText={handleChange('name')}
                              onBlur={handleBlur('name')}
                              placeholderTextColor="rgba(255, 255, 255, 0.5)"
                            />
                            {errors.name && touched.name && (
                              <Text style={styles.errorText}>
                                {errors.name}
                              </Text>
                            )}
                          </View>

                          <View style={styles.inputRow}>
                            <View style={[styles.inputContainer, {flex: 1}]}>
                              <Text style={styles.inputLabel}>
                                Target Amount
                              </Text>
                              <View
                                style={[
                                  styles.amountInput,
                                  errors.target &&
                                    touched.target &&
                                    styles.inputErrorBorder,
                                ]}>
                                <Text style={styles.currencySymbol}>$</Text>
                                <TextInput
                                  style={[styles.textInput, {flex: 1}]}
                                  value={values.target}
                                  onChangeText={handleChange('target')}
                                  onBlur={handleBlur('target')}
                                  keyboardType="decimal-pad"
                                  maxLength={6}
                                  returnKeyType="done"
                                  enablesReturnKeyAutomatically={true}
                                />
                              </View>
                              {errors.target && touched.target && (
                                <Text style={styles.errorText}>
                                  {errors.target}
                                </Text>
                              )}
                            </View>

                            <View style={[styles.inputContainer, {flex: 1}]}>
                              <Text style={styles.inputLabel}>
                                Already Saved
                              </Text>
                              <View
                                style={[
                                  styles.amountInput,
                                  errors.saved &&
                                    touched.saved &&
                                    styles.inputErrorBorder,
                                ]}>
                                <Text style={styles.currencySymbol}>$</Text>
                                <TextInput
                                  style={[styles.textInput, {flex: 1}]}
                                  value={values.saved}
                                  onChangeText={handleChange('saved')}
                                  onBlur={handleBlur('saved')}
                                  keyboardType="decimal-pad"
                                  maxLength={6}
                                  returnKeyType="done"
                                  enablesReturnKeyAutomatically={true}
                                />
                              </View>
                              {errors.saved && touched.saved && (
                                <Text style={styles.errorText}>
                                  {errors.saved}
                                </Text>
                              )}
                            </View>
                          </View>

                          <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>
                              Target Date (Optional)
                            </Text>
                            <TouchableOpacity
                              onPress={() => setShowEditDatePicker(true)}
                              style={styles.datePickerButton}
                              activeOpacity={0.7}>
                              <View style={styles.datePickerContent}>
                                <Calendar
                                  size={20}
                                  color="rgba(255, 255, 255, 0.7)"
                                />
                                <Text style={styles.dateText}>
                                  {values.deadline || 'Select Date'}
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
                                values.deadline
                                  ? new Date(values.deadline)
                                  : new Date()
                              }
                              mode="date"
                              onConfirm={date => {
                                setShowEditDatePicker(false);
                                setFieldValue('deadline', formatDate(date));
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
                                contentContainerStyle={
                                  styles.colorPickerContent
                                }>
                                {defaultColors.map(color => (
                                  <TouchableOpacity
                                    key={color}
                                    style={[
                                      styles.colorOption,
                                      {backgroundColor: color},
                                      values.color === color &&
                                        styles.colorOptionSelected,
                                    ]}
                                    onPress={() =>
                                      setFieldValue('color', color)
                                    }>
                                    {values.color === color && (
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
                                handleDeletePress(editingGoal.id);
                                setShowEditGoalModal(null);
                              }
                            }}>
                            <Text style={styles.deleteButtonText}>
                              Delete Goal
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.modalButton, styles.confirmButton]}
                            onPress={handleSubmit}>
                            <Text style={styles.confirmButtonText}>
                              Save Changes
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </>
                    )}
                  </Formik>
                )}
              </View>
            </View>
          </Modal>

          {/* Add Funds Modal with Formik */}
          <Modal
            isVisible={!!showAddFundsModal}
            avoidKeyboard={true}
            onModalHide={() => {
              setShowAddFundsModal(null);
              setEditingGoal(null);
            }}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Add Funds to Goal</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setShowAddFundsModal(null);
                      setEditingGoal(null);
                    }}>
                    <X size={24} color="#fff" />
                  </TouchableOpacity>
                </View>

                {editingGoal && (
                  <Formik
                    initialValues={initialFundsValues}
                    validationSchema={fundsValidationSchema}
                    onSubmit={handleAddFunds}
                    validateOnMount={false}
                    context={{
                      remaining: editingGoal
                        ? editingGoal.target - editingGoal.saved
                        : 0,
                    }}>
                    {({
                      values,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      errors,
                      touched,
                    }) => (
                      <>
                        <View style={styles.modalForm}>
                          <Text style={styles.goalSummary}>
                            Adding to:{' '}
                            <Text
                              style={{
                                color: editingGoal.color,
                                fontWeight: '600',
                              }}>
                              {editingGoal.name}
                            </Text>
                          </Text>
                          <Text style={styles.goalSummary}>
                            Current: {formatCurrency(editingGoal.saved)} /{' '}
                            {formatCurrency(editingGoal.target)}
                          </Text>

                          <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Amount to Add</Text>
                            <View
                              style={[
                                styles.amountInput,
                                errors.amount &&
                                  touched.amount &&
                                  styles.inputErrorBorder,
                              ]}>
                              <Text style={styles.currencySymbol}>$</Text>
                              <TextInput
                                style={[styles.textInput, {flex: 1}]}
                                value={values.amount}
                                onChangeText={handleChange('amount')}
                                onBlur={handleBlur('amount')}
                                placeholder="0"
                                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                keyboardType="decimal-pad"
                                maxLength={6}
                                returnKeyType="done"
                                enablesReturnKeyAutomatically={true}
                              />
                            </View>
                            {errors.amount && touched.amount && (
                              <Text style={styles.errorText}>
                                {errors.amount}
                              </Text>
                            )}
                          </View>

                          <Text style={styles.noteText}>
                            Note: You cannot add more than the remaining target
                            amount.
                          </Text>
                        </View>

                        <View style={styles.modalActions}>
                          <TouchableOpacity
                            style={[styles.modalButton, styles.cancelButton]}
                            onPress={() => setShowAddFundsModal(null)}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.modalButton, styles.confirmButton]}
                            onPress={handleSubmit}>
                            <Text style={styles.confirmButtonText}>
                              Add Funds
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </>
                    )}
                  </Formik>
                )}
              </View>
            </View>
          </Modal>

          {/* Income Edit Modal with Formik */}
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

                <Formik
                  initialValues={{income: monthlyIncome.toString()}}
                  validationSchema={incomeValidationSchema}
                  onSubmit={handleUpdateIncome}>
                  {({
                    values,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    errors,
                    touched,
                  }) => (
                    <>
                      <View style={styles.modalForm}>
                        <View style={styles.inputContainer}>
                          <Text style={styles.inputLabel}>Monthly Income</Text>
                          <View
                            style={[
                              styles.amountInput,
                              errors.income &&
                                touched.income &&
                                styles.inputErrorBorder,
                            ]}>
                            <Text style={styles.currencySymbol}>$</Text>
                            <TextInput
                              style={[styles.textInput, {flex: 1}]}
                              value={values.income}
                              onChangeText={handleChange('income')}
                              onBlur={handleBlur('income')}
                              placeholder="0"
                              placeholderTextColor="rgba(255, 255, 255, 0.5)"
                              keyboardType="decimal-pad"
                              maxLength={6}
                              returnKeyType="done"
                              enablesReturnKeyAutomatically={true}
                            />
                          </View>
                          {errors.income && touched.income && (
                            <Text style={styles.errorText}>
                              {errors.income}
                            </Text>
                          )}
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
                          onPress={handleSubmit}>
                          <Text style={styles.confirmButtonText}>
                            Update Income
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </Formik>
              </View>
            </View>
          </Modal>

          {/* Auto-Save Edit Modal with Formik */}
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

                <Formik
                  initialValues={{percentage: autoSavePercentage.toString()}}
                  validationSchema={autoSaveValidationSchema}
                  onSubmit={handleUpdateAutoSave}>
                  {({
                    values,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    errors,
                    touched,
                  }) => (
                    <>
                      <View style={styles.modalForm}>
                        <View style={styles.inputContainer}>
                          <Text style={styles.inputLabel}>
                            Auto-Save Percentage
                          </Text>
                          <View
                            style={[
                              styles.amountInput,
                              errors.percentage &&
                                touched.percentage &&
                                styles.inputErrorBorder,
                            ]}>
                            <TextInput
                              style={[styles.textInput, {flex: 1}]}
                              value={values.percentage}
                              onChangeText={handleChange('percentage')}
                              onBlur={handleBlur('percentage')}
                              placeholder="0"
                              placeholderTextColor="rgba(255, 255, 255, 0.5)"
                              keyboardType="decimal-pad"
                              maxLength={3}
                              returnKeyType="done"
                              enablesReturnKeyAutomatically={true}
                            />
                            <Text style={styles.currencySymbol}>%</Text>
                          </View>
                          {errors.percentage && touched.percentage && (
                            <Text style={styles.errorText}>
                              {errors.percentage}
                            </Text>
                          )}
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
                          onPress={handleSubmit}>
                          <Text style={styles.confirmButtonText}>Update %</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </Formik>
              </View>
            </View>
          </Modal>

          {/* Validation Modal */}
          <AppModal
            visible={showValidationModal}
            type={validationModalData.type}
            title={validationModalData.title}
            message={validationModalData.message}
            cancelText={validationModalData.type === 'success' ? 'OK' : 'Close'}
            confirmText={
              validationModalData.type === 'warning' ? 'Edit' : undefined
            }
            onClose={() => setShowValidationModal(false)}
            onConfirm={() => {
              setShowValidationModal(false);
            }}
          />

          {/* Delete Confirmation Modal */}
          <AppModal
            visible={showDeleteModal}
            title="Delete Goal"
            message="Are you sure you want to delete this goal? This action cannot be undone."
            type="warning"
            onClose={() => {
              setShowDeleteModal(false);
              setGoalToDelete(null);
            }}
            onConfirm={handleConfirmDelete}
            confirmText="Delete"
            cancelText="Cancel"
          />
        </SafeAreaView>
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
  colorPickerContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
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
  // Formik validation styles
  inputError: {
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  inputErrorBorder: {
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 4,
  },
});
