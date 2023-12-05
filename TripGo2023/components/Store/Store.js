import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, ImageBackground } from 'react-native';
import { firebaseAuth, firestoreDB, doc, deleteDoc, getDocs, collection } from '../../firebaseConfig';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// Define StoreItem component first
const StoreItem = ({ store, onPress }) => (
  <TouchableOpacity style={styles.storeItem} onPress={() => onPress(store)}>
    <Image source={{ uri: store.image }} style={styles.storeImage} />
    <Text style={styles.storeName}>{store.name}</Text>
  </TouchableOpacity>
);

const Store = () => {
  const navigation = useNavigation();
  const [stores, setStores] = useState([]);
  const [selectedCity, setSelectedCity] = useState('서울');
  const koreanCities = [
    '서울',
    '경기',
    '부산',
    '인천',
    '대구',
    '대전',
    '광주',
    '울산',
    '세종',
    '강원',
    '충북',
    '충남',
    '전북',
    '전남',
    '경북',
    '경남',
    '제주',
  ];

  // Function to shuffle an array
  const shuffleArray = (array) => {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const fetchRandomStores = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestoreDB, 'Stores'));
      const allStores = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Shuffle the array to get random stores
      const shuffledStores = shuffleArray(allStores);

      // Take the first 4 stores
      const randomStores = shuffledStores;

      setStores(randomStores);
    } catch (error) {
      console.error("Error fetching stores: ", error);
    }
  };

  const handleCityChange = (itemValue) => {
    setSelectedCity(itemValue);
  };

  useEffect(() => {
    // Initial data fetch when the component mounts
    fetchRandomStores();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchRandomStores();
    }, [])
  );

  const handleStoreClick = (store) => {
    navigation.navigate('상점상세', { store });
  };

  const handleAddStore = () => {
    navigation.navigate('상점등록');
  };

  // Filter stores based on selectedCity
  const filteredStores = selectedCity
    ? stores.filter(store => store.city === selectedCity)
    : stores;

  return (
    <ImageBackground
      source={require('../../assets/shop.png')} // Make sure this path is correct
      style={styles.backgroundImage}
      resizeMode="cover" // This ensures the image covers the entire background
    >
      <View style={styles.container}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedCity}
            onValueChange={handleCityChange} // Handle city change
            style={styles.picker}
          >
            
            {koreanCities.map((city, index) => (
              <Picker.Item key={index} label={city} value={city} />
            ))}
          </Picker>
          <TouchableOpacity style={styles.addButton} onPress={handleAddStore}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.message}>{"환영합니다!\n 무작위로 선택된 4개의 상점입니다. \n 자세히 살펴보고 관심 있는 상점을 찾아보세요. \n 새로운 상점을 등록하려면 \n'+' 버튼을 눌러주세요!"}</Text>

        <FlatList
          data={filteredStores}
          renderItem={({ item }) => <StoreItem store={item} onPress={handleStoreClick} />}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      </View>
    </ImageBackground>
  );
};

// Rest of your component code remains the same

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'rgba(240, 240, 240, 0.8)', // Use an RGBA color for better opacity
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  picker: {
    flex: 1,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  storeItem: {
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
  storeImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  storeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  row: {
    justifyContent: 'space-around',
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center', // Center align the text
  },
  backgroundImage: {
    flex: 1, // Fill the entire screen
    width: null,
    height: null,
    justifyContent: 'center',
  },
});

export default Store;
