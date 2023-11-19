// ReviewScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, Image, TextInput, Button, Text } from 'react-native';

const ReviewScreen = ({ route, navigation }) => {
  const { photoUri } = route.params;
  const [reviewText, setReviewText] = useState('');

  const submitReview = () => {
    // Submit the review, then navigate back or to another screen
    console.log(reviewText);
    // Here you would send the review to your backend or handle it as needed
    navigation.goBack(); // Or navigation.navigate('SomeOtherScreen');
  };

  return (
    <View style={styles.container}>
      <Text>리뷰를 작성해 주세요.</Text>
      <Image source={{ uri: photoUri }} style={styles.image} />
      <TextInput
        style={styles.input}
        onChangeText={setReviewText}
        value={reviewText}
        placeholder="리뷰 작성"
        multiline
      />
      <Button title="제출하기" onPress={submitReview} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
  },
  image: {
    width: '100%',
    height: '50%', // Takes half of the screen size
  },
  input: {
    height: 100,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
  },
});

export default ReviewScreen;
