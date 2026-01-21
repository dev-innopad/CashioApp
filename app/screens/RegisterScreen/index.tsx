// screens/RegisterScreen.tsx
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch} from 'react-redux';
import {registerUser} from '../../store/reducers/userData.slice';
import {_showToast} from '../../services/UIs/ToastConfig';
import {AppFonts, FontSize} from '../../assets/fonts';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {Eye, EyeOff} from 'lucide-react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const Step1Schema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name is too long')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
});

const Step2Schema = Yup.object().shape({
  monthlyBudget: Yup.number()
    .typeError('Budget must be a number')
    .min(100, 'Budget must be at least $100')
    .max(1000000, 'Budget cannot exceed $1,000,000')
    .required('Monthly budget is required'),
});

const Step3Schema = Yup.object().shape({
  pin: Yup.string()
    .matches(/^[0-9]{4}$/, 'PIN must be exactly 4 digits')
    .required('PIN is required'),
  confirmPin: Yup.string()
    .oneOf([Yup.ref('pin')], 'PINs must match')
    .required('Confirm PIN is required'),
});

export default function RegisterScreen({navigation}: any) {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);

  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  // Initial form values
  const initialValues = {
    name: '',
    email: '',
    phone: '',
    monthlyBudget: '',
    pin: '',
    confirmPin: '',
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    monthlyBudget: '',
    pin: '',
    confirmPin: '',
  });

  const handleNext = (values: any, errors: any, touched: any) => {
    if (step === 1) {
      // Validate step 1
      Step1Schema.validate(values, {abortEarly: false})
        .then(() => {
          setStep(2);
        })
        .catch((validationError: Yup.ValidationError) => {
          // Show first error
          const firstError = validationError.errors[0];
          _showToast(firstError, 'info');
        });
    } else if (step === 2) {
      // Validate step 2
      Step2Schema.validate(values, {abortEarly: false})
        .then(() => {
          setStep(3);
        })
        .catch((validationError: Yup.ValidationError) => {
          const firstError = validationError.errors[0];
          _showToast(firstError, 'info');
        });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  const getValidationSchema = () => {
    switch (step) {
      case 1:
        return Step1Schema;
      case 2:
        return Step2Schema;
      case 3:
        return Step3Schema;
      default:
        return Step1Schema;
    }
  };

  const handleRegister = (values: any) => {
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    dispatch(
      registerUser({
        name: values.name,
        email: values.email,
        phone: values.phone,
        monthlyBudget: Number(values.monthlyBudget),
        pin: values.pin,
      }),
    );

    _showToast('Account created successfully!', 'success');
    navigation.replace('PinScreen');
  };

  const renderStep1 = (props: any) => (
    <>
      <Text style={styles.stepTitle}>Personal Information</Text>

      <View style={styles.fieldWrapper}>
        <TextInput
          style={[
            styles.input,
            props.touched.name && props.errors.name && styles.inputError,
          ]}
          placeholder="Full Name"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={props.values.name}
          onChangeText={props.handleChange('name')}
          onBlur={props.handleBlur('name')}
        />

        {props.touched.name && props.errors.name && (
          <Text style={styles.errorText}>{props.errors.name}</Text>
        )}
      </View>

      <View style={styles.fieldWrapper}>
        <TextInput
          style={[
            styles.input,
            props.touched.email && props.errors.email && styles.inputError,
          ]}
          placeholder="Email"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={props.values.email}
          onChangeText={props.handleChange('email')}
          onBlur={props.handleBlur('email')}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {props.touched.email && props.errors.email && (
          <Text style={styles.errorText}>{props.errors.email}</Text>
        )}
      </View>

      <View style={styles.fieldWrapper}>
        <TextInput
          style={[
            styles.input,
            props.touched.phone && props.errors.phone && styles.inputError,
          ]}
          placeholder="Phone Number"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={props.values.phone}
          maxLength={10}
          onChangeText={props.handleChange('phone')}
          onBlur={props.handleBlur('phone')}
          keyboardType="phone-pad"
          returnKeyType="done"
          enablesReturnKeyAutomatically={true}
        />

        {props.touched.phone && props.errors.phone && (
          <Text style={styles.errorText}>{props.errors.phone}</Text>
        )}
      </View>
    </>
  );

  const renderStep2 = (props: any) => (
    <>
      <Text style={styles.stepTitle}>Monthly Budget</Text>
      <Text style={styles.stepDescription}>
        Set your monthly budget to start tracking expenses
      </Text>
      <View style={[styles.budgetInputContainer]}>
        <Text style={styles.currencySymbol}>$</Text>
        <TextInput
          style={[styles.budgetInput]}
          placeholder="0.00"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={props.values.monthlyBudget}
          onChangeText={props.handleChange('monthlyBudget')}
          onBlur={props.handleBlur('monthlyBudget')}
          keyboardType="numeric"
          returnKeyType="done"
          enablesReturnKeyAutomatically={true}
        />
      </View>
      {props.touched.monthlyBudget && props.errors.monthlyBudget && (
        <Text style={styles.errorText}>{props.errors.monthlyBudget}</Text>
      )}

      <View style={styles.budgetSuggestions}>
        <TouchableOpacity
          style={styles.budgetSuggestion}
          onPress={() => props.setFieldValue('monthlyBudget', '1000')}>
          <Text style={styles.budgetSuggestionText}>$ 1,000</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.budgetSuggestion}
          onPress={() => props.setFieldValue('monthlyBudget', '2500')}>
          <Text style={styles.budgetSuggestionText}>$ 2,500</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.budgetSuggestion}
          onPress={() => props.setFieldValue('monthlyBudget', '5000')}>
          <Text style={styles.budgetSuggestionText}>$ 5,000</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderStep3 = (props: any) => (
    <>
      <Text style={styles.stepTitle}>Set Security PIN</Text>
      <Text style={styles.stepDescription}>
        Create a 4-digit PIN to secure your account
      </Text>

      {/* PIN */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.input,
            props.touched.pin && props.errors.pin && styles.inputError,
            {paddingRight: 48},
          ]}
          placeholder="Enter 4-digit PIN"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={props.values.pin}
          onChangeText={props.handleChange('pin')}
          onBlur={props.handleBlur('pin')}
          keyboardType="numeric"
          secureTextEntry={!showPin} // 🔥 FIX
          maxLength={4}
          returnKeyType="done"
          enablesReturnKeyAutomatically={true}
        />

        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPin(prev => !prev)}
          hitSlop={10}>
          {showPin ? (
            <EyeOff size={20} color="rgba(255, 255, 255, 0.7)" />
          ) : (
            <Eye size={20} color="rgba(255, 255, 255, 0.7)" />
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.errorText}>
        {props.touched.pin && props.errors.pin ? props.errors.pin : ' '}
      </Text>

      {/* CONFIRM PIN */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.input,
            props.touched.confirmPin &&
              props.errors.confirmPin &&
              styles.inputError,
            {paddingRight: 48},
          ]}
          placeholder="Confirm PIN"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={props.values.confirmPin}
          onChangeText={props.handleChange('confirmPin')}
          onBlur={props.handleBlur('confirmPin')}
          keyboardType="numeric"
          secureTextEntry={!showConfirmPin} // 🔥 FIX
          maxLength={4}
          returnKeyType="done"
          enablesReturnKeyAutomatically={true}
        />

        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowConfirmPin(prev => !prev)}
          hitSlop={10}>
          {showConfirmPin ? (
            <EyeOff size={20} color="rgba(255, 255, 255, 0.7)" />
          ) : (
            <Eye size={20} color="rgba(255, 255, 255, 0.7)" />
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.errorText}>
        {props.touched.confirmPin && props.errors.confirmPin
          ? props.errors.confirmPin
          : ' '}
      </Text>
    </>
  );

  return (
    <LinearGradient colors={['#141326', '#24224A']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAwareScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <View style={styles.stepIndicator}>
              {[1, 2, 3].map(num => (
                <View
                  key={num}
                  style={[
                    styles.stepDot,
                    num === step && styles.stepDotActive,
                    num < step && styles.stepDotCompleted,
                  ]}>
                  {num < step && <Text style={styles.stepCheck}>✓</Text>}
                </View>
              ))}
            </View>
          </View>

          <Formik
            initialValues={initialValues}
            validationSchema={getValidationSchema()}
            validateOnBlur={true}
            validateOnChange={true}
            onSubmit={handleRegister}>
            {formikProps => (
              <View style={styles.formContainer}>
                {step === 1 && renderStep1(formikProps)}
                {step === 2 && renderStep2(formikProps)}
                {step === 3 && renderStep3(formikProps)}

                <TouchableOpacity
                  style={styles.nextButton}
                  // onPress={() => {
                  //   if (step === 3) {
                  //     // Validate step 3 before submission
                  //     Step3Schema.validate(formikProps.values, {
                  //       abortEarly: false,
                  //     })
                  //       .then(() => {
                  //         handleRegister(formikProps.values);
                  //       })
                  //       .catch((validationError: Yup.ValidationError) => {
                  //         const firstError = validationError.errors[0];
                  //         _showToast(firstError, 'info');
                  //       });
                  //   } else {
                  //     handleNext(
                  //       formikProps.values,
                  //       formikProps.errors,
                  //       formikProps.touched,
                  //     );
                  //   }
                  // }}
                  onPress={() => {
                    formikProps.handleSubmit();
                  }}>
                  <Text style={styles.nextButtonText}>
                    {step === 3 ? 'Create Account' : 'Next'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 24,
  },
  stepIndicator: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: '#F4C66A',
  },
  stepDotCompleted: {
    backgroundColor: '#4ECDC4',
  },
  stepCheck: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 24,
    marginTop: 40,
  },
  stepTitle: {
    fontSize: FontSize._28,
    fontFamily: AppFonts.BOLD,
    color: '#fff',
    marginBottom: 16,
  },
  stepDescription: {
    fontSize: FontSize._16,
    fontFamily: AppFonts.REGULAR,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 32,
    lineHeight: 24,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: FontSize._16,
    fontFamily: AppFonts.REGULAR,
    // marginBottom: 16,
  },
  inputError: {
    borderColor: '#FF6B6B',
    borderWidth: 1,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  budgetInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 8,
    marginBottom: 22,
  },
  currencySymbol: {
    color: '#fff',
    fontSize: FontSize._20,
    fontFamily: AppFonts.BOLD,
    paddingHorizontal: 16,
  },
  budgetInput: {
    flex: 1,
    marginBottom: 0,
    color: '#fff',
    fontSize: FontSize._20,
    fontFamily: AppFonts.REGULAR,
  },
  budgetSuggestions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  budgetSuggestion: {
    backgroundColor: 'rgba(244, 198, 106, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(244, 198, 106, 0.3)',
  },
  budgetSuggestionText: {
    color: '#F4C66A',
    fontSize: FontSize._16,
    fontFamily: AppFonts.BOLD,
  },
  nextButton: {
    backgroundColor: '#F4C66A',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  nextButtonText: {
    color: '#000',
    fontSize: FontSize._20,
    fontFamily: AppFonts.MEDIUM,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: FontSize._12,
    fontFamily: AppFonts.REGULAR,
    marginBottom: 12,
    marginTop: 2,
    // bottom: 10,
    marginLeft: 4,
  },
  successText: {
    color: '#4ECDC4',
    fontSize: FontSize._12,
    fontFamily: AppFonts.REGULAR,
    marginTop: 6,
    marginLeft: 8,
  },
  pinInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  pinInput: {
    flex: 1,
    color: '#fff',
    fontSize: FontSize._16,
    fontFamily: AppFonts.REGULAR,
    padding: 16,
  },
  inputWrapper: {
    position: 'relative',
    // marginBottom: 6,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  fieldWrapper: {
    marginBottom: 12,
  },
});
