// screens/ProfileScreen.tsx
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
  TextInput,
  Pressable,
  TouchableOpacity,
  Alert,
  Image,
  Keyboard,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AppMainContainer from '../../components/AppMainContainer';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Bell,
  Edit2,
  Save,
  LogOut,
  DollarSign,
  Target,
  Shield,
  Key,
  Eye,
  EyeOff,
  Cross,
  X,
} from 'lucide-react-native';
import {useDispatch, useSelector} from 'react-redux';
import * as ImagePicker from 'react-native-image-picker';
import {
  logoutUser,
  updateUserProfile,
} from '../../store/reducers/userData.slice';
import {_showInfoToast, _showToast} from '../../services/UIs/ToastConfig';
import AppModal from '../../components/AppModal';
import {NavigationKeys} from '../../constants/navigationKeys';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default function ProfileScreen({navigation}: any) {
  const dispatch = useDispatch();

  // Get user data from Redux
  const currentUser = useSelector((state: any) => state.userData.currentUser);
  const expenses = useSelector((state: any) => state.userData.expenses || []);

  const [isEditing, setIsEditing] = useState(false);
  const [showOldPin, setShowOldPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    monthlyBudget: '',
    profileImage: '',
  });

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const [pinData, setPinData] = useState({
    oldPin: '',
    newPin: '',
    confirmPin: '',
  });

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
        // Hide bottom tabs
        navigation.getParent()?.setOptions({
          tabBarStyle: {display: 'none'},
        });
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
        // Show bottom tabs
        navigation.getParent()?.setOptions({
          tabBarStyle: {display: 'flex'},
        });
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [navigation]);

  // Initialize user data from Redux
  useEffect(() => {
    if (currentUser) {
      setUserData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        monthlyBudget: currentUser.monthlyBudget?.toString() || '',
        profileImage: currentUser.profileImage || '',
      });
    }
  }, [currentUser]);

  // Calculate user statistics
  const calculateStats = () => {
    const totalSpent = expenses.reduce(
      (sum: number, expense: any) => sum + (expense.amount || 0),
      0,
    );

    const totalBudget = currentUser?.monthlyBudget || 0;
    const remainingBudget = Math.max(0, totalBudget - totalSpent);
    const utilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    return {
      totalSpent,
      totalBudget,
      remainingBudget,
      utilization: Math.round(utilization),
    };
  };

  const stats = calculateStats();

  const handleSave = () => {
    if (!userData.name.trim()) {
      _showToast('Please enter your name', 'info');
      return;
    }

    if (userData.email && !isValidEmail(userData.email)) {
      _showToast('Please enter a valid email address', 'info');
      return;
    }

    const monthlyBudget = parseFloat(userData.monthlyBudget);
    if (isNaN(monthlyBudget) || monthlyBudget <= 0) {
      _showToast('Please enter a valid monthly budget', 'info');
      return;
    }

    // Update user profile in Redux
    dispatch(
      updateUserProfile({
        name: userData.name,
        email: userData.email || undefined,
        phone: userData.phone || undefined,
        monthlyBudget: monthlyBudget,
        profileImage: userData.profileImage || undefined,
      }),
    );

    setIsEditing(false);
    _showToast('Profile updated successfully!', 'success');
  };

  const handleChangePin = () => {
    if (!pinData.oldPin || pinData.oldPin.length !== 4) {
      _showToast('Please enter your current 4-digit PIN', 'info');
      return;
    }

    if (pinData.oldPin !== currentUser?.pin) {
      _showToast('Current PIN is incorrect', 'info');
      return;
    }

    if (!pinData.newPin || pinData.newPin.length !== 4) {
      _showToast('New PIN must be 4 digits', 'info');
      return;
    }

    if (pinData.newPin !== pinData.confirmPin) {
      _showToast('New PINs do not match', 'info');
      return;
    }

    if (pinData.oldPin === pinData.newPin) {
      _showToast('New PIN must be different from current PIN', 'info');
      return;
    }

    // Update PIN in Redux
    dispatch(
      updateUserProfile({
        pin: pinData.newPin,
      }),
    );

    setIsChangingPin(false);
    setPinData({oldPin: '', newPin: '', confirmPin: ''});
    _showToast('PIN updated successfully!', 'success');
  };

  const handleSelectImage = () => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 800,
    };

    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        Alert.alert('Error', 'Failed to select image');
      } else if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri;
        setUserData({...userData, profileImage: imageUri});

        // Update profile image in Redux
        dispatch(
          updateUserProfile({
            profileImage: imageUri,
          }),
        );
      }
    });
  };

  const handleLogout = () => {
    // Alert.alert('Logout', 'Are you sure you want to logout?', [
    //   {text: 'Cancel', style: 'cancel'},
    //   {
    //     text: 'Logout',
    //     style: 'destructive',
    //     onPress: () => {
    //       dispatch(logoutUser());
    //       navigation.reset({
    //         index: 0,
    //         routes: [{name: 'PinScreen'}],
    //       });
    //     },
    //   },
    // ]);
    setShowLogoutModal(true);
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const renderInputField = (
    label: string,
    value: string,
    icon: React.ReactNode,
    key: keyof typeof userData,
    keyboardType: any = 'default',
    maxLength?: number,
  ) => (
    <View style={styles.inputContainer}>
      <View style={styles.inputLabelRow}>
        {icon}
        <Text style={styles.inputLabel}>{label}</Text>
      </View>
      {isEditing ? (
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={text => setUserData({...userData, [key]: text})}
          placeholder={`Enter ${label}`}
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          keyboardType={keyboardType}
          // editable={key !== 'monthlyBudget'} // Don't edit budget from here
          editable={true}
          maxLength={maxLength}
          returnKeyType="done"
          enablesReturnKeyAutomatically={true}
        />
      ) : (
        <Text style={styles.inputValue}>
          {key === 'monthlyBudget'
            ? `$${parseFloat(value).toLocaleString()}`
            : value || 'Not set'}
        </Text>
      )}
    </View>
  );

  const renderPinInput = (
    label: string,
    value: string,
    show: boolean,
    setShow: (show: boolean) => void,
    key: keyof typeof pinData,
  ) => (
    <View style={styles.inputContainer}>
      <View style={styles.inputLabelRow}>
        <Key size={20} color="#F4C66A" />
        <Text style={styles.inputLabel}>{label}</Text>
      </View>
      <View style={styles.pinInputContainer}>
        <TextInput
          style={styles.pinInput}
          value={value}
          onChangeText={text =>
            setPinData({...pinData, [key]: text.replace(/[^0-9]/g, '')})
          }
          placeholder="••••"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          keyboardType="numeric"
          secureTextEntry={!show}
          maxLength={4}
        />
        <TouchableOpacity
          onPress={() => setShow(!show)}
          style={styles.eyeButton}>
          {show ? (
            <EyeOff size={20} color="#F4C66A" />
          ) : (
            <Eye size={20} color="#F4C66A" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!currentUser) {
    return null;
  }

  return (
    <AppMainContainer hideTop hideBottom>
      <LinearGradient colors={['#141326', '#24224A']} style={{flex: 1}}>
        <StatusBar barStyle={'light-content'} translucent={false} />
        <SafeAreaView style={{flex: 1}}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>My Profile</Text>
          </View>

          <KeyboardAwareScrollView
            style={{flex: 1}}
            contentContainerStyle={[
              styles.scrollContent,
              {paddingBottom: isKeyboardVisible ? 40 : 100},
            ]}
            enableOnAndroid={true}
            extraScrollHeight={100}
            keyboardShouldPersistTaps="handled"
            enableAutomaticScroll={Platform.OS === 'ios'}
            extraHeight={Platform.select({android: 150, ios: 0})}
            showsVerticalScrollIndicator={false}>
            <ScrollView style={{flex: 1, paddingBottom: 90}}>
              {/* Profile Section */}
              <View style={styles.profileSection}>
                <View style={styles.avatarContainer}>
                  {userData.profileImage ? (
                    <Image
                      source={{uri: userData.profileImage}}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <View style={styles.avatar}>
                      <User size={60} color="#fff" />
                    </View>
                  )}
                  {isEditing && (
                    <TouchableOpacity
                      onPress={handleSelectImage}
                      style={styles.editAvatarButton}>
                      <Edit2 size={16} color="#fff" />
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={styles.userName}>{userData.name}</Text>
                <Text style={styles.userEmail}>
                  {userData.email || 'No email set'}
                </Text>
              </View>

              {/* Edit Profile Section */}
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Personal Information</Text>
                  {!isEditing ? (
                    <TouchableOpacity
                      onPress={() => setIsEditing(true)}
                      style={styles.editButton}>
                      <Edit2 size={20} color="#F4C66A" />
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => setIsEditing(false)}
                      style={styles.saveButton}>
                      {/* <X size={20} color="#4ECDC4" /> */}
                      <Text style={styles.saveButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {renderInputField(
                  'Name',
                  userData.name,
                  <User size={20} color="#F4C66A" />,
                  'name',
                )}
                {renderInputField(
                  'Email',
                  userData.email,
                  <Mail size={20} color="#F4C66A" />,
                  'email',
                  'email-address',
                )}
                {renderInputField(
                  'Phone',
                  userData.phone,
                  <Phone size={20} color="#F4C66A" />,
                  'phone',
                  'phone-pad',
                  10,
                )}
                {renderInputField(
                  'Monthly Budget',
                  userData.monthlyBudget,
                  <DollarSign size={20} color="#F4C66A" />,
                  'monthlyBudget',
                  'numeric',
                  6,
                )}

                {isEditing && (
                  <View style={styles.buttonRow}>
                    {/* <Pressable
                    style={styles.cancelButton}
                    onPress={() => {
                      setIsEditing(false);
                      // Reset to original values
                      if (currentUser) {
                        setUserData({
                          name: currentUser.name || '',
                          email: currentUser.email || '',
                          phone: currentUser.phone || '',
                          monthlyBudget:
                            currentUser.monthlyBudget?.toString() || '',
                          profileImage: currentUser.profileImage || '',
                        });
                      }
                    }}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </Pressable> */}
                    <Pressable
                      style={styles.saveChangesButton}
                      onPress={handleSave}>
                      <Text style={styles.saveChangesButtonText}>
                        Save Changes
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>

              {/* Security Section */}
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Security</Text>
                  <TouchableOpacity
                    onPress={() => setIsChangingPin(!isChangingPin)}
                    style={styles.editButton}>
                    <Shield size={20} color="#F4C66A" />
                    <Text style={styles.editButtonText}>
                      {isChangingPin ? 'Cancel' : 'Change PIN'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {isChangingPin ? (
                  <>
                    {renderPinInput(
                      'Current PIN',
                      pinData.oldPin,
                      showOldPin,
                      setShowOldPin,
                      'oldPin',
                    )}
                    {renderPinInput(
                      'New PIN',
                      pinData.newPin,
                      showNewPin,
                      setShowNewPin,
                      'newPin',
                    )}
                    {renderPinInput(
                      'Confirm New PIN',
                      pinData.confirmPin,
                      showConfirmPin,
                      setShowConfirmPin,
                      'confirmPin',
                    )}

                    <Pressable
                      style={styles.changePinButton}
                      onPress={handleChangePin}>
                      <Text style={styles.changePinButtonText}>Update PIN</Text>
                    </Pressable>
                  </>
                ) : (
                  <View style={styles.securityInfo}>
                    <View style={styles.securityItem}>
                      <Shield size={20} color="#4ECDC4" />
                      <Text style={styles.securityText}>
                        Your account is secured with a 4-digit PIN
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              {/* App Control Section */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Account</Text>
                <View style={styles.appControlGrid}>
                  <TouchableOpacity
                    style={styles.appControlItem}
                    onPress={() => _showToast('Coming Soon', 'info')}>
                    <View
                      style={[
                        styles.controlIcon,
                        {backgroundColor: 'rgba(168, 85, 247, 0.2)'},
                      ]}>
                      <Bell size={24} color="#A855F7" />
                    </View>
                    <Text style={styles.controlLabel}>Notifications</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.appControlItem}
                    onPress={handleLogout}>
                    <View
                      style={[
                        styles.controlIcon,
                        {backgroundColor: 'rgba(255, 107, 107, 0.2)'},
                      ]}>
                      <LogOut size={24} color="#FF6B6B" />
                    </View>
                    <Text style={styles.controlLabel}>Logout</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAwareScrollView>
          <AppModal
            visible={showLogoutModal}
            type="error"
            title="Logout"
            message="Are you sure you want to logout?"
            cancelText="Cancel"
            confirmText="Logout"
            onClose={() => setShowLogoutModal(false)}
            onConfirm={() => {
              setShowLogoutModal(false);
              dispatch(logoutUser());
              navigation.reset({
                index: 0,
                routes: [{name: NavigationKeys.WelcomeScreen}],
              });
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
    flexGrow: 1,
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
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    alignSelf: 'center',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#F97316',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#F97316',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  sectionContainer: {
    backgroundColor: '#1F1D3A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  editButtonText: {
    color: '#F4C66A',
    fontSize: 14,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  inputLabel: {
    color: '#F4C66A',
    fontSize: 14,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    color: '#fff',
    fontSize: 16,
  },
  pinInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  pinInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 12,
  },
  eyeButton: {
    padding: 8,
  },
  inputValue: {
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
  },
  saveChangesButton: {
    flex: 1,
    backgroundColor: '#F97316',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginLeft: 10,
  },
  saveChangesButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  changePinButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  changePinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  securityInfo: {
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    borderRadius: 12,
    padding: 16,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  securityText: {
    color: '#4ECDC4',
    fontSize: 14,
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  appControlGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  appControlItem: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  controlIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  controlLabel: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});
