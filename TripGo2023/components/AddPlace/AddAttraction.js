import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, TextInput, Alert, ActivityIndicator } from 'react-native';
import {
  firestoreDB,
  collection,
  doc,
  addDoc,
  serverTimestamp,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  firebaseAuth
} from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

const AddAttractionScreen = ({ route }) => {
  const { photoUri, location } = route.params;
  const [attractionName, setAttractionName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 인디케이터 표시 상태
  const navigation = useNavigation();

  const handleRegisterAttraction = async () => {
    if (!attractionName || !description) {
      Alert.alert('Error', '내용을 전부 작성해주세요.');
      return;
    }

    const userId = firebaseAuth.currentUser?.uid;

    try {
      setIsLoading(true); // 등록 중에 인디케이터 표시 시작

      // Upload the image to Firebase Storage
      const response = await fetch(photoUri);
      const blob = await response.blob();
      const imageRef = ref(storage, `attractionImages/${userId}_${Date.now()}.jpg`);
      await uploadBytes(imageRef, blob);

      // Get the download URL of the uploaded image
      const imageUrl = await getDownloadURL(imageRef);

      // Create attraction data with image URL
      const attractionData = {
        attractionName: attractionName,
        description: description,
        longitude: location.longitude,
        image: imageUrl, // Use the image URL
        latitude: location.latitude,
      };

      // Add attraction data to Firestore
      const tripCollectionRef = collection(firestoreDB, 'User_Tourlist', userId, 'history');
      await addDoc(tripCollectionRef, attractionData);

      setIsLoading(false); // 등록 성공하면 인디케이터 숨김
      Alert.alert('등록 성공!'); // 성공 메시지 표시
      navigation.navigate('main'); // Replace 'Home' with your home screen route name
    } catch (error) {
      setIsLoading(false); // 등록 실패하면 인디케이터 숨김
      console.error('Error registering attraction: ', error);
      Alert.alert('Error', 'Failed to register attraction.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: photoUri }} style={styles.previewImage} />
      <TextInput
        placeholder="관광지 이름을 적어주세요."
        value={attractionName}
        onChangeText={setAttractionName}
        style={styles.textInput}
      />
      <TextInput
        placeholder="관광지에 대한 간단한 설명을 적어주세요"
        value={description}
        onChangeText={setDescription}
        style={[styles.textInput, styles.descriptionInput]}
        multiline
      />
      <TouchableOpacity onPress={handleRegisterAttraction} style={styles.registerButton}>
        <Text style={styles.buttonText}>관광지 등록</Text>
      </TouchableOpacity>
      {isLoading && (
        <View style={styles.indicatorContainer}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  registerButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  indicatorContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AddAttractionScreen;