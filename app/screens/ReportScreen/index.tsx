// screens/ReportScreen.tsx - Complete Implementation
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AppMainContainer from '../../components/AppMainContainer';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PiggyBank,
  ChevronLeft,
  Bell,
  Download,
  Share2,
  Filter,
  PieChart,
  BarChart3,
  Calendar,
  Home,
  Car,
  ShoppingBag,
  Utensils,
  Airplay,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Settings,
  MoreVertical,
  Target,
} from 'lucide-react-native';
import {BarChart, PieChart as RNPPieChart} from 'react-native-gifted-charts';
import {ProgressCircle} from 'react-native-svg-charts';
import Svg, {Circle} from 'react-native-svg';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

export default function ReportScreen({navigation}: any) {
  // State for dynamic data
  const [selectedPeriod, setSelectedPeriod] = useState('Monthly');
  const [expenseTrendData, setExpenseTrendData] = useState([
    {value: 2000, label: 'Week1', frontColor: '#F97316'},
    {value: 4000, label: 'Week2', frontColor: '#22D3EE'},
    {value: 3000, label: 'Week3', frontColor: '#86EFAC'},
    {value: 2000, label: 'Week4', frontColor: '#A855F7'},
  ]);

  const [statistics, setStatistics] = useState({
    totalExpense: 20800,
    totalSave: 9200,
    budget: 20000,
    expenseChange: 12.5,
    savingsChange: 8.2,
  });

  // Expense Breakdown State
  const [expenseBreakdown, setExpenseBreakdown] = useState([
    {
      id: '1',
      category: 'Home',
      icon: Home,
      color: '#F97316',
      percentage: 35,
      amount: 7280,
      budget: 10000,
      trend: 12,
      transactions: 24,
      expanded: false,
    },
    {
      id: '2',
      category: 'Transport',
      icon: Car,
      color: '#22D3EE',
      percentage: 25,
      amount: 5200,
      budget: 6000,
      trend: -8,
      transactions: 18,
      expanded: false,
    },
    {
      id: '3',
      category: 'Shopping',
      icon: ShoppingBag,
      color: '#86EFAC',
      percentage: 20,
      amount: 4160,
      budget: 5000,
      trend: 5,
      transactions: 32,
      expanded: false,
    },
    {
      id: '4',
      category: 'Food',
      icon: Utensils,
      color: '#A855F7',
      percentage: 15,
      amount: 3120,
      budget: 4000,
      trend: 15,
      transactions: 45,
      expanded: false,
    },
    {
      id: '5',
      category: 'Entertainment',
      icon: Airplay,
      color: '#FF6B6B',
      percentage: 5,
      amount: 1040,
      budget: 2000,
      trend: 25,
      transactions: 12,
      expanded: false,
    },
  ]);

  const [showDetails, setShowDetails] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const periods = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, []);

  // Function to handle period change
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    // Update trend data based on period
    const mockData = {
      Daily: [2000, 1500, 1800, 2200],
      Weekly: [2000, 4000, 3000, 2000],
      Monthly: [12000, 15000, 10000, 13000],
      Yearly: [12000, 16000, 18000, 20000],
    };

    const newTrendData = mockData[period as keyof typeof mockData].map(
      (value, index) => ({
        value,
        label:
          period === 'Daily'
            ? `Day${index + 1}`
            : period === 'Weekly'
            ? `Week${index + 1}`
            : period === 'Monthly'
            ? `Month${index + 1}`
            : `Q${index + 1}`,
        frontColor: ['#F97316', '#22D3EE', '#86EFAC', '#A855F7'][index],
      }),
    );

    setExpenseTrendData(newTrendData);

    // Update statistics based on period
    const statMultipliers = {
      Daily: {expense: 20800, save: 9200, budget: 20000},
      Weekly: {expense: 5200, save: 2300, budget: 5000},
      Monthly: {expense: 20800, save: 9200, budget: 20000},
      Yearly: {expense: 249600, save: 110400, budget: 240000},
    };

    const newStats = statMultipliers[period as keyof typeof statMultipliers];
    setStatistics(prev => ({
      ...prev,
      totalExpense: newStats.expense,
      totalSave: newStats.save,
      budget: newStats.budget,
    }));
  };

  // Function to export report
  const handleExport = () => {
    console.log('Exporting report...');
  };

  // Function to share report
  const handleShare = () => {
    console.log('Sharing report...');
  };

  // Function to filter data
  const handleFilter = () => {
    console.log('Opening filter...');
  };

  // Toggle category expansion
  const toggleCategory = (id: string) => {
    setExpenseBreakdown(prev =>
      prev.map(item =>
        item.id === id ? {...item, expanded: !item.expanded} : item,
      ),
    );
    setSelectedCategory(selectedCategory === id ? null : id);
  };

  // Toggle all details
  const toggleAllDetails = () => {
    setShowDetails(!showDetails);
  };

  // Calculate totals
  const totalSpent = expenseBreakdown.reduce(
    (sum, item) => sum + item.amount,
    0,
  );
  const totalBudget = expenseBreakdown.reduce(
    (sum, item) => sum + item.budget,
    0,
  );
  const remainingBudget = totalBudget - totalSpent;
  const budgetUtilization = (totalSpent / totalBudget) * 100;

  // Get top spending category
  const topCategory = expenseBreakdown.reduce((prev, current) =>
    prev.amount > current.amount ? prev : current,
  );

  // Get highest trend
  const highestTrend = expenseBreakdown.reduce((prev, current) =>
    Math.abs(prev.trend) > Math.abs(current.trend) ? prev : current,
  );

  // Enhanced Pie Chart Data
  const pieChartData = expenseBreakdown.map(item => ({
    value: item.percentage,
    color: item.color,
    label: item.category,
    gradientCenterColor: item.color,
    focused: selectedCategory === item.id,
  }));

  // Render Circular Progress for each category
  const renderCategoryProgress = (item: any) => {
    const progress = (item.amount / item.budget) * 100;
    const strokeWidth = 4;
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <View style={styles.progressContainer}>
        <Svg width="50" height="50">
          {/* Background Circle */}
          <Circle
            cx="25"
            cy="25"
            r={radius}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Circle */}
          <Circle
            cx="25"
            cy="25"
            r={radius}
            stroke={item.color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin="25, 25"
          />
        </Svg>
        <View style={styles.progressTextContainer}>
          <Text style={[styles.progressText, {color: item.color}]}>
            {Math.round(progress)}%
          </Text>
        </View>
      </View>
    );
  };

  // Render Trend Indicator
  const renderTrendIndicator = (trend: number) => {
    const isPositive = trend > 0;
    return (
      <View
        style={[
          styles.trendContainer,
          {
            backgroundColor: isPositive
              ? 'rgba(76, 217, 100, 0.1)'
              : 'rgba(255, 59, 48, 0.1)',
          },
        ]}>
        {isPositive ? (
          <ArrowUpRight size={12} color="#4CD964" />
        ) : (
          <ArrowDownRight size={12} color="#FF3B30" />
        )}
        <Text
          style={[
            styles.trendText,
            {
              color: isPositive ? '#4CD964' : '#FF3B30',
            },
          ]}>
          {Math.abs(trend)}%
        </Text>
      </View>
    );
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
              <Text style={styles.headerTitle}>Report</Text>
              <View style={styles.headerActions}>
                <TouchableOpacity
                  style={styles.headerButton}
                  onPress={handleFilter}>
                  <Filter size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.headerButton}
                  onPress={handleExport}>
                  <Download size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.headerButton}
                  onPress={handleShare}>
                  <Share2 size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Statistics Header */}
            <View style={styles.statisticsHeader}>
              <View>
                <Text style={styles.statisticsTitle}>Statistics</Text>
                <Text style={styles.statisticsSubtitle}>
                  Visualizing progress through numbers
                </Text>
              </View>
              <TouchableOpacity style={styles.notificationButton}>
                <Bell size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Period Selector */}
            <View style={styles.periodSelector}>
              {periods.map(period => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.periodButton,
                    selectedPeriod === period && styles.periodButtonActive,
                  ]}
                  onPress={() => handlePeriodChange(period)}>
                  <Text
                    style={[
                      styles.periodButtonText,
                      selectedPeriod === period &&
                        styles.periodButtonTextActive,
                    ]}>
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Budget Card */}
            <View style={styles.budgetCard}>
              <View style={styles.budgetHeader}>
                <DollarSign size={24} color="#F4C66A" />
                <Text style={styles.budgetTitle}>Budget</Text>
              </View>
              <Text style={styles.budgetAmount}>
                ${statistics.budget.toLocaleString()}
              </Text>
              <View style={styles.budgetProgress}>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${
                          (statistics.totalExpense / statistics.budget) * 100
                        }%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.budgetStatus}>
                  {statistics.totalExpense > statistics.budget
                    ? 'Over budget'
                    : 'Within budget'}
                </Text>
              </View>
            </View>

            {/* Statistics Cards */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <DollarSign size={20} color="#FF6B6B" />
                  <Text style={styles.statTitle}>Total Expense</Text>
                </View>
                <Text style={styles.statAmount}>
                  ${statistics.totalExpense.toLocaleString()}
                </Text>
                <View style={styles.statChange}>
                  <ArrowUpRight size={16} color="#FF6B6B" />
                  <Text style={[styles.changeText, {color: '#FF6B6B'}]}>
                    +{statistics.expenseChange}%
                  </Text>
                </View>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <PiggyBank size={20} color="#4ECDC4" />
                  <Text style={styles.statTitle}>Total Save</Text>
                </View>
                <Text style={styles.statAmount}>
                  ${statistics.totalSave.toLocaleString()}
                </Text>
                <View style={styles.statChange}>
                  <ArrowUpRight size={16} color="#4ECDC4" />
                  <Text style={[styles.changeText, {color: '#4ECDC4'}]}>
                    +{statistics.savingsChange}%
                  </Text>
                </View>
              </View>
            </View>

            {/* Expense Trend Chart */}
            <View style={styles.chartContainer}>
              <View style={styles.chartHeader}>
                <BarChart3 size={24} color="#fff" />
                <Text style={styles.chartTitle}>Expense Trend</Text>
                <TouchableOpacity>
                  <ChevronRight size={20} color="#F4C66A" />
                </TouchableOpacity>
              </View>

              <View style={styles.chartWrapper}>
                <BarChart
                  data={expenseTrendData}
                  barWidth={40}
                  spacing={30}
                  roundedTop
                  roundedBottom
                  hideRules
                  xAxisThickness={0}
                  yAxisThickness={0}
                  yAxisTextStyle={{
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: 12,
                  }}
                  xAxisLabelTextStyle={{
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: 12,
                  }}
                  noOfSections={4}
                  maxValue={
                    Math.max(...expenseTrendData.map(d => d.value)) * 1.2
                  }
                  height={180}
                  width={SCREEN_WIDTH - 80}
                />
              </View>
            </View>

            <Animated.View
              style={[
                styles.advancedBreakdownContainer,
                {
                  opacity: fadeAnim,
                  transform: [{translateY: slideAnim}],
                },
              ]}>
              {/* Section Header with Stats */}
              <View style={styles.breakdownHeader}>
                <View>
                  <Text style={styles.breakdownTitle}>Expense Analytics</Text>
                  <Text style={styles.breakdownSubtitle}>
                    Detailed category breakdown
                  </Text>
                </View>
              </View>

              {/* Summary Cards */}
              <View style={styles.summaryCards}>
                <View style={styles.summaryCard}>
                  <View style={styles.summaryCardHeader}>
                    <DollarSign size={20} color="#F4C66A" />
                    <Text style={styles.summaryCardTitle}>Total Spent</Text>
                  </View>
                  <Text style={styles.summaryCardValue}>
                    ${totalSpent.toLocaleString()}
                  </Text>
                  <Text style={styles.summaryCardSubtext}>
                    of ${totalBudget.toLocaleString()} budget
                  </Text>
                </View>

                <View style={styles.summaryCard}>
                  <View style={styles.summaryCardHeader}>
                    <Target size={20} color="#4ECDC4" />
                    <Text style={styles.summaryCardTitle}>Budget Used</Text>
                  </View>
                  <Text style={styles.summaryCardValue}>
                    {Math.round(budgetUtilization)}%
                  </Text>
                  <Text style={styles.summaryCardSubtext}>
                    ${remainingBudget.toLocaleString()} remaining
                  </Text>
                </View>
              </View>

              <Text style={styles.categoryListTitle}>Category Breakdown</Text>

              <View style={styles.chartContainer}>
                <View style={styles.pieChartWrapper}>
                  <RNPPieChart
                    data={pieChartData}
                    donut
                    radius={140}
                    innerRadius={85}
                    focusOnPress={true} // Enable focus on press
                    strokeWidth={0}
                    innerCircleColor="#1F1D3A"
                    innerCircleBorderWidth={0}
                    innerCircleBorderColor="transparent"
                    showText
                    showValuesAsLabels
                    textColor="#fff"
                    textSize={14}
                    showTextBackground={false}
                    onPress={(item: any, index: number) => {
                      // When pie chart segment is pressed, toggle that category
                      const category = expenseBreakdown.find(
                        cat => cat.category === item.label,
                      );
                      if (category) {
                        toggleCategory(category.id);
                      }
                    }}
                    centerLabelComponent={() => (
                      <View style={styles.centerLabel}>
                        <Text style={styles.centerLabelTitle}>Total</Text>
                        <Text style={styles.centerLabelValue}>
                          ${totalSpent.toLocaleString()}
                        </Text>
                        <Text style={styles.centerLabelSubtitle}>
                          {expenseBreakdown.length} categories
                        </Text>
                      </View>
                    )}
                  />
                </View>

                {/* Default Detailed Category Cards View */}
                <View style={styles.categoryListContainer}>
                  <View style={styles.detailedCategoryView}>
                    {expenseBreakdown.map(item => {
                      const IconComponent = item.icon;
                      const progress = (item.amount / item.budget) * 100;
                      const isOverBudget = progress > 100;

                      return (
                        <TouchableOpacity
                          key={item.id}
                          style={[
                            styles.detailedCategoryCard,
                            selectedCategory === item.id &&
                              styles.categoryListItemSelected,
                          ]}
                          onPress={() => toggleCategory(item.id)}
                          activeOpacity={0.8}>
                          <View style={styles.detailedCardHeader}>
                            <View style={styles.detailedCategoryLeft}>
                              <View
                                style={[
                                  styles.categoryDotLarge,
                                  {backgroundColor: item.color},
                                ]}
                              />
                              <IconComponent size={20} color="#fff" />
                              <Text style={styles.detailedCategoryName}>
                                {item.category}
                              </Text>
                            </View>
                            <View style={styles.detailedCategoryRight}>
                              <Text style={styles.detailedCategoryPercentage}>
                                {item.percentage}%
                              </Text>
                            </View>
                          </View>

                          <View style={styles.detailedCardBody}>
                            <Text style={styles.detailedCategoryAmount}>
                              ${item.amount.toLocaleString()}
                            </Text>
                            <View style={styles.detailedProgressContainer}>
                              <View
                                style={styles.detailedProgressBarBackground}>
                                <View
                                  style={[
                                    styles.detailedProgressBarFill,
                                    {
                                      width: `${Math.min(progress, 100)}%`,
                                      backgroundColor: isOverBudget
                                        ? '#FF6B6B'
                                        : item.color,
                                    },
                                  ]}
                                />
                              </View>
                              <Text style={styles.detailedProgressText}>
                                {Math.round(progress)}% of $
                                {item.budget.toLocaleString()}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>

              {/* Expanded Category Details (Only when individual category is expanded) */}
              {expenseBreakdown
                .filter(item => item.expanded)
                .map(item => {
                  const IconComponent = item.icon;
                  const progress = (item.amount / item.budget) * 100;
                  const isOverBudget = progress > 100;

                  return (
                    <Animated.View
                      key={item.id}
                      style={[styles.expandedCategoryCard]}>
                      <TouchableOpacity
                        style={styles.categoryCardHeader}
                        // onPress={() => toggleCategory(item.id)}
                        activeOpacity={0.7}>
                        <View style={styles.categoryHeaderLeft}>
                          <View
                            style={[
                              styles.categoryIconContainer,
                              {backgroundColor: `${item.color}20`},
                            ]}>
                            <IconComponent size={20} color={item.color} />
                          </View>
                          <View>
                            <Text style={styles.categoryName}>
                              {item.category}
                            </Text>
                            <Text style={styles.categoryTransactions}>
                              {item.transactions} transactions
                            </Text>
                          </View>
                        </View>
                        <View style={styles.categoryHeaderRight}>
                          {renderCategoryProgress(item)}
                          <ChevronUp size={20} color="#666" />
                        </View>
                      </TouchableOpacity>

                      <Animated.View style={styles.categoryDetails}>
                        {/* Budget Progress */}
                        <View style={styles.detailSection}>
                          <Text style={styles.detailTitle}>
                            Budget Progress
                          </Text>
                          <View style={styles.budgetProgressContainer}>
                            <View style={styles.budgetLabels}>
                              <Text style={styles.budgetLabel}>
                                Spent: ${item.amount.toLocaleString()}
                              </Text>
                              <Text style={styles.budgetLabel}>
                                Budget: ${item.budget.toLocaleString()}
                              </Text>
                            </View>
                            {/* <View style={styles.progressBarContainer}>
                              <View style={styles.progressBarBackground}>
                                <View
                                  style={[
                                    styles.progressBarFill,
                                    {
                                      width: `${Math.min(progress, 100)}%`,
                                      backgroundColor: isOverBudget
                                        ? '#FF6B6B'
                                        : item.color,
                                    },
                                  ]}
                                />
                              </View>
                              <Text
                                style={[
                                  styles.progressText,
                                  {
                                    color: isOverBudget
                                      ? '#FF6B6B'
                                      : item.color,
                                  },
                                ]}>
                                {Math.round(progress)}%
                              </Text>
                            </View>
                            {isOverBudget && (
                              <Text style={styles.overBudgetWarning}>
                                ⚠️ Over budget by $
                                {(item.amount - item.budget).toLocaleString()}
                              </Text>
                            )} */}
                          </View>
                        </View>

                        {/* Additional Stats */}
                        <View style={styles.statsGrid}>
                          <View style={styles.statItem}>
                            <Text style={styles.statLabel}>
                              Avg. Transaction
                            </Text>
                            <Text style={styles.statValue}>
                              $
                              {Math.round(
                                item.amount / item.transactions,
                              ).toLocaleString()}
                            </Text>
                          </View>
                          <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Daily Avg.</Text>
                            <Text style={styles.statValue}>
                              ${Math.round(item.amount / 30).toLocaleString()}
                            </Text>
                          </View>
                          <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Trend</Text>
                            <View style={styles.trendValue}>
                              {item.trend > 0 ? (
                                <ArrowUpRight size={16} color="#4CD964" />
                              ) : (
                                <ArrowDownRight size={16} color="#FF3B30" />
                              )}
                              <Text
                                style={[
                                  styles.statValue,
                                  {
                                    color:
                                      item.trend > 0 ? '#4CD964' : '#FF3B30',
                                  },
                                ]}>
                                {Math.abs(item.trend)}%
                              </Text>
                            </View>
                          </View>
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.actionButtons}>
                          <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => {
                              // Navigate to transactions for this category
                              console.log(`View ${item.category} transactions`);
                              // navigation.navigate('Transactions', { category: item.category });
                            }}>
                            <Text style={styles.actionButtonText}>
                              View Transactions
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.actionButton, styles.editButton]}
                            onPress={() => {
                              // Open budget adjustment for this category
                              console.log(`Adjust ${item.category} budget`);
                              // navigation.navigate('Budget', { category: item.category });
                            }}>
                            <Text style={styles.editButtonText}>
                              Adjust Budget
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </Animated.View>
                    </Animated.View>
                  );
                })}

              {/* Insights */}
              <View style={styles.insightsSection}>
                <Text style={styles.insightsTitle}>💡 Spending Insights</Text>
                <View style={styles.insightItem}>
                  <View
                    style={[
                      styles.insightIcon,
                      {backgroundColor: `${topCategory.color}20`},
                    ]}>
                    <TrendingUp size={20} color={topCategory.color} />
                  </View>
                  <Text style={styles.insightText}>
                    Highest spending is on{' '}
                    <Text style={{color: topCategory.color, fontWeight: '600'}}>
                      {topCategory.category}
                    </Text>{' '}
                    (${topCategory.amount.toLocaleString()})
                  </Text>
                </View>
                <View style={styles.insightItem}>
                  <View
                    style={[
                      styles.insightIcon,
                      {
                        backgroundColor:
                          highestTrend.trend > 0
                            ? 'rgba(76, 217, 100, 0.1)'
                            : 'rgba(255, 59, 48, 0.1)',
                      },
                    ]}>
                    {highestTrend.trend > 0 ? (
                      <ArrowUpRight size={20} color="#4CD964" />
                    ) : (
                      <ArrowDownRight size={20} color="#FF3B30" />
                    )}
                  </View>
                  <Text style={styles.insightText}>
                    <Text
                      style={{
                        color: highestTrend.trend > 0 ? '#4CD964' : '#FF3B30',
                        fontWeight: '600',
                      }}>
                      {highestTrend.category}
                    </Text>{' '}
                    is {highestTrend.trend > 0 ? 'increasing' : 'decreasing'} by{' '}
                    {Math.abs(highestTrend.trend)}%
                  </Text>
                </View>
              </View>
            </Animated.View>

            {/* Spacer for bottom navigation */}
            <View style={{height: 100}} />
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  statisticsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  statisticsTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statisticsSubtitle: {
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
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: '#1F1D3A',
  },
  periodButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '500',
  },
  periodButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  budgetCard: {
    backgroundColor: '#1F1D3A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  budgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  statValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  budgetTitle: {
    color: '#F4C66A',
    fontSize: 16,
    fontWeight: '600',
  },
  budgetAmount: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 16,
  },
  budgetProgress: {
    gap: 8,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F97316',
    borderRadius: 4,
  },
  budgetStatus: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1F1D3A',
    borderRadius: 16,
    padding: 16,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  statTitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  statAmount: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chartContainer: {
    backgroundColor: '#1F1D3A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginLeft: 12,
  },
  chartWrapper: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  // Advanced Breakdown Styles
  advancedBreakdownContainer: {
    backgroundColor: '#1F1D3A',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  breakdownTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  breakdownSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(244, 198, 106, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  toggleButtonText: {
    color: '#F4C66A',
    fontSize: 14,
    fontWeight: '600',
  },
  summaryCards: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
  },
  summaryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  summaryCardTitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  summaryCardValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  summaryCardSubtext: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
  },
  visualizationToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  vizButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 8,
  },
  vizButtonActive: {
    backgroundColor: '#F97316',
  },
  vizButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  vizButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  chartSection: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 24,
  },
  pieChartWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },

  centerLabel: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabelTitle: {
    fontSize: 14,
    color: '#B5B5C3',
    marginBottom: 6,
  },

  centerLabelValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  centerLabelSubtitle: {
    fontSize: 13,
    color: '#B5B5C3',
    marginTop: 6,
  },
  legendContainer: {
    flex: 1,
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  legendItemSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  legendItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendCategory: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  legendItemRight: {
    alignItems: 'flex-end',
  },
  legendPercentage: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  legendAmount: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  categoryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  categoryListContainer: {
    marginTop: 20,
    width: '100%',
  },

  categoryCardExpanded: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  categoryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryListTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    paddingVertical: 8,
    // marginBottom: 16,
  },

  categoryList: {
    gap: 12,
  },
  categoryListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  categoryListItemSelected: {
    backgroundColor: '#3C3C3E',
    borderWidth: 1,
    borderColor: '#F4C66A',
  },
  categoryListItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // 👈 allows text to breathe
    gap: 10,
  },

  categoryListName: {
    fontSize: 16,
    color: '#FFFFFF',
    flexShrink: 1, // 👈 prevents pushing right side
  },

  /* RIGHT */
  categoryListItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 14,
  },

  categoryListPercentage: {
    fontSize: 14,
    color: '#B5B5C3',
    width: 48, // 👈 fixed column
    textAlign: 'right',
  },

  categoryListAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    width: 90, // 👈 fixed column
    textAlign: 'right',
  },

  categoryName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  categoryTransactions: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
  },
  categoryHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressContainer: {
    position: 'relative',
    width: 50,
    height: 50,
  },
  progressTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: 10,
    fontWeight: '700',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  trendText: {
    fontSize: 10,
    fontWeight: '600',
  },
  categoryDetails: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  detailSection: {
    marginBottom: 20,
  },
  detailTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  budgetProgressContainer: {
    gap: 12,
  },
  budgetLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  overBudgetWarning: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginBottom: 6,
  },
  trendValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  editButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '600',
  },
  insightsSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  insightsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  insightIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    flex: 1,
  },
  categoryListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(244, 198, 106, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },

  detailToggleText: {
    color: '#F4C66A',
    fontSize: 14,
    fontWeight: '600',
  },
  toggleChevron: {
    transform: [{rotate: '0deg'}],
    transition: 'transform 0.3s',
  },

  toggleChevronRotated: {
    transform: [{rotate: '90deg'}],
  },

  detailedCategoryView: {
    gap: 12,
  },

  detailedCategoryCard: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
  },

  detailedCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  detailedCategoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },

  categoryDotLarge: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  detailedCategoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flexShrink: 1,
  },

  detailedCategoryRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  detailedCategoryPercentage: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    minWidth: 50,
    textAlign: 'right',
  },

  detailedCardBody: {
    gap: 8,
  },

  detailedCategoryAmount: {
    fontSize: 14,
    color: '#B5B5C3',
    marginBottom: 4,
  },

  detailedProgressContainer: {
    gap: 6,
  },

  detailedProgressBarBackground: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },

  detailedProgressBarFill: {
    height: '100%',
    borderRadius: 3,
  },

  detailedProgressText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    alignSelf: 'flex-end',
  },

  expandedCategoryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    marginTop: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
});
