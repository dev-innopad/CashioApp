import React, {useState, useEffect, useCallback} from 'react';
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
import debounce from 'lodash.debounce';
import AppMainContainer from '../../components/AppMainContainer';
import DatePicker from 'react-native-date-picker';
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
import {useDispatch, useSelector} from 'react-redux';
import {addExpense} from '../../store/reducers/userData.slice';
import {_showToast} from '../../services/UIs/ToastConfig';
import {AppFonts, FontSize} from '../../assets/fonts';
import {fetchAddressSuggestions} from '../../services/addressService';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import {RootState} from '../../store';
import {NavigationKeys} from '../../constants/navigationKeys';

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
  amount: string | number;
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

  const dispatch = useDispatch();

  const [addressSuggestions, setAddressSuggestions] = useState<
    Array<{label: string; fullAddress: string}>
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [afterModalCloseAction, setAfterModalCloseAction] = useState<
    (() => void) | null
  >(null);
  const categories = useSelector(
    (state: RootState) => state.userData.currentUser?.categories || [],
  );
  const [expense, setExpense] = useState<Partial<Expense>>({
    amount: '',
    description: '',
    category: categories[0] || null,
    date: new Date(),
    location: '',
    notes: '',
  });

  const [receipt, setReceipt] = useState<any>(null);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const handleAddressSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length < 3) {
        setAddressSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      setIsSearching(true);
      const suggestions = await fetchAddressSuggestions(query);
      setAddressSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
      setIsSearching(false);
    }, 300),
    [],
  );

  // Load categories if passed as route params
  // useEffect(() => {
  //   if (route.params?.updatedCategories) {
  //     setCategories(route.params.updatedCategories);
  //     // Update selected category if it exists
  //     if (
  //       expense.category &&
  //       route.params.updatedCategories.find(c => c.id === expense.category?.id)
  //     ) {
  //       setExpense(prev => ({
  //         ...prev,
  //         category: route.params.updatedCategories.find(
  //           c => c.id === expense.category?.id,
  //         ),
  //       }));
  //     }
  //   }
  // }, [route.params?.updatedCategories]);

  useEffect(() => {
    if (categories.length > 0 && !expense.category) {
      setExpense(prev => ({
        ...prev,
        category: categories[0],
      }));
    }
  }, [categories]);

  // Function to navigate to Add Category Screen
  const navigateToAddCategory = () => {
    // navigation.navigate('AddCategoryScreen', {
    //   categories: categories,
    //   onSaveCategories: (updatedCategories: Category[]) => {
    //     // Update categories when coming back
    //     setCategories(updatedCategories);
    //     // Auto-select the newly added category (last one)
    //     if (updatedCategories.length > 0) {
    //       setExpense(prev => ({
    //         ...prev,
    //         category: updatedCategories[updatedCategories.length - 1],
    //       }));
    //     }
    //   },
    // });
    navigation.navigate(NavigationKeys.AddCategoryScreen);
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
  const onDateChange = (selectedDate: Date) => {
    setExpense({...expense, date: selectedDate});
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
    if (!expense.amount || parseFloat(expense.amount.toString()) <= 0) {
      _showToast('Please enter a valid amount', 'error');
      return;
    }

    if (!expense.description?.trim()) {
      _showToast('Please enter a description', 'error');
      return;
    }

    if (!expense.category) {
      _showToast('Please select a category', 'error');
      return;
    }

    // Convert date to ISO string for serialization
    const dateString =
      expense.date instanceof Date ? expense.date.toISOString() : expense.date;

    const newExpense = {
      id: Date.now().toString(),
      amount: Number(expense.amount!),
      description: expense.description!,
      category: expense.category!,
      date: dateString,
      location: expense.location?.trim() || undefined, // Store if not empty
      receipt: receipt || undefined, // Store if exists
      notes: expense.notes?.trim() || undefined, // Store if not empty
    };

    console.log('new expense', newExpense);

    // Save to Redux store using the new addExpense action
    dispatch(addExpense(newExpense));

    console.log('Expense saved to Redux:', newExpense);

    // Pass back to previous screen if needed
    route.params?.onSaveExpense?.(newExpense);

    _showToast('Expense added successfully!', 'success');
    navigation.goBack();
  };

  return (
    <AppMainContainer hideTop hideBottom>
      <LinearGradient colors={['#141326', '#24224A']} style={{flex: 1}}>
        <StatusBar barStyle={'light-content'} translucent={false} />
        <SafeAreaView style={{flex: 1}}>
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
          <KeyboardAwareScrollView>
            <ScrollView
              style={styles.container}
              showsVerticalScrollIndicator={false}>
              {/* Header */}

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
                    placeholder="0"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    keyboardType="decimal-pad"
                    maxLength={6}
                    returnKeyType="done"
                    enablesReturnKeyAutomatically={true}
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
                    onPress={() => setShowDatePicker(true)}
                    activeOpacity={0.7}>
                    <View style={styles.dateSelectorContent}>
                      <Calendar size={20} color="#F4C66A" />
                      <Text style={styles.dateText}>
                        {formatDate(expense.date!)}
                      </Text>
                    </View>
                    <ChevronLeft
                      size={20}
                      color="rgba(244, 198, 106, 0.7)"
                      style={styles.dateSelectorChevron}
                    />
                  </TouchableOpacity>

                  <DatePicker
                    modal
                    open={showDatePicker}
                    date={expense.date || new Date()}
                    mode="date"
                    onConfirm={selectedDate => {
                      setShowDatePicker(false);
                      setExpense({...expense, date: selectedDate});
                    }}
                    onCancel={() => {
                      setShowDatePicker(false);
                    }}
                    theme={Platform.OS === 'ios' ? 'light' : 'dark'}
                    confirmText="Select"
                    cancelText="Cancel"
                    title="Select Date"
                    maximumDate={new Date()} // Disable future dates
                    minimumDate={new Date(2000, 0, 1)} // Optional: Set min date
                    androidVariant="nativeAndroid" // or "iosClone" for iOS-like on Android
                  />
                </View>

                {/* Location */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Location (Optional)</Text>
                  <View style={styles.locationInput}>
                    <MapPin size={20} color="#F4C66A" />
                    {/* <TextInput
                    style={[styles.textInput, {flex: 1}]}
                    value={expense.location}
                    onChangeText={text =>
                      setExpense({...expense, location: text})
                    }
                    placeholder="Where did you spend?"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  /> */}
                    <TextInput
                      style={[styles.textInput, {flex: 1}]}
                      value={expense.location}
                      onChangeText={text => {
                        setExpense({...expense, location: text});
                        handleAddressSearch(text);
                      }}
                      onFocus={() => {
                        if (addressSuggestions.length > 0)
                          setShowSuggestions(true);
                      }}
                      placeholder="Start typing an address..."
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    />
                    {showSuggestions && addressSuggestions.length > 0 && (
                      <View style={styles.suggestionsContainer}>
                        {addressSuggestions.map((item, index) => (
                          <TouchableOpacity
                            key={index}
                            style={styles.suggestionItem}
                            onPress={() => {
                              setExpense({
                                ...expense,
                                location: item.fullAddress,
                              });
                              setShowSuggestions(false);
                            }}>
                            <Text style={styles.suggestionText}>
                              {item.fullAddress}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
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
            </ScrollView>

            <Modal
              isVisible={showCategoryPicker}
              backdropOpacity={0.8}
              style={styles.modal}
              onBackdropPress={() => setShowCategoryPicker(false)}
              onBackButtonPress={() => setShowCategoryPicker(false)}
              onModalHide={() => {
                if (afterModalCloseAction) {
                  afterModalCloseAction();
                  setAfterModalCloseAction(null); // Reset
                }
              }}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Category</Text>
                  <TouchableOpacity
                    onPress={() => setShowCategoryPicker(false)}>
                    <X size={24} color="#fff" />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  style={styles.categoriesList}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.categoriesListContent}>
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
                      }}
                      activeOpacity={0.7}>
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
                      setTimeout(() => {
                        navigateToAddCategory();
                      }, 300);
                    }}
                    activeOpacity={0.7}>
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
            </Modal>
          </KeyboardAwareScrollView>
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
    fontSize: FontSize._25,
    fontFamily: AppFonts.EXTRA_BOLD,
    // fontWeight: '700',
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
    fontSize: FontSize._16,
    fontFamily: AppFonts.REGULAR,
    // fontWeight: '600',
  },
  amountSection: {
    backgroundColor: '#1F1D3A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    // alignItems: 'center',
  },
  sectionLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: FontSize._14,
    fontFamily: AppFonts.REGULAR,
    marginBottom: 12,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  amountInput: {
    color: '#fff',
    fontSize: FontSize._38,
    fontFamily: AppFonts.EXTRA_BOLD,
    flex: 1,
    // textAlign: 'center',
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
    fontSize: FontSize._14,
    fontFamily: AppFonts.REGULAR,
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
    fontSize: FontSize._14,
    fontFamily: AppFonts.REGULAR,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    color: '#fff',
    fontSize: FontSize._16,
    fontFamily: AppFonts.REGULAR,
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
    fontSize: FontSize._20,
    fontFamily: AppFonts.REGULAR,
  },
  categoryName: {
    color: '#fff',
    fontSize: FontSize._16,
    fontFamily: AppFonts.MEDIUM,
    flex: 1,
  },
  placeholderText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: FontSize._16,
    fontFamily: AppFonts.REGULAR,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  dateSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  dateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },

  dateSelectorChevron: {
    transform: [{rotate: '-90deg'}],
    opacity: 0.7,
  },

  // Optional: Pressed state
  dateSelectorPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderColor: 'rgba(244, 198, 106, 0.3)',
  },
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingLeft: 12,
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
    fontSize: FontSize._16,
    fontFamily: AppFonts.REGULAR,
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
    fontSize: FontSize._16,
    fontFamily: AppFonts.REGULAR,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
    fontFamily: AppFonts.MEDIUM,
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
    fontSize: FontSize._20,
    fontFamily: AppFonts.REGULAR,
  },
  categoryOptionName: {
    color: '#fff',
    fontSize: FontSize._16,
    fontFamily: AppFonts.REGULAR,
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
    fontSize: FontSize._16,
    fontFamily: AppFonts.REGULAR,
    flex: 1,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#1F1D3A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 4,
    maxHeight: 200,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  suggestionIcon: {
    marginRight: 10,
  },
  suggestionText: {
    color: '#fff',
    fontSize: FontSize._14,
    fontFamily: AppFonts.REGULAR,
    flex: 1,
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  categoriesListContent: {
    // paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 30,
  },
});
