import React, { useState } from 'react';

import { StyleSheet, TextInput, Button, ImageBackground, KeyboardAvoidingView, Platform, TouchableOpacity, Text, Image, View } from 'react-native';
import { firestoreDB,createUserWithEmailAndPassword,firebaseAuth , addDoc,doc,setDoc,getDoc} from '../firebaseConfig';

import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const [nickName, setnickName] = useState('');

  const [selectedGender, setSelectedGender] = useState("남성");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("10대");


  const auth = firebaseAuth;
  const db = firestoreDB


  const handleNickName = (value) => {
    setnickName(value);
  };

  const handleGender = (value) => {
    setGender(value);
  };

  const handleAge = (value) => {
    setAge(value);
  };

  const handleSignup = () => {
    if(nickName.length < 4){
      alert('닉네임은 최소 4자 이상이어야 합니다.')
      return;
    }
    

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const uid = userCredential.user.uid;
        const userDocRef = doc(db, `userInfo/${uid}`)
        const userData = {
            userID: uid,
            nickname: nickName,
            gender: selectedGender,
            ageGroup: selectedAgeGroup,
            profile_img: '',
            point: 1000,
        }

        //파이어스토어한테 이제 보냅니다
        setDoc(userDocRef, userData)
          .then(() => {

          })

          .catch((error) => {
            alert('firestore 문서 생성에 실패했습니다:');
          });

          
        alert('회원가입 성공!');
        // 여기에 회원가입 후 처리할 로직 추가
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    
        if (errorCode === 'auth/weak-password') {
          alert('비밀번호는 최소 6자 이상이어야 합니다.');
        } else if (errorCode === 'auth/email-already-in-use') {
          alert('이미 사용 중인 이메일입니다.');
        } else if (errorCode === 'auth/invalid-email') {
          alert('유효하지 않은 이메일입니다.');
        }
        
        else {
          alert(errorMessage);
        }
      });
  };

  return (
    <ImageBackground source={require("../assets/LoginImage.png")} style={styles.imgContainer}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>

          {/* <Image source={require('../assets/petLogo.png')} style={styles.logo} /> */}
          <TextInput
            placeholder="Email"
            onChangeText={(text) => setEmail(text)}
            value={email}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry
            style={styles.input}
          />
          <TextInput
            placeholder="NickName"
            onChangeText={(text) => setnickName(text)}
            value={nickName}
            style={styles.input}
          />
          
          <Picker
            selectedValue={selectedGender}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setSelectedGender(itemValue)}
          >
            <Picker.Item label="남성" value="male" />
            <Picker.Item label="여성" value="female" />
          </Picker>

          <Picker
            selectedValue={selectedAgeGroup}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setSelectedAgeGroup(itemValue)}
          >
            {['10대', '20대', '30대', '40대', '50대', '60대', '70대', '80대', '90대'].map((age) => (
              <Picker.Item key={age} label={age} value={age} />
            ))}
          </Picker>
          

          

          <TouchableOpacity onPress={handleSignup} style={styles.button}>
            <Text style={styles.buttonText}>회원가입 진행</Text>
          </TouchableOpacity>

        </KeyboardAvoidingView>
    </ImageBackground>
  );
}

export default SignUp;


const styles = StyleSheet.create({
  imgContainer: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 50,
    width: '100%',
    marginVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.85)', // 투명도 조정
    paddingHorizontal: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    color: '#333', // 입력 텍스트 색상 조정
  },
  button: {
    backgroundColor: '#ff7f50', // Coral 색상 대신, 여행 앱에 어울리는 색상으로 변경
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20, // 버튼의 둥근 모서리를 조금 더 둥글게
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
    shadowColor: 'rgba(0,0,0, .4)', // 그림자 효과 추가
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 2, // 안드로이드를 위한 그림자 효과
    marginTop:30,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    
  },

  buttonSignUp: {
    backgroundColor: 'rgba(135,206,250,0.85)', // skyblue 배경에 투명도 적용
  },
  buttonTextSignUp: {
    color: 'white',
  },
  logo: {
    width: 281.5,
    height: 80,
    marginBottom: 70,
  },
  picker: {
    height: 50,
    width: '45%',
    marginVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    color: '#333',
  },

});

