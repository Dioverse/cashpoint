// ActionCard.js
import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';

const ActionCard = ({ title, description, icon, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: '#3432a830',
        width: '48%',
        borderRadius: 12,
        padding: 13,
        marginBottom: 12,
        justifyContent: 'center',
        alignItems: 'center', // Center the content
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: '#3C3ADD',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        {icon}
      </View>
      <Text
        style={{
          color: '#000',
          fontWeight: 'bold',
          marginBottom: 4,
          textAlign: 'center', // Ensure text is centered
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          color: '#000',
          fontSize: 14,
          textAlign: 'center', // Ensure text is centered
        }}
      >
        {description}
      </Text>
    </TouchableOpacity>
  );
};

export default ActionCard;
