import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert , ActivityIndicator} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation} from '@react-navigation/native';

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

const ProductAdd = ({ route }) => {
    const { store } = route.params;
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const navigation = useNavigation();
  
    const selectImage = () => {
      const options = {
        title: '상품 이미지를 선택해주세요',
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
        Alert.alert('Please select an image');
        return null;
      }
  
      try {
        const response = await fetch(image.uri);
        const blob = await response.blob();
        const storageRef = ref(storage, `products/${Date.now()}_${productName}`);
  
        await uploadBytes(storageRef, blob);
        return getDownloadURL(storageRef);
      } catch (error) {
        console.error('Error uploading image: ', error);
        return null;
      }
    };
  
    const handleRegisterProduct = async () => {
      try {
        setIsLoading(true); // Set loading state to true
        const imageURL = await uploadImage();
        if (!imageURL) {
          setIsLoading(false); // Set loading state to false
          return;
        }
    
        const currentUser = firebaseAuth.currentUser;
        if (!currentUser) {
          // Handle the case where there is no authenticated user
          Alert.alert('User not authenticated', 'Please log in before registering a product.');
          setIsLoading(false); // Set loading state to false
          return;
        }
    
        const productData = {
          name: productName,
          description: productDescription,
          price: parseFloat(productPrice),
          image: imageURL,
          createdAt: serverTimestamp(),
          ownerUID: currentUser.uid, // Add the user's UID
        };
    
        const productCollectionRef = collection(firestoreDB, 'Stores', store.id, 'products');
        await addDoc(productCollectionRef, productData);
    
        setIsLoading(false); // Set loading state to false
        Alert.alert('상품 등록', '성공적으로 상품이 등록되었습니다.', [
          {
            text: 'OK',
            onPress: () => {
              // Navigate back to the store detail screen
              navigation.navigate('상점상세', { store });
            },
          },
        ]);
      } catch (error) {
        console.error('Error adding product: ', error);
        setIsLoading(false); // Set loading state to false
        Alert.alert('Error', 'There was a problem registering the product.');
      }
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>상품 등록 페이지</Text>
        <TextInput
          style={styles.input}
          placeholder="상품 이름"
          value={productName}
          onChangeText={(text) => setProductName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="상품 설명"
          value={productDescription}
          onChangeText={(text) => setProductDescription(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="상품 가격(ex: 15000)"
          value={productPrice}
          onChangeText={(text) => setProductPrice(text)}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.imagePickerButton} onPress={selectImage}>
          <Text style={styles.imagePickerButtonText}>이미지 선택</Text>
        </TouchableOpacity>
        {image && (
          <Image source={image} style={styles.imagePreview} />
        )}
        <TouchableOpacity style={styles.registerButton} onPress={handleRegisterProduct} disabled={isLoading}>
          <Text style={styles.registerButtonText}>상품 등록</Text>
        </TouchableOpacity>
        {isLoading && (
          <ActivityIndicator size="large" color="#007bff" />
        )}
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    imagePickerButton: {
      backgroundColor: '#007bff',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    imagePickerButtonText: {
      color: '#fff',
      textAlign: 'center',
      fontSize: 16,
    },
    imagePreview: {
      width: '100%',
      height: 200,
      marginBottom: 20,
    },
    registerButton: {
      backgroundColor: '#007bff',
      padding: 10,
      borderRadius: 5,
    },
    registerButtonText: {
      color: '#fff',
      textAlign: 'center',
      fontSize: 16,
    },
  });
  
  export default ProductAdd;
