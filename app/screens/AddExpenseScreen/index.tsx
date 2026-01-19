// screens/AddExpenseScreen.tsx - Updated with "Add New Category" option
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AppMainContainer from '../../components/AppMainContainer';
import {
  ChevronLeft,
  Camera,
  Image as ImageIcon,
  X,
  DollarSign,
  Calendar,
  Tag,
  MapPin,
  FileText,
  Paperclip,
  Send,
  Trash2,
  Plus,
} from 'lucide-react-native';
import * as ImagePicker from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  budget: number;
  isDefault: boolean;
}

interface Expense {
  id: string;
  amount: number;
  description: string;
  category: Category;
  date: Date;
  location?: string;
  receipt?: any;
  notes?: string;
}

export default function AddExpenseScreen({navigation, route}: any) {
  // Get categories from route params or use default
  const initialCategories: Category[] = route.params?.categories || [
    {
      id: '1',
      name: 'Food',
      icon: '🍔',
      color: '#F97316',
      budget: 5000,
      isDefault: true,
    },
    {
      id: '2',
      name: 'Transport',
      icon: '🚗',
      color: '#22D3EE',
      budget: 3000,
      isDefault: true,
    },
    {
      id: '3',
      name: 'Shopping',
      icon: '🛍️',
      color: '#86EFAC',
      budget: 4000,
      isDefault: true,
    },
    {
      id: '4',
      name: 'Entertainment',
      icon: '🎬',
      color: '#A855F7',
      budget: 2000,
      isDefault: true,
    },
  ];

  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [expense, setExpense] = useState<Partial<Expense>>({
    amount: 0,
    description: '',
    category: initialCategories[0],
    date: new Date(),
    location: '',
    notes: '',
  });

  const [receipt, setReceipt] = useState<any>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  // Load categories if passed as route params
  useEffect(() => {
    if (route.params?.updatedCategories) {
      setCategories(route.params.updatedCategories);
      // Update selected category if it exists
      if (
        expense.category &&
        route.params.updatedCategories.find(c => c.id === expense.category?.id)
      ) {
        setExpense(prev => ({
          ...prev,
          category: route.params.updatedCategories.find(
            c => c.id === expense.category?.id,
          ),
        }));
      }
    }
  }, [route.params?.updatedCategories]);

  // Function to navigate to Add Category Screen
  const navigateToAddCategory = () => {
    navigation.navigate('AddCategoryScreen', {
      categories: categories,
      onSaveCategories: (updatedCategories: Category[]) => {
        // Update categories when coming back
        setCategories(updatedCategories);
        // Auto-select the newly added category (last one)
        if (updatedCategories.length > 0) {
          setExpense(prev => ({
            ...prev,
            category: updatedCategories[updatedCategories.length - 1],
          }));
        }
      },
    });
  };

  // Handle image picker
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 800,
    });

    if (result.assets && result.assets[0]) {
      setReceipt(result.assets[0]);
    }
  };

  // Take photo
  const takePhoto = async () => {
    const result = await ImagePicker.launchCamera({
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 800,
    });

    if (result.assets && result.assets[0]) {
      setReceipt(result.assets[0]);
    }
  };

  // Remove receipt
  const removeReceipt = () => {
    setReceipt(null);
  };

  // Handle date change
  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setExpense({...expense, date: selectedDate});
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Save expense
  const handleSaveExpense = () => {
    if (!expense.amount || expense.amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!expense.description?.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    if (!expense.category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    const newExpense: Expense = {
      id: Date.now().toString(),
      amount: expense.amount!,
      description: expense.description!,
      category: expense.category!,
      date: expense.date!,
      location: expense.location,
      receipt: receipt,
      notes: expense.notes,
    };

    // Save to local storage or send to server
    console.log('Saving expense:', newExpense);

    // Pass back to previous screen
    route.params?.onSaveExpense?.(newExpense);
    Alert.alert('Success', 'Expense added successfully!', [
      {text: 'OK', onPress: () => navigation.goBack()},
    ]);
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
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.headerButton}>
                <ChevronLeft size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Add Expense</Text>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveExpense}>
                <Send size={24} color="#F4C66A" />
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>

            {/* Amount Input */}
            <View style={styles.amountSection}>
              <Text style={styles.sectionLabel}>Amount</Text>
              <View style={styles.amountInputContainer}>
                <DollarSign size={32} color="#F4C66A" />
                <TextInput
                  style={styles.amountInput}
                  value={expense.amount?.toString() || ''}
                  onChangeText={text => {
                    const cleanText = text.replace(/[^0-9.]/g, '');
                    const amount = parseFloat(cleanText) || 0;
                    setExpense({...expense, amount});
                  }}
                  placeholder="0.00"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  keyboardType="decimal-pad"
                  maxLength={10}
                />
              </View>
            </View>

            {/* Main Form */}
            <View style={styles.formContainer}>
              {/* Description */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={styles.textInput}
                  value={expense.description}
                  onChangeText={text =>
                    setExpense({...expense, description: text})
                  }
                  placeholder="What did you spend on?"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  multiline
                />
              </View>

              {/* Category Selection */}
              <View style={styles.inputGroup}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.inputLabel}>Category</Text>
                  <TouchableOpacity
                    style={styles.addCategoryButton}
                    onPress={navigateToAddCategory}>
                    <Plus size={16} color="#F4C66A" />
                    <Text style={styles.addCategoryButtonText}>Add New</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.categorySelector}
                  onPress={() => setShowCategoryPicker(true)}>
                  {expense.category ? (
                    <View style={styles.selectedCategory}>
                      <View
                        style={[
                          styles.categoryIcon,
                          {backgroundColor: expense.category.color},
                        ]}>
                        <Text style={styles.categoryIconText}>
                          {expense.category.icon}
                        </Text>
                      </View>
                      <Text style={styles.categoryName}>
                        {expense.category.name}
                      </Text>
                      <ChevronLeft
                        size={20}
                        color="#666"
                        style={{transform: [{rotate: '-90deg'}]}}
                      />
                    </View>
                  ) : (
                    <Text style={styles.placeholderText}>
                      Select a category
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              {/* Date Selection */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Date</Text>
                <TouchableOpacity
                  style={styles.dateSelector}
                  onPress={() => setShowDatePicker(true)}>
                  <Calendar size={20} color="#F4C66A" />
                  <Text style={styles.dateText}>
                    {formatDate(expense.date!)}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Location */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Location (Optional)</Text>
                <View style={styles.locationInput}>
                  <MapPin size={20} color="#F4C66A" />
                  <TextInput
                    style={[styles.textInput, {flex: 1}]}
                    value={expense.location}
                    onChangeText={text =>
                      setExpense({...expense, location: text})
                    }
                    placeholder="Where did you spend?"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  />
                </View>
              </View>

              {/* Receipt Section */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Receipt (Optional)</Text>

                {receipt ? (
                  <View style={styles.receiptPreview}>
                    <Image
                      source={{uri: receipt.uri}}
                      style={styles.receiptImage}
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      style={styles.removeReceiptButton}
                      onPress={removeReceipt}>
                      <Trash2 size={20} color="#FF6B6B" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.receiptOptions}>
                    <TouchableOpacity
                      style={styles.receiptOption}
                      onPress={pickImage}>
                      <ImageIcon size={24} color="#F4C66A" />
                      <Text style={styles.receiptOptionText}>
                        Choose from Gallery
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.receiptOption}
                      onPress={takePhoto}>
                      <Camera size={24} color="#F4C66A" />
                      <Text style={styles.receiptOptionText}>Take Photo</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Notes */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Notes (Optional)</Text>
                <TextInput
                  style={[styles.textInput, styles.notesInput]}
                  value={expense.notes}
                  onChangeText={text => setExpense({...expense, notes: text})}
                  placeholder="Any additional notes..."
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>

            {/* Quick Amount Buttons */}
            <View style={styles.quickAmountsContainer}>
              <Text style={styles.sectionLabel}>Quick Amount</Text>
              <View style={styles.quickAmounts}>
                {[100, 500, 1000, 2000, 5000].map(amount => (
                  <TouchableOpacity
                    key={amount}
                    style={styles.quickAmountButton}
                    onPress={() => setExpense({...expense, amount})}>
                    <Text style={styles.quickAmountText}>${amount}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Category Picker Modal */}
          {showCategoryPicker && (
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Category</Text>
                  <TouchableOpacity
                    onPress={() => setShowCategoryPicker(false)}>
                    <X size={24} color="#fff" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.categoriesList}>
                  {categories.map(category => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryOption,
                        expense.category?.id === category.id &&
                          styles.categoryOptionSelected,
                      ]}
                      onPress={() => {
                        setExpense({...expense, category});
                        setShowCategoryPicker(false);
                      }}>
                      <View
                        style={[
                          styles.categoryOptionIcon,
                          {backgroundColor: category.color},
                        ]}>
                        <Text style={styles.categoryOptionIconText}>
                          {category.icon}
                        </Text>
                      </View>
                      <Text style={styles.categoryOptionName}>
                        {category.name}
                      </Text>
                      {expense.category?.id === category.id && (
                        <View style={styles.selectedIndicator}>
                          <ChevronLeft
                            size={20}
                            color="#F97316"
                            style={{transform: [{rotate: '-90deg'}]}}
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}

                  {/* Add New Category Option */}
                  <TouchableOpacity
                    style={styles.addNewCategoryOption}
                    onPress={() => {
                      setShowCategoryPicker(false);
                      navigateToAddCategory();
                    }}>
                    <View style={styles.addNewIcon}>
                      <Plus size={20} color="#F4C66A" />
                    </View>
                    <Text style={styles.addNewText}>Add New Category</Text>
                    <ChevronLeft
                      size={20}
                      color="#666"
                      style={{transform: [{rotate: '-90deg'}]}}
                    />
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </View>
          )}

          {/* Date Picker */}
          {showDatePicker && (
            <DateTimePicker
              value={expense.date!}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}
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
    fontSize: 20,
    fontWeight: '700',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(244, 198, 106, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  saveButtonText: {
    color: '#F4C66A',
    fontSize: 14,
    fontWeight: '600',
  },
  amountSection: {
    backgroundColor: '#1F1D3A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  sectionLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginBottom: 12,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  amountInput: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#1F1D3A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginBottom: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addCategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(244, 198, 106, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  addCategoryButtonText: {
    color: '#F4C66A',
    fontSize: 12,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    color: '#fff',
    fontSize: 16,
  },
  categorySelector: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
  },
  selectedCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIconText: {
    fontSize: 18,
  },
  categoryName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  placeholderText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 16,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
  },
  dateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  receiptOptions: {
    gap: 12,
  },
  receiptOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  receiptOptionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  receiptPreview: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  receiptImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeReceiptButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notesInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  quickAmountsContainer: {
    backgroundColor: '#1F1D3A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 40,
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAmountButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickAmountText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    fontSize: 18,
    fontWeight: '600',
  },
  categoriesList: {
    maxHeight: 400,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  categoryOptionSelected: {
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    borderWidth: 1,
    borderColor: '#F97316',
  },
  categoryOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryOptionIconText: {
    fontSize: 20,
  },
  categoryOptionName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(249, 115, 22, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addNewCategoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(244, 198, 106, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  addNewIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(244, 198, 106, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addNewText: {
    color: '#F4C66A',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
});
