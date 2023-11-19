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
  const navigation = useNavigation();
  useEffect(() => {
    // Reset scanned state on component mount
    setQrvalue('');

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
            alert('CAMERA permission denied');
          }
        } catch (err) {
          console.warn('Camera permission error', err);
        }
      }
    };

    requestCameraPermission();
  }, []);

  const onBarcodeScan = (qrvalue) => {
    setQrvalue(qrvalue);

    // You can perform any action with the scanned QR code here
    Alert.alert('QR Code', qrvalue, [
      {
        text: 'OK',
        onPress: () => {
          navigation.navigate('QR결재', { qrValue: qrvalue });
          setQrvalue('');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Your existing styles here
});

export default QRScannerScreen;
