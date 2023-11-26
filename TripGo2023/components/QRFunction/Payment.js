import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert ,StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { updateDoc, firestoreDB, doc } from '../../firebaseConfig';

const PaymentScreen = ({ route }) => {
  const { qrValue } = route.params;
  const navigation = useNavigation();
  const qrData = JSON.parse(qrValue.replace(/\\/g, ''));
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isValidAmount, setIsValidAmount] = useState(true);

  const handlePayment = async () => {
    
    const uid = qrData.userId;
    const userPoints = qrData.points;
    const qrEntryTime = new Date(qrData.entryTime); // Convert QR entryTime to Date object
    const currentTime = new Date(); // Get current time
    const timeDifference = currentTime - qrEntryTime; // Calculate time difference in milliseconds

    const parsedAmount = parseFloat(paymentAmount);

    // Check if the QR code was generated within the last 3 minutes and the payment amount is valid
    if (timeDifference <= 180000 && timeDifference >= 0 && parsedAmount <= userPoints && parsedAmount > 0) {
      const updatedPoints = userPoints - parsedAmount;

      // Update user document
      const userDocRef = doc(firestoreDB, 'userInfo', uid);
      try {
        await updateDoc(userDocRef, { point: updatedPoints });
        Alert.alert('결제 성공');
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
    <View style={styles.container}>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsText}>사용자의 보유 points: {qrData.points}</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter payment amount"
        keyboardType="numeric"
        value={paymentAmount}
        onChangeText={(text) => {
          setPaymentAmount(text);
          setIsValidAmount(true);
        }}
      />
      
      {!isValidAmount && (
        <Text style={styles.errorText}>
          Payment invalid. Please ensure the QR code is within 3 minutes old and the payment amount does not exceed your points.
        </Text>
      )}
      
      <TouchableOpacity style={styles.paymentButton} onPress={handlePayment}>
        <Text style={styles.paymentButtonText}>Process Payment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f7f7f7',
  },
  detailsContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  detailsText: {
    fontSize: 16,
    marginVertical: 5,
  },
  input: {
    fontSize: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    backgroundColor: 'white',
    marginBottom: 15,
  },
  errorText: {
    fontSize: 14,
    color: 'red',
    marginBottom: 15,
  },
  paymentButton: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 5,
    backgroundColor: '#007bff',
    alignItems: 'center',
  },
  paymentButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PaymentScreen;