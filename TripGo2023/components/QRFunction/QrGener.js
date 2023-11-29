import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { firebaseAuth, firestoreDB, doc, getDoc, onSnapshot } from '../../firebaseConfig';

const imageSource = require('../../assets/MoneyIcon.png');

const QrGener = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrValue, setQrValue] = useState('');
  const [entryTime, setEntryTime] = useState(new Date().toISOString());
  const [previousPoint, setPreviousPoint] = useState(null);
  const [isFirstEntry, setIsFirstEntry] = useState(true);

  const currentUser = firebaseAuth.currentUser;

  const handlePaymentPress = () => {
    // Handle the payment logic here
    navigation.navigate('QR스캔');
    console.log('Payment button pressed');
  };

  useEffect(() => {
    if (isFocused) {
      setEntryTime(new Date().toISOString());
    }
  }, [isFocused]);

  useEffect(() => {
    let unsubscribe;

    if (currentUser) {
      const docRef = doc(firestoreDB, 'userInfo', currentUser.uid);
      unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setProfile({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log('No such document!');
        }
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentUser]);

  useEffect(() => {
    if (profile && entryTime) {
      const generateQrValue = () => {
        const newQrValue = JSON.stringify({
          userId: currentUser.uid,
          points: profile?.point || 0,
          entryTime: entryTime,
        });
        setQrValue(newQrValue);
      };
      generateQrValue();
    }
  }, [profile, entryTime]);

  useEffect(() => {
    if (profile) {
      setPreviousPoint(profile?.point); // Set previousPoint on initial render
    }
  }, [profile]); // Depend on profile to run only once after profile is set
  
  useEffect(() => {
    if (profile && previousPoint !== null && !isFirstEntry) {
      const pointsDifference = previousPoint - profile.point;
      if (profile.point !== previousPoint) {
        Alert.alert(
          '결제 성공', 
          `결제가 성공적으로 이루어졌습니다. 사용 포인트: ${pointsDifference}포인트`,
        );
      }
      setPreviousPoint(profile?.point); // Update previousPoint on subsequent renders
    }
    setIsFirstEntry(false); // Set isFirstEntry to false after first execution
  }, [profile?.point, isFirstEntry]);
  

  useEffect(() => {
    if (currentUser) {
      const fetchProfile = async () => {
        try {
          const docRef = doc(firestoreDB, 'userInfo', currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setProfile({ id: docSnap.id, ...docSnap.data() });
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    }
  }, [currentUser]);

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
    padding: 10,
  },
  logo: {
    width: '92%',
    height: '8%',
    marginBottom: 30,
  },
  paymentButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    elevation: 2,
    shadowOpacity: 0.2,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
    marginTop: 20,
  },
  paymentButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default QrGener;