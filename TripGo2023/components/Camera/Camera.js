import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, Alert, ActivityIndicator } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

const CameraScreen = () => {
  const devices = useCameraDevices();
  const device = devices.back;
  const cameraRef = useRef(null);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  
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

    setIsLoading(true);
    try {
      const photoData = await cameraRef.current.takePhoto();
      setPhoto({ uri: `file://${photoData.path}` });
      getCurrentLocation();
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Unable to take picture');
      console.error('Error taking photo:', error);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setLocation(position.coords);
        setIsLoading(false);
      },
      error => {
        setIsLoading(false);
        Alert.alert('Error', `Unable to get location: ${error.message}`);
        console.error(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const usePhoto = () => {
    // Handle the photo, navigate to a different screen, and pass the photo data, or save it, etc.
    console.log('Photo to be used:', photo);
    console.log('Location:', location);
    setPhoto(null);
    // Ensure that you're using `photo.path` instead of `photo.uri`
    // Pass photo and location to the next screen or save it
    navigation.navigate('선택', { photoUri: photo.uri, location });

    //테스트용도
    // navigation.navigate('리뷰등록', { location });
  };

  const retakePicture = () => {
    setPhoto(null);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (isFocused && !photo) {
    return (
      <View style={styles.container}>
        {device && cameraPermission && locationPermission && (
          <Camera
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            photo={true}
          />
        )}
        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={takePictureAndGetCurrentLocation} style={styles.captureButton}>
            <Text style={styles.buttonText}>사진 촬영</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  } else if (photo) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photo.uri }} style={styles.previewImage} />
        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={retakePicture} style={styles.button}>
            <Text style={styles.buttonText}>다시 촬영하기</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={usePhoto} style={styles.button}>
            <Text style={styles.buttonText}>사용하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    flex: 1,
    resizeMode: 'contain',
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
    backgroundColor: '#ddec08',
    borderRadius: 50,
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 14,
    color: 'black',
  },
});

export default CameraScreen;