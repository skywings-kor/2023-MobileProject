import React,  { useState, useEffect }  from 'react';
import {  Modal, TextInput,View, Text, StyleSheet, Image, TouchableOpacity, Switch, Alert } from 'react-native';
import { updateDoc,serverTimestamp,firestoreDB, firebaseAuth,collection, doc, setDoc, getDoc, query, orderBy, limit, getDocs, analytics, storage, ref, uploadBytes, getDownloadURL ,onAuthStateChanged, addDoc } from '../firebaseConfig';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';


const MyPage = () => { 
  const navigation = useNavigation();
  //이미지 URL
  const [imageURL,setimageURL] = useState("");

  //이미지
  const [image, setImage] = useState(null);
  
  // 1. selectedImages 상태를 추가합니다.
  const [selectedImages, setSelectedImages] = useState();

  const [profile, setProfile] = useState([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const ageOptions = ['10대', '20대', '30대', '40대', '50대', '60대'];
  const genderOptions = ['남자', '여자'];

  const [user, setUser] = useState({
    name: 'John Doe',
    age:"20대",
    nickname:"길동",
    gender: "여",
    image: 'https://via.placeholder.com/150',
    points: 1200,
  });

  const [isModalVisible, setModalVisible] = useState(false);
  const [editNickname, setEditNickname] = useState('');
  const [editAge, setEditAge] = useState('');
  const [editGender, setEditGender] = useState('');

  
  const currentUser = firebaseAuth.currentUser; // 현재 로그인한 사용자 가져오기


  //useState에서 변경하기 위한 용도입니다!
  const handleInfoChange = () => {
    setEditNickname(profile.nickname);
    setEditAge(profile.ageGroup);
    setEditGender(profile.gender);
    setModalVisible(true); // Show the modal
  };

  //사용자 프로필 이미지 DB 업데이트
  const uploadUserImage = async (imageUser) => {
    try {
      //Board에 접근해서 가져올 자료가 없기 때문에 일단 뺐음
      // const boardCollectionRef = collection(db, "Board");
      
      // const queryRef = query(boardCollectionRef, orderBy('n2umber'), limit(1));
      // const querySnapshot = await getDocs(queryRef);
      // const lastDoc = querySnapshot.docs[0];
      
      // const lastNumber = lastDoc ? lastDoc.data().number : 0;
      // const newNumber = lastNumber + 1;
      
      
      // URI에서 Raw Byte 데이터 가져오기
    const response = await fetch(imageUser);

    const blob = await response.blob();
    
    const storageRef = ref(storage, `image/userImage/${currentUser.uid}`);
    
    await uploadBytes(storageRef, blob);
    
    const imageRef = ref(storage, `image/userImage/${currentUser.uid}`);
    const downloadURL = await getDownloadURL(imageRef);

    console.log (downloadURL);
    
    const docRef = doc(firestoreDB, "userInfo", currentUser.uid);

    // Update the document with the new data
    try {
      await updateDoc(docRef, {
        profile_img: downloadURL,
      });
      
      // Assuming you want to update the state as well
      setProfile(prevState => ({
        ...prevState,
        profile_img: downloadURL,
      }));
  
      Alert.alert("업데이트 완료!", "정상적으로 변경이 완료되었습니다.");
    } catch (error) {
      console.error("업데이트에 실패했습니다:", error);
      Alert.alert("업데이트에 실패했습니다", "알 수 없는 오류가 발생하였습니다.");
    }

    
    alert('이미지 업로드가 완료되었습니다.')
    
    

  } catch (error) {
      console.error('이미지 업로드 중 오류 발생',error)
    }
  }


  // 여기가 그 개인 정보 변경 용
  const saveProfileChanges = async () => {
    // Create a reference to the Firestore document
    const docRef = doc(firestoreDB, "userInfo", currentUser.uid);
  
    // Update the document with the new data
    try {
      await updateDoc(docRef, {
        ageGroup: editAge,
        nickname: editNickname,
        gender: editGender,
      });
      
      // Assuming you want to update the state as well
      setProfile(prevState => ({
        ...prevState,
        ageGroup: editAge,
        nickname: editNickname,
        gender: editGender,
      }));
  
      Alert.alert("업데이트 완료!", "정상적으로 변경이 완료되었습니다.");
    } catch (error) {
      console.error("업데이트에 실패했습니다:", error);
      Alert.alert("업데이트에 실패했습니다", "알 수 없는 오류가 발생하였습니다.");
    }
  
    setModalVisible(false); // Hide the modal after saving changes
  };


  const db = firestoreDB
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(firestoreDB, "userInfo", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile({ id: docSnap.id, ...docSnap.data() }); // Save the document data
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    //이쪽에 유저가 이미지 없을 때, user_Icon 이미지를 불러오도록 하기...
    // const fetch

    fetchProfile();
  }, []);



  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const handleChangePhoto = () => {

    const options = {
      title: 'Choose User Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
  
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        alert('사진 변경을 취소하였습니다');
      } else if (response.error) {
        alert('이미지 라이브러리 오류: ' + response.error);
      } else if (response.assets && response.assets.length > 0) {
        const chosenImage = response.assets[0].uri;
  
        // 선택된 이미지 URI 저장
        uploadUserImage(chosenImage);
      }
    });

    // 프로필 사진 변경 로직.
    // console.log(profiles)
  };

  const handleChatbot = () => {
    // 리뷰 확인 로직 .
    navigation.navigate('고객상담');
  };
  const handlePaymentHistory = () => {
    // 결제 내역 로직 .
    navigation.navigate('결제내역');
  };
  const handleSellHistory = () => {
    // 판매 내역 로직 .
    navigation.navigate('판매내역');
  };
  const handleDeleteAccount = () => {
    // 회원 탈퇴 로직 .
   
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={handleChangePhoto}>
          <Image source ={profile.profile_img ? { uri: profile.profile_img} : require("../assets/user_Icon.png")} style={styles.profileImage}/>
          {/* <Image source={{ uri: profile.profile_img || ""}} style={styles.profileImage} /> */}
        </TouchableOpacity> 
       
        <View style={styles.profileTextContainer}>
          <Text style={styles.userName}>{profile.nickname}</Text>
          <Text style={styles.userPoints}>포인트: {profile.point}</Text>
        </View> 
         <View style={styles.optionContainer}>
            <Text style={styles.optionTitle}>알림</Text>
            <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
            />
        </View>
      </View>
     <Text style={styles.infoText}>닉네임: {profile.nickname}</Text>
     <Text style={styles.infoText}>나이: {profile.ageGroup}</Text>
     <Text style={styles.infoText}>성별: {profile.gender}</Text>
     
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={handleChatbot}>
            <Text style={styles.buttonText}> 고객 상담 </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handlePaymentHistory}>
            <Text style={styles.buttonText}>결제 내역</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSellHistory}>
            <Text style={styles.buttonText}>판매 내역</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleInfoChange}>
            <Text style={styles.buttonText}>사용자 정보 변경</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.button} onPress={handleDeleteAccount}>
            <Text style={styles.buttonText}>회원 탈퇴</Text>
        </TouchableOpacity> */}

        {/* <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>로그아웃</Text>
        </TouchableOpacity> */}

      </View>
       {/* Modal for editing user information */}
       <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Edit Profile</Text>

          <TextInput 
            style={styles.input}
            onChangeText={setEditNickname}
            value={editNickname}
            placeholder="닉네임"
          />
          {/* Age Picker */}
            <Picker
            selectedValue={editAge}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) =>
                setEditAge(itemValue)
            }>
            {ageOptions.map((age, index) => (
                <Picker.Item key={index} label={age} value={age} />
            ))}
            </Picker>

            {/* Gender Picker */}
            <Picker
            selectedValue={editGender}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) =>
                setEditGender(itemValue)
            }>
            {genderOptions.map((gender, index) => (
                <Picker.Item key={index} label={gender} value={gender} />
            ))}
            </Picker>

          <TouchableOpacity
            style={styles.buttonSave}
            onPress={saveProfileChanges}
          >
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    width: '100%',
    alignItems: 'center',
    
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent:'flex-start',
    padding:10,
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  profileTextContainer: {
    justifyContent: 'center',
    marginRight:20,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  userPoints: {
    fontSize: 16,
    color: 'black',
  },
  infoText:{
    fontSize: 16,
    marginBottom:10,
    marginLeft:20,
    color: 'black',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '60%',
    alignItems: 'center',
    marginBottom: 70,
  },
  optionTitle: {

    fontSize: 18,
    color: 'black',
  },
  button: {
    width: '80%',
    padding: 10,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 5,
  },
  picker: {
    height: 50,
    width: 150,
    // Add any additional styling you want for the picker
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  input: {
    height: 40,
    width: '80%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  buttonSave: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "#2196F3",
  },
});

export default MyPage;