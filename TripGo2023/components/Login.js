import React, { useState } from 'react';
import {View, StyleSheet, TextInput, Button, ImageBackground, KeyboardAvoidingView, Platform, TouchableOpacity, Text, Image } from 'react-native';
import { firebaseAuth, signInWithEmailAndPassword } from '../firebaseConfig';

export default function Login({ handleLogin, navigation }) {
  const handleSignup = () => {
    navigation.navigate('SignUp');
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const auth = firebaseAuth;

  const handleLoginPress = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // 로그인 성공 처리
        console.log('로그인 성공:', userCredential.user);
        handleLogin();
      })
      .catch((error) => {
        // 로그인 실패 시 처리할 코드입니다!
        if (error.code === 'auth/invalid-email') {
          alert('아이디 혹은 비밀번호가 틀렸습니다.');
        }
      });
  };

  return (
    

    <ImageBackground source={require("../assets/LoginImage.png")} style={styles.imgContainer}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        
      <Image source={require("../assets/loginIcon.png")} style={styles.logo} />

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={setPassword}
          value={password}
        />

        <TouchableOpacity style={styles.button} onPress={handleLoginPress}>
          <Text style={styles.buttonText}>로그인</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.buttonSignUp]} onPress={handleSignup}>
          <Text style={[styles.buttonText, styles.buttonTextSignUp]}>회원가입</Text>
        </TouchableOpacity>
      
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

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
    backgroundColor: 'rgba(255,255,255,0.8)', // 흰색 배경에 투명도 적용
    paddingHorizontal: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
  },
  button: {
    backgroundColor: 'rgba(0,0,0,0.8)', // 검정색 배경에 투명도 적용
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonSignUp: {
    backgroundColor: 'rgba(135,206,250,0.8)', // skyblue 배경에 투명도 적용
  },
  buttonTextSignUp: {
    color: 'white',
  },
  logo: {
    width: 281.5,
    height: 80,
    marginBottom: 70,
  },

});