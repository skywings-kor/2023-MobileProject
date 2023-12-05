import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { firebaseAuth, firestoreDB, doc, deleteDoc } from '../../firebaseConfig'; // Import necessary Firebase modules

const ProductDetail = ({ route, navigation }) => {
  // Extract the product data from the route params
  const { product } = route.params;
  const currentUser = firebaseAuth.currentUser; // Get the current user

  const [address, setAddress] = useState('');
  const [points, setPoints] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handlePurchase = () => {
    // Implement your purchase logic here
    if (address.trim() === '' || points.trim() === '' || phoneNumber.trim() === '') {
      alert('Please fill in all required fields.');
    } else {
      // Perform the purchase
      alert('Purchase Successful!\n\nAddress: ' + address + '\nPoints Used: ' + points + '\nPhone Number: ' + phoneNumber);
    }
  };

  const handleRemoveProduct = async () => {
    if (currentUser && currentUser.uid === product.OwnerUID) {
      // User is the owner, delete the product from Firestore
      try {
        const productRef = doc(firestoreDB, 'Products', product.id);
        await deleteDoc(productRef);
        alert('Product removed successfully.');
        // You can navigate back to the store detail screen or take appropriate action here
      } catch (error) {
        console.error('Error removing product: ', error);
      }
    } else {
      // User is not the owner, show an error message or take appropriate action
      alert('You do not have permission to remove this product.');
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image source={{ uri: product.image }} style={styles.image} />
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>
          {product.currency}{product.price}
        </Text>
        <Text style={styles.description}>{product.description}</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Delivery Address"
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="Points to Use"
          value={points}
          onChangeText={setPoints}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handlePurchase}>
          <Text style={styles.buttonText}>구매하기</Text>
        </TouchableOpacity>
        {currentUser && currentUser.uid === product.ownerUID&& (
          <TouchableOpacity style={styles.removeButton} onPress={handleRemoveProduct}>
            <Text style={styles.buttonText}>Remove Product</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: 'gray',
  },
  inputContainer: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 16,
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 16,
  },
  button: {
    width: '80%',
    padding: 10,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 5,
  },
  removeButton: {
    width: '80%',
    padding: 10,
    backgroundColor: 'red', // Change the button color as needed
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ProductDetail;
