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
} from 'lucide-react-native';

// Static data for transactions
const transactions = [
  {
    id: '1',
    title: 'Shell',
    date: 'Sep 02, 2022',
    amount: '750',
    color: '#F97316',
    icon: Fuel,
  },
  {
    id: '2',
    title: 'Supermart',
    date: 'Sep 01, 2022',
    amount: '235',
    color: '#22D3EE',
    icon: ShoppingCart,
  },
  {
    id: '4',
    title: 'AMAZON',
    date: 'Aug 31, 2022',
    amount: '600',
    color: '#A855F7',
    icon: ShoppingBag,
  },
];

// Budget categories data
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

// Recent expenses data
const recentExpenses = [
  {
    id: '1',
    title: 'House Rent',
    description: 'Description here',
    date: '02 Oct 25',
    amount: '6000',
    icon: Home,
  },
  {
    id: '2',
    title: 'Groceries',
    description: 'Weekly grocery shopping',
    date: '01 Oct 25',
    amount: '1050',
    icon: ShoppingCart,
  },
  {
    id: '3',
    title: 'Netflix',
    description: 'Monthly subscription',
    date: '30 Sep 25',
    amount: '500',
    icon: Tv,
  },
];

export default function HomeScreen({navigation}: any) {
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
              <View>
                <Text style={styles.welcomeText}>Welcome Back</Text>
                <Text style={styles.userName}>Jhon Alex</Text>
              </View>
              <Pressable style={styles.notificationIcon}>
                <Bell size={24} color="#fff" />
              </Pressable>
            </View>

            {/* Monthly Summary */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Monthly Summary</Text>
              <View style={styles.summaryCards}>
                <View style={styles.summaryCard}>
                  <CircleDollarSign size={24} color="#F4C66A" />
                  <Text style={styles.summaryLabel}>Budget Remaining</Text>
                  <Text style={styles.summaryValue}>$10,000</Text>
                </View>
                <View style={styles.summaryCard}>
                  <TrendingUp size={24} color="#FF6B6B" />
                  <Text style={styles.summaryLabel}>Total Spent</Text>
                  <Text style={styles.summaryValue}>$15,000</Text>
                </View>
                <View style={styles.summaryCard}>
                  <PiggyBank size={24} color="#4ECDC4" />
                  <Text style={styles.summaryLabel}>Total Savings</Text>
                  <Text style={styles.summaryValue}>$5,000</Text>
                </View>
              </View>
            </View>

            {/* Budget Tracking */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Budget Tracking</Text>
                <Pressable>
                  <Text style={styles.seeAllText}>See all</Text>
                </Pressable>
              </View>

              {budgetCategories.map(category => {
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
                <Pressable>
                  <Text style={styles.seeAllText}>See all</Text>
                </Pressable>
              </View>

              {recentExpenses.map(expense => {
                const IconComponent = expense.icon;
                return (
                  <View key={expense.id} style={styles.expenseCard}>
                    <View
                      style={[
                        styles.expenseIcon,
                        {
                          backgroundColor: `${
                            expense.icon === Home ? '#F97316' : '#4ECDC4'
                          }20`,
                        },
                      ]}>
                      <IconComponent
                        size={24}
                        color={expense.icon === Home ? '#F97316' : '#4ECDC4'}
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

            {/* Your Transactions (Original Data) */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>My transactions</Text>
              {transactions.map(transaction => {
                const IconComponent = transaction.icon;
                return (
                  <View key={transaction.id} style={styles.transactionCard}>
                    <View
                      style={[
                        styles.transactionIcon,
                        {backgroundColor: transaction.color},
                      ]}>
                      <IconComponent size={20} color="#000" />
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
});
