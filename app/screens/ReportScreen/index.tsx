import React, {useState, useEffect, useRef, useMemo, useCallback} from 'react';
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
  PieChart as PieChartIcon,
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
  Coffee,
  Film,
  Heart,
  Book,
  Bus,
  Plane,
  Music,
  Gamepad2,
  Dumbbell,
  GraduationCap,
  Gift,
  Wifi,
  Phone,
  Zap,
  Cloud,
  Package,
} from 'lucide-react-native';
import {BarChart, PieChart as RNPPieChart} from 'react-native-gifted-charts';
import Svg, {Circle} from 'react-native-svg';
import {_showToast} from '../../services/UIs/ToastConfig';
import {useSelector} from 'react-redux';
import {NavigationKeys} from '../../constants/navigationKeys';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

export default function ReportScreen({navigation}: any) {
  // Get data from Redux using memoized selectors
  const expenses = useSelector((state: any) => state.userData.expenses || []);
  const categories = useSelector(
    (state: any) => state.userData.categories || [],
  );
  const monthlyBudget = useSelector(
    (state: any) => state.userData.monthlyBudget || 0,
  );

  // Memoize the data to prevent unnecessary rerenders
  const memoizedExpenses = useMemo(() => expenses, [JSON.stringify(expenses)]);
  const memoizedCategories = useMemo(
    () => categories,
    [JSON.stringify(categories)],
  );

  // State for dynamic data
  const [selectedPeriod, setSelectedPeriod] = useState('Monthly');
  const [expenseTrendData, setExpenseTrendData] = useState([]);
  const [statistics, setStatistics] = useState({
    totalExpense: 0,
    totalSave: 0,
    budget: monthlyBudget,
    expenseChange: 0,
    savingsChange: 0,
  });

  // Expense Breakdown State
  const [expenseBreakdown, setExpenseBreakdown] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const periods = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

  // Calculate dynamic data with useMemo to prevent infinite loops
  const calculatedData = useMemo(() => {
    const totalExpense = memoizedExpenses.reduce(
      (sum: number, exp: any) => sum + (exp.amount || 0),
      0,
    );
    const budget = monthlyBudget || 0;
    const savingsGoal = budget * 0.3;
    const totalSave = Math.max(0, savingsGoal - totalExpense);

    return {
      totalExpense,
      totalSave,
      budget,
      expenseChange: totalExpense > 0 ? 12.5 : 0,
      savingsChange: totalSave > 0 ? 8.2 : 0,
    };
  }, [memoizedExpenses, monthlyBudget]);

  // Calculate expense trend data based on selected period
  const calculateExpenseTrendData = useCallback(() => {
    if (!memoizedExpenses || memoizedExpenses.length === 0) {
      return [];
    }

    let data = [];
    const colors = [
      '#F97316',
      '#22D3EE',
      '#86EFAC',
      '#A855F7',
      '#FF6B6B',
      '#4ECDC4',
    ];

    const now = new Date();

    switch (selectedPeriod) {
      case 'Daily':
        data = Array.from({length: 7}, (_, i) => {
          const date = new Date(now);
          date.setDate(date.getDate() - (6 - i));
          const dayStart = new Date(date.setHours(0, 0, 0, 0));
          const dayEnd = new Date(date.setHours(23, 59, 59, 999));

          const dayExpenses = memoizedExpenses.filter((expense: any) => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= dayStart && expenseDate <= dayEnd;
          });

          const total = dayExpenses.reduce(
            (sum: number, exp: any) => sum + (exp.amount || 0),
            0,
          );

          return {
            value: total,
            label: date
              .toLocaleDateString('en-US', {weekday: 'short'})
              .charAt(0),
            frontColor: colors[i % colors.length],
            spacing: 20,
          };
        });
        break;

      case 'Weekly':
        data = Array.from({length: 4}, (_, index) => {
          const weekStart = new Date(now);
          weekStart.setDate(weekStart.getDate() - (3 - index) * 7);
          weekStart.setHours(0, 0, 0, 0);

          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          weekEnd.setHours(23, 59, 59, 999);

          const weekExpenses = memoizedExpenses.filter((expense: any) => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= weekStart && expenseDate <= weekEnd;
          });

          const total = weekExpenses.reduce(
            (sum: number, exp: any) => sum + (exp.amount || 0),
            0,
          );

          return {
            value: total,
            label: `W${index + 1}`,
            frontColor: colors[index % colors.length],
          };
        });
        break;

      case 'Monthly':
        data = Array.from({length: 6}, (_, index) => {
          const month = new Date(now);
          month.setMonth(month.getMonth() - (5 - index));
          const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
          const monthEnd = new Date(
            month.getFullYear(),
            month.getMonth() + 1,
            0,
          );
          monthEnd.setHours(23, 59, 59, 999);

          const monthExpenses = memoizedExpenses.filter((expense: any) => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= monthStart && expenseDate <= monthEnd;
          });

          const total = monthExpenses.reduce(
            (sum: number, exp: any) => sum + (exp.amount || 0),
            0,
          );

          return {
            value: total,
            label: month.toLocaleDateString('en-US', {month: 'short'}),
            frontColor: colors[index % colors.length],
          };
        });
        break;

      case 'Yearly':
        data = Array.from({length: 4}, (_, index) => {
          const year = now.getFullYear() - (3 - index);
          const yearStart = new Date(year, 0, 1);
          const yearEnd = new Date(year, 11, 31);
          yearEnd.setHours(23, 59, 59, 999);

          const yearExpenses = memoizedExpenses.filter((expense: any) => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= yearStart && expenseDate <= yearEnd;
          });

          const total = yearExpenses.reduce(
            (sum: number, exp: any) => sum + (exp.amount || 0),
            0,
          );

          return {
            value: total,
            label: year.toString(),
            frontColor: colors[index % colors.length],
          };
        });
        break;
    }

    return data;
  }, [memoizedExpenses, selectedPeriod]);

  // Calculate expense breakdown by category
  const calculateExpenseBreakdown = useCallback(() => {
    if (
      !memoizedExpenses ||
      memoizedExpenses.length === 0 ||
      !memoizedCategories ||
      memoizedCategories.length === 0
    ) {
      return [];
    }

    // Initialize category totals
    const categoryTotals: Record<string, any> = {};

    // Initialize with categories that have budget
    memoizedCategories.forEach((cat: any) => {
      if (cat && cat.name && (cat.budget || 0) > 0) {
        categoryTotals[cat.name] = {
          id: cat.id || cat.name,
          category: cat.name,
          icon: getCategoryIcon(cat.name),
          color: cat.color || '#F97316',
          amount: 0,
          budget: cat.budget || 0,
          transactions: 0,
          expanded: false,
        };
      }
    });

    // Calculate spent per category
    memoizedExpenses.forEach((expense: any) => {
      let categoryName = '';

      if (typeof expense.category === 'string') {
        categoryName = expense.category;
      } else if (expense.category && expense.category.name) {
        categoryName = expense.category.name;
      }

      if (categoryName && categoryTotals[categoryName]) {
        categoryTotals[categoryName].amount += expense.amount || 0;
        categoryTotals[categoryName].transactions += 1;
      }
    });

    // Convert to array and calculate percentages
    const totalSpent = Object.values(categoryTotals).reduce(
      (sum: number, cat: any) => sum + cat.amount,
      0,
    );

    const breakdownArray = Object.values(categoryTotals)
      .filter((cat: any) => cat.budget > 0)
      .map((cat: any) => {
        const percentage = (cat.amount / cat.budget) * 100;
        const breakdownPercentage =
          totalSpent > 0 ? (cat.amount / totalSpent) * 100 : 0;

        // Calculate trend (simplified)
        const trend = cat.amount > cat.budget ? -10 : Math.random() * 20;

        return {
          ...cat,
          percentage: Math.min(Math.round(percentage), 100),
          breakdownPercentage: Math.round(breakdownPercentage),
          trend: Math.round(trend),
        };
      })
      .sort((a: any, b: any) => b.amount - a.amount);

    return breakdownArray;
  }, [memoizedExpenses, memoizedCategories]);

  // Use effects to update state only when needed
  useEffect(() => {
    // Update statistics
    setStatistics(calculatedData);

    // Update trend data
    const trendData = calculateExpenseTrendData();
    setExpenseTrendData(trendData);

    // Update breakdown
    const breakdown = calculateExpenseBreakdown();
    setExpenseBreakdown(breakdown);

    // Animation
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
  }, [
    calculatedData,
    calculateExpenseTrendData,
    calculateExpenseBreakdown,
    fadeAnim,
    slideAnim,
  ]);

  // Helper function to get icon based on category name
  const getCategoryIcon = useCallback((categoryName: string) => {
    const lowerName = categoryName.toLowerCase();

    if (
      lowerName.includes('food') ||
      lowerName.includes('grocer') ||
      lowerName.includes('restaurant')
    )
      return Utensils;
    if (
      lowerName.includes('transport') ||
      lowerName.includes('car') ||
      lowerName.includes('gas')
    )
      return Car;
    if (lowerName.includes('shop') || lowerName.includes('retail'))
      return ShoppingBag;
    if (
      lowerName.includes('home') ||
      lowerName.includes('rent') ||
      lowerName.includes('mortgage')
    )
      return Home;
    if (
      lowerName.includes('entertain') ||
      lowerName.includes('movie') ||
      lowerName.includes('netflix')
    )
      return Airplay;
    if (lowerName.includes('health') || lowerName.includes('medical'))
      return Heart;
    if (lowerName.includes('education') || lowerName.includes('school'))
      return GraduationCap;
    if (lowerName.includes('coffee') || lowerName.includes('cafe'))
      return Coffee;
    if (
      lowerName.includes('travel') ||
      lowerName.includes('flight') ||
      lowerName.includes('hotel')
    )
      return Plane;
    if (lowerName.includes('fuel') || lowerName.includes('gasoline'))
      return Zap;
    if (lowerName.includes('gym') || lowerName.includes('fitness'))
      return Dumbbell;
    if (lowerName.includes('gift') || lowerName.includes('donation'))
      return Gift;
    if (lowerName.includes('internet') || lowerName.includes('wifi'))
      return Wifi;
    if (lowerName.includes('phone') || lowerName.includes('mobile'))
      return Phone;
    if (lowerName.includes('music') || lowerName.includes('spotify'))
      return Music;
    if (lowerName.includes('game') || lowerName.includes('gaming'))
      return Gamepad2;
    if (lowerName.includes('subscription') || lowerName.includes('cloud'))
      return Cloud;
    if (lowerName.includes('delivery') || lowerName.includes('package'))
      return Package;

    return DollarSign;
  }, []);

  // Function to handle period change
  const handlePeriodChange = useCallback((period: string) => {
    setSelectedPeriod(period);
  }, []);

  // Function to export report
  const handleExport = useCallback(() => {
    console.log('Exporting report...');
    _showToast('Coming Soon', 'info');
  }, []);

  // Toggle category expansion
  const toggleCategory = useCallback(
    (id: string) => {
      setExpenseBreakdown(prev =>
        prev.map(item =>
          item.id === id ? {...item, expanded: !item.expanded} : item,
        ),
      );
      setSelectedCategory(selectedCategory === id ? null : id);
    },
    [selectedCategory],
  );

  // Toggle all details
  const toggleAllDetails = useCallback(() => {
    setShowDetails(!showDetails);
  }, [showDetails]);

  // Calculate totals
  const totals = useMemo(() => {
    const totalSpent = expenseBreakdown.reduce(
      (sum: number, item: any) => sum + item.amount,
      0,
    );
    const totalBudget = expenseBreakdown.reduce(
      (sum: number, item: any) => sum + item.budget,
      0,
    );
    const remainingBudget = totalBudget - totalSpent;
    const budgetUtilization =
      totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    return {totalSpent, totalBudget, remainingBudget, budgetUtilization};
  }, [expenseBreakdown]);

  // Get top spending category
  const topCategory = useMemo(() => {
    return expenseBreakdown.length > 0
      ? expenseBreakdown.reduce((prev: any, current: any) =>
          prev.amount > current.amount ? prev : current,
        )
      : null;
  }, [expenseBreakdown]);

  // Get highest trend
  const highestTrend = useMemo(() => {
    return expenseBreakdown.length > 0
      ? expenseBreakdown.reduce((prev: any, current: any) =>
          Math.abs(prev.trend) > Math.abs(current.trend) ? prev : current,
        )
      : null;
  }, [expenseBreakdown]);

  // Enhanced Pie Chart Data
  const pieChartData = useMemo(() => {
    return expenseBreakdown.map((item: any) => ({
      value: item.breakdownPercentage,
      color: item.color,
      label: item.category,
      gradientCenterColor: item.color,
      focused: selectedCategory === item.id,
    }));
  }, [expenseBreakdown, selectedCategory]);

  // Render Circular Progress for each category
  const renderCategoryProgress = useCallback((item: any) => {
    const progress = item.percentage;
    const strokeWidth = 4;
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <View style={styles.progressContainer}>
        <Svg width="50" height="50">
          <Circle
            cx="25"
            cy="25"
            r={radius}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
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
  }, []);

  // Render Trend Indicator
  const renderTrendIndicator = useCallback((trend: number) => {
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
  }, []);

  // Render empty state
  const renderEmptyState = useCallback(
    (title: string, message: string) => (
      <View style={styles.emptyState}>
        <PieChartIcon size={48} color="rgba(255, 255, 255, 0.3)" />
        <Text style={styles.emptyStateTitle}>{title}</Text>
        <Text style={styles.emptyStateText}>{message}</Text>
        <TouchableOpacity
          style={styles.emptyStateButton}
          onPress={() => navigation.navigate(NavigationKeys.AddExpenseScreen)}>
          <Text style={styles.emptyStateButtonText}>
            Add Your First Expense
          </Text>
        </TouchableOpacity>
      </View>
    ),
    [navigation],
  );

  return (
    <AppMainContainer hideTop hideBottom>
      <LinearGradient colors={['#141326', '#24224A']} style={{flex: 1}}>
        <StatusBar barStyle={'light-content'} translucent={false} />
        <SafeAreaView style={{flex: 1}}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation.goBack()}>
              <ChevronLeft size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Report</Text>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleExport}>
              <Download size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}>
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

            {/* Main Statistics */}
            {memoizedExpenses.length === 0 ? (
              renderEmptyState(
                'No Expense Data',
                'Start tracking your expenses to see detailed reports and insights',
              )
            ) : (
              <>
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
                            width: `${Math.min(
                              (statistics.totalExpense / statistics.budget) *
                                100,
                              100,
                            )}%`,
                            backgroundColor:
                              statistics.totalExpense > statistics.budget
                                ? '#FF6B6B'
                                : '#F97316',
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.budgetStatus}>
                      {statistics.totalExpense > statistics.budget
                        ? `Over budget by $${(
                            statistics.totalExpense - statistics.budget
                          ).toLocaleString()}`
                        : `Within budget - $${(
                            statistics.budget - statistics.totalExpense
                          ).toLocaleString()} remaining`}
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
                      {statistics.expenseChange > 0 ? (
                        <ArrowUpRight size={16} color="#FF6B6B" />
                      ) : (
                        <ArrowDownRight size={16} color="#4ECDC4" />
                      )}
                      <Text
                        style={[
                          styles.changeText,
                          {
                            color:
                              statistics.expenseChange > 0
                                ? '#FF6B6B'
                                : '#4ECDC4',
                          },
                        ]}>
                        {statistics.expenseChange > 0 ? '+' : ''}
                        {statistics.expenseChange}%
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
                      {statistics.savingsChange > 0 ? (
                        <ArrowUpRight size={16} color="#4ECDC4" />
                      ) : (
                        <ArrowDownRight size={16} color="#FF6B6B" />
                      )}
                      <Text
                        style={[
                          styles.changeText,
                          {
                            color:
                              statistics.savingsChange > 0
                                ? '#4ECDC4'
                                : '#FF6B6B',
                          },
                        ]}>
                        {statistics.savingsChange > 0 ? '+' : ''}
                        {statistics.savingsChange}%
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Expense Trend Chart */}
                {expenseTrendData.length > 0 && (
                  <View style={styles.chartContainer}>
                    <View style={styles.chartHeader}>
                      <BarChart3 size={24} color="#fff" />
                      <Text style={styles.chartTitle}>
                        Expense Trend ({selectedPeriod})
                      </Text>
                    </View>

                    <View style={styles.chartWrapper}>
                      <BarChart
                        data={expenseTrendData}
                        barWidth={30}
                        spacing={25}
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
                          expenseTrendData.length > 0
                            ? Math.max(
                                ...expenseTrendData.map((d: any) => d.value),
                              ) * 1.2
                            : 0
                        }
                        height={180}
                        width={SCREEN_WIDTH - 80}
                      />
                    </View>
                  </View>
                )}

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
                      <Text style={styles.breakdownTitle}>
                        Expense Analytics
                      </Text>
                      <Text style={styles.breakdownSubtitle}>
                        Detailed category breakdown
                      </Text>
                    </View>
                  </View>

                  {/* Summary Cards */}
                  {expenseBreakdown.length > 0 && (
                    <>
                      <View style={styles.summaryCards}>
                        <View style={styles.summaryCard}>
                          <View style={styles.summaryCardHeader}>
                            <DollarSign size={20} color="#F4C66A" />
                            <Text style={styles.summaryCardTitle}>
                              Total Spent
                            </Text>
                          </View>
                          <Text style={styles.summaryCardValue}>
                            ${totals.totalSpent.toLocaleString()}
                          </Text>
                          <Text style={styles.summaryCardSubtext}>
                            of ${totals.totalBudget.toLocaleString()} budget
                          </Text>
                        </View>

                        <View style={styles.summaryCard}>
                          <View style={styles.summaryCardHeader}>
                            <Target size={20} color="#4ECDC4" />
                            <Text style={styles.summaryCardTitle}>
                              Budget Used
                            </Text>
                          </View>
                          <Text style={styles.summaryCardValue}>
                            {Math.round(totals.budgetUtilization)}%
                          </Text>
                          <Text style={styles.summaryCardSubtext}>
                            ${totals.remainingBudget.toLocaleString()} remaining
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.categoryListTitle}>
                        Category Breakdown
                      </Text>

                      <View style={styles.chartContainer}>
                        {pieChartData.length > 0 ? (
                          <>
                            <View style={styles.pieChartWrapper}>
                              <RNPPieChart
                                data={pieChartData}
                                donut
                                radius={140}
                                innerRadius={85}
                                focusOnPress={true}
                                strokeWidth={0}
                                innerCircleColor="#1F1D3A"
                                innerCircleBorderWidth={0}
                                innerCircleBorderColor="transparent"
                                showTextBackground={false}
                                onPress={(item: any, index: number) => {
                                  const category = expenseBreakdown.find(
                                    (cat: any) => cat.category === item.label,
                                  );
                                  if (category) {
                                    toggleCategory(category.id);
                                  }
                                }}
                                centerLabelComponent={() => (
                                  <View style={styles.centerLabel}>
                                    <Text style={styles.centerLabelTitle}>
                                      Total
                                    </Text>
                                    <Text style={styles.centerLabelValue}>
                                      ${totals.totalSpent.toLocaleString()}
                                    </Text>
                                    <Text style={styles.centerLabelSubtitle}>
                                      {expenseBreakdown.length} categories
                                    </Text>
                                  </View>
                                )}
                              />
                            </View>

                            {/* Category List */}
                            <View style={styles.categoryListContainer}>
                              <View style={styles.detailedCategoryView}>
                                {expenseBreakdown.map((item: any) => {
                                  const IconComponent = item.icon;
                                  const progress = item.percentage;
                                  const isOverBudget =
                                    item.amount > item.budget;

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
                                        <View
                                          style={styles.detailedCategoryLeft}>
                                          <View
                                            style={[
                                              styles.categoryDotLarge,
                                              {backgroundColor: item.color},
                                            ]}
                                          />
                                          <IconComponent
                                            size={20}
                                            color="#fff"
                                          />
                                          <Text
                                            style={styles.detailedCategoryName}>
                                            {item.category}
                                          </Text>
                                        </View>
                                        <View
                                          style={styles.detailedCategoryRight}>
                                          <Text
                                            style={
                                              styles.detailedCategoryPercentage
                                            }>
                                            {item.breakdownPercentage}%
                                          </Text>
                                        </View>
                                      </View>

                                      <View style={styles.detailedCardBody}>
                                        <Text
                                          style={styles.detailedCategoryAmount}>
                                          ${item.amount.toLocaleString()}
                                        </Text>
                                        <View
                                          style={
                                            styles.detailedProgressContainer
                                          }>
                                          <View
                                            style={
                                              styles.detailedProgressBarBackground
                                            }>
                                            <View
                                              style={[
                                                styles.detailedProgressBarFill,
                                                {
                                                  width: `${Math.min(
                                                    progress,
                                                    100,
                                                  )}%`,
                                                  backgroundColor: isOverBudget
                                                    ? '#FF6B6B'
                                                    : item.color,
                                                },
                                              ]}
                                            />
                                          </View>
                                          <Text
                                            style={styles.detailedProgressText}>
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
                          </>
                        ) : (
                          <View style={styles.emptyStateSmall}>
                            <Text style={styles.emptyStateSmallText}>
                              No categories with budget set up
                            </Text>
                          </View>
                        )}
                      </View>

                      {/* Expanded Category Details */}
                      {expenseBreakdown
                        .filter((item: any) => item.expanded)
                        .map((item: any) => {
                          const IconComponent = item.icon;
                          const progress = item.percentage;
                          const isOverBudget = item.amount > item.budget;

                          return (
                            <Animated.View
                              key={item.id}
                              style={[styles.expandedCategoryCard]}>
                              <TouchableOpacity
                                style={styles.categoryCardHeader}
                                activeOpacity={0.7}>
                                <View style={styles.categoryHeaderLeft}>
                                  <View
                                    style={[
                                      styles.categoryIconContainer,
                                      {backgroundColor: `${item.color}20`},
                                    ]}>
                                    <IconComponent
                                      size={20}
                                      color={item.color}
                                    />
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
                                      {item.transactions > 0
                                        ? Math.round(
                                            item.amount / item.transactions,
                                          ).toLocaleString()
                                        : '0'}
                                    </Text>
                                  </View>
                                  <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>
                                      Daily Avg.
                                    </Text>
                                    <Text style={styles.statValue}>
                                      $
                                      {Math.round(
                                        item.amount / 30,
                                      ).toLocaleString()}
                                    </Text>
                                  </View>
                                  <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>Trend</Text>
                                    <View style={styles.trendValue}>
                                      {item.trend > 0 ? (
                                        <ArrowUpRight
                                          size={16}
                                          color="#4CD964"
                                        />
                                      ) : (
                                        <ArrowDownRight
                                          size={16}
                                          color="#FF3B30"
                                        />
                                      )}
                                      <Text
                                        style={[
                                          styles.statValue,
                                          {
                                            color:
                                              item.trend > 0
                                                ? '#4CD964'
                                                : '#FF3B30',
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
                                      _showToast('Coming Soon', 'info');
                                    }}>
                                    <Text style={styles.actionButtonText}>
                                      View Transactions
                                    </Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    style={[
                                      styles.actionButton,
                                      styles.editButton,
                                    ]}
                                    onPress={() => {
                                      _showToast('Coming Soon', 'info');
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
                      {topCategory && highestTrend && (
                        <View style={styles.insightsSection}>
                          <Text style={styles.insightsTitle}>
                            💡 Spending Insights
                          </Text>
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
                              <Text
                                style={{
                                  color: topCategory.color,
                                  fontWeight: '600',
                                }}>
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
                                  color:
                                    highestTrend.trend > 0
                                      ? '#4CD964'
                                      : '#FF3B30',
                                  fontWeight: '600',
                                }}>
                                {highestTrend.category}
                              </Text>{' '}
                              is{' '}
                              {highestTrend.trend > 0
                                ? 'increasing'
                                : 'decreasing'}{' '}
                              by {Math.abs(highestTrend.trend)}%
                            </Text>
                          </View>
                        </View>
                      )}
                    </>
                  )}

                  {expenseBreakdown.length === 0 && categories.length > 0 && (
                    <View style={styles.emptyStateSmall}>
                      <Text style={styles.emptyStateSmallText}>
                        Set up category budgets to see breakdown
                      </Text>
                      <TouchableOpacity
                        style={styles.emptyStateButtonSmall}
                        onPress={() => navigation.navigate('ManageCategories')}>
                        <Text style={styles.emptyStateButtonText}>
                          Setup Budgets
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </Animated.View>
              </>
            )}

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
    paddingHorizontal: 16,
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
  categoryListContainer: {
    marginTop: 20,
    width: '100%',
  },
  categoryListTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    paddingVertical: 8,
    marginBottom: 16,
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
  categoryListItemSelected: {
    backgroundColor: '#3C3C3E',
    borderWidth: 1,
    borderColor: '#F4C66A',
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
  statValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    marginTop: 20,
  },
  emptyStateTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 20,
  },
  emptyStateButton: {
    backgroundColor: '#F4C66A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyStateButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyStateSmall: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  emptyStateSmallText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyStateButtonSmall: {
    backgroundColor: 'rgba(244, 198, 106, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F4C66A',
  },
});
