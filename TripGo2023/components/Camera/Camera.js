import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, Alert } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid } from 'react-native';
const CameraScreen = () => {
  const devices = useCameraDevices();
  const device = devices.back;
  const cameraRef = useRef(null);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);
  const [photo, setPhoto] = useState(null); // 촬영된 사진을 상태로 저장합니다.
  const navigation = useNavigation();

  const retakePicture = () => {
    setPhoto(null); // This will cause the camera view to be shown again
  };

  const usePhoto = () => {
    // Handle the photo, navigate to a different screen, and pass the photo data, or save it, etc.
    console.log('Photo to be used:', photo);
    // Ensure that you're using `photo.path` instead of `photo.uri`
    navigation.navigate('리뷰등록', { photoUri:`file://${photo.path}`  });
  };

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermission();
      setCameraPermission(cameraStatus === 'authorized');

      if (Platform.OS === 'android') {
        const status = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        setLocationPermission(status === PermissionsAndroid.RESULTS.GRANTED);
      }
    })();
  }, []);

  const takePictureAndGetCurrentLocation = async () => {
    if (!cameraRef.current || !cameraPermission || !locationPermission) return;

    try {
      const photoData = await cameraRef.current.takePhoto();
      console.log('Photo object:', photoData); // Log the entire photo object
      
      setPhoto(photoData); // 사진 데이터를 상태에 저장합니다.
      console.log('Photo taken:', photoData);

      Geolocation.getCurrentPosition(
        (position) => {
          console.log('Current position:', position.coords);
        },
        (error) => {
          Alert.alert('Error', 'Unable to get location');
          console.error('Location error:', error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } catch (error) {
      Alert.alert('Error', 'Unable to take picture');
      console.error('Error taking photo:', error);
    }
  };

  // 촬영된 사진이 있을 때 사진을 화면에 표시합니다.
  if (photo) {
    console.log('Photo path:', photo.path);
    return (
      <View style={styles.container}>
        <View style={styles.previewContainer}>
        <Image source={{ uri: `file://${photo.path}` }} style={styles.previewImage} />
        </View>
        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={retakePicture} style={[styles.button, styles.retakeButton]}>
            <Text style={styles.buttonText}>다시 촬영하기</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={usePhoto} style={[styles.button, styles.usePhotoButton]}>
            <Text style={styles.buttonText}>사진 사용하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 카메라 뷰를 화면에 표시합니다.
  return (
    <View style={styles.container}>
      {device && cameraPermission && locationPermission && (
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          photo={true} // Enable photo capture
        />
      )}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={takePictureAndGetCurrentLocation} style={styles.captureButton}>
          <Text style={styles.buttonText}>촬영하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  previewImage: {
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingVertical: 20,
  },
  captureButton: {
    backgroundColor: '#fff',
    borderRadius: 50,
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    color: 'black',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginHorizontal: 10, // Add spacing between buttons
  },
  retakeButton: {
    backgroundColor: 'white', // Red color for retake button
  },
  usePhotoButton: {
    backgroundColor: 'white', // Green color for use photo button
  },
  previewContainer: {
    flex: 9/10,
    borderWidth: 1,
    borderColor: 'black',
    margin: 20, // You can adjust the margin as needed
    borderRadius: 4, // Optional: if you want rounded corners
  },
  previewImage: {
    flex: 1,
    borderRadius: 4, // Match the borderRadius of previewContainer if used
  },
});

export default CameraScreen;
