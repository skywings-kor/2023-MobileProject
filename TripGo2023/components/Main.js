import React, { useState,useEffect ,useRef  } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView,FlatList, Linking, PermissionsAndroid  } from 'react-native';

import Config from '../API_Config'

import Geolocation from '@react-native-community/geolocation';

import GeolocationPosition from 'react-native-geolocation-service';

const Main = () => {
  //API 호출
  const Tour_apiKey = Config.TOUR_API_KEY;
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  //오늘 날짜 계산
  const currentDate = new Date();
  const formattedDate = currentDate.getFullYear() 
                      + ('0' + (currentDate.getMonth() + 1)).slice(-2) 
                      + ('0' + currentDate.getDate()).slice(-2);

  

  //행사정보용
  const [festival_Data, setFestival_Data] = useState([]);

  //주변 행사정보
  const [nearFestival, setNearFestival] = useState([]);

  //사용자 현재 위치정보용
  const [location, setLocation] = useState(36.3504,127.3845);

  useEffect(() => {
    requestPermissions();
    GeolocationPosition.getCurrentPosition(
      position => {
        setLocation(position.coords);
        setIsLoadingLocation(false); // Set loading to false after getting location
      },
      error => {
        console.error(error.code, error.message);
        setIsLoadingLocation(false); // Also set loading to false in case of error
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  }, []);

  const horizontalData = [
    { id: '8', u_img: 'https://via.placeholder.com/150', timestamp: new Date(), region: 'text 1', city: 'text' },
    { id: '9', u_img: 'https://via.placeholder.com/150', timestamp: new Date(), region: 'text 1', city: 'text' },
    { id: '10', u_img: 'https://via.placeholder.com/150', timestamp: new Date(), region: 'text 1', city: 'text' },
    { id: '11', u_img: 'https://via.placeholder.com/150', timestamp: new Date(), region: 'text 1', city: 'text' },
    { id: '12', u_img: 'https://via.placeholder.com/150', timestamp: new Date(), region: 'text 1', city: 'text' },
  ];

  // 수직 스크롤 데이터
  const verticalData = [
    { id: '1', u_img: 'https://via.plac eholder.com/150', timestamp: new Date(), region: 'Region 1', city: 'City A' },
    { id: '2', u_img: 'https://via.placeholder.com/150', timestamp: new Date(), region: 'Region 1', city: 'City A' },
    { id: '3', u_img: 'https://via.placeholder.com/150', timestamp: new Date(), region: 'Region 1', city: 'City A' },
    { id: '4', u_img: 'https://via.placeholder.com/150', timestamp: new Date(), region: 'Region 1', city: 'City A' },
    { id: '5', u_img: 'https://via.placeholder.com/150', timestamp: new Date(), region: 'Region 1', city: 'City A' },
    { id: '6', u_img: 'https://via.placeholder.com/150', timestamp: new Date(), region: 'Region 1', city: 'City A' },
    { id: '7', u_img: 'https://via.placeholder.com/150', timestamp: new Date(), region: 'Region 1', city: 'City A' },
  ];

  const renderHorizontalItem = ({ item }) => {
    const handleLinkPress = () => {
      
      const url = `https://www.ktourmap.com/spotDetails.jsp?contentId=${item.contentid}`;
      Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
    };


    return(
      <TouchableOpacity style={styles.gridItemHorizontal} onPress={handleLinkPress}>
          <Image 
            source={item.firstimage ? { uri: item.firstimage } : require('../assets/empty_img.png')}
            style={styles.gridImageHorizontal} 
          />

          {/* <Text style={styles.gridText}>
            기간: {item.eventstartdate} ~ {item.eventenddate}
          </Text> */}
          
          <Text style={styles.gridText}>
            {item.title}
          </Text>

          <Text style={styles.gridText}>
            장소: {item.addr1}
          </Text>

      </TouchableOpacity>
    )
  };
  
  // ?.toISOString().split('T')[0]
  // 수직 스크롤 아이템 렌더링 함수
  const renderVerticalItem = ({ item }) => {

    const handleLinkPress = () => {
      const url = `https://www.ktourmap.com/spotDetails.jsp?contentId=${item.contentid}`;
      Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
    };


    return(
      <TouchableOpacity style={styles.gridItem} onPress={handleLinkPress}>
        <Image 
          source={item.firstimage ? { uri: item.firstimage } : require('../assets/empty_img.png')}
          style={styles.gridImage} 
        />

        <Text style={styles.gridDateLabel}>
          기간: {item.eventstartdate} ~ {item.eventenddate}
        </Text>
        
        <Text style={styles.gridRegionLabel}>
          {item.title}
        </Text>

        <Text style={styles.gridPlaceLabel}>
          장소: {item.addr1}
        </Text>

    </TouchableOpacity>
  )
  };

  const HorizontalSection = ({}) => (
    <>
    <Text style={styles.contentTitle}> 내 주변 최신 행사 </Text>
    <FlatList
      data={nearFestival}
      horizontal={true}
      renderItem={renderHorizontalItem}
      keyExtractor={(item, index) => item.id + ':' + index}
      style={styles.horizontalList}
    />
    <Text style={styles.contentTitle}>전국 운영 중인 행사</Text>
    </>
  );


  //축제 관련 Vertical 최신화용
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://apis.data.go.kr/B551011/KorService1/searchFestival1?serviceKey=${Tour_apiKey}&numOfRows=15&pageNo=1&MobileOS=AND&MobileApp=TripGO&_type=json&listYN=Y&arrange=A&eventStartDate=${formattedDate}`);
        console.log("이건왜 안됨")
        console.log(process.env.TOUR_API_KEY)

        const data = await response.json();
        setFestival_Data(data.response.body.items.item);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);



  
  async function requestPermissions(){
    await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );    
  }

//위치 허락 관련 
useEffect(() => {
    requestPermissions()
    GeolocationPosition.getCurrentPosition(
        position => {
          setLocation(position.coords);
        },
        error => {
          console.error(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );

    // handleCheck()
},[])



  //내 주변 행사 최신화용
  useEffect(() => {
    if (!isLoadingLocation && location) {
      const updateNearFes = async () => {
        try {
          //20km내 감지하는거입니다
          const response = await fetch(`https://apis.data.go.kr/B551011/KorService1/locationBasedList1?serviceKey=${Tour_apiKey}&numOfRows=5&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&listYN=Y&arrange=D&mapX=${location.longitude}&mapY=${location.latitude}&radius=20000&contentTypeId=15`);

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data = await response.json();

          if (!data || !data.response || !data.response.body) {
            throw new Error('Invalid data structure');
          }

          setNearFestival(data.response.body.items.item);
        } catch (error) {
          console.error('Error fetching nearby festivals:', error);
        }
      };

      updateNearFes();
    }
  }, [location, isLoadingLocation]);





  //festival정보 가져왔을때 실행
  useEffect(() => {
    console.log(festival_Data);
    console.log(formattedDate);

  }, [festival_Data]); // festival_Data 상태가 변경될 때마다 실행됩니다.


  return (
    <View style={styles.screenContainer}>
      {/* 헤더 섹션 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TripGo</Text>
        {/* 추가적인 아이콘이 필요한 경우 여기에 추가 */}
        <View style={styles.headerIcons}>
          {/* Icons can be added here if needed */}
        </View>
      </View>


      
  
      <FlatList
        data={festival_Data}
        renderItem={renderVerticalItem}
        keyExtractor={(item, index) => item.id + ':' + index}
        numColumns={2}
        ListHeaderComponent={HorizontalSection}
        style={styles.verticalList}
      />
     
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    color: 'black',
  },

  horizontalList: {
    flexGrow: 0, 
  },
  verticalList: {
    flex: 1,
    
  },
   container: {
    flex: 1,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    color: 'rgb(182,20,45)',
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    width: 75,
    justifyContent: 'space-between',
  },
  actionButton: {
    margin: 10,
    height:70,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 10,
  },
  actionText: {
    color: 'white',
    textAlign: 'center',
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 10,
    color: 'black',
  },
   horizontalMenu: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8F8F8', 
    paddingVertical: 5, 
  },
    menuItem: {
     padding:10,
  },
  menuItemText: {
    
  },
   bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 10, 
    color: 'black',
  },
   scrollViewContainer: {
    alignItems: 'center',
  },
  iconBox: {
    marginRight: 20, 
    alignItems: 'center', 
    
  },
  iconImage: {
    width: 150, 
    height: 150, 
    resizeMode: 'contain', 
   
  },
  gridItem: {
    flex: 1 / 2, 
    aspectRatio: 1, // 이 부분은 유지하거나 조정할 수 있습니다.
    margin: 4,
    height: 200, // 요소의 높이를 늘렸습니다.
    padding: 10, // 내부 패딩을 추가하여 텍스트에 공간을 제공합니다.
  },
  gridImage: {
    width: '100%', 
    height: '70%', 
  },
  gridDateLabel: {
    fontSize: 12,
    color: 'black',
  },
  
  gridPlaceLabel: {
    fontSize: 11,
    color: 'black',
    fontWeight: 'bold',
  },

  gridRegionLabel: {
    fontSize: 14, 
    fontWeight: 'bold', 
    color: 'black',
  },
  flatListContainer: {
    height: 150, 
  },
  
  gridItemHorizontal: {
    margin: 10, 
    width: 150,
    
  
  },
  gridImageHorizontal: {
    width: '100%', 
    height: 100,
  },
  gridText: {
    textAlign: 'center', 
    color: 'black',
   
  },

});

export default Main;