import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, TextInput, Alert } from 'react-native';
import { firebaseAuth } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

const AddAttractionScreen = ({ route }) => {
  const { photoUri, location } = route.params;
  const [attractionName, setAttractionName] = useState('');
  const [description, setDescription] = useState('');
  const navigation = useNavigation();

  const handleRegisterAttraction = () => {
    if (!attractionName || !description) {
      Alert.alert('Error', 'Please provide all the required information.');
      return;
    }
    const userId = firebaseAuth.currentUser?.uid;
    console.log('Attraction Name:', attractionName);
    console.log('Photo URI:', photoUri);
    console.log('Location:', location);
    console.log('User ID:', userId);
    console.log('Description:', description);

    navigation.navigate('main'); // Replace 'Home' with your home screen route name
    // Add your logic here to save these details to a database or a server
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: photoUri }} style={styles.previewImage} />
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
  });
  

  export default AddAttractionScreen;