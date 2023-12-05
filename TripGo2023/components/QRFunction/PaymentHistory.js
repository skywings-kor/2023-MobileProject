import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { firestoreDB, collection, query, where, getDocs,firebaseAuth,onSnapshot } from '../../firebaseConfig'; // Ensure these are correctly imported

const PaymentHistoryScreen = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  useEffect(() => {
    const uid = firebaseAuth.currentUser; // 사용자 UID 사용
    const billRef = collection(firestoreDB, 'User_Receipt', uid.uid, 'bill');

    const unsubscribe = onSnapshot(billRef, (querySnapshot) => {
      const history = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPaymentHistory(history);
    }, (error) => {
      console.error('Error fetching payment history:', error);
    });

    return () => unsubscribe(); // 컴포넌트 언마운트 시 구독 해제
  }, []);

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionType}>{item.type === 0 ? '결제' : '환불'}</Text>
      <Text style={styles.transactionPoints}>{item.sellerNickname}</Text>
      <Text style={styles.transactionPoints}>{item.amount} points</Text>
      <Text style={styles.transactionPoints}>{item.randomNumber} </Text>
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
    // flexDirection 변경: 'row' -> 'column'
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  transactionType: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5, // 추가된 여백
  },
  transactionPoints: {
    fontSize: 14, // 텍스트 크기 감소
    marginBottom: 5, // 추가된 여백
  },
  transactionDate: {
    fontSize: 12, // 텍스트 크기 감소
    color: '#666',
  },
});

export default PaymentHistoryScreen;
