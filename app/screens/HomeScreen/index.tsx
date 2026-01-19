import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AppMainContainer from '../../components/AppMainContainer';
import AppText from '../../components/AppText';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

// Import Lucide icons
import {
  Bell,
  Home,
  BarChart3,
  Wallet,
  User,
  ShoppingCart,
  Car,
  ShoppingBag,
  CreditCard,
  Utensils,
  Bus,
  Tv,
  CircleDollarSign,
  TrendingUp,
  PiggyBank,
  GanttChartSquare,
  Fuel,
  DollarSign,
} from 'lucide-react-native';
import {useSelector} from 'react-redux';
import {_showToast} from '../../services/UIs/ToastConfig';

export default function HomeScreen({navigation}: any) {
  // Get expenses from Redux
  const expenses = useSelector((state: any) => state.userData.expenses || []);

  console.log('expenses from redux', expenses);

  // Get user name from Redux (if available)
  const userName = useSelector(
    (state: any) => state.userData.userName || 'John Alex',
  );

  // Calculate totals from Redux expenses
  const calculateTotals = () => {
    if (!expenses || expenses.length === 0) {
      return {
        totalSpent: 0,
        totalBudget: 30000, // Default budget if no expenses
        totalRemaining: 30000,
        totalSavings: 0,
        // Add formatted strings
        formattedRemaining: '$30,000',
        formattedSpent: '$0',
        formattedSavings: '$0',
      };
    }

    const totalSpent = expenses.reduce(
      (sum: number, expense: any) => sum + (expense.amount || 0),
      0,
    );

    const totalBudget = 30000;
    const totalRemaining = Math.max(0, totalBudget - totalSpent);
    const totalSavings = Math.max(0, totalBudget * 0.3 - totalSpent);

    // Format numbers properly to avoid line breaks
    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: true,
    });

    return {
      totalSpent,
      totalBudget,
      totalRemaining,
      totalSavings,
      formattedRemaining: `$${formatter.format(totalRemaining)}`,
      formattedSpent: `$${formatter.format(totalSpent)}`,
      formattedSavings: `$${formatter.format(totalSavings)}`,
    };
  };

  const totals = calculateTotals();

  // Group expenses by category and calculate category totals
  // In HomeScreen, update the getCategoryTotals function:
  const getCategoryTotals = () => {
    if (!expenses || expenses.length === 0) {
      return budgetCategories; // Return default if no expenses
    }

    const categoryMap = {
      Food: {spent: 0, color: '#F97316', icon: Utensils, budget: 5000},
      Transport: {spent: 0, color: '#22D3EE', icon: Car, budget: 6000},
      Shopping: {spent: 0, color: '#86EFAC', icon: ShoppingBag, budget: 5000},
      Home: {spent: 0, color: '#A855F7', icon: Home, budget: 4000},
      Entertainment: {spent: 0, color: '#FF6B6B', icon: Tv, budget: 2000},
    };

    // Calculate spent per category
    expenses.forEach((expense: any) => {
      let categoryName = '';

      // Handle both string and object category
      if (typeof expense.category === 'string') {
        categoryName = expense.category;
      } else if (expense.category && expense.category.name) {
        categoryName = expense.category.name;
      }

      if (categoryName && categoryMap[categoryName]) {
        categoryMap[categoryName].spent += expense.amount || 0;
      }
    });

    // Convert to array format
    return Object.entries(categoryMap).map(([title, data], index) => ({
      id: (index + 1).toString(),
      title,
      percentage: Math.min(Math.round((data.spent / data.budget) * 100), 100),
      spent: data.spent,
      total: data.budget,
      color: data.color,
      icon: data.icon,
    }));
  };

  const budgetCategoriesData = getCategoryTotals();

  // Get recent expenses (last 3 expenses)
  const getRecentExpenses = () => {
    if (!expenses || expenses.length === 0) {
      return recentExpenses; // Return default if no expenses
    }

    // Sort by date (newest first) and take first 3
    const sortedExpenses = [...expenses]
      .sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime(),
      )
      .slice(0, 3);

    return sortedExpenses.map((expense: any, index: number) => {
      // Get category name
      let categoryName = '';
      if (typeof expense.category === 'string') {
        categoryName = expense.category;
      } else if (expense.category && expense.category.name) {
        categoryName = expense.category.name;
      }

      // Map category to icon
      let icon = ShoppingCart; // default
      if (categoryName === 'Home') icon = Home;
      else if (categoryName === 'Transport') icon = Car;
      else if (categoryName === 'Shopping') icon = ShoppingBag;
      else if (categoryName === 'Food') icon = Utensils;
      else if (categoryName === 'Entertainment') icon = Tv;

      // Format date
      const date = new Date(expense.date);
      const formattedDate = `${date.getDate()} ${date.toLocaleString(
        'default',
        {month: 'short'},
      )} ${date.getFullYear().toString().slice(-2)}`;

      return {
        id: expense.id || index.toString(),
        title: expense.description || 'Expense',
        description: categoryName || 'Category',
        date: formattedDate,
        amount: `$${expense.amount?.toLocaleString() || '0'}`,
        icon,
      };
    });
  };

  const recentExpensesData = getRecentExpenses();

  // Get all transactions (for the transactions section)
  const getAllTransactions = () => {
    if (!expenses || expenses.length === 0) {
      return transactions; // Return default if no expenses
    }

    // Take first 3 expenses for transactions section
    const firstThreeExpenses = expenses.slice(0, 3);

    return firstThreeExpenses.map((expense: any, index: number) => {
      // Get category name
      let categoryName = '';
      if (typeof expense.category === 'string') {
        categoryName = expense.category;
      } else if (expense.category && expense.category.name) {
        categoryName = expense.category.name;
      }

      // Map category to icon and color
      let icon = Fuel; // default
      let color = '#F97316'; // default

      if (categoryName === 'Home') {
        icon = Home;
        color = '#F97316';
      } else if (categoryName === 'Transport') {
        icon = Car;
        color = '#22D3EE';
      } else if (categoryName === 'Shopping') {
        icon = ShoppingBag;
        color = '#A855F7';
      } else if (categoryName === 'Food') {
        icon = Utensils;
        color = '#86EFAC';
      } else if (categoryName === 'Entertainment') {
        icon = Tv;
        color = '#FF6B6B';
      }

      // Format date
      const date = new Date(expense.date);
      const formattedDate = `${date.toLocaleString('default', {
        month: 'short',
      })} ${date.getDate()}, ${date.getFullYear()}`;

      return {
        id: expense.id || index.toString(),
        title: expense.description || 'Transaction',
        date: formattedDate,
        amount: `$${expense.amount?.toLocaleString() || '0'}`,
        color,
        icon,
      };
    });
  };

  const transactionsData = getAllTransactions();

  return (
    <AppMainContainer hideTop hideBottom>
      <LinearGradient colors={['#141326', '#24224A']} style={{flex: 1}}>
        <StatusBar barStyle={'light-content'} translucent={false} />
        <SafeAreaView style={{flex: 1}}>
          <View style={styles.header}>
            <View>
              <Text style={styles.welcomeText}>Welcome Back</Text>
              <Text style={styles.userName}>{userName}</Text>
            </View>
            <Pressable
              style={styles.notificationIcon}
              onPress={() => {
                _showToast('Coming Soon', 'info');
              }}>
              <Bell size={24} color="#fff" />
            </Pressable>
          </View>
          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}>
            {/* Header */}

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Monthly Summary</Text>
              <View style={styles.summaryCards}>
                <View style={styles.summaryCard}>
                  <CircleDollarSign size={24} color="#F4C66A" />
                  <Text style={styles.summaryLabel}>Budget Remaining</Text>
                  <Text
                    style={styles.summaryValue}
                    numberOfLines={1}
                    adjustsFontSizeToFit>
                    {totals.formattedRemaining}
                  </Text>
                </View>
                <View style={styles.summaryCard}>
                  <TrendingUp size={24} color="#FF6B6B" />
                  <Text style={styles.summaryLabel}>Total Spent</Text>
                  <Text
                    style={styles.summaryValue}
                    numberOfLines={1}
                    adjustsFontSizeToFit>
                    {totals.formattedSpent}
                  </Text>
                </View>
                <View style={styles.summaryCard}>
                  <PiggyBank size={24} color="#4ECDC4" />
                  <Text style={styles.summaryLabel}>Total Savings</Text>
                  <Text
                    style={styles.summaryValue}
                    numberOfLines={1}
                    adjustsFontSizeToFit>
                    {totals.formattedSavings}
                  </Text>
                </View>
              </View>
            </View>

            {/* Budget Tracking */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Budget Tracking</Text>
                {/* <Pressable onPress={() => navigation.navigate('Report')}>
                  <Text style={styles.seeAllText}>See all</Text>
                </Pressable> */}
              </View>

              {budgetCategoriesData.map(category => {
                const IconComponent = category.icon;
                return (
                  <View key={category.id} style={styles.budgetCard}>
                    <View style={styles.budgetHeader}>
                      <View style={styles.budgetTitleContainer}>
                        <IconComponent size={20} color={category.color} />
                        <Text style={styles.budgetTitle}>{category.title}</Text>
                      </View>
                      <Text
                        style={[
                          styles.budgetPercentage,
                          {color: category.color},
                        ]}>
                        {category.percentage}%
                      </Text>
                    </View>
                    <View style={styles.progressBarContainer}>
                      <View style={styles.progressBarBackground}>
                        <View
                          style={[
                            styles.progressBarFill,
                            {
                              width: `${category.percentage}%`,
                              backgroundColor: category.color,
                            },
                          ]}
                        />
                      </View>
                    </View>
                    <Text style={styles.budgetAmount}>
                      Spent ${category.spent.toLocaleString()} | $
                      {category.total.toLocaleString()}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Recent Expenses */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Expenses</Text>
                {/* <Pressable onPress={() => navigation.navigate('Expenses')}>
                  <Text style={styles.seeAllText}>See all</Text>
                </Pressable> */}
              </View>

              {recentExpensesData.map(expense => {
                const IconComponent = expense.icon;
                const isHome = expense.icon === Home;
                return (
                  <View key={expense.id} style={styles.expenseCard}>
                    <View
                      style={[
                        styles.expenseIcon,
                        {
                          backgroundColor: isHome ? '#F9731620' : '#4ECDC420',
                        },
                      ]}>
                      <IconComponent
                        size={24}
                        color={isHome ? '#F97316' : '#4ECDC4'}
                      />
                    </View>
                    <View style={styles.expenseInfo}>
                      <Text style={styles.expenseTitle}>{expense.title}</Text>
                      <Text style={styles.expenseDescription}>
                        {expense.description}
                      </Text>
                    </View>
                    <View style={styles.expenseRight}>
                      <Text style={styles.expenseDate}>{expense.date}</Text>
                      <Text style={styles.expenseAmount}>{expense.amount}</Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Your Transactions */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>My Transactions</Text>
              {transactionsData.map(transaction => {
                const IconComponent = transaction.icon;
                return (
                  <View key={transaction.id} style={styles.transactionCard}>
                    <View
                      style={[
                        styles.transactionIcon,
                        {backgroundColor: transaction.color},
                      ]}>
                      <IconComponent size={20} color="#fff" />
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionTitle}>
                        {transaction.title}
                      </Text>
                      <Text style={styles.transactionDate}>
                        {transaction.date}
                      </Text>
                    </View>
                    <Text style={styles.transactionAmount}>
                      {transaction.amount}
                    </Text>
                  </View>
                );
              })}
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
    paddingHorizontal: 16,
  },
  welcomeText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 4,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    color: '#F4C66A',
    fontSize: 14,
  },
  summaryCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#1F1D3A',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    minWidth: 0,
  },
  summaryLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'center',
  },
  summaryValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  budgetCard: {
    backgroundColor: '#1F1D3A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  budgetTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  budgetTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  budgetPercentage: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressBarContainer: {
    marginBottom: 8,
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
  budgetAmount: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  expenseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F1D3A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  expenseIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  expenseDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  expenseRight: {
    alignItems: 'flex-end',
  },
  expenseDate: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginBottom: 4,
  },
  expenseAmount: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F1D3A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionDate: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  transactionAmount: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
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
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#F4C66A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});

// Static data for fallback (when Redux is empty)
const transactions = [
  {
    id: '1',
    title: 'Shell',
    date: 'Sep 02, 2022',
    amount: '$750',
    color: '#F97316',
    icon: Fuel,
  },
  {
    id: '2',
    title: 'Supermart',
    date: 'Sep 01, 2022',
    amount: '$235',
    color: '#22D3EE',
    icon: ShoppingCart,
  },
  {
    id: '4',
    title: 'AMAZON',
    date: 'Aug 31, 2022',
    amount: '$600',
    color: '#A855F7',
    icon: ShoppingBag,
  },
];

// Default budget categories (used when no expenses in Redux)
const budgetCategories = [
  {
    id: '1',
    title: 'Food',
    percentage: 75,
    spent: 3800,
    total: 8000,
    color: '#FF6B6B',
    icon: Utensils,
  },
  {
    id: '2',
    title: 'Transport',
    percentage: 25,
    spent: 3800,
    total: 8000,
    color: '#4ECDC4',
    icon: Car,
  },
  {
    id: '3',
    title: 'Shopping',
    percentage: 92,
    spent: 3800,
    total: 8000,
    color: '#FFD166',
    icon: ShoppingBag,
  },
];

// Default recent expenses (used when no expenses in Redux)
const recentExpenses = [
  {
    id: '1',
    title: 'House Rent',
    description: 'Home',
    date: '02 Oct 25',
    amount: '$6000',
    icon: Home,
  },
  {
    id: '2',
    title: 'Groceries',
    description: 'Food',
    date: '01 Oct 25',
    amount: '$1050',
    icon: ShoppingCart,
  },
  {
    id: '3',
    title: 'Netflix',
    description: 'Entertainment',
    date: '30 Sep 25',
    amount: '$500',
    icon: Tv,
  },
];
