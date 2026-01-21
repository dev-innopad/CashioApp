import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
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
  ChevronRight,
} from 'lucide-react-native';
import {NavigationKeys} from '../../constants/navigationKeys';
import {AppFonts, FontSize} from '../../assets/fonts';

// Icon mapping function to ensure consistency
// const getCategoryIcon = (categoryName: string) => {
//   if (!categoryName) return ShoppingCart;

//   const lowerName = categoryName.toLowerCase();

//   if (
//     lowerName.includes('food') ||
//     lowerName.includes('grocer') ||
//     lowerName.includes('restaurant')
//   )
//     return Utensils;
//   if (
//     lowerName.includes('transport') ||
//     lowerName.includes('car') ||
//     lowerName.includes('gas')
//   )
//     return Car;
//   if (lowerName.includes('shop') || lowerName.includes('retail'))
//     return ShoppingBag;
//   if (
//     lowerName.includes('home') ||
//     lowerName.includes('rent') ||
//     lowerName.includes('mortgage')
//   )
//     return Home;
//   if (
//     lowerName.includes('entertain') ||
//     lowerName.includes('movie') ||
//     lowerName.includes('netflix')
//   )
//     return Tv;
//   if (lowerName.includes('health') || lowerName.includes('medical'))
//     return Heart;
//   if (lowerName.includes('education') || lowerName.includes('school'))
//     return GraduationCap;
//   if (lowerName.includes('coffee') || lowerName.includes('cafe')) return Coffee;
//   if (
//     lowerName.includes('travel') ||
//     lowerName.includes('flight') ||
//     lowerName.includes('hotel')
//   )
//     return Plane;
//   if (lowerName.includes('fuel') || lowerName.includes('gasoline')) return Fuel;
//   if (lowerName.includes('gym') || lowerName.includes('fitness'))
//     return Dumbbell;
//   if (lowerName.includes('gift') || lowerName.includes('donation')) return Gift;
//   if (lowerName.includes('internet') || lowerName.includes('wifi')) return Wifi;
//   if (lowerName.includes('phone') || lowerName.includes('mobile')) return Phone;
//   if (lowerName.includes('music') || lowerName.includes('spotify'))
//     return Music;
//   if (lowerName.includes('game') || lowerName.includes('gaming'))
//     return Gamepad2;
//   if (lowerName.includes('subscription') || lowerName.includes('cloud'))
//     return Cloud;
//   if (lowerName.includes('delivery') || lowerName.includes('package'))
//     return Package;
//   if (
//     lowerName.includes('bill') ||
//     lowerName.includes('payment') ||
//     lowerName.includes('credit')
//   )
//     return CreditCard;
//   if (lowerName.includes('savings') || lowerName.includes('investment'))
//     return PiggyBank;
//   if (lowerName.includes('book') || lowerName.includes('learning')) return Book;
//   if (lowerName.includes('bus') || lowerName.includes('train')) return Bus;
//   if (lowerName.includes('electricity') || lowerName.includes('power'))
//     return Zap;

//   return ShoppingCart; // default
// };

export default function HomeScreen({navigation}: any) {
  // Get all data from Redux
  const expenses = useSelector((state: any) => state.userData.expenses || []);
  console.log('expenses from redux', expenses);

  const currentUser = useSelector((state: any) => state.userData.currentUser);
  const categories = useSelector(
    (state: any) => state.userData.categories || [],
  );

  const userName = currentUser?.name || 'User';
  const monthlyBudget = currentUser?.monthlyBudget || 30000;

  // Update the getCategoryIcon function to use the actual category icon from Redux
  const getCategoryIcon = (categoryName: string, categories: any[]) => {
    if (!categoryName) return ShoppingCart;

    // First, try to find the category in Redux to get its actual icon
    const category = categories.find(
      (cat: any) => cat.name.toLowerCase() === categoryName.toLowerCase(),
    );

    // If category found in Redux and has an icon, use it
    if (category?.icon) {
      // For emoji icons, we need to return a component that renders the emoji
      // We'll create a custom component for this
      const EmojiIcon = ({size, color}: {size: number; color: string}) => (
        <Text style={{fontSize: size, color}}>{category.icon}</Text>
      );
      return EmojiIcon;
    }

    // Fallback to the existing icon mapping logic
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
      return Tv;
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
      return Fuel;
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
    if (
      lowerName.includes('bill') ||
      lowerName.includes('payment') ||
      lowerName.includes('credit')
    )
      return CreditCard;
    if (lowerName.includes('savings') || lowerName.includes('investment'))
      return PiggyBank;
    if (lowerName.includes('book') || lowerName.includes('learning'))
      return Book;
    if (lowerName.includes('bus') || lowerName.includes('train')) return Bus;
    if (lowerName.includes('electricity') || lowerName.includes('power'))
      return Zap;

    return ShoppingCart; // default
  };

  // Update the getAllTransactions function
  // Get all transactions (newest first, limited to 5)
  const getAllTransactions = () => {
    if (!expenses || expenses.length === 0) {
      return [];
    }

    // Sort by date (newest first) and take only 5 items
    const sortedExpenses = [...expenses]
      .sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime(),
      )
      .slice(0, 5); // Only show 5 most recent transactions

    return sortedExpenses.map((expense: any, index: number) => {
      // Get category name
      let categoryName = '';
      let categoryIcon = '';
      let categoryColor = '#F97316';

      if (typeof expense.category === 'string') {
        categoryName = expense.category;
        // Find category in Redux
        const categoryDetails = categories.find(
          (cat: any) => cat.name === categoryName,
        );
        if (categoryDetails) {
          categoryIcon = categoryDetails.icon;
          categoryColor = categoryDetails.color || '#F97316';
        }
      } else if (expense.category && expense.category.name) {
        categoryName = expense.category.name;
        categoryIcon = expense.category.icon;
        categoryColor = expense.category.color || '#F97316';
      }

      // Use the updated getCategoryIcon function
      const icon = getCategoryIcon(categoryName, categories);

      // Format date for better readability
      const date: any = new Date(expense.date);
      const formattedDate = `${date.toLocaleString('default', {
        month: 'short',
      })} ${date.getDate()}, ${date.getFullYear()}`;

      // Truncate description if too long
      const title = expense.description || 'Transaction';
      const truncatedTitle =
        title.length > 30 ? title.substring(0, 30) + '...' : title;

      return {
        id: expense.id || `expense-${index}`,
        title: truncatedTitle,
        fullTitle: title,
        description: categoryName || 'Category',
        date: formattedDate,
        amount: `$${(expense.amount || 0).toLocaleString()}`,
        color: categoryColor,
        icon,
        categoryName,
        categoryIcon,
      };
    });
  };

  // Get recent expenses (last 3 added - newest first by ID)
  const getRecentExpenses = () => {
    if (!expenses || expenses.length === 0) {
      return [];
    }

    // Sort by ID in descending order (newest added first)
    // Assuming ID is a timestamp string like "1705837200000"
    const sortedExpenses = [...expenses]
      .sort((a: any, b: any) => {
        // Parse IDs as numbers for comparison
        const idA = parseInt(a.id) || 0;
        const idB = parseInt(b.id) || 0;
        return idB - idA; // Descending (newest first)
      })
      .slice(0, 3); // Only show 3 most recently added expenses

    return sortedExpenses.map((expense: any, index: number) => {
      // Get category name
      let categoryName = '';
      let categoryIcon = '';
      let categoryColor = '#F97316';

      if (typeof expense.category === 'string') {
        categoryName = expense.category;
        // Find category in Redux
        const categoryDetails = categories.find(
          (cat: any) => cat.name === categoryName,
        );
        if (categoryDetails) {
          categoryIcon = categoryDetails.icon;
          categoryColor = categoryDetails.color || '#F97316';
        }
      } else if (expense.category && expense.category.name) {
        categoryName = expense.category.name;
        categoryIcon = expense.category.icon;
        categoryColor = expense.category.color || '#F97316';
      }

      // Use the updated getCategoryIcon function
      const icon = getCategoryIcon(categoryName, categories);

      // Format date (but don't use for sorting)
      const date = new Date(expense.date);
      const formattedDate = `${date.getDate()} ${date.toLocaleString(
        'default',
        {month: 'short'},
      )} ${date.getFullYear().toString().slice(-2)}`;

      // Truncate description if too long
      const title = expense.description || 'Expense';
      const truncatedTitle =
        title.length > 25 ? title.substring(0, 25) + '...' : title;

      return {
        id: expense.id || `recent-${index}`,
        title: truncatedTitle,
        fullTitle: title,
        description: categoryName || 'Category',
        date: formattedDate,
        amount: `$${(expense.amount || 0).toLocaleString()}`,
        color: categoryColor,
        icon,
        categoryName,
        categoryIcon,
      };
    });
  };

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

  // Get all transactions with consistent icons
  // const getAllTransactions = () => {
  //   if (!expenses || expenses.length === 0) {
  //     return [];
  //   }

  //   return expenses.slice(0, 10).map((expense: any, index: number) => {
  //     // Get category name
  //     let categoryName = '';
  //     if (typeof expense.category === 'string') {
  //       categoryName = expense.category;
  //     } else if (expense.category && expense.category.name) {
  //       categoryName = expense.category.name;
  //     }

  //     // Get category details for color
  //     let color = '#F97316';
  //     const categoryDetails = categories.find(
  //       (cat: any) => cat.name === categoryName,
  //     );
  //     if (categoryDetails) {
  //       color = categoryDetails.color || '#F97316';
  //     }

  //     // Use consistent icon mapping
  //     const icon = getCategoryIcon(categoryName);

  //     // Format date
  //     const date: any = new Date(expense.date);
  //     const formattedDate = `${date.toLocaleString('default', {
  //       month: 'short',
  //     })} ${date.getDate()}, ${date.getFullYear()}`;

  //     // Truncate description if too long
  //     const title = expense.description || 'Transaction';
  //     const truncatedTitle =
  //       title.length > 30 ? title.substring(0, 30) + '...' : title;

  //     return {
  //       id: expense.id || `expense-${index}`,
  //       title: truncatedTitle,
  //       fullTitle: title,
  //       description: categoryName || 'Category',
  //       date: formattedDate,
  //       amount: `$${(expense.amount || 0).toLocaleString()}`,
  //       color,
  //       icon,
  //       categoryName,
  //     };
  //   });
  // };

  const allTransactionsData = getAllTransactions();

  // Get recent expenses (last 3 expenses)
  // const getRecentExpenses = () => {
  //   if (!expenses || expenses.length === 0) {
  //     return [];
  //   }

  //   // Sort by date (newest first) and take first 3
  //   const sortedExpenses = [...expenses]
  //     .sort(
  //       (a: any, b: any) =>
  //         new Date(b.date).getTime() - new Date(a.date).getTime(),
  //     )
  //     .slice(0, 3);

  //   return sortedExpenses.map((expense: any, index: number) => {
  //     // Get category name
  //     let categoryName = '';
  //     if (typeof expense.category === 'string') {
  //       categoryName = expense.category;
  //     } else if (expense.category && expense.category.name) {
  //       categoryName = expense.category.name;
  //     }

  //     // Get category details for color
  //     let color = '#F97316';
  //     const categoryDetails = categories.find(
  //       (cat: any) => cat.name === categoryName,
  //     );
  //     if (categoryDetails) {
  //       color = categoryDetails.color || '#F97316';
  //     }

  //     // Use consistent icon mapping
  //     const icon = getCategoryIcon(categoryName);

  //     // Format date
  //     const date = new Date(expense.date);
  //     const formattedDate = `${date.getDate()} ${date.toLocaleString(
  //       'default',
  //       {month: 'short'},
  //     )} ${date.getFullYear().toString().slice(-2)}`;

  //     // Truncate description if too long
  //     const title = expense.description || 'Expense';
  //     const truncatedTitle =
  //       title.length > 25 ? title.substring(0, 25) + '...' : title;

  //     return {
  //       id: expense.id || `recent-${index}`,
  //       title: truncatedTitle,
  //       fullTitle: title,
  //       description: categoryName || 'Category',
  //       date: formattedDate,
  //       amount: `$${(expense.amount || 0).toLocaleString()}`,
  //       color,
  //       icon,
  //       categoryName,
  //     };
  //   });
  // };

  const recentExpensesData = getRecentExpenses();

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

  // Navigation to All Transactions screen
  const handleViewAllTransactions = () => {
    navigation.navigate('AllTransactionsScreen', {
      transactions: allTransactionsData,
      totals: totals,
    });
  };

  return (
    <AppMainContainer hideTop hideBottom>
      <LinearGradient colors={['#141326', '#24224A']} style={{flex: 1}}>
        <StatusBar barStyle={'light-content'} translucent={false} />
        <SafeAreaView style={{flex: 1}}>
          <View style={styles.header}>
            <View>
              <Text style={styles.welcomeText}>Welcome Back</Text>
              <Text
                style={styles.userName}
                numberOfLines={1}
                ellipsizeMode="tail">
                {userName}
              </Text>
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
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
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

            {/* Recent Expenses */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Expenses</Text>
              </View>

              <FlatList
                data={recentExpensesData} // Already sorted newest first
                keyExtractor={item => item.id.toString()}
                scrollEnabled={false} // Since it's only 3 items, disable scrolling
                renderItem={({item}) => {
                  const IconComponent = item.icon;
                  const isEmojiIcon =
                    item.categoryIcon && item.categoryIcon.length === 2;

                  return (
                    <View style={styles.expenseCard}>
                      <View
                        style={[
                          styles.expenseIcon,
                          {backgroundColor: `${item.color}20`},
                        ]}>
                        {isEmojiIcon ? (
                          <Text style={[styles.emojiIcon, {color: item.color}]}>
                            {item.categoryIcon}
                          </Text>
                        ) : (
                          <IconComponent size={24} color={item.color} />
                        )}
                      </View>

                      <View style={styles.expenseInfo}>
                        <Text
                          style={styles.expenseTitle}
                          numberOfLines={1}
                          ellipsizeMode="tail">
                          {item.title}
                        </Text>
                        <Text style={styles.expenseDescription}>
                          {item.description}
                        </Text>
                      </View>

                      <View style={styles.expenseRight}>
                        <Text style={styles.expenseDate}>{item.date}</Text>
                        <Text style={styles.expenseAmount}>{item.amount}</Text>
                      </View>
                    </View>
                  );
                }}
                ListEmptyComponent={() =>
                  renderEmptyState(
                    'No Recent Expenses',
                    'Your recent expenses will appear here',
                    true,
                  )
                }
              />
            </View>

            {/* All Transactions */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>My Transactions</Text>
                <TouchableOpacity
                  style={styles.seeAllButton}
                  onPress={handleViewAllTransactions}>
                  <Text style={styles.seeAllText}>See All</Text>
                  <ChevronRight size={16} color="#F4C66A" />
                </TouchableOpacity>
              </View>

              <FlatList
                data={allTransactionsData} // Already sorted newest first
                keyExtractor={item => item.id.toString()}
                scrollEnabled={false} // Since it's only 5 items, disable scrolling
                renderItem={({item}) => {
                  const IconComponent = item.icon;
                  const isEmojiIcon =
                    item.categoryIcon && item.categoryIcon.length === 2;

                  return (
                    <View style={styles.transactionCard}>
                      <View
                        style={[
                          styles.transactionIcon,
                          {backgroundColor: item.color},
                        ]}>
                        {isEmojiIcon ? (
                          <Text style={styles.emojiIconWhite}>
                            {item.categoryIcon}
                          </Text>
                        ) : (
                          <IconComponent size={20} color="#fff" />
                        )}
                      </View>

                      <View style={styles.transactionInfo}>
                        <Text
                          style={styles.transactionTitle}
                          numberOfLines={1}
                          ellipsizeMode="tail">
                          {item.title}
                        </Text>
                        <Text style={styles.transactionDate}>{item.date}</Text>
                      </View>

                      <Text style={styles.transactionAmount}>
                        {item.amount}
                      </Text>
                    </View>
                  );
                }}
                ListEmptyComponent={() =>
                  renderEmptyState(
                    'No Transactions',
                    'Your transactions will appear here',
                    true,
                  )
                }
              />
            </View>

            {/* Savings Progress */}
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
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
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
    fontSize: FontSize._16,
    fontFamily: AppFonts.REGULAR,
  },
  userName: {
    color: '#fff',
    fontSize: FontSize._28,
    fontFamily: AppFonts.BOLD,
    marginTop: 4,
    maxWidth: 250, // Prevent overflow
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
    fontSize: FontSize._22,
    fontFamily: AppFonts.BOLD,
    // marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    color: '#F4C66A',
    fontSize: FontSize._16,
    fontFamily: AppFonts.REGULAR,
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
    fontSize: FontSize._14,
    fontFamily: AppFonts.REGULAR,
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'center',
  },
  summaryValue: {
    color: '#fff',
    fontSize: FontSize._28,
    fontFamily: AppFonts.BOLD,
    textAlign: 'center',
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
    marginRight: 12,
    minWidth: 0, // Important for text truncation
  },
  expenseTitle: {
    color: '#fff',
    fontSize: FontSize._16,
    fontFamily: AppFonts.BOLD,
    marginBottom: 4,
  },
  expenseDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: FontSize._14,
    fontFamily: AppFonts.REGULAR,
  },
  expenseRight: {
    alignItems: 'flex-end',
    minWidth: 80, // Ensure amount doesn't get squeezed
  },
  expenseDate: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: FontSize._12,
    fontFamily: AppFonts.REGULAR,
    marginBottom: 4,
  },
  expenseAmount: {
    color: '#FF6B6B',
    fontSize: FontSize._16,
    fontFamily: AppFonts.BOLD,
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
    marginRight: 12,
    minWidth: 0,
  },
  emojiIcon: {
    fontSize: FontSize._22,
    textAlign: 'center',
  },
  emojiIconWhite: {
    fontSize: FontSize._20,
    textAlign: 'center',
    color: '#fff',
  },
  transactionTitle: {
    color: '#fff',
    fontSize: FontSize._16,
    fontFamily: AppFonts.BOLD,
    marginBottom: 4,
  },
  transactionDate: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: FontSize._14,
    fontFamily: AppFonts.REGULAR,
  },
  transactionAmount: {
    color: '#FF6B6B',
    fontSize: FontSize._16,
    fontFamily: AppFonts.BOLD,
    minWidth: 70,
    textAlign: 'right',
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
    fontSize: FontSize._28,
    fontFamily: AppFonts.BOLD,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: FontSize._14,
    fontFamily: AppFonts.REGULAR,
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
    fontSize: FontSize._16,
    fontFamily: AppFonts.MEDIUM,
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
    fontSize: FontSize._16,
    fontFamily: AppFonts.MEDIUM,
  },
  savingsAmount: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: FontSize._14,
    fontFamily: AppFonts.REGULAR,
    marginTop: 8,
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
});
