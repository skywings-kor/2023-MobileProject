import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet,TouchableOpacity } from 'react-native';

const ProductDetail = () => {
    const product = {
        id: 'product1',
        name: 'Special Product',
        image: 'https://via.placeholder.com/150',
        price: 19.99,
        currency: '$',
        description: 'This is a special product with high-quality features and an affordable price.',
      };
      
  return (
    <ScrollView >
     <View style={styles.container}>
      <View >
          <Image source={{ uri:product.image}} style={styles.image} />
      </View> 
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>
        {product.currency}{product.price}
      </Text>
      <Text style={styles.description}>{product.description}</Text>
     </View>
     <View style={styles.bContainer}>
        <TouchableOpacity style={styles.button} onPress={''}>
            <Text style={styles.buttonText}>구매하기</Text>
        </TouchableOpacity>
     </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  button: {
    width: '80%',
    padding: 10,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  image: {
    width: "100%",
    height: 300,
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
  bContainer:{
    alignItems:'center',
  
  },
});

export default ProductDetail;
