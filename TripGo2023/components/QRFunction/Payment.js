import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert ,StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firestoreDB, doc, updateDoc, addDoc, collection,firebaseAuth } from '../../firebaseConfig'; // Ensure these are correctly imported from your Firebase setup file

const PaymentScreen = ({ route }) => {
  const { qrValue } = route.params;
  const navigation = useNavigation();
  const qrData = JSON.parse(qrValue.replace(/\\/g, ''));
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isValidAmount, setIsValidAmount] = useState(true);

  const generateRandomNumber = ()=> {
    const min = 1000;
    const max = 9999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  const randomNumber = generateRandomNumber();
  

  const handlePayment = async () => {
    const uid = qrData.userId; // Buyer's UID
    const userPoints = qrData.points;
    const qrEntryTime = new Date(qrData.entryTime);
    const currentTime = new Date();
    const timeDifference = currentTime - qrEntryTime;
    const seller= firebaseAuth.currentUser; 

    const parsedAmount = parseFloat(paymentAmount);
  
    if (timeDifference <= 180000 && timeDifference >= 0 && parsedAmount <= userPoints && parsedAmount > 0) {
      const updatedPoints = userPoints - parsedAmount;
      const userDocRef = doc(firestoreDB, 'userInfo', uid);
  
      try {
        await updateDoc(userDocRef, { point: updatedPoints });
  
        const sellerUid = seller.uid // Replace with actual seller UID
        // Create a reference to the buyer's bill subcollection
        const buyerBillRef = collection(firestoreDB, 'User_Receipt', uid, 'bill');
        // If necessary, also create a reference to the seller's sellbill subcollection
        const sellerSellBillRef = collection(firestoreDB, 'User_Receipt', sellerUid, 'sellbill');
  
        const paymentTimestamp = currentTime; // Or firebase.firestore.Timestamp.fromDate(new Date())
        const buyerReceiptData = {
          buyerUid: uid,
          sellerUid: sellerUid,
          amount: parsedAmount,
          timestamp: paymentTimestamp,
          type: 0, // 0 for payment
          randomNumber: randomNumber
        };
        // Similarly, create a data object for the seller's receipt
        const sellerReceiptData = {
          buyerUid: uid,
          sellerUid: sellerUid,
          amount: parsedAmount,
          timestamp: paymentTimestamp,
          randomNumber: randomNumber,
          type: 0 // 0 for payment
        };
  
        // Add the buyer's receipt to their bill subcollection
        await addDoc(buyerBillRef, buyerReceiptData);
        // If necessary, add the seller's receipt to their sellbill subcollection
        await addDoc(sellerSellBillRef, sellerReceiptData);
  
        Alert.alert('결제 성공', 'Payment was successful.');
        navigation.goBack(); // Or navigate to the desired screen
      } catch (error) {
        console.error('Error updating points or creating receipt:', error);
        Alert.alert('Error', 'An error occurred while processing the payment.');
      }
    } else {
      const errorMessage = timeDifference > 180000
        ? 'QR code has expired. Please generate a new code.'
        : 'Enter an amount less than or equal to your points and that is a positive number.';
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