import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { launchImageLibrary } from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
import { firebaseAuth } from '../../firebaseConfig';
import { useNavigation, useIsFocused } from '@react-navigation/native';
const AddAttractionScreen = () => {
  const devices = useCameraDevices();
  const device = devices.back;
  const cameraRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [attractionName, setAttractionName] = useState('');
  const [location, setLocation] = useState(null);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setPhoto(null);
      setAttractionName('');
      setDescription('');
      setLocation(null);
    }
    // Request permissions only if the screen is focused
    if (isFocused) {
      Camera.requestCameraPermission();
      Camera.requestMicrophonePermission();
    }
  }, [isFocused]);

  const takePicture = async () => {
    if (!cameraRef.current) return;
    setIsLoading(true);
    const photoData = await cameraRef.current.takePhoto();
    setPhoto({ uri: `file://${photoData.path}` });
    getCurrentLocation();
  };

  // const chooseFromGallery = () => {
  //   const options = {
  //     selectionLimit: 1,
  //     mediaType: 'photo',
  //   };
  //   setIsLoading(true);
  //   launchImageLibrary(options, (response) => {
  //     if (response.didCancel) {
  //       setIsLoading(false);
  //       console.log('User cancelled image picker');
  //     } else if (response.errorCode) {
  //       setIsLoading(false);
  //       console.log('ImagePicker Error: ', response.errorMessage);
  //     } else {
  //       const source = { uri: response.assets[0].uri };
  //       setPhoto(source);
  //       getCurrentLocation();
  //     }
  //   });
  // };

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

  const handleRegisterAttraction = () => {
    if (!photo || !attractionName || !location || !description) {
      Alert.alert('Error', 'Please provide all the required information.');
      return;
    }
    const userId = firebaseAuth.currentUser?.uid; // 현재 로그인한 사용자의 아이디
    console.log('Attraction Name:', attractionName);
    console.log('Photo URI:', photo.uri);
    console.log('Location:', location);
    console.log('User ID:', userId); // 사용자 아이디 출력
    console.log('Description:', description);
    navigation.navigate('홈'); // Replace 'Home' with your home screen route name
    setPhoto(null);
    setDescription("");
    setAttractionName("");
    
    
    // Add your logic here to save these details to a database or a server
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }
  if (!photo && isFocused) {
    return (
      <View style={styles.container}>
        {device && (
          <Camera
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            photo={true}
          />
        )}
        <View style={styles.captureButtonContainer}>
          <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
            <Text style={styles.buttonText}>사진 촬영</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={chooseFromGallery} style={styles.captureButton}>
            <Text style={styles.buttonText}>Choose from Gallery</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    );
  } else if (photo) {
    return (
        <View style={styles.imageContainer}>
          <Image source={photo} style={styles.previewImage} />
          <TextInput
            placeholder="Enter attraction name"
            value={attractionName}
            onChangeText={setAttractionName}
            style={styles.textInput}
          />
          <TextInput
            placeholder="Write a description"
            value={description}
            onChangeText={setDescription}
            style={[styles.textInput, styles.descriptionInput]}
            multiline
          />
          <TouchableOpacity onPress={handleRegisterAttraction} style={styles.registerButton}>
            <Text style={styles.buttonText}>Register Attraction</Text>
          </TouchableOpacity>
        </View>
      )}
      return null;
    
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  previewImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',
    padding: 10,
    marginBottom: 20,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',
    padding: 10,
  },
  captureButtonContainer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  captureButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AddAttractionScreen;