import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ChevronLeft} from 'lucide-react-native';
import AppMainContainer from '../../components/AppMainContainer';
import {AppFonts, FontSize} from '../../assets/fonts';

export default function AllTransactionsScreen({navigation, route}: any) {
  const {transactions, totals} = route.params || {};
  const allTransactions = transactions || [];

  console.log('All Transactions:->', allTransactions);

  const formatDate = (dateString: string) => {
    // Check if it's already in the desired format (like "Jan 20, 2026")
    if (dateString && typeof dateString === 'string') {
      // If it contains a comma and looks like a formatted date, return as-is
      if (dateString.includes(',') && dateString.split(' ').length === 3) {
        return dateString;
      }

      // Otherwise try to format it
      try {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });
        }
      } catch (error) {
        // Do nothing
      }
    }

    // Return original if all else fails
    return dateString;
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
            <Text style={styles.headerTitle}>All Transactions</Text>
            <View style={styles.headerButtonPlaceholder} />
          </View>

          {/* Summary */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Transactions</Text>
              <Text style={styles.summaryValue}>{allTransactions.length}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Spent</Text>
              <Text style={styles.summaryValue}>
                {totals?.formattedSpent || '$0'}
              </Text>
            </View>
          </View>

          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}>
            {allTransactions.length > 0 ? (
              allTransactions.map((transaction: any) => {
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
                      <Text
                        style={styles.transactionTitle}
                        numberOfLines={1}
                        ellipsizeMode="tail">
                        {transaction.fullTitle || transaction.title}
                      </Text>
                      <Text style={styles.transactionCategory}>
                        {transaction.categoryName || transaction.description}
                      </Text>
                      <Text style={styles.transactionDate}>
                        {transaction.date || formatDate(transaction.date)}
                      </Text>
                    </View>
                    <Text style={styles.transactionAmount}>
                      {transaction.amount}
                    </Text>
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateTitle}>No Transactions</Text>
                <Text style={styles.emptyStateText}>
                  You haven't made any transactions yet
                </Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </AppMainContainer>
  );
}

const styles = StyleSheet.create({
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
    fontSize: FontSize._24,
    fontFamily: AppFonts.BOLD,
  },
  headerButtonPlaceholder: {
    width: 40,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1F1D3A',
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: FontSize._14,
    fontFamily: AppFonts.REGULAR,
    marginBottom: 4,
  },
  summaryValue: {
    color: '#fff',
    fontSize: FontSize._24,
    fontFamily: AppFonts.BOLD,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
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
  transactionTitle: {
    color: '#fff',
    fontSize: FontSize._16,
    fontFamily: AppFonts.BOLD,
    marginBottom: 4,
  },
  transactionCategory: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: FontSize._14,
    fontFamily: AppFonts.REGULAR,
    marginBottom: 2,
  },
  transactionDate: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: FontSize._12,
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
    paddingVertical: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    marginTop: 20,
  },
  emptyStateTitle: {
    color: '#fff',
    fontSize: FontSize._24,
    fontFamily: AppFonts.BOLD,
    marginBottom: 8,
  },
  emptyStateText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: FontSize._16,
    fontFamily: AppFonts.REGULAR,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
