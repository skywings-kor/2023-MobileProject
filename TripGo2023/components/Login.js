import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Image } from 'react-native';
import { firebaseAuth, signInWithEmailAndPassword } from '../firebaseConfig';

export default function Login({ handleLogin, navigation }) {
  const handleSignup = () => {
    navigation.navigate('SignUp');
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  // const imgSignup = require('../assets/Signup.png');
  // const imgLogin = require('../assets/Login.png');

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
    <View style={styles.container}>
      {/* <Image source={require('../assets/AppIcon.png')} style={styles.logo} /> */}

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
      />

      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button onPress={handleLoginPress} title="로그인" color="black" />
        </View>
        <View style={[styles.button]}>
          <Button  onPress={handleSignup} title="회원가입" color="skyblue" fontSize={28}/>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  logo: {
    width: '59.3%',
    height: '8%',
    marginBottom: 30,
  },
  input: {
    marginBottom: 20,
    fontSize: 20,
    width: '80%',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  buttonContainer: {
    marginTop:20,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '60%',
    height: 100,
  },
  button: {
    marginTop:0,
    width: '120%',
    height: 50,
    marginBottom: 10,
    borderRadius: 20,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 20,
    alignSelf: 'center',
  },
});
