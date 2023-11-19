import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useFocusEffect, useNavigation  } from '@react-navigation/native';
import { firebaseAuth, firestoreDB, doc, getDoc } from '../../firebaseConfig';

const imageSource = require('../../assets/MoneyIcon.png');

const QrGener = () => {
  const navigation = useNavigation();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrValue, setQrValue] = useState('');

  const currentUser = firebaseAuth.currentUser;

  const handlePaymentPress = () => {
    // Handle the payment logic here
    navigation.navigate('QR스캔')
    console.log('Payment button pressed');
  };


  
  useFocusEffect(
    React.useCallback(() => {
      if (currentUser) {
        const entryTime = new Date().toISOString();
        const fetchProfile = async () => {
          try {
            const docRef = doc(firestoreDB, "userInfo", currentUser.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              setProfile({ id: docSnap.id, ...docSnap.data() });
              // Generate QR value including current time
              const newQrValue = JSON.stringify({
                userId: currentUser.uid,
                points: docSnap.data().point,
                entryTime: entryTime,
              });
              setQrValue(newQrValue);
            } else {
              console.log("No such document!");
            }
          } catch (error) {
            console.error('Error fetching profile:', error);
          } finally {
            setLoading(false);
          }
        };

        fetchProfile();
      }
    }, [currentUser])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!currentUser || !profile) {
    return (
      <View style={styles.container}>
        <Text>사용자가 로그인되어 있지 않거나 프로필을 불러올 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      <Image source={imageSource} style={styles.logo} />
      
      <TouchableOpacity onPress={handlePaymentPress} style={styles.paymentButton}>
        <Text style={styles.paymentButtonText}>결제 하기</Text>
      </TouchableOpacity>

      <Text style={styles.title}>보유 포인트: {profile?.point}</Text>
      
      <QRCode value={qrValue} size={200} />
      
      <Text style={styles.subtitle}>{profile?.nickname}님의 QR 코드입니다.</Text>
      {/* Display additional user information if needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    padding:10,
  },
  logo: {
    width: '77%',
    height: '7%',
    marginBottom: 30,
  },

  paymentButton: {
    backgroundColor: '#007bff', // Bootstrap primary blue color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    elevation: 2, // This adds a slight shadow on Android
    shadowOpacity: 0.2, // and these lines add shadow on iOS
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
    marginTop: 20, // Add some space on top of the button
  },
  paymentButtonText: {
    color: '#ffffff', // White text color
    fontSize: 18,
    fontWeight: '600', // Semi-bold text
    textAlign: 'center',
  },

  // ... other styles ...
});

export default QrGener;
