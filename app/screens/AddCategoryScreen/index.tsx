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

// Validation schema for new category
const newCategorySchema = Yup.object().shape({
  name: Yup.string()
    .required('Category name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters'),
  budget: Yup.string()
    .test('is-valid-number', 'Budget must be a valid number', value => {
      if (!value || value.trim() === '') return true; // Allow empty (optional)
      return !isNaN(Number(value)) && Number(value) >= 0;
    })
    .test('max-length', 'Budget is too large', value => {
      if (!value) return true;
      return Number(value) <= 1000000; // Max 1 million
    }),
});

// Validation schema for editing category
const editCategorySchema = Yup.object().shape({
  name: Yup.string()
    .required('Category name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters'),
  budget: Yup.number()
    .typeError('Budget must be a number')
    .min(0, 'Budget cannot be negative')
    .max(1000000, 'Budget cannot exceed $1,000,000')
    .required('Budget is required'),
});

export default function AddCategoryScreen({navigation, route}: any) {
  const existingCategories: Category[] = route.params?.categories || [];

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [categories, setCategories] = useState<Category[]>([
    ...existingCategories,
    // Default categories
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
  ]);

  const [newCategory, setNewCategory] = useState({
    name: '',
    icon: '🍔',
    color: '#F97316',
    budget: '',
  });

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showCustomIconModal, setShowCustomIconModal] = useState(false);
  const [customIcon, setCustomIcon] = useState('');

  // Update useEffect for back handler
  useEffect(() => {
    // Check if there are unsaved changes
    const hasChanges =
      newCategory.name.trim() !== '' ||
      newCategory.budget !== '' ||
      categories.length !== existingCategories.length ||
      JSON.stringify(categories) !== JSON.stringify(existingCategories);

    setHasUnsavedChanges(hasChanges);
  }, [newCategory, categories, existingCategories]);

  // Update the back handler function
  const handleBack = () => {
    if (hasUnsavedChanges) {
      setShowModal(true);
    } else {
      navigation.goBack();
    }
  };

  // Save categories and go back
  const handleSave = () => {
    // Filter out empty categories
    const validCategories = categories.filter(cat => cat.name.trim() !== '');

    // Pass back to previous screen
    if (route.params?.onSaveCategories) {
      route.params.onSaveCategories(validCategories);
    }

    navigation.goBack();
  };

  // Add new category
  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      _showToast('Please enter a category name', 'error');
      return;
    }

    const newCat: Category = {
      id: Date.now().toString(),
      name: newCategory.name,
      icon: newCategory.icon,
      color: newCategory.color,
      budget: parseFloat(newCategory.budget) || 0,
      isDefault: false,
    };

    setCategories([...categories, newCat]);
    setNewCategory({
      name: '',
      icon: '🍔',
      color: '#F97316',
      budget: '',
    });
  };

  // Update category
  const handleUpdateCategory = () => {
    if (!editingCategory?.name.trim()) {
      // Alert.alert('Error', 'Please enter a category name');
      _showToast('Please enter a category name', 'Error');
      return;
    }

    setCategories(
      categories.map(cat =>
        cat.id === editingCategory.id ? editingCategory : cat,
      ),
    );
    setEditingCategory(null);
  };

  // Delete category
  const handleDeleteCategory = (id: string) => {
    Alert.alert(
      'Delete Category',
      'Are you sure you want to delete this category? All expenses in this category will be deleted.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setCategories(categories.filter(cat => cat.id !== id));
          },
        },
      ],
    );
  };

  // Pick icon from emoji
  const selectIcon = (icon: string) => {
    if (editingCategory) {
      setEditingCategory({...editingCategory, icon});
    } else {
      setNewCategory({...newCategory, icon});
    }
    setShowIconPicker(false);
  };

  // Select color
  const selectColor = (color: string) => {
    if (editingCategory) {
      setEditingCategory({...editingCategory, color});
    } else {
      setNewCategory({...newCategory, color});
    }
    setShowColorPicker(false);
  };

  // Pick image from gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (result.assets && result.assets[0]) {
      // Handle the image - in a real app, you'd upload to server or save locally
      _showToast('Image selected', 'success');
    }
    setShowCustomIconModal(false);
  };

  // Take photo
  const takePhoto = async () => {
    const result = await ImagePicker.launchCamera({
      mediaType: 'photo',
      quality: 1,
    });

    if (result.assets && result.assets[0]) {
      // Handle the image - in a real app, you'd upload to server or save locally
      _showToast('Image selected', 'success');
    }
    setShowCustomIconModal(false);
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
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Save size={24} color="#F4C66A" />
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}>
            {/* Header */}

            {/* Add New Category Form */}
            <View style={styles.addCategoryContainer}>
              <Text style={styles.sectionTitle}>Add New Category</Text>

              <View style={styles.formRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Category Name</Text>
                  <TextInput
                    style={styles.textInput}
                    value={newCategory.name}
                    onChangeText={text =>
                      setNewCategory({...newCategory, name: text})
                    }
                    placeholder="e.g., Groceries"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Monthly Budget</Text>
                  <View style={styles.budgetInput}>
                    <DollarSign size={20} color="#F4C66A" />
                    <TextInput
                      style={[styles.textInput, {flex: 1}]}
                      value={newCategory.budget}
                      onChangeText={text =>
                        setNewCategory({...newCategory, budget: text})
                      }
                      placeholder="0.00"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      keyboardType="decimal-pad"
                    />
                  </View>
                </View>
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
                Your Categories ({categories.length})
              </Text>

              {categories.map(category => (
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
                        Budget: ${category.budget.toLocaleString()}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.categoryActions}>
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
                          onPress={() => handleDeleteCategory(category.id)}>
                          <Trash2 size={18} color="#FF6B6B" />
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
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

                {/* Remove justifyContent from ScrollView style */}
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
                          {
                            backgroundColor:
                              editingCategory?.color || newCategory.color,
                          },
                        ]}>
                        <Text style={styles.iconOptionText}>{icon}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  style={styles.customIconButton}
                  onPress={() => {
                    setShowIconPicker(false);
                    setShowCustomIconModal(true);
                  }}>
                  <Camera size={20} color="#fff" />
                  <Text style={styles.customIconButtonText}>
                    Use Custom Image
                  </Text>
                </TouchableOpacity>
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
                      {(editingCategory?.color === color ||
                        newCategory.color === color) && (
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

          {/* Custom Icon Modal */}
          <Modal
            visible={showCustomIconModal}
            transparent
            animationType="slide"
            onRequestClose={() => setShowCustomIconModal(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Custom Icon</Text>
                  <TouchableOpacity
                    onPress={() => setShowCustomIconModal(false)}>
                    <X size={24} color="#fff" />
                  </TouchableOpacity>
                </View>

                <View style={styles.customIconOptions}>
                  <TouchableOpacity
                    style={styles.customIconOption}
                    onPress={pickImage}>
                    <ImageIcon size={32} color="#F4C66A" />
                    <Text style={styles.customIconOptionText}>
                      Choose from Gallery
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.customIconOption}
                    onPress={takePhoto}>
                    <Camera size={32} color="#F4C66A" />
                    <Text style={styles.customIconOptionText}>Take Photo</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
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
  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  inputContainer: {
    flex: 1,
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
  customIconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(249, 115, 22, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },
  customIconButtonText: {
    color: '#fff',
    fontSize: FontSize._16,
    fontFamily: AppFonts.REGULAR,
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
  customIconOptions: {
    gap: 16,
  },
  customIconOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
  },
  customIconOptionText: {
    color: '#fff',
    fontSize: FontSize._16,
    fontFamily: AppFonts.REGULAR,
    flex: 1,
  },
});
