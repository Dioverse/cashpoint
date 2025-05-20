import {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  ArrowLeftIcon,
  XMarkIcon,
  ExclamationCircleIcon,
} from 'react-native-heroicons/outline';
import {SafeAreaView} from 'react-native-safe-area-context';

const Pin = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {phoneNumber, network, amount} = route.params || {};

  const [pin, setPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNumberPress = number => {
    if (pin.length < 4) {
      setPin(prev => prev + number);
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleForgetPin = () => {
    Alert.alert('Reset PIN', 'Would you like to reset your transaction PIN?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Reset PIN', onPress: () => navigation.navigate('ResetPin')},
    ]);
  };

  useEffect(() => {
    if (pin.length === 4) {
      verifyPin();
    }
  }, [pin]);

  const verifyPin = async () => {
    setIsProcessing(true);

    // Simulate PIN verification
    setTimeout(() => {
      setIsProcessing(false);

      const isCorrectPin = true;

      if (isCorrectPin) {
        // Generate transaction data
        const transactionData = {
          id: `202503${Math.floor(Math.random() * 10000000000)}`,
          date: new Date().toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          }),
          phoneNumber: phoneNumber,
          amount: amount,
          amountDeduction: amount * 0.98, // 2% discount
          transactionType: 'Airtime Top up',
        };

        navigation.navigate('Receipt', transactionData);
      } else {
        Alert.alert(
          'Incorrect PIN',
          'The PIN you entered is incorrect. Please try again.',
        );
        setPin('');
      }
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#4B39EF]">
      {/* Header */}
      <View className="flex-row items-center justify-center px-4 py-4 relative">
        <TouchableOpacity
          className="absolute left-4 z-10"
          onPress={() => navigation.goBack()}>
          <ArrowLeftIcon size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold">
          Confirm Payment
        </Text>
      </View>

      {/* Information Icon */}
      <View className="items-center justify-center mt-20 mb-4">
        <View className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
          <ExclamationCircleIcon size={40} color="black" />
        </View>
      </View>

      {/* PIN Instruction */}
      <Text className="text-white text-center text-lg font-medium px-6 mb-12">
        Confirm payment by entering your 4 digit PIN
      </Text>

      {/* PIN Input Display */}
      <View className="rounded-t-3xl bg-white px-6 pt-12 pb-6 flex-1">
        <View className="flex-row justify-center space-x-4 mb-4">
          {[0, 1, 2, 3].map(index => (
            <View
              key={index}
              className="w-16 h-16 border-2 border-gray-300 rounded-lg justify-center items-center">
              {pin.length > index ? (
                <View className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <Text className="text-2xl font-bold">
                    {isProcessing ? '' : '0'}
                  </Text>
                </View>
              ) : null}
            </View>
          ))}
        </View>

        {/* Forget PIN Link */}
        <TouchableOpacity
          className="mb-6 items-center"
          onPress={handleForgetPin}>
          <Text className="text-indigo-600 font-medium">
            Forget Transaction PIN
          </Text>
        </TouchableOpacity>

        {/* Keypad */}
        <View className="flex-row flex-wrap justify-center mt-2">
          {/* Row 1 */}
          <TouchableOpacity
            className="w-[30%] aspect-square bg-gray-100 m-1 rounded-md items-center justify-center"
            onPress={() => handleNumberPress('1')}>
            <Text className="text-3xl font-bold">1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[30%] aspect-square bg-gray-100 m-1 rounded-md items-center justify-center"
            onPress={() => handleNumberPress('2')}>
            <Text className="text-3xl font-bold">2</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[30%] aspect-square bg-gray-100 m-1 rounded-md items-center justify-center"
            onPress={() => handleNumberPress('3')}>
            <Text className="text-3xl font-bold">3</Text>
          </TouchableOpacity>

          {/* Row 2 */}
          <TouchableOpacity
            className="w-[30%] aspect-square bg-gray-100 m-1 rounded-md items-center justify-center"
            onPress={() => handleNumberPress('4')}>
            <Text className="text-3xl font-bold">4</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[30%] aspect-square bg-gray-100 m-1 rounded-md items-center justify-center"
            onPress={() => handleNumberPress('5')}>
            <Text className="text-3xl font-bold">5</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[30%] aspect-square bg-gray-100 m-1 rounded-md items-center justify-center"
            onPress={() => handleNumberPress('6')}>
            <Text className="text-3xl font-bold">6</Text>
          </TouchableOpacity>

          {/* Row 3 */}
          <TouchableOpacity
            className="w-[30%] aspect-square bg-gray-100 m-1 rounded-md items-center justify-center"
            onPress={() => handleNumberPress('7')}>
            <Text className="text-3xl font-bold">7</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[30%] aspect-square bg-gray-100 m-1 rounded-md items-center justify-center"
            onPress={() => handleNumberPress('8')}>
            <Text className="text-3xl font-bold">8</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[30%] aspect-square bg-gray-100 m-1 rounded-md items-center justify-center"
            onPress={() => handleNumberPress('9')}>
            <Text className="text-3xl font-bold">9</Text>
          </TouchableOpacity>

          {/* Row 4 */}
          <TouchableOpacity
            className="w-[49%]  bg-gray-100 m-1 rounded-md items-center justify-center"
            onPress={() => handleNumberPress('0')}>
            <Text className="text-3xl font-bold">0</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[30%] aspect-square bg-gray-100 m-1 rounded-md items-center justify-center"
            onPress={handleDelete}>
            <XMarkIcon size={28} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Pin;
