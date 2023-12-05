import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { updateDoc, serverTimestamp, firestoreDB, firebaseAuth, collection, doc, setDoc, getDoc, query, orderBy, limit, getDocs, analytics, storage, ref, uploadBytes, getDownloadURL, onAuthStateChanged, addDoc } from '../../firebaseConfig';
import { launchImageLibrary } from 'react-native-image-picker'; // Ensure this is correctly imported
import { useNavigation } from '@react-navigation/native';

const StoreRegistration = () => {
  const [storeName, setStoreName] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [contact, setContact] = useState('');
  const [selectedCity, setSelectedCity] = useState('서울');
  const [image, setImage] = useState(null); // State to hold the selected image
  const [storeDescription, setStoreDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigation = useNavigation();

  const koreanCities = [
    '서울', '부산', '인천', '대구', '대전', '광주', '울산', '세종',
    '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주',
  ];

  const selectImage = () => {
    const options = {
      title: 'Choose Store Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.assets[0].uri };
        setImage(source);
      }
    });
  };

  const uploadImage = async () => {
    if (!image) {
      Alert.alert("이미지를 넣어주세요!");
      return null;
    }

    const response = await fetch(image.uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `stores/${Date.now()}_${storeName}`);

    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  const handleRegister = async () => {
    try {
      setIsLoading(true); // Set loading state to true
      const currentUser = firebaseAuth.currentUser;
      if (!currentUser) {
        Alert.alert("Error", "계정 조회가 안됩니다");
        setIsLoading(false); // Set loading state to false
        return;
      }

      const imageURL = await uploadImage();
      if (!imageURL) {
        setIsLoading(false); // Set loading state to false
        return; // Stop if there was an issue uploading the image
      }

      await addDoc(collection(firestoreDB, 'Stores'), {
        ownerUID: currentUser.uid,
        name: storeName,
        city: selectedCity,
        address: storeAddress,
        contact: contact,
        description: storeDescription, // Add store description
        image: imageURL,
      });

      setIsLoading(false); // Set loading state to false
      Alert.alert("등록되었습니다", "성공적으로 가게가 등록되었습니다.", [
        {
          text: 'OK',
          onPress: () => {
            // Navigate back to the store screen
            navigation.navigate('지역특산품'); // Replace 'Store' with the actual screen name
          },
        },
      ]);
    } catch (error) {
      console.error("Error adding store: ", error);
      setIsLoading(false); // Set loading state to false
      Alert.alert("Error", "가게 등록 문제 발생.");
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.label}>가게 이름:</Text>
        <TextInput
          style={styles.input}
          value={storeName}
          onChangeText={setStoreName}
          placeholder="가게 이름을 넣어주세요"
        />
        <Text style={styles.label}>도시:</Text>
        <Picker
          selectedValue={selectedCity}
          onValueChange={setSelectedCity}
          style={styles.picker}>
          {koreanCities.map((city, index) => (
            <Picker.Item key={index} label={city} value={city} />
          ))}
        </Picker>
        <Text style={styles.label}>가게 주소:</Text>
        <TextInput
          style={styles.input}
          value={storeAddress}
          onChangeText={setStoreAddress}
          placeholder="가게 주소 입력해주세요"
        />
        <Text style={styles.label}>가게 설명:</Text>
        <TextInput
          style={styles.input}
          value={storeDescription}
          onChangeText={setStoreDescription}
          placeholder="가게에 대한 설명을 적어주세요"
        />
        <Text style={styles.label}>가게 전화번호:</Text>
        <TextInput
          style={styles.input}
          value={contact}
          onChangeText={setContact}
          placeholder="가게 전화번호를 넣어주세요"
        />

        <TouchableOpacity onPress={selectImage} style={styles.imagePicker}>
          <Text style={styles.imagePickerText}>가게 이미지 넣기</Text>
        </TouchableOpacity>

        {image && (
          <Image source={image} style={styles.imagePreview} />
        )}
        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isLoading}>
          <Text style={styles.buttonText}>가게 등록하기</Text>
        </TouchableOpacity>
        {isLoading && (
          <ActivityIndicator size="large" color="#007bff" />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  imagePicker: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePickerText: {
    color: '#000',
    fontSize: 16,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
});

export default StoreRegistration;
