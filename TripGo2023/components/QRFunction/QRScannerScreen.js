import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  PermissionsAndroid,
  Platform,
  Vibration,
  Alert,
} from 'react-native';
import { CameraScreen } from 'react-native-camera-kit';
import { useNavigation } from '@react-navigation/native';
function QRScannerScreen() {
  const [qrvalue, setQrvalue] = useState('');
  const [isScannerActive, setIsScannerActive] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {

    const requestCameraPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera Permission',
              message: 'App needs permission for camera access',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            // Start scanning when permission is granted
            setQrvalue('');
          } else {
            alert('카메라 권한이 거부되었습니다');
          }
        } catch (err) {
          console.warn('Camera permission error', err);
        }
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      setQrvalue('');
      setIsScannerActive(true); // 화면 포커스시 스캐너 활성화
    });

    const blurUnsubscribe = navigation.addListener('blur', () => {
      setIsScannerActive(false); // 화면 포커스를 잃을 때 스캐너 비활성화
    });

    requestCameraPermission();
    return () => {
      unsubscribe();
      blurUnsubscribe();
    };
  }, [navigation]);


  const onBarcodeScan = (qrvalue) => {
    setQrvalue(qrvalue);
    navigation.navigate('QR결재', { qrValue: qrvalue });
    setQrvalue('');
 
  };

  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {isScannerActive && ( // 스캐너가 활성화되었을 때만 CameraScreen을 렌더링
          <CameraScreen
            showFrame={false}
            scanBarcode={true}
            laserColor={'blue'}
            frameColor={'yellow'}
            colorForScannerFrame={'black'}
            onReadCode={(event) =>
              onBarcodeScan(event.nativeEvent.codeStringValue)
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Your existing styles here
});

export default QRScannerScreen;
