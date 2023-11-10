import React,{ useState }  from 'react';
import { View, Text, FlatList, StyleSheet, Image,TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ProudctDetail from './ProductDetail'
import { useNavigation } from '@react-navigation/native';
// Dummy product data
const products = new Array(10).fill(null).map((_, index) => ({
    id: String(index),
    name: `Product ${index + 1}`,
    price: (Math.random() * 100).toFixed(2),
    image: `https://via.placeholder.com/150?text=Product+${index + 1}`,
  }));
  
  // Single product item component
  const ProductItem = ({ item }) => (
    <View style={styles.productItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</  Text>
      <Text style={styles.productPrice}>${item.price}</Text>
    </View>
  );
  
  


const Product = () => {
  const navigation = useNavigation();

  const handleItemClick = (item) => {
    navigation.navigate('상세페이지', { itemData: item });
  }

  const [selectedCity, setSelectedCity] = useState();

  const koreanCities = [
    '서울',
    '부산',
    '인천',
    '대구',
    '대전',
    '광주',
    '울산',
    '세종',
    '경기',
    '강원',
    '충북',
    '충남',
    '전북',
    '전남',
    '경북',
    '경남',
    '제주',
  ];

  return (
    <View>
      <View style={styles.container}>
      <Picker
        selectedValue={selectedCity}
        onValueChange={(itemValue, itemIndex) => setSelectedCity(itemValue)}
        style={styles.picker}
      >
        {koreanCities.map((city, index) => (
          <Picker.Item key={index} label={city} value={city} />
        ))}
      </Picker>
      </View>
 
    
      <FlatList
        data={products}
        renderItem={({ item }) => (
        
          <TouchableOpacity 
            style={styles.imageContainer} 
            onPress={() => handleItemClick(item)}
          >
            <ProductItem item={item} />
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        // Additional props for the grid layout
        numColumns={2}
        columnWrapperStyle={styles.row}
      /> 
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flex: 1,
    justifyContent: 'space-around',
  },
  productItem: {
    flex: 1,
    flexDirection: 'column',
    margin: 10,
    alignItems: 'center', // Center items in the column
  },
  productImage: {
    width: '100%',
    height: 150,
    aspectRatio: 1, // Keep the aspect ratio of the image
    resizeMode: 'cover', // Cover the whole area of the Image component
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  productPrice: {
    fontSize: 14,
  },
  container: {
    alignItems:'center',
    margin: 20,
  },
  picker: {
    height: 50,

    width: '50%',
  },
});

export default Product;
