import React, { useState, useEffect ,useRef  } from 'react';
import { View, StyleSheet, Image, TextInput, Button, Text, ScrollView, TouchableOpacity,Alert  } from 'react-native';
import Config from '../../API_Config'
import { runTransaction, firestoreDB, doc, setDoc, updateDoc, addDoc, collection,firebaseAuth ,getDoc} from '../../firebaseConfig'; 

export const useSleep = delay => new Promise(resolve => setTimeout(resolve, delay));


const ReviewScreen = ({ route, navigation }) => {

  const Tour_apiKey = Config.TOUR_API_KEY;

  const { photoUri,location } = route.params;

  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(null);
  const [satisfied, setSatisfied] = useState(null);

  const categories = ['음식', '환경', '이벤트'];

  //긍정 부정 퍼센테이지
  const [positive, setPositive] = useState(0)
  const [negative, setNegative] = useState(0)
  
  //행사정보용
  const [festival_Data, setFestival_Data] = useState([]);

  //현재 로그인한 사용자 UID
  const uid = firebaseAuth.currentUser.uid;


  //감정 분석 프로세스
  const predictReview = async ()=>{
    
      // 리뷰 텍스트를 분석하기 위한 요청을 보냅니다.
    try {
      let response = await fetch('http://54.166.160.243:5001/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // 분석할 리뷰 텍스트
        body: JSON.stringify({ sentence: reviewText }) 
      });

      if (!response.ok) {
        throw new Error(`HTTP 에러발생! : ${response.status}`);
      }

      // 응답 데이터를 JSON 형식으로 파싱
      let responseFeel = await response.json();
      console.log(responseFeel);


      // 응답으로부터 긍정 및 부정 감정의 수치를 추출 그리고 상태에 저장
      setPositive(responseFeel.positive_prob);
      setNegative(responseFeel.negative_prob);
      
      console.log(responseFeel.positive_prob)
      console.log(responseFeel.negative_prob)
      
      //useState잘 안되어서 이렇게 전달하려고 하는중
      const positiveScore = parseInt(responseFeel.positive_prob * 100);
      const negativeScore = 100-positiveScore

      return { positiveScore, negativeScore };
    } 

    catch (error) {
      console.error('Fetching Error 발생함:', error);
    }

  }

  //DB에 보내는 감정 결과 값
 // DB에 보내는 감정 결과 값
  const sendPredictResult = async (item, positiveScore,negativeScore) => {
    try {
      console.log(item)
      console.log(item.addr1)
      // 문서 참조 생성. 여기서 item.addr1은 문서 ID가 됩니다.
      const predictDocRef = doc(firestoreDB, 'User_Review', item[0].addr1);
      // 필드에 들어갈 내용
      const sendData = {
        [uid]: [positiveScore, negativeScore], // 숫자로 변환
        // 다른 필드도 필요하다면 여기에 추가합니다.
      };

      // 문서에 데이터 설정 (특정 문서에 데이터를 추가하거나 업데이트)
      await setDoc(predictDocRef, sendData, { merge: true });

      console.log('Document successfully written!');
    } catch (e) {
      console.error('Error writing document: ', e);
    }
  };


  //핸들링 - festival data용도
  const handleFestival_Data=(item)=>{
    setFestival_Data(item);
  }

  //리뷰가 성공적으로 등록되었을 때 100포인트 주기위한 기능
  const incrementUserPoints = async () => {
    try {

      const docRef = doc(firestoreDB, 'userInfo', uid);
  
      await runTransaction(firestoreDB, async (transaction) => {
        const userDoc = await transaction.get(docRef);
        if (!userDoc.exists()) {
          throw "Document does not exist!";
        }
  
        const newPoints = (userDoc.data().point || 0) + 100; // 기존 포인트에 100을 더합니다.
        transaction.update(docRef, { point: newPoints });
      });
  
      console.log("User points successfully incremented by 100");
    } catch (error) {
      console.error("Error incrementing user points: ", error);
    }
  };


  //전송 버튼 누를 때 이벤트
  const submitReview = async () => {
    console.log(reviewText, rating, satisfied,location);

    //1차적으로 현재 사용자 핸드폰으로 사진 찍은 위치가 이 근방에 해당 관광지가 있는지! 검증
    try {

      //200m 안 감지
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
      }

      else
      {
        //AI서버에 보내서 리뷰 결과값 반환하는 프로세스이고 여기서 pos, nega 담겨짐
        const scores= await predictReview()
        
        await useSleep(3000);
        console.log("________________-------")
        console.log(data.response.body.items.item)
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
    }
    
    catch (error) {
      console.error(error);
    }
    navigation.navigate('main');
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
      {/* <ScrollView horizontal={true} style={styles.optionsContainer}>
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
  */}
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