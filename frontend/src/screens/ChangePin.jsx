import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

const ChangePin = () => {
  const navigation = useNavigation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(180);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inputRefs = useRef([]);

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = Array(6)
      .fill()
      .map((_, i) => inputRefs.current[i] || React.createRef());
  }, []);

  // Timer countdown effect
  useEffect(() => {
    let interval = null;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(3, '0')}`;
  };

  const handleOtpChange = (text, index) => {
    if (text.length > 1) {
      text = text[text.length - 1];
    }

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto focus to next input
    if (text !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResendOtp = () => {
    if (!canResend) return;

    // Reset the OTP fields
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0].focus();

    // Reset the timer
    setTimer(180);
    setCanResend(false);

    // API call would go here
    // resendOtpApi();
  };

  const handleContinue = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) return;

    setIsLoading(true);

    try {
      // API call would go here
      // await verifyOtpApi(otpValue);

      // Navigate to next screen
      navigation.navigate('ConfirmPin');
      console.log('OTP verified:', otpValue);
    } catch (error) {
      console.error('OTP verification failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>Change PIN</Text>

        <View style={styles.otpContainer}>
          <Text style={styles.labelText}>Confirm OTP</Text>
          <Text style={styles.instructionText}>
            Enter the 6 digit OTP sent to your email:{' '}
            <Text style={styles.emailText}>alex@gmail.com</Text>
          </Text>

          <View style={styles.otpInputContainer}>
            {[0, 1, 2, 3, 4, 5].map(index => (
              <TextInput
                key={index}
                ref={ref => (inputRefs.current[index] = ref)}
                style={styles.otpInput}
                maxLength={1}
                keyboardType="number-pad"
                value={otp[index]}
                onChangeText={text => handleOtpChange(text, index)}
                onKeyPress={e => handleKeyPress(e, index)}
                autoFocus={index === 0}
                selectTextOnFocus
              />
            ))}
          </View>

          <View style={styles.resendContainer}>
            <TouchableOpacity
              onPress={handleResendOtp}
              disabled={!canResend}
              activeOpacity={0.7}>
              <Text
                style={
                  canResend
                    ? styles.resendActiveText
                    : styles.resendInactiveText
                }>
                Resend OTP
              </Text>
            </TouchableOpacity>

            <Text style={styles.timerText}>{formatTime(timer)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            otp.join('').length === 6
              ? styles.buttonActive
              : styles.buttonInactive,
          ]}
          onPress={handleContinue}
          disabled={otp.join('').length !== 6 || isLoading}>
          <Text style={styles.buttonText}>
            {isLoading ? 'Verifying...' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
  },
  otpContainer: {
    marginTop: 32,
  },
  labelText: {
    fontSize: 16,
    color: '#333333',
  },
  instructionText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  emailText: {
    color: '#3B82F6',
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 24,
  },
  otpInput: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resendActiveText: {
    fontSize: 16,
    color: '#3B82F6',
  },
  resendInactiveText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  timerText: {
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  continueButton: {
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonActive: {
    backgroundColor: '#111827',
  },
  buttonInactive: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ChangePin;
