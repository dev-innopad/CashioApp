// screens/auth/CheckUserScreen.tsx
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Mail, Phone, ArrowRight, Shield} from 'lucide-react-native';
import {useDispatch, useSelector} from 'react-redux';
import {checkUserExists} from '../../store/reducers/userData.slice';
import {_showToast} from '../../services/UIs/ToastConfig';
import {NavigationKeys} from '../../constants/navigationKeys';

export default function CheckUserScreen({navigation}: any) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'email' | 'phone'>(
    'email',
  );
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  // Change from state.auth to state.userData
  const userExists = useSelector((state: any) => state.userData.userExists);
  const users = useSelector((state: any) => state.userData.users);

  const handleContinue = () => {
    // Validate input
    if (selectedMethod === 'email' && !email.trim()) {
      _showToast('Please enter your email', 'error');
      return;
    }

    if (selectedMethod === 'phone' && !phone.trim()) {
      _showToast('Please enter your phone number', 'error');
      return;
    }

    // Validate email format
    if (selectedMethod === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        _showToast('Please enter a valid email address', 'error');
        return;
      }
    }

    // Validate phone format (basic validation)
    if (selectedMethod === 'phone' && phone.length < 10) {
      _showToast('Please enter a valid phone number', 'error');
      return;
    }

    setLoading(true);

    // Check if user exists in Redux
    const userExists = checkIfUserExists();

    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);

      if (userExists) {
        // User is registered - proceed to PIN screen for login
        _showToast('Account found! Enter your PIN', 'success');
        navigation.navigate('PinScreen', {
          [selectedMethod === 'email' ? 'email' : 'phone']:
            selectedMethod === 'email' ? email : phone,
          method: selectedMethod,
          isExistingUser: true,
        });
      } else {
        // User is not registered - show message
        if (selectedMethod === 'email') {
          _showToast(
            'No account found with this email. Please sign up.',
            'info',
          );
        } else {
          _showToast(
            'No account found with this phone number. Please sign up.',
            'info',
          );
        }

        // Option 1: Navigate to signup screen
        // navigation.navigate('SignupScreen', {
        //   [selectedMethod === 'email' ? 'email' : 'phone']:
        //     selectedMethod === 'email' ? email : phone,
        //   method: selectedMethod,
        // });

        // Option 2: Navigate to PIN screen for new registration
        navigation.navigate(NavigationKeys.RegisterScreen);
      }
    }, 800);
  };

  // Function to check if user exists in Redux
  const checkIfUserExists = () => {
    if (selectedMethod === 'email') {
      // Check if any user has this email
      const exists = users.some(
        (user: any) =>
          user.email && user.email.toLowerCase() === email.toLowerCase(),
      );
      return exists;
    } else {
      // Check if any user has this phone
      // Remove any non-digit characters for comparison
      const cleanPhone = phone.replace(/\D/g, '');
      const exists = users.some((user: any) => {
        if (!user.phone) return false;
        const cleanUserPhone = user.phone.replace(/\D/g, '');
        return cleanUserPhone === cleanPhone;
      });
      return exists;
    }
  };

  const handleContinueAlternative = () => {
    if (selectedMethod === 'email' && !email.trim()) {
      // Show error
      return;
    }

    if (selectedMethod === 'phone' && !phone.trim()) {
      // Show error
      return;
    }

    setLoading(true);

    // Check directly without Redux
    const exists = checkIfUserExists();

    setTimeout(() => {
      setLoading(false);

      navigation.navigate('PinScreen', {
        [selectedMethod === 'email' ? 'email' : 'phone']:
          selectedMethod === 'email' ? email : phone,
        method: selectedMethod,
        isExistingUser: exists,
      });
    }, 500);
  };

  return (
    <LinearGradient colors={['#141326', '#24224A']} style={{flex: 1}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Shield size={32} color="#F4C66A" />
            </View>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>
              Enter your email or phone to continue
            </Text>
          </View>

          {/* Method Selector */}
          <View style={styles.methodSelector}>
            <TouchableOpacity
              style={[
                styles.methodButton,
                selectedMethod === 'email' && styles.methodButtonActive,
              ]}
              onPress={() => setSelectedMethod('email')}>
              <Mail
                size={20}
                color={selectedMethod === 'email' ? '#F4C66A' : '#999'}
              />
              <Text
                style={[
                  styles.methodText,
                  selectedMethod === 'email' && styles.methodTextActive,
                ]}>
                Email
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.methodButton,
                selectedMethod === 'phone' && styles.methodButtonActive,
              ]}
              onPress={() => setSelectedMethod('phone')}>
              <Phone
                size={20}
                color={selectedMethod === 'phone' ? '#F4C66A' : '#999'}
              />
              <Text
                style={[
                  styles.methodText,
                  selectedMethod === 'phone' && styles.methodTextActive,
                ]}>
                Phone
              </Text>
            </TouchableOpacity>
          </View>

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            {selectedMethod === 'email' ? (
              <View style={styles.inputWrapper}>
                <Mail size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#666"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            ) : (
              <View style={styles.inputWrapper}>
                <Phone size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#666"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            )}
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={[
              styles.continueButton,
              loading && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue} // Use the alternative approach
            disabled={loading}>
            <Text style={styles.continueButtonText}>
              {loading ? 'Checking...' : 'Continue'}
            </Text>
            <ArrowRight size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(244, 198, 106, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  methodSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  methodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  methodButtonActive: {
    backgroundColor: '#1F1D3A',
  },
  methodText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '600',
  },
  methodTextActive: {
    color: '#F4C66A',
  },
  inputContainer: {
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  continueButton: {
    flexDirection: 'row',
    backgroundColor: '#F4C66A',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  continueButtonDisabled: {
    opacity: 0.7,
  },
  continueButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '700',
  },
});
