import React, { useState, useEffect  } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { firebaseAuth, firestoreDB, doc, deleteDoc, getDoc } from '../../firebaseConfig'; // Import necessary Firebase modules

const ProductDetail = ({ route, navigation }) => {
  // Extract the product data from the route params
  const { product } = route.params;
  const currentUser = firebaseAuth.currentUser; // Get the current user

  const [address, setAddress] = useState('');
  const [points, setPoints] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customer, setCustomer] = useState('');

  const [userPoints, setUserPoints] = useState(0);


  //해당 유저의 포인트 값을 불러오기 위함
  useEffect(() => {
    const updateUserPoint = async () => {
      try {
          const uid = firebaseAuth.currentUser.uid;
          const docRef = doc(firestoreDB, 'userInfo', uid);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          // 문서에서 'point' 필드 값을 가져옵니다.
          const userPoints = docSnap.data().point;
          console.log("User points:", userPoints);

          setUserPoints(userPoints)
          // 상태를 업데이트하거나 다른 로직 수행
        } else {
          // 문서가 존재하지 않는 경우 처리
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    };
  
    updateUserPoint();
  }, []);


  //구매하기 버튼을 눌렀을 때 이벤트 발생
  const handlePurchase = () => {
    // Implement your purchase logic here
    if (address.trim() === '' || points.trim() === '' || phoneNumber.trim() === '') {
      alert('Please fill in all required fields.');
      
      return;
    }

    
    // 사용자가 입력한 포인트를 숫자로 변환
    const pointsToUse = parseInt(points, 10);

    // 사용 가능한 포인트보다 더 많은 포인트를 사용하려고 하는지 확인
    if (pointsToUse > userPoints) {
      alert('사용 가능한 포인트를 초과했습니다.');
      return;
    }

    // 구매 로직 수행
    alert('구매가 성공적으로 완료되었습니다!\n\n배송 주소: ' + address + '\n사용 포인트: ' + points + '\n전화번호: ' + phoneNumber);

    

  };


  const handleRemoveProduct = async () => {
    if (currentUser && currentUser.uid === product.OwnerUID) {
      // User is the owner, delete the product from Firestore
      try {
        const productRef = doc(firestoreDB, 'Products', product.id);
        await deleteDoc(productRef);
        alert('정상적으로 상품이 삭제되었습니다.');
        // You can navigate back to the store detail screen or take appropriate action here
      } catch (error) {
        console.error('Error removing product: ', error);
      }
    } else {
      // User is not the owner, show an error message or take appropriate action
      alert('해당 UID는 삭제할 권한이 없습니다.');
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
          placeholder="배송 받으실 주소를 입력해주세요"
          value={address}
          onChangeText={setAddress}
        />

        <Text>
          사용가능한 포인트: {userPoints}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="사용할 포인트를 입력해주세요(ex: 1000)"
          value={points}
          onChangeText={setPoints}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="수령자 성함을 적어주세요"
          value={customer}
          onChangeText={setCustomer}
        />

        <TextInput
          style={styles.input}
          placeholder="핸드폰 번호를 적어주세요"
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
