import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ChevronLeft, MapPin, FileText, Eye, X} from 'lucide-react-native';
import {useSelector} from 'react-redux';
import AppMainContainer from '../../components/AppMainContainer';
import {AppFonts, FontSize} from '../../assets/fonts';
import {_showToast} from '../../services/UIs/ToastConfig';

export default function AllTransactionsScreen({navigation, route}: any) {
  // Get data directly from Redux store
  const expenses = useSelector((state: any) => state.userData.expenses || []);
  const currentUser = useSelector((state: any) => state.userData.currentUser);
  const categories = useSelector(
    (state: any) => state.userData.categories || [],
  );

  const monthlyBudget = currentUser?.monthlyBudget || 0;

  // State for viewing transaction details
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Calculate totals
  const calculateTotals = () => {
    const totalSpent = expenses.reduce(
      (sum: number, expense: any) => sum + (expense.amount || 0),
      0,
    );

    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: true,
    });

    return {
      totalSpent,
      formattedSpent: `$${formatter.format(totalSpent)}`,
      totalTransactions: expenses.length,
    };
  };

  const totals = calculateTotals();

  // Format date for display
  const formatDate = (dateString: string) => {
    if (dateString && typeof dateString === 'string') {
      // If it's already in the desired format
      if (dateString.includes(',') && dateString.split(' ').length === 3) {
        return dateString;
      }

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

    return dateString || 'Invalid Date';
  };

  // Get all transactions sorted by date (newest first)
  const getAllTransactions = () => {
    if (!expenses || expenses.length === 0) {
      return [];
    }

    // Sort by date (newest first)
    const sortedExpenses = [...expenses].sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return sortedExpenses.map((expense: any) => {
      // Get category details
      let categoryName = '';
      let categoryIcon = '';
      let categoryColor = '#F97316';

      if (expense.category) {
        if (typeof expense.category === 'object') {
          categoryName = expense.category.name || '';
          categoryIcon = expense.category.icon || '';
          categoryColor = expense.category.color || '#F97316';
        } else if (typeof expense.category === 'string') {
          categoryName = expense.category;
          // Find category in Redux
          const categoryDetails = categories.find(
            (cat: any) => cat.name === categoryName,
          );
          if (categoryDetails) {
            categoryIcon = categoryDetails.icon || '';
            categoryColor = categoryDetails.color || '#F97316';
          }
        }
      }

      // Format date
      const date: any = new Date(expense.date);
      const formattedDate = `${date.toLocaleString('default', {
        month: 'short',
      })} ${date.getDate()}, ${date.getFullYear()}`;

      // Truncate description if too long
      const title = expense.description || 'Transaction';
      const truncatedTitle =
        title.length > 30 ? title.substring(0, 30) + '...' : title;

      // Check if has optional fields
      const hasLocation = expense.location && expense.location.trim() !== '';
      const hasNotes = expense.notes && expense.notes.trim() !== '';
      const hasReceipt = expense.receipt;

      return {
        id: expense.id,
        title: truncatedTitle,
        fullTitle: title,
        description: categoryName || 'Category',
        date: formattedDate,
        amount: `$${(expense.amount || 0).toLocaleString()}`,
        color: categoryColor,
        categoryIcon: categoryIcon || '💰',
        categoryName,
        hasLocation,
        hasNotes,
        hasReceipt,
        location: expense.location,
        notes: expense.notes,
        receipt: expense.receipt,
        originalExpense: expense, // Keep reference to original data
      };
    });
  };

  const allTransactions = getAllTransactions();

  // Function to view transaction details
  const viewTransactionDetails = (transaction: any) => {
    setSelectedTransaction(transaction);
    setShowDetailsModal(true);
  };

  // Function to get the original expense by ID
  const getOriginalExpenseById = (transactionId: string) => {
    return expenses.find((exp: any) => exp.id === transactionId);
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
              <Text style={styles.summaryValue}>
                {totals.totalTransactions}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Spent</Text>
              <Text style={styles.summaryValue}>{totals.formattedSpent}</Text>
            </View>
          </View>

          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}>
            {allTransactions.length > 0 ? (
              allTransactions.map((transaction: any) => {
                const hasOptionalFields =
                  transaction.hasLocation ||
                  transaction.hasNotes ||
                  transaction.hasReceipt;

                return (
                  <TouchableOpacity
                    key={transaction.id}
                    style={styles.transactionCard}
                    onPress={() =>
                      viewTransactionDetails(transaction.originalExpense)
                    }
                    activeOpacity={0.7}>
                    <View
                      style={[
                        styles.transactionIcon,
                        {backgroundColor: transaction.color},
                      ]}>
                      <Text style={styles.emojiIcon}>
                        {transaction.categoryIcon}
                      </Text>
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
                        {formatDate(transaction.date)}
                      </Text>

                      {/* Show optional fields indicators */}
                      {hasOptionalFields && (
                        <View style={styles.optionalFieldsIndicator}>
                          {transaction.hasLocation && (
                            <View style={styles.fieldIndicator}>
                              <FileText size={12} color="#F4C66A" />
                              <Text style={styles.fieldIndicatorText}>
                                Full Info
                              </Text>
                            </View>
                          )}
                        </View>
                      )}
                    </View>

                    <View style={styles.transactionRight}>
                      <Text style={styles.transactionAmount}>
                        {transaction.amount}
                      </Text>
                      {hasOptionalFields && (
                        <ChevronLeft
                          size={16}
                          color="#F4C66A"
                          style={{transform: [{rotate: '-90deg'}]}}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
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

          {/* Transaction Details Modal */}
          <Modal
            visible={showDetailsModal}
            transparent
            animationType="slide"
            onRequestClose={() => setShowDetailsModal(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Transaction Details</Text>
                  <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
                    <X size={24} color="#fff" />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  style={styles.modalBody}
                  showsVerticalScrollIndicator={false}>
                  {selectedTransaction && (
                    <>
                      {/* Basic Info */}
                      <View style={styles.detailSection}>
                        <Text style={styles.detailLabel}>Description</Text>
                        <Text style={styles.detailValue}>
                          {selectedTransaction.description}
                        </Text>
                      </View>

                      <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>Amount</Text>
                          <Text style={styles.detailValue}>
                            ${selectedTransaction.amount?.toLocaleString()}
                          </Text>
                        </View>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>Date</Text>
                          <Text style={styles.detailValue}>
                            {formatDate(selectedTransaction.date)}
                          </Text>
                        </View>
                      </View>

                      {/* Category */}
                      <View style={styles.detailSection}>
                        <Text style={styles.detailLabel}>Category</Text>
                        <View style={styles.categoryDetail}>
                          <View
                            style={[
                              styles.categoryDetailIcon,
                              {
                                backgroundColor:
                                  selectedTransaction.category?.color ||
                                  '#F97316',
                              },
                            ]}>
                            <Text style={styles.categoryDetailIconText}>
                              {selectedTransaction.category?.icon || '💰'}
                            </Text>
                          </View>
                          <Text style={styles.detailValue}>
                            {selectedTransaction.category?.name ||
                              'Uncategorized'}
                          </Text>
                        </View>
                      </View>

                      {/* Optional Fields */}
                      {selectedTransaction.location && (
                        <View style={styles.detailSection}>
                          <View style={styles.detailHeader}>
                            <MapPin size={20} color="#F4C66A" />
                            <Text style={styles.detailLabel}>Location</Text>
                          </View>
                          <Text style={styles.detailValue}>
                            {selectedTransaction.location}
                          </Text>
                        </View>
                      )}

                      {selectedTransaction.notes && (
                        <View style={styles.detailSection}>
                          <View style={styles.detailHeader}>
                            <FileText size={20} color="#F4C66A" />
                            <Text style={styles.detailLabel}>Notes</Text>
                          </View>
                          <Text style={styles.detailValue}>
                            {selectedTransaction.notes}
                          </Text>
                        </View>
                      )}

                      {selectedTransaction.receipt && (
                        <View style={styles.detailSection}>
                          <View style={styles.detailHeader}>
                            <Eye size={20} color="#F4C66A" />
                            <Text style={styles.detailLabel}>Receipt</Text>
                          </View>

                          {/* Show receipt preview if available */}
                          {selectedTransaction.receipt?.uri && (
                            <View style={styles.receiptPreview}>
                              <Image
                                source={{uri: selectedTransaction.receipt.uri}}
                                style={styles.receiptImage}
                                resizeMode="cover"
                              />
                            </View>
                          )}
                        </View>
                      )}
                    </>
                  )}
                </ScrollView>
              </View>
            </View>
          </Modal>
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
  emojiIcon: {
    fontSize: FontSize._24,
    color: '#fff',
    textAlign: 'center',
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
  optionalFieldsIndicator: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  fieldIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(244, 198, 106, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  fieldIndicatorText: {
    color: '#F4C66A',
    fontSize: FontSize._10,
    fontFamily: AppFonts.REGULAR,
  },
  transactionRight: {
    alignItems: 'flex-end',
    minWidth: 70,
  },
  transactionAmount: {
    color: '#FF6B6B',
    fontSize: FontSize._16,
    fontFamily: AppFonts.BOLD,
    marginBottom: 4,
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
  // Modal styles
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
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: '#fff',
    fontSize: FontSize._20,
    fontFamily: AppFonts.BOLD,
  },
  modalBody: {
    maxHeight: 500,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailItem: {
    flex: 1,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  detailLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: FontSize._14,
    fontFamily: AppFonts.REGULAR,
    marginBottom: 4,
  },
  detailValue: {
    color: '#fff',
    fontSize: FontSize._16,
    fontFamily: AppFonts.REGULAR,
  },
  categoryDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryDetailIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryDetailIconText: {
    fontSize: FontSize._18,
    color: '#fff',
  },
  receiptButton: {
    backgroundColor: 'rgba(244, 198, 106, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(244, 198, 106, 0.3)',
    marginBottom: 12,
  },
  receiptButtonText: {
    color: '#F4C66A',
    fontSize: FontSize._16,
    fontFamily: AppFonts.REGULAR,
  },
  receiptPreview: {
    // alignItems: 'center',
  },
  receiptImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  receiptPreviewText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: FontSize._12,
    fontFamily: AppFonts.REGULAR,
    textAlign: 'center',
  },
});
