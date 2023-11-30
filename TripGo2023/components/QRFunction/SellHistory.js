import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList ,TouchableOpacity,TextInput,Alert} from 'react-native';
import { firestoreDB, collection, getDoc,getDocs, firebaseAuth ,doc,updateDoc} from '../../firebaseConfig'; // Ensure these are correctly imported
import { useFocusEffect } from '@react-navigation/native';
const SellHistoryScreen = () => {
  const [sellHistory, setSellHistory] = useState([]);
  const [refundRandomNumber, setRefundRandomNumber] = useState('');
  const fetchSellHistory = async () => {
    const uid = firebaseAuth.currentUser.uid;
    const sellBillRef = collection(firestoreDB, 'User_Receipt', uid, 'sellbill');

    try {
      const querySnapshot = await getDocs(sellBillRef);
      const history = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSellHistory(history);
    } catch (error) {
      console.error('Error fetching sell history:', error);
    }
  };

  useEffect(() => {
    fetchSellHistory();
  }, []);

  const processRefund = async (item) => {
    if (refundRandomNumber.toString() === item.randomNumber.toString()) {
      // Update transaction status to '환불' in seller's record
      const sellerTransactionRef = doc(firestoreDB, 'User_Receipt', item.sellerUid, 'sellbill', item.id);
      await updateDoc(sellerTransactionRef, { type: 1 }); // 1 for refund
  
      // Update buyer's points
      const buyerRef = doc(firestoreDB, 'userInfo', item.buyerUid);
      const buyerDoc = await getDoc(buyerRef);
      if (buyerDoc.exists()) {
        const updatedPoints = buyerDoc.data().point + item.amount;
        await updateDoc(buyerRef, { point: updatedPoints });
      }
  
      // Update transaction status to '환불' in buyer's record
      const buyerBillRef = collection(firestoreDB, 'User_Receipt', item.buyerUid, 'bill');
      const buyerBillSnapshot = await getDocs(buyerBillRef);
      const buyerTransactionDoc = buyerBillSnapshot.docs.find(doc => doc.data().randomNumber === item.randomNumber);
  
      if (buyerTransactionDoc) {
        const buyerTransactionRef = doc(firestoreDB, 'User_Receipt', item.buyerUid, 'bill', buyerTransactionDoc.id);
        await updateDoc(buyerTransactionRef, { type: 1 }); // 1 for refund
      }
  
      Alert.alert('환불 성공', 'Refund successful.');
      fetchSellHistory();
    } else {
      Alert.alert('환불 실패', 'Incorrect random number.');
    }
  };
  
  useFocusEffect(
    React.useCallback(() => {
      fetchSellHistory();
    }, [])
  );
  
  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionType}>{item.type === 0 ? '판매' : '환불'}</Text>
      <Text style={styles.transactionPoints}>{item.buyerNickname},</Text>
      <Text style={styles.transactionPoints}>{item.amount} points</Text>
      <Text style={styles.transactionRandomNumber}>{item.randomNumber}</Text>
      <Text style={styles.transactionDate}>{item.timestamp.toDate().toISOString().split('T')[0]}</Text>
      {item.type === 0 && ( // Show refund button only for sales
      <TouchableOpacity onPress={() => processRefund(item)}>
          <Text style={styles.refundButtonText}>환불</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sell History</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Random Number for Refund"
        keyboardType="numeric"
        value={refundRandomNumber}
        onChangeText={setRefundRandomNumber}
      />
      <FlatList
        data={sellHistory}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  transactionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '500',
  },
  transactionPoints: {
    fontSize: 16,
  },
  transactionRandomNumber: {
    fontSize: 16,
    color: '#666',
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  refundButtonText: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default SellHistoryScreen;
