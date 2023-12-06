import React, { useState, useEffect ,useRef  } from 'react';
import { View, StyleSheet, Image, TextInput, Button, Text, ScrollView, TouchableOpacity,Alert, ActivityIndicator } from 'react-native';
import Config from '../../API_Config'
import { runTransaction, firestoreDB, doc, setDoc, updateDoc, addDoc, collection,firebaseAuth ,getDoc} from '../../firebaseConfig'; 

export const useSleep = delay => new Promise(resolve => setTimeout(resolve, delay));

const ReviewScreen = ({ route, navigation }) => {
  const Tour_apiKey = Config.TOUR_API_KEY;
  const { photoUri, location } = route.params;
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(null);
  const [satisfied, setSatisfied] = useState(null);
  const categories = ['음식', '환경', '이벤트'];
  const [positive, setPositive] = useState(0)
  const [negative, setNegative] = useState(0)
  const [festival_Data, setFestival_Data] = useState([]);
  const uid = firebaseAuth.currentUser.uid;
  const [isLoading, setIsLoading] = useState(false); // 인디케이터 표시 상태

  const predictReview = async () => {
    try {
      let response = await fetch('http://54.166.160.243:5001/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sentence: reviewText }) 
      });

      if (!response.ok) {
        throw new Error(`HTTP 에러발생! : ${response.status}`);
      }

      let responseFeel = await response.json();

      setPositive(responseFeel.positive_prob);
      setNegative(responseFeel.negative_prob);

      const positiveScore = parseInt(responseFeel.positive_prob * 100);
      const negativeScore = 100 - positiveScore;

      return { positiveScore, negativeScore };
    } catch (error) {
      console.error('Fetching Error 발생함:', error);
    }
  }

  const sendPredictResult = async (item, positiveScore, negativeScore) => {
    try {
      const predictDocRef = doc(firestoreDB, 'User_Review', item[0].addr1);
      const sendData = {
        [uid]: [positiveScore, negativeScore],
      };
      await setDoc(predictDocRef, sendData, { merge: true });
    } catch (e) {
      console.error('Error writing document: ', e);
    }
  };

  const handleFestival_Data = (item) => {
    setFestival_Data(item);
  }

  const incrementUserPoints = async () => {
    try {
      const docRef = doc(firestoreDB, 'userInfo', uid);
      await runTransaction(firestoreDB, async (transaction) => {
        const userDoc = await transaction.get(docRef);
        if (!userDoc.exists()) {
          throw "Document does not exist!";
        }
        const newPoints = (userDoc.data().point || 0) + 100;
        transaction.update(docRef, { point: newPoints });
      });
      console.log("User points successfully incremented by 100");
    } catch (error) {
      console.error("Error incrementing user points: ", error);
    }
  };

  const submitReview = async () => {
    setIsLoading(true); // 등록 중에 인디케이터 표시 시작
    try {
      const response = await fetch(`https://apis.data.go.kr/B551011/KorService1/locationBasedList1?serviceKey=${Tour_apiKey}&numOfRows=10&pageNo=1&MobileOS=AND&MobileApp=TripGO&_type=json&listYN=Y&arrange=A&mapX=${location.longitude}&mapY=${location.latitude}&radius=200&contentTypeId=12`);
      const data = await response.json();
      handleFestival_Data(data.response.body.items.item);
      if (data.response.body.totalCount === 0) {
        Alert.alert(
          "알림", // Alert Title
          "관광지가 근처에 없습니다", // Alert Message
          [
            { text: "확인", onPress: () => console.log("OK Pressed") }
          ],
          { cancelable: false }
        );
      } else {
        const scores = await predictReview()
        await useSleep(3000);
        sendPredictResult(data.response.body.items.item, scores.positiveScore, scores.negativeScore)
        await useSleep(1000);
        incrementUserPoints();
        await useSleep(1000);
        Alert.alert(
          "알림", // Alert Title
          "성공적으로 리뷰가 등록되었습니다", // Alert Message
          [
            { text: "확인", onPress: () => console.log("OK Pressed") }
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // 등록 성공 또는 실패 시 인디케이터 숨김
      navigation.navigate('main');
    }
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
      <TextInput
        style={styles.input}
        onChangeText={setReviewText}
        value={reviewText}
        placeholder="리뷰 작성"
        multiline
      />
      <Button title="제출하기" onPress={submitReview} />
      {isLoading && (
        <View style={styles.indicatorContainer}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      )}
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
    backgroundColor: 'white',
  },
  selectedOptionButton: {
    borderColor: 'blue',
    backgroundColor: 'lightblue',
  },
  indicatorContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ReviewScreen;