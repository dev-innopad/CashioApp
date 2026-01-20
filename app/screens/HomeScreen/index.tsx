import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AppMainContainer from '../../components/AppMainContainer';
import {useSelector} from 'react-redux';
import {_showToast} from '../../services/UIs/ToastConfig';

// Import Lucide icons
import {
  Bell,
  Home,
  ShoppingCart,
  Car,
  ShoppingBag,
  Utensils,
  Tv,
  CircleDollarSign,
  TrendingUp,
  PiggyBank,
  Fuel,
  CreditCard,
  DollarSign,
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
import {NavigationKeys} from '../../constants/navigationKeys';

export default function HomeScreen({navigation}: any) {
  // Get all data from Redux
  const expenses = useSelector((state: any) => state.userData.expenses || []);
  const currentUser = useSelector((state: any) => state.userData.currentUser);
  const categories = useSelector(
    (state: any) => state.userData.categories || [],
  );
  // const userName = useSelector(
  //   (state: any) => state.userData.userName || 'User',
  // );

  const userName = currentUser?.name || 'User';
  // const monthlyBudget = useSelector(
  //   (state: any) => state.userData.monthlyBudget || 30000,
  // );

  const monthlyBudget = currentUser?.monthlyBudget || 30000;

  console.log('Data from redux:', {
    expensesCount: expenses.length,
    categoriesCount: categories.length,
    monthlyBudget,
  });

  // Calculate dynamic totals
  const calculateTotals = () => {
    const totalSpent = expenses.reduce(
      (sum: number, expense: any) => sum + (expense.amount || 0),
      0,
    );

    const totalBudget = monthlyBudget || 0;
    const totalRemaining = Math.max(0, totalBudget - totalSpent);
    const savingsGoal = totalBudget * 0.3; // 30% savings goal
    const totalSavings = Math.max(0, savingsGoal - totalSpent);

    // Format numbers
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

  // Get category totals dynamically
  const getCategoryTotals = () => {
    if (
      !expenses ||
      expenses.length === 0 ||
      !categories ||
      categories.length === 0
    ) {
      return [];
    }

    // Create a map of category budgets
    const categoryBudgetMap: {[key: string]: number} = {};
    categories.forEach((cat: any) => {
      categoryBudgetMap[cat.name] = cat.budget || 0;
    });

    // Initialize category totals
    const categoryTotals: {
      [key: string]: {spent: number; budget: number; color: string; icon: any};
    } = {};

    // Set defaults from categories
    categories.forEach((cat: any) => {
      // Map category name to icon
      let icon = ShoppingCart; // default
      if (cat.name?.toLowerCase().includes('food')) icon = Utensils;
      else if (cat.name?.toLowerCase().includes('transport')) icon = Car;
      else if (cat.name?.toLowerCase().includes('shopping')) icon = ShoppingBag;
      else if (cat.name?.toLowerCase().includes('home')) icon = Home;
      else if (cat.name?.toLowerCase().includes('entertainment')) icon = Tv;
      else if (cat.name?.toLowerCase().includes('health')) icon = Heart;
      else if (cat.name?.toLowerCase().includes('education'))
        icon = GraduationCap;
      else if (cat.name?.toLowerCase().includes('bills')) icon = CreditCard;
      else if (cat.name?.toLowerCase().includes('travel')) icon = Plane;
      else if (cat.name?.toLowerCase().includes('fuel')) icon = Fuel;
      else if (cat.name?.toLowerCase().includes('coffee')) icon = Coffee;
      else if (cat.name?.toLowerCase().includes('movie')) icon = Film;
      else if (cat.name?.toLowerCase().includes('music')) icon = Music;
      else if (cat.name?.toLowerCase().includes('gym')) icon = Dumbbell;
      else if (cat.name?.toLowerCase().includes('gift')) icon = Gift;
      else if (cat.name?.toLowerCase().includes('internet')) icon = Wifi;
      else if (cat.name?.toLowerCase().includes('phone')) icon = Phone;
      else if (cat.name?.toLowerCase().includes('electricity')) icon = Zap;
      else if (cat.name?.toLowerCase().includes('subscription')) icon = Cloud;
      else if (cat.name?.toLowerCase().includes('delivery')) icon = Package;

      categoryTotals[cat.name] = {
        spent: 0,
        budget: cat.budget || 0,
        color: cat.color || '#F97316',
        icon: icon,
      };
    });

    // Calculate spent per category
    expenses.forEach((expense: any) => {
      let categoryName = '';

      if (typeof expense.category === 'string') {
        categoryName = expense.category;
      } else if (expense.category && expense.category.name) {
        categoryName = expense.category.name;
      }

      if (categoryName && categoryTotals[categoryName]) {
        categoryTotals[categoryName].spent += expense.amount || 0;
      }
    });

    // Convert to array format
    return Object.entries(categoryTotals)
      .map(([title, data], index) => ({
        id: (index + 1).toString(),
        title,
        percentage:
          data.budget > 0
            ? Math.min(Math.round((data.spent / data.budget) * 100), 100)
            : 0,
        spent: data.spent,
        total: data.budget,
        color: data.color,
        icon: data.icon,
      }))
      .filter(cat => cat.total > 0); // Only show categories with budget
  };

  const budgetCategoriesData = getCategoryTotals();

  // Get recent expenses (last 3 expenses)
  const getRecentExpenses = () => {
    if (!expenses || expenses.length === 0) {
      return [];
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

      // Get category details for icon and color
      let icon = ShoppingCart;
      let color = '#F97316';

      const categoryDetails = categories.find(
        (cat: any) => cat.name === categoryName,
      );
      if (categoryDetails) {
        color = categoryDetails.color || '#F97316';
        // Simple icon mapping based on category name
        if (categoryName?.toLowerCase().includes('food')) icon = Utensils;
        else if (categoryName?.toLowerCase().includes('transport')) icon = Car;
        else if (categoryName?.toLowerCase().includes('shopping'))
          icon = ShoppingBag;
        else if (categoryName?.toLowerCase().includes('home')) icon = Home;
        else if (categoryName?.toLowerCase().includes('entertainment'))
          icon = Tv;
        else if (categoryName?.toLowerCase().includes('fuel')) icon = Fuel;
        else if (categoryName?.toLowerCase().includes('coffee')) icon = Coffee;
        else if (categoryName?.toLowerCase().includes('movie')) icon = Film;
        else if (categoryName?.toLowerCase().includes('music')) icon = Music;
      }

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
        amount: `$${(expense.amount || 0).toLocaleString()}`,
        icon,
        color,
      };
    });
  };

  const recentExpensesData = getRecentExpenses();

  // Get all transactions (for the transactions section)
  const getAllTransactions = () => {
    if (!expenses || expenses.length === 0) {
      return [];
    }

    // Take first 5 expenses for transactions section
    const firstFiveExpenses = expenses.slice(0, 5);

    return firstFiveExpenses.map((expense: any, index: number) => {
      // Get category name
      let categoryName = '';
      if (typeof expense.category === 'string') {
        categoryName = expense.category;
      } else if (expense.category && expense.category.name) {
        categoryName = expense.category.name;
      }

      // Get category details for icon and color
      let icon = ShoppingCart;
      let color = '#F97316';

      const categoryDetails = categories.find(
        (cat: any) => cat.name === categoryName,
      );
      if (categoryDetails) {
        color = categoryDetails.color || '#F97316';
        if (categoryName?.toLowerCase().includes('food')) icon = Utensils;
        else if (categoryName?.toLowerCase().includes('transport')) icon = Car;
        else if (categoryName?.toLowerCase().includes('shopping'))
          icon = ShoppingBag;
        else if (categoryName?.toLowerCase().includes('home')) icon = Home;
        else if (categoryName?.toLowerCase().includes('entertainment'))
          icon = Tv;
        else if (categoryName?.toLowerCase().includes('fuel')) icon = Fuel;
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
        amount: `$${(expense.amount || 0).toLocaleString()}`,
        color,
        icon,
      };
    });
  };

  const transactionsData = getAllTransactions();

  // Calculate savings percentage
  const calculateSavingsPercentage = () => {
    if (totals.totalBudget === 0) return 0;
    const savingsGoal = totals.totalBudget * 0.3;
    if (savingsGoal === 0) return 0;
    const percentage = Math.min(
      Math.round((totals.totalSavings / savingsGoal) * 100),
      100,
    );
    return percentage;
  };

  const savingsPercentage = calculateSavingsPercentage();

  // Render empty states
  const renderEmptyState = (
    title: string,
    message: string,
    showButton: boolean = false,
  ) => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>{title}</Text>
      <Text style={styles.emptyStateText}>{message}</Text>
      {showButton && (
        <Pressable
          style={styles.addButton}
          onPress={() => navigation.navigate(NavigationKeys.AddExpenseScreen)}>
          <Text style={styles.addButtonText}>Add Your First Expense</Text>
        </Pressable>
      )}
    </View>
  );

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
            {/* Monthly Summary */}
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
              </View>
            </View>

            {/* Budget Tracking */}
            {/* <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Budget Tracking</Text>
              </View>

              {budgetCategoriesData.length > 0 ? (
                budgetCategoriesData.map(category => {
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
                })
              ) : (
                null
              )}
            </View> */}

            {/* Recent Expenses */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Expenses</Text>
              </View>

              {recentExpensesData.length > 0
                ? recentExpensesData.map(expense => {
                    const IconComponent = expense.icon;
                    return (
                      <View key={expense.id} style={styles.expenseCard}>
                        <View
                          style={[
                            styles.expenseIcon,
                            {backgroundColor: `${expense.color}20`},
                          ]}>
                          <IconComponent size={24} color={expense.color} />
                        </View>
                        <View style={styles.expenseInfo}>
                          <Text style={styles.expenseTitle}>
                            {expense.title}
                          </Text>
                          <Text style={styles.expenseDescription}>
                            {expense.description}
                          </Text>
                        </View>
                        <View style={styles.expenseRight}>
                          <Text style={styles.expenseDate}>{expense.date}</Text>
                          <Text style={styles.expenseAmount}>
                            {expense.amount}
                          </Text>
                        </View>
                      </View>
                    );
                  })
                : renderEmptyState(
                    'No Recent Expenses',
                    'Your recent expenses will appear here',
                    true,
                  )}
            </View>

            {/* Your Transactions */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>My Transactions</Text>
              {transactionsData.length > 0
                ? transactionsData.map(transaction => {
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
                  })
                : renderEmptyState(
                    'No Transactions',
                    'Your transactions will appear here',
                    true,
                  )}
            </View>

            {/* Savings Progress (Optional) */}
            {totals.totalBudget > 0 && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Savings Progress</Text>
                <View style={styles.savingsCard}>
                  <View style={styles.savingsHeader}>
                    <PiggyBank size={24} color="#4ECDC4" />
                    <Text style={styles.savingsTitle}>
                      Monthly Savings Goal
                    </Text>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarBackground}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${savingsPercentage}%`,
                            backgroundColor: '#4ECDC4',
                          },
                        ]}
                      />
                    </View>
                  </View>
                  <Text style={styles.savingsAmount}>
                    {savingsPercentage}% towards $
                    {(totals.totalBudget * 0.3).toLocaleString()} goal
                  </Text>
                </View>
              </View>
            )}
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
  savingsCard: {
    backgroundColor: '#1F1D3A',
    borderRadius: 16,
    padding: 16,
  },
  savingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  savingsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  savingsAmount: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 8,
  },
});
