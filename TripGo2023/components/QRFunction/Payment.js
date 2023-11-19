import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { updateDoc, firestoreDB, doc } from '../../firebaseConfig';

const PaymentScreen = ({ route }) => {
  const { qrValue } = route.params;
  const navigation = useNavigation();

  const [paymentAmount, setPaymentAmount] = useState('');
  const [isValidAmount, setIsValidAmount] = useState(true);

  const handlePayment = async () => {
    const qrData = JSON.parse(qrValue.replace(/\\/g, ''));
    const uid = qrData.userId;
    const userPoints = qrData.points;
    const qrEntryTime = new Date(qrData.entryTime); // Convert QR entryTime to Date object
    const currentTime = new Date(); // Get current time
    const timeDifference = currentTime - qrEntryTime; // Calculate time difference in milliseconds

    const parsedAmount = parseFloat(paymentAmount);

    // Check if the QR code was generated within the last 3 minutes and the payment amount is valid
    if (timeDifference <= 180000 && parsedAmount <= userPoints && parsedAmount > 0) {
      const updatedPoints = userPoints - parsedAmount;

      // Update user document
      const userDocRef = doc(firestoreDB, 'userInfo', uid);
      try {
        await updateDoc(userDocRef, { point: updatedPoints });
        Alert.alert('Success', 'Payment processed successfully.');
        navigation.navigate('main'); // Replace 'main' with the actual route you wish to navigate to
      } catch (error) {
        console.error('Error updating points:', error);
        Alert.alert('Error', 'An error occurred while updating the points.');
      }
    } else {
      // Provide feedback on why the payment was invalid
      const errorMessage = timeDifference > 180000 ?
        'QR code has expired. Please generate a new code.' :
        'Enter an amount less than or equal to your points and that is a positive number.';
      Alert.alert('Payment Invalid', errorMessage);
      setIsValidAmount(false);
    }
  };

  return (
    <View>
      <Text>Scanned QR code points: {qrValue.points}, User ID: {qrValue.userId}</Text>
      <TextInput
        placeholder="Enter payment amount"
        keyboardType="numeric"
        value={paymentAmount}
        onChangeText={(text) => {
          setPaymentAmount(text);
          setIsValidAmount(true); // Reset validation state when user changes input
        }}
      />
      {!isValidAmount && (
        <Text>
          Payment invalid. Please make sure the QR code is within 3 minutes old and the payment amount does not exceed your points.
        </Text>
      )}
      <Button title="Payment" onPress={handlePayment} />
    </View>
  );
};

export default PaymentScreen;
