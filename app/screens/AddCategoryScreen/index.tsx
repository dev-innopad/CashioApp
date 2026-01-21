// screens/AddCategoryScreen.tsx
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
  Modal,
  Alert,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AppMainContainer from '../../components/AppMainContainer';
import {
  ChevronLeft,
  Plus,
  X,
  Palette,
  DollarSign,
  Target,
  Edit2,
  Trash2,
  Save,
  Check,
  Camera,
  Image as ImageIcon,
} from 'lucide-react-native';
import * as ImagePicker from 'react-native-image-picker';
import {_showToast} from '../../services/UIs/ToastConfig';
import AppModal from '../../components/AppModal';
import * as Yup from 'yup';
import {AppFonts, FontSize} from '../../assets/fonts';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../../store';
import {addCategory, deleteCategory} from '../../store/reducers/userData.slice';
import {NavigationKeys} from '../../constants/navigationKeys';

// Default category icons
const defaultIcons = [
  '🍔',
  '🚗',
  '🏠',
  '🛍️',
  '🎬',
  '💊',
  '✈️',
  '🎓',
  '⚽',
  '📱',
  '💻',
  '🎮',
  '📚',
  '🎵',
  '🎨',
  '🏋️',
  '💈',
  '🐶',
  '🎁',
  '💸',
];

// Default colors
const defaultColors = [
  '#F97316',
  '#22D3EE',
  '#86EFAC',
  '#A855F7',
  '#EF4444',
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EC4899',
  '#8B5CF6',
  '#06B6D4',
  '#84CC16',
  '#F43F5E',
  '#8B5CF6',
  '#6366F1',
];

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  budget: number;
  isDefault: boolean;
}

// Validation schema
const categorySchema = Yup.object().shape({
  name: Yup.string()
    .required('Category name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .trim(),
  budget: Yup.number()
    .typeError('Budget must be a number')
    .min(0, 'Budget cannot be negative')
    .max(1000000, 'Budget cannot exceed $1,000,000')
    .required('Budget is required'),
  icon: Yup.string().required('Icon is required'),
  color: Yup.string().required('Color is required'),
});

export default function AddCategoryScreen({navigation, route}: any) {
  const dispatch = useDispatch();

  // Get categories from Redux
  const existingCategories = useSelector(
    (state: RootState) => state.userData.currentUser?.categories || [],
  );

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [newCategory, setNewCategory] = useState({
    name: '',
    icon: '🍔',
    color: '#F97316',
    budget: '',
  });

  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    budget?: string;
  }>({});

  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Check if category name already exists (case-insensitive)
  const isCategoryNameExists = (name: string) => {
    const normalizedName = name.toLowerCase().trim();
    return existingCategories.some(
      category => category.name.toLowerCase().trim() === normalizedName,
    );
  };

  // Validate form
  const validateForm = async () => {
    try {
      await categorySchema.validate(newCategory, {abortEarly: false});

      // Check if category name already exists
      if (isCategoryNameExists(newCategory.name)) {
        setValidationErrors({
          name: 'Category with this name already exists',
        });
        return false;
      }

      setValidationErrors({});
      return true;
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors: any = {};
        error.inner.forEach(err => {
          errors[err.path!] = err.message;
        });
        setValidationErrors(errors);
      }
      return false;
    }
  };

  const handleDeleteCategory = (id: string, isDefault: boolean) => {
    if (isDefault) {
      _showToast('Default categories cannot be deleted', 'error');
      return;
    }

    Alert.alert(
      'Delete Category',
      'Are you sure you want to delete this category?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteCategory(id));
            _showToast('Category deleted successfully', 'success');
          },
        },
      ],
    );
  };

  // Handle text input changes with validation
  const handleNameChange = async (text: string) => {
    setNewCategory({...newCategory, name: text});

    // Clear validation error for name when user starts typing
    if (validationErrors.name) {
      setValidationErrors({...validationErrors, name: undefined});
    }
  };

  const handleBudgetChange = (text: string) => {
    // Allow only numbers and decimal point
    const cleanText = text.replace(/[^0-9.]/g, '');
    setNewCategory({...newCategory, budget: cleanText});

    // Clear validation error for budget when user starts typing
    if (validationErrors.budget) {
      setValidationErrors({...validationErrors, budget: undefined});
    }
  };

  // Add new category
  const handleAddCategory = async () => {
    const isValid = await validateForm();

    if (!isValid) {
      // _showToast('Please Enter Detail', 'error');
      return;
    }

    // Check for duplicate category name (case-insensitive)
    if (isCategoryNameExists(newCategory.name)) {
      // _showToast('Category with this name already exists', 'error');
      return;
    }

    const categoryData = {
      name: newCategory.name.trim(), // Trim whitespace
      icon: newCategory.icon,
      color: newCategory.color,
      budget: parseFloat(newCategory.budget) || 0,
    };

    // Dispatch to Redux
    dispatch(addCategory(categoryData));

    // navigation.goBack();
    setTimeout(() => {
      if (route.params?.returnToAddExpense) {
        // Go back to AddExpense with flag
        navigation.navigate({
          name: 'AddExpenseScreen',
          params: {fromAddCategory: true},
        });
      } else {
        navigation.goBack();
      }
    }, 100);
    _showToast('Category added successfully', 'success');

    // Reset form
    setNewCategory({
      name: '',
      icon: '🍔',
      color: '#F97316',
      budget: '',
    });
    setValidationErrors({});
  };

  // Update existing category
  const handleUpdateCategory = async (category: Category) => {
    // If name changed, check for duplicates
    const originalCategory = existingCategories.find(c => c.id === category.id);
    if (originalCategory && category.name !== originalCategory.name) {
      if (isCategoryNameExists(category.name)) {
        _showToast('Category with this name already exists', 'error');
        return;
      }
    }

    dispatch(
      updateCategory({
        categoryId: category.id,
        updates: {
          name: category.name.trim(),
          icon: category.icon,
          color: category.color,
          budget: category.budget,
        },
      }),
    );

    _showToast('Category updated successfully', 'success');
  };

  // Pick icon from emoji
  const selectIcon = (icon: string) => {
    setNewCategory({...newCategory, icon});
    setShowIconPicker(false);
  };

  // Select color
  const selectColor = (color: string) => {
    setNewCategory({...newCategory, color});
    setShowColorPicker(false);
  };

  // Update back handler to check for changes
  useEffect(() => {
    const hasChanges =
      newCategory.name.trim() !== '' ||
      newCategory.budget !== '' ||
      validationErrors.name ||
      validationErrors.budget;

    setHasUnsavedChanges(hasChanges);
  }, [newCategory, validationErrors]);

  const handleBack = () => {
    if (hasUnsavedChanges) {
      setShowModal(true);
    } else {
      navigation.goBack();
    }
  };

  return (
    <AppMainContainer hideTop hideBottom>
      <LinearGradient colors={['#141326', '#24224A']} style={{flex: 1}}>
        <StatusBar barStyle={'light-content'} translucent={false} />
        <SafeAreaView style={{flex: 1}}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
              <ChevronLeft size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Manage Categories</Text>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => navigation.goBack()}>
              {/* <X size={24} color="#F4C66A" /> */}
              <Text style={styles.saveButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            {/* Add New Category Form */}
            <View style={styles.addCategoryContainer}>
              <Text style={styles.sectionTitle}>Add New Category</Text>

              {/* Category Name Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Category Name</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    validationErrors.name && styles.inputError,
                  ]}
                  value={newCategory.name}
                  onChangeText={handleNameChange}
                  placeholder="e.g., Groceries"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  maxLength={50}
                />
                {validationErrors.name && (
                  <Text style={styles.errorText}>{validationErrors.name}</Text>
                )}
              </View>

              {/* Budget Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Monthly Budget</Text>
                <View
                  style={[
                    styles.budgetInput,
                    validationErrors.budget && styles.inputError,
                  ]}>
                  <DollarSign size={20} color="#F4C66A" />
                  <TextInput
                    style={[styles.textInput, {flex: 1}]}
                    value={newCategory.budget}
                    onChangeText={handleBudgetChange}
                    placeholder="0.00"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                    enablesReturnKeyAutomatically={true}
                    maxLength={6}
                  />
                </View>
                {validationErrors.budget && (
                  <Text style={styles.errorText}>
                    {validationErrors.budget}
                  </Text>
                )}
              </View>

              {/* Icon Selection */}
              <View style={styles.iconSection}>
                <Text style={styles.inputLabel}>Select Icon</Text>
                <TouchableOpacity
                  style={styles.iconSelector}
                  onPress={() => setShowIconPicker(true)}>
                  <View
                    style={[
                      styles.iconPreview,
                      {backgroundColor: newCategory.color},
                    ]}>
                    <Text style={styles.iconText}>{newCategory.icon}</Text>
                  </View>
                  <Text style={styles.iconSelectorText}>
                    Tap to change icon
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Color Selection */}
              <View style={styles.colorSection}>
                <Text style={styles.inputLabel}>Select Color</Text>
                <TouchableOpacity
                  style={styles.colorSelector}
                  onPress={() => setShowColorPicker(true)}>
                  <View
                    style={[
                      styles.colorPreview,
                      {backgroundColor: newCategory.color},
                    ]}
                  />
                  <Text style={styles.colorSelectorText}>
                    Tap to change color
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Add Button */}
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddCategory}>
                <Plus size={20} color="#fff" />
                <Text style={styles.addButtonText}>Add Category</Text>
              </TouchableOpacity>
            </View>

            {/* Existing Categories */}
            <View style={styles.categoriesContainer}>
              <Text style={styles.sectionTitle}>
                Your Categories ({existingCategories.length})
              </Text>

              {existingCategories.map(category => (
                <View key={category.id} style={styles.categoryItem}>
                  <View style={styles.categoryInfo}>
                    <View
                      style={[
                        styles.categoryIcon,
                        {backgroundColor: category.color},
                      ]}>
                      <Text style={styles.categoryIconText}>
                        {category.icon}
                      </Text>
                    </View>
                    <View style={styles.categoryDetails}>
                      <Text style={styles.categoryName}>{category.name}</Text>
                      <Text style={styles.categoryBudget}>
                        Budget: ₹{category.budget.toLocaleString()}
                      </Text>
                      {category.isDefault && (
                        <Text style={styles.defaultBadge}>Default</Text>
                      )}
                    </View>
                  </View>

                  {/* <View style={styles.categoryActions}>
                    {!category.isDefault && (
                      <>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() =>
                            _showToast('Edit feature coming soon', 'info')
                          }>
                          <Edit2 size={18} color="#F4C66A" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() =>
                            handleDeleteCategory(
                              category.id,
                              category.isDefault,
                            )
                          }>
                          <Trash2 size={18} color="#FF6B6B" />
                        </TouchableOpacity>
                      </>
                    )}
                  </View> */}
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Icon Picker Modal */}
          <Modal
            visible={showIconPicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowIconPicker(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select an Icon</Text>
                  <TouchableOpacity onPress={() => setShowIconPicker(false)}>
                    <X size={24} color="#fff" />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  style={styles.iconsGrid}
                  contentContainerStyle={styles.iconsGridContent}
                  showsVerticalScrollIndicator={false}>
                  {defaultIcons.map((icon, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.iconOption}
                      onPress={() => selectIcon(icon)}>
                      <View
                        style={[
                          styles.iconOptionCircle,
                          {backgroundColor: newCategory.color},
                        ]}>
                        <Text style={styles.iconOptionText}>{icon}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>

          {/* Color Picker Modal */}
          <Modal
            visible={showColorPicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowColorPicker(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select a Color</Text>
                  <TouchableOpacity onPress={() => setShowColorPicker(false)}>
                    <X size={24} color="#fff" />
                  </TouchableOpacity>
                </View>

                <View style={styles.colorsGrid}>
                  {defaultColors.map((color, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.colorOption}
                      onPress={() => selectColor(color)}>
                      <View
                        style={[
                          styles.colorOptionCircle,
                          {backgroundColor: color},
                        ]}
                      />
                      {newCategory.color === color && (
                        <Check
                          size={16}
                          color="#fff"
                          style={styles.colorSelected}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </Modal>

          {/* Discard Changes Modal */}
          <AppModal
            visible={showModal}
            type="warning"
            title="Discard Changes?"
            message="You have unsaved changes. Are you sure you want to discard them?"
            cancelText="Cancel"
            confirmText="Discard"
            onClose={() => setShowModal(false)}
            onConfirm={() => {
              setShowModal(false);
              navigation.goBack();
            }}
          />
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
  scrollContent: {
    paddingBottom: 40,
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
    fontSize: FontSize._24,
    fontFamily: AppFonts.EXTRA_BOLD,
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
    fontFamily: AppFonts.MEDIUM,
  },
  addCategoryContainer: {
    backgroundColor: '#1F1D3A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: FontSize._24,
    fontFamily: AppFonts.BOLD,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: FontSize._14,
    fontFamily: AppFonts.REGULAR,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    color: '#fff',
    fontSize: FontSize._16,
    fontFamily: AppFonts.REGULAR,
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: FontSize._12,
    fontFamily: AppFonts.REGULAR,
    marginTop: 4,
    marginLeft: 4,
  },
  budgetInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingLeft: 12,
  },
  iconSection: {
    marginBottom: 16,
  },
  iconSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
  },
  iconPreview: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: FontSize._24,
    fontFamily: AppFonts.REGULAR,
  },
  iconSelectorText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: FontSize._16,
    fontFamily: AppFonts.REGULAR,
    flex: 1,
  },
  colorSection: {
    marginBottom: 24,
  },
  colorSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
  },
  colorPreview: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  colorSelectorText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: FontSize._14,
    fontFamily: AppFonts.REGULAR,
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F97316',
    borderRadius: 12,
    padding: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: FontSize._20,
    fontFamily: AppFonts.BOLD,
  },
  categoriesContainer: {
    backgroundColor: '#1F1D3A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 40,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIconText: {
    fontSize: FontSize._24,
    fontFamily: AppFonts.REGULAR,
  },
  categoryDetails: {
    flex: 1,
  },
  categoryName: {
    color: '#fff',
    fontSize: FontSize._18,
    fontFamily: AppFonts.BOLD,
    marginBottom: 4,
  },
  categoryBudget: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: FontSize._14,
    fontFamily: AppFonts.REGULAR,
  },
  defaultBadge: {
    color: '#F4C66A',
    fontSize: FontSize._12,
    fontFamily: AppFonts.REGULAR,
    backgroundColor: 'rgba(244, 198, 106, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  categoryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
    fontSize: FontSize._18,
    fontFamily: AppFonts.BOLD,
  },
  iconsGrid: {
    marginBottom: 20,
  },
  iconsGridContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  iconOption: {
    width: '19%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  iconOptionCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOptionText: {
    fontSize: FontSize._24,
    fontFamily: AppFonts.REGULAR,
  },
  colorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorOptionCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  colorSelected: {
    position: 'absolute',
  },
});
