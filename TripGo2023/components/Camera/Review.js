import React, { useState } from 'react';
import { View, StyleSheet, Image, TextInput, Button, Text, ScrollView, TouchableOpacity } from 'react-native';

const ReviewScreen = ({ route, navigation }) => {
  const { photoUri } = route.params;
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(null);
  const [satisfied, setSatisfied] = useState(null);

  const categories = ['음식', '환경', '이벤트'];

  const submitReview = () => {
    console.log(reviewText, rating, satisfied,);
    navigation.goBack();
  };

  const toggleRating = (value) => {
    setRating(rating === value ? null : value);
  };

  const toggleSatisfied = (category) => {
    setSatisfied(satisfied === category ? null : category);
  };


  const getOptionButtonStyle = (category) => [
    styles.optionButton,
    (category === satisfied ) && styles.selectedOptionButton,
  ];

  return (
    <View style={styles.container}>
      <Text>리뷰를 작성해 주세요.</Text>
      <Image source={{ uri: photoUri }} style={styles.image} />
      <ScrollView horizontal={true} style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.optionButton, rating === 'good' && styles.selectedOptionButton]}
          onPress={() => toggleRating('good')}
        >
          <Text>좋았어요</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionButton, rating === 'bad' && styles.selectedOptionButton]}
          onPress={() => toggleRating('bad')}
        >
          <Text>별로였어요</Text>
        </TouchableOpacity>
      </ScrollView>
      <ScrollView horizontal={true} style={styles.optionsContainer}>
        {categories.map((cat, index) => (
          <TouchableOpacity
            key={index}
            style={getOptionButtonStyle(cat)}
            onPress={() => toggleSatisfied(cat)}
          >
            <Text>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
 
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
    height: '50%',
  },
  optionsContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },

  input: {
    height: 100,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '100%',
    marginTop: 10,
    marginBottom: 20,
  },
  optionButton: {
    marginHorizontal: 5,
    padding: 5,
    height:30,
    borderRadius: 5,
    backgroundColor: 'white', // default background color
  },
  selectedOptionButton: {
    borderColor: 'blue', // selected state border color
    backgroundColor: 'lightblue', // selected state background color
  },
  // ... other styles
});

export default ReviewScreen;