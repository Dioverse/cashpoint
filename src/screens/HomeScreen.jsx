import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { View, Text, Button } from 'react-native';

export default function HomeScreen({navigation}) {
  return (
    <View className="flex-1 items-center justify-center bg-[#ffffff]">
      <Text className="text-xl font-bold">Home Screen <AntDesign name={'arrowright'} size={24} color={'#000'} /></Text>
      <Button
        title="Go to Other ChangePassword"
        onPress={() => {
          navigation.navigate('Profile', {
            screen: 'ChangePassword', // Navigate to the screen inside OtherTabs
          });
        }}
      />
    </View>
  );
}
