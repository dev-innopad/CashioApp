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

export default function RegisterScreen({navigation}: any) {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    monthlyBudget: '',
    pin: '',
    confirmPin: '',
  });

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name.trim()) {
        _showToast('Please enter your name', 'info');
        return;
      } else if (!formData.email.trim()) {
        _showToast('Please enter your email', 'info');
        return;
      } else if (!formData.phone.trim()) {
        _showToast('Please enter your phone number', 'info');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.monthlyBudget || parseFloat(formData.monthlyBudget) <= 0) {
        _showToast('Please enter a valid monthly budget', 'info');
        return;
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleRegister = () => {
    if (!formData.pin || formData.pin.length !== 4) {
      _showToast('Please enter a valid 4-digit PIN', 'info');
      return;
    }

    if (formData.pin !== formData.confirmPin) {
      _showToast('PINs do not match', 'info');
      return;
    }

    // Register user
    dispatch(
      registerUser({
        name: formData.name,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        monthlyBudget: parseFloat(formData.monthlyBudget),
        pin: formData.pin,
      }),
    );

    // Alert.alert('Success', 'Account created successfully!', [
    //   {text: 'OK', onPress: () => navigation.replace('PinScreen')},
    // ]);
    _showToast('Account created successfully!', 'success');
    navigation.replace('PinScreen');
  };

  const renderStep1 = () => (
    <>
      <Text style={styles.stepTitle}>Personal Information</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="rgba(255, 255, 255, 0.5)"
        value={formData.name}
        onChangeText={text => setFormData({...formData, name: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="rgba(255, 255, 255, 0.5)"
        value={formData.email}
        onChangeText={text => setFormData({...formData, email: text})}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="rgba(255, 255, 255, 0.5)"
        value={formData.phone}
        maxLength={10}
        onChangeText={text => setFormData({...formData, phone: text})}
        keyboardType="phone-pad"
      />
    </>
  );

  const renderStep2 = () => (
    <>
      <Text style={styles.stepTitle}>Monthly Budget</Text>
      <Text style={styles.stepDescription}>
        Set your monthly budget to start tracking expenses
      </Text>
      <View style={styles.budgetInputContainer}>
        <Text style={styles.currencySymbol}>$</Text>
        <TextInput
          style={[styles.input, styles.budgetInput]}
          placeholder="0.00"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={formData.monthlyBudget}
          onChangeText={text => setFormData({...formData, monthlyBudget: text})}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.budgetSuggestions}>
        <TouchableOpacity
          style={styles.budgetSuggestion}
          onPress={() => setFormData({...formData, monthlyBudget: '1000'})}>
          <Text style={styles.budgetSuggestionText}>$1,000</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.budgetSuggestion}
          onPress={() => setFormData({...formData, monthlyBudget: '2500'})}>
          <Text style={styles.budgetSuggestionText}>$2,500</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.budgetSuggestion}
          onPress={() => setFormData({...formData, monthlyBudget: '5000'})}>
          <Text style={styles.budgetSuggestionText}>$5,000</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderStep3 = () => (
    <>
      <Text style={styles.stepTitle}>Set Security PIN</Text>
      <Text style={styles.stepDescription}>
        Create a 4-digit PIN to secure your account
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter 4-digit PIN"
        placeholderTextColor="rgba(255, 255, 255, 0.5)"
        value={formData.pin}
        onChangeText={text => setFormData({...formData, pin: text})}
        keyboardType="numeric"
        secureTextEntry
        maxLength={4}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm PIN"
        placeholderTextColor="rgba(255, 255, 255, 0.5)"
        value={formData.confirmPin}
        onChangeText={text => setFormData({...formData, confirmPin: text})}
        keyboardType="numeric"
        secureTextEntry
        maxLength={4}
      />
    </>
  );

  return (
    <LinearGradient colors={['#141326', '#24224A']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView}>
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

          <View style={styles.formContainer}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}

            <TouchableOpacity
              style={styles.nextButton}
              onPress={step === 3 ? handleRegister : handleNext}>
              <Text style={styles.nextButtonText}>
                {step === 3 ? 'Create Account' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  stepDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 32,
    lineHeight: 24,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
  },
  budgetInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginBottom: 24,
  },
  currencySymbol: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 16,
  },
  budgetInput: {
    flex: 1,
    marginBottom: 0,
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
    fontSize: 16,
    fontWeight: '600',
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
    fontSize: 18,
    fontWeight: 'bold',
  },
});
