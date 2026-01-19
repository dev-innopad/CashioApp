// screens/ReportScreen.tsx or BudgetScreen.tsx
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AppMainContainer from '../../components/AppMainContainer';
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
} from 'lucide-react-native';

export default function ReportScreen({navigation}: any) {
  const [savingsGoals, setSavingsGoals] = useState([
    {id: '1', name: 'New Car', target: 33000, saved: 16000, color: '#F97316'},
    {id: '2', name: 'Vacation', target: 5000, saved: 2500, color: '#22D3EE'},
    {
      id: '3',
      name: 'Emergency Fund',
      target: 10000,
      saved: 7500,
      color: '#86EFAC',
    },
  ]);

  const [financialSettings, setFinancialSettings] = useState([
    {id: '1', label: 'Monthly Income', value: '13,000', enabled: true},
    {id: '2', label: 'Auto Savings', value: 'Enabled', enabled: true},
    {id: '3', label: 'Investment Tips', value: 'Weekly', enabled: true},
    {id: '4', label: 'Budget Alerts', value: 'On', enabled: false},
  ]);

  const toggleSetting = (id: string) => {
    setFinancialSettings(prev =>
      prev.map(setting =>
        setting.id === id ? {...setting, enabled: !setting.enabled} : setting,
      ),
    );
  };

  const calculatePercentage = (saved: number, target: number) => {
    return Math.min(Math.round((saved / target) * 100), 100);
  };

  return (
    <AppMainContainer hideTop hideBottom>
      <LinearGradient colors={['#141326', '#24224A']} style={{flex: 1}}>
        <StatusBar barStyle={'light-content'} translucent={false} />
        <SafeAreaView style={{flex: 1}}>
          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Financial Report</Text>
              <View style={styles.headerRight}>
                <TouchableOpacity style={styles.iconButton}>
                  <Download size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <Share2 size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* User Info */}
            <View style={styles.userInfoSection}>
              <View style={styles.userAvatar}>
                <Text style={styles.avatarText}>JA</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>Jhon Alex</Text>
                <Text style={styles.userEmail}>jhon@example.com</Text>
              </View>
              <TouchableOpacity style={styles.notificationButton}>
                <Bell size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Total Profit/Net Worth */}
            <View style={styles.profitSection}>
              <View style={styles.profitHeader}>
                <TrendingUp size={24} color="#F4C66A" />
                <Text style={styles.profitTitle}>Net Worth</Text>
              </View>
              <Text style={styles.profitAmount}>₹2,45,000</Text>
              <Text style={styles.profitChange}>+12.5% from last month</Text>
            </View>

            {/* My Saving Goals */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>My Saving Goals</Text>
                <TouchableOpacity style={styles.addButton}>
                  <Plus size={20} color="#F4C66A" />
                  <Text style={styles.addButtonText}>Add Goal</Text>
                </TouchableOpacity>
              </View>

              {savingsGoals.map(goal => {
                const percentage = calculatePercentage(goal.saved, goal.target);
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
                        <Text style={styles.goalName}>{goal.name}</Text>
                      </View>
                      <Text style={styles.goalPercentage}>{percentage}%</Text>
                    </View>

                    <Text style={styles.goalTarget}>
                      Target Achieved (₹{goal.saved.toLocaleString()} / ₹
                      {goal.target.toLocaleString()})
                    </Text>

                    <View style={styles.progressBarContainer}>
                      <View style={styles.progressBarBackground}>
                        <View
                          style={[
                            styles.progressBarFill,
                            {
                              width: `${percentage}%`,
                              backgroundColor: goal.color,
                            },
                          ]}
                        />
                      </View>
                    </View>

                    <View style={styles.goalActions}>
                      <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>Add Funds</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.editButton]}>
                        <Text style={styles.editButtonText}>Edit Goal</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
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
                    onValueChange={() => toggleSetting(setting.id)}
                    trackColor={{false: '#767577', true: '#86EFAC'}}
                    thumbColor={setting.enabled ? '#fff' : '#f4f3f4'}
                  />
                </View>
              ))}
            </View>

            {/* Monthly Overview */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Monthly Overview</Text>
              <View style={styles.overviewGrid}>
                <View style={styles.overviewItem}>
                  <DollarSign size={24} color="#F4C66A" />
                  <Text style={styles.overviewLabel}>Income</Text>
                  <Text style={styles.overviewValue}>₹13,000</Text>
                </View>
                <View style={styles.overviewItem}>
                  <TrendingUp size={24} color="#FF6B6B" />
                  <Text style={styles.overviewLabel}>Expenses</Text>
                  <Text style={styles.overviewValue}>₹8,500</Text>
                </View>
                <View style={styles.overviewItem}>
                  <PiggyBank size={24} color="#4ECDC4" />
                  <Text style={styles.overviewLabel}>Savings</Text>
                  <Text style={styles.overviewValue}>₹4,500</Text>
                </View>
                <View style={styles.overviewItem}>
                  <Target size={24} color="#F97316" />
                  <Text style={styles.overviewLabel}>Goals</Text>
                  <Text style={styles.overviewValue}>75%</Text>
                </View>
              </View>
            </View>
          </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
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
  headerRight: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  notificationButton: {
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
    color: '#86EFAC',
    fontSize: 14,
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
  },
  addButtonText: {
    color: '#F4C66A',
    fontSize: 14,
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
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  goalIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  goalPercentage: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
    gap: 10,
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
    gap: 8,
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
  },
  overviewValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
