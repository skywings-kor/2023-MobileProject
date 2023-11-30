import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { firestoreDB, collection, query, where, getDocs,firebaseAuth } from '../../firebaseConfig'; // Ensure these are correctly imported

const PaymentHistoryScreen = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  useEffect(() => {
    const fetchPaymentHistory = async () => {
      const uid = firebaseAuth.currentUser; // Replace with the user's UID
      const billRef = collection(firestoreDB, 'User_Receipt', uid.uid, 'bill');

      try {
        const querySnapshot = await getDocs(billRef);
        const history = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPaymentHistory(history);
      } catch (error) {
        console.error('Error fetching payment history:', error);
      }
    };

    fetchPaymentHistory();
  }, []);

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionType}>{item.type === 0 ? '결제' : '환불'},</Text>
      <Text style={styles.transactionPoints}>{item.sellerNickname},</Text>
      <Text style={styles.transactionPoints}>{item.amount} points,</Text>
      <Text style={styles.transactionPoints}>{item.randomNumber} ,</Text>
      <Text style={styles.transactionDate}>{item.timestamp.toDate().toISOString().split('T')[0]}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment History</Text>
      <FlatList
        data={paymentHistory}
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
  transactionDate: {
    fontSize: 14,
    color: '#666',
  },
});

export default PaymentHistoryScreen;
