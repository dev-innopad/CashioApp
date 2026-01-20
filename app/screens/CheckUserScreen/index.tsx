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
import {AppFonts, FontSize} from '../../assets/fonts';
import {windowHeight} from '../../constants/metrics';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {SafeAreaView} from 'react-native-safe-area-context';

const getValidationSchema = (method: 'email' | 'phone') =>
  Yup.object().shape({
    email:
      method === 'email'
        ? Yup.string()
            .email('Enter a valid email address')
            .required('Email is required')
        : Yup.string().notRequired(),

    phone:
      method === 'phone'
        ? Yup.string()
            .matches(/^\d{10}$/, 'Enter a valid 10-digit phone number')
            .required('Phone number is required')
        : Yup.string().notRequired(),
  });

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

  // const handleContinue = () => {
  //   switch (selectedMethod) {
  //     case 'email': {
  //       if (!email.trim()) {
  //         _showToast('Please enter your email', 'error');
  //         return;
  //       }

  //       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //       if (!emailRegex.test(email)) {
  //         _showToast('Please enter a valid email address', 'error');
  //         return;
  //       }
  //       break;
  //     }

  //     case 'phone': {
  //       if (!phone.trim()) {
  //         _showToast('Please enter your phone number', 'error');
  //         return;
  //       }

  //       if (phone.length < 10) {
  //         _showToast('Please enter a valid phone number', 'error');
  //         return;
  //       }
  //       break;
  //     }

  //     default:
  //       return;
  //   }

  //   setLoading(true);
  //   const userExists = checkIfUserExists();

  //   setTimeout(() => {
  //     setLoading(false);

  //     if (userExists) {
  //       _showToast('Account found! Enter your PIN', 'success');

  //       navigation.navigate('PinScreen', {
  //         [selectedMethod === 'email' ? 'email' : 'phone']:
  //           selectedMethod === 'email' ? email : phone,
  //         method: selectedMethod,
  //         isExistingUser: true,
  //       });
  //     } else {
  //       _showToast(
  //         selectedMethod === 'email'
  //           ? 'No account found with this email. Please sign up.'
  //           : 'No account found with this phone number. Please sign up.',
  //         'info',
  //       );

  //       navigation.navigate(NavigationKeys.RegisterScreen);
  //     }
  //   }, 800);
  // };

  const handleContinue = (values: {email: string; phone: string}) => {
    const emailVal = values.email;
    const phoneVal = values.phone;

    setLoading(true);
    const userExists =
      selectedMethod === 'email'
        ? users.some(
            (u: any) =>
              u.email && u.email.toLowerCase() === emailVal.toLowerCase(),
          )
        : users.some(
            (u: any) =>
              u.phone &&
              u.phone.replace(/\D/g, '') === phoneVal.replace(/\D/g, ''),
          );

    setTimeout(() => {
      setLoading(false);

      if (userExists) {
        _showToast('Account found! Enter your PIN', 'success');

        navigation.navigate('PinScreen', {
          [selectedMethod]: selectedMethod === 'email' ? emailVal : phoneVal,
          method: selectedMethod,
          isExistingUser: true,
        });
      } else {
        _showToast(
          selectedMethod === 'email'
            ? 'No account found with this email. Please sign up.'
            : 'No account found with this phone number. Please sign up.',
          'info',
        );

        navigation.navigate(NavigationKeys.RegisterScreen);
      }
    }, 800);
  };

  const checkIfUserExists = () => {
    switch (selectedMethod) {
      case 'email':
        return users.some(
          (user: any) =>
            user.email && user.email.toLowerCase() === email.toLowerCase(),
        );

      case 'phone': {
        const cleanPhone = phone.replace(/\D/g, '');

        return users.some((user: any) => {
          if (!user.phone) return false;
          const cleanUserPhone = user.phone.replace(/\D/g, '');
          return cleanUserPhone === cleanPhone;
        });
      }

      default:
        return false;
    }
  };

  return (
    <LinearGradient colors={['#141326', '#24224A']} style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.topHeader}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.container}>
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
            {/* <View style={styles.inputContainer}>
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
                  maxLength={10}
                />
              </View>
            )}
          </View> */}

            <Formik
              enableReinitialize
              initialValues={{email: '', phone: ''}}
              validationSchema={getValidationSchema(selectedMethod)}
              onSubmit={values => handleContinue(values)}>
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
              }) => (
                <>
                  {/* Input Fields */}
                  <View style={styles.inputContainer}>
                    {selectedMethod === 'email' ? (
                      <>
                        <View
                          style={[
                            styles.inputWrapper,
                            touched.email &&
                              errors.email && {
                                borderColor: 'red',
                                borderWidth: 1,
                              },
                          ]}>
                          <Mail
                            size={20}
                            color="#666"
                            style={styles.inputIcon}
                          />
                          <TextInput
                            style={styles.input}
                            placeholder="Enter your email"
                            placeholderTextColor="#666"
                            value={values.email}
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            keyboardType="email-address"
                            autoCapitalize="none"
                          />
                        </View>

                        {touched.email && errors.email && (
                          <Text style={styles.errorText}>{errors.email}</Text>
                        )}
                      </>
                    ) : (
                      <>
                        <View
                          style={[
                            styles.inputWrapper,
                            touched.phone &&
                              errors.phone && {
                                borderColor: 'red',
                                borderWidth: 1,
                              },
                          ]}>
                          <Phone
                            size={20}
                            color="#666"
                            style={styles.inputIcon}
                          />
                          <TextInput
                            style={styles.input}
                            placeholder="Enter your phone number"
                            placeholderTextColor="#666"
                            value={values.phone}
                            onChangeText={handleChange('phone')}
                            onBlur={handleBlur('phone')}
                            keyboardType="phone-pad"
                            maxLength={10}
                          />
                        </View>

                        {touched.phone && errors.phone && (
                          <Text style={styles.errorText}>{errors.phone}</Text>
                        )}
                      </>
                    )}
                  </View>

                  {/* Continue Button */}
                  <TouchableOpacity
                    style={[
                      styles.continueButton,
                      loading && styles.continueButtonDisabled,
                    ]}
                    onPress={handleSubmit}
                    disabled={loading}>
                    <Text style={styles.continueButtonText}>
                      {loading ? 'Checking...' : 'Continue'}
                    </Text>
                    <ArrowRight size={20} color="#000" />
                  </TouchableOpacity>
                </>
              )}
            </Formik>

            {/* Continue Button */}
            {/* <TouchableOpacity
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
          </TouchableOpacity> */}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingBottom: windowHeight * 0.1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 24,
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
    fontSize: FontSize._40,
    fontFamily: AppFonts.BOLD,
    marginBottom: 8,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: FontSize._20,
    fontFamily: AppFonts.REGULAR,
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
    fontSize: FontSize._18,
    fontFamily: AppFonts.MEDIUM,
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
    fontSize: FontSize._18,
    fontFamily: AppFonts.REGULAR,
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
    fontSize: FontSize._22,
    fontFamily: AppFonts.MEDIUM,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    marginTop: 6,
    marginLeft: 6,
    fontFamily: AppFonts.REGULAR,
  },
});
