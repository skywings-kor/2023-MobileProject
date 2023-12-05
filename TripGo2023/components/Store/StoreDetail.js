import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { firebaseAuth, firestoreDB, collection, query, where, getDocs } from '../../firebaseConfig';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const StoreDetailScreen = ({ route }) => {
  const { store } = route.params;
  const [products, setProducts] = useState([]);
  const currentUser = firebaseAuth.currentUser;
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const fetchProducts = async () => {
        try {
          const productsQuery = query(
            collection(firestoreDB, 'Stores', store.id, 'products')
          );
  
          const productsSnapshot = await getDocs(productsQuery);
  
          const productsData = productsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
  
          setProducts(productsData);
        } catch (error) {
          console.error('Error fetching products: ', error);
        }
      };
  
      fetchProducts();
    }, [store.id])
  );

  const handleAddProduct = () => {
    if (currentUser && currentUser.uid === store.ownerUID) {
      // User is the owner, navigate to the product registration screen
      navigation.navigate('특산물추가', { store });
    } else {
      // User is not the owner, show an error message or take appropriate action
      alert('You do not have permission to add products to this store.');
    }
  };

  const handleProductPress = (product) => {
    // Navigate to the product detail screen with the selected product
    navigation.navigate('상품상세', { product });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: store.image }} style={styles.storeImage} />
        <Text style={styles.storeName}>{store.name}</Text>
        <Text style={styles.storeDescription}>{store.description}</Text>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <FlatList
        data={products}
        numColumns={2} // Display two products per row
        renderItem={({ item }) => (
          <ProductItem product={item} onPress={() => handleProductPress(item)} />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const ProductItem = ({ product, onPress }) => (
  <TouchableOpacity style={styles.productItem} onPress={onPress}>
    <Image source={{ uri: product.image }} style={styles.productImage} />
    <Text style={styles.productName}>{product.name}</Text>
    <Text style={styles.productPrice}>{product.price} KRW</Text>
    {/* Add more product details here */}
  </TouchableOpacity>
);

// Add styles for ProductItem
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  storeImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  storeName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  storeDescription: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    position: 'absolute',
    top: 10,
    right: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  productItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  productPrice: {
    fontSize: 14,
    color: '#007bff',
  },
  // ... other styles ...
});

export default StoreDetailScreen;
