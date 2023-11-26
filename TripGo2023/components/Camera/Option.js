import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Option = ({ route }) => {
  const { photoUri, location } = route.params;
  const navigation = useNavigation();

  const handleRegisterAttraction = () => {
    navigation.navigate('관광지등록', { photoUri, location });
  };

  const handleVerifyAttraction = () => {
    // 이동할 인증 화면으로 이동 (예제에서는 가정)
    navigation.navigate('리뷰등록', { photoUri, location });
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: photoUri }} style={styles.previewImage} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleRegisterAttraction} style={styles.button}>
          <Text style={styles.buttonText}>관광지 등록</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleVerifyAttraction} style={styles.button}>
          <Text style={styles.buttonText}>관광지 인증</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  previewImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Option;