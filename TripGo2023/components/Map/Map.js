import React, { useState,useEffect ,useRef  } from 'react';
import { StyleSheet,View, Text, Button, TextInput, Image, Modal, TouchableOpacity,ScrollView, PermissionsAndroid } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';

import GeolocationPosition from 'react-native-geolocation-service';

import { launchImageLibrary } from 'react-native-image-picker';
import { Picker } from "@react-native-picker/picker";

import MapView, { Marker } from 'react-native-maps';
import { serverTimestamp,firestoreDB, firebaseAuth,collection, doc, setDoc, getDoc, query, orderBy, limit, getDocs, analytics, storage, ref, uploadBytes, getDownloadURL ,onAuthStateChanged, addDoc } from '../../firebaseConfig';




const Map=()=>{
    const regions = [
        { name: '대전광역시', latitude: 36.3504, longitude: 127.3845 },
        { name: '서울특별시', latitude: 37.5665, longitude: 126.9780 },
        { name: '부산광역시', latitude: 35.1796, longitude: 129.0756 },
        { name: '광주광역시', latitude: 35.126033, longitude: 126.831302 },
        { name: '세종특별시', latitude: 36.56069, longitude: 127.2587334 },
        { name: '대구광역시', latitude: 35.798838, longitude: 128.583052 },
        { name: '인천광역시', latitude: 37.469221, longitude: 126.573234 },
        { name: '울산광역시', latitude: 35.519301, longitude: 129.239078 },
        { name: '경기도', latitude: 37.567167, longitude: 127.190292 },
        { name: '강원도', latitude: 37.555837, longitude: 128.209315 },
        { name: '충청남도', latitude: 36.557229, longitude: 126.779757 },
        { name: '충청북도', latitude: 36.628503, longitude: 127.929344 },
        { name: '경상북도', latitude: 36.248647, longitude: 128.664734 },
        { name: '경상남도', latitude: 35.259787, longitude: 128.664734 },
        { name: '전라북도', latitude: 35.716705, longitude:  127.144185 },
        { name: '전라남도', latitude: 34.819400, longitude: 126.893113 },
        { name: '제주특별자치도', latitude: 33.364805, longitude: 126.542671 }
      ];

      const cities = [
        ['동구', '중구', '서구','유성구','대덕구'],
        ['서울시'],
        ['해운대구', '중구', '서구','동구','영도구','부산진구','동래구','남구','북구','사하구','금정구','강서구','연제구','수영구','사상구','기장군'],
        ['서구', '북구', '남구','동구','광산구'],
        ['세종시'],
        ['중구', '동구', '서구','남구','북구','수성구','달서구','달성군'],
        ['중구', '동구', '미추홀구','연수구','남동구','부평구','계양구','서구','강화군','옹진군'],
        ['중구','남구','동구','북구','울주군'],
        ['고양시', '수원시', '용인시','과천시','광명시','광주시','구리시','군포시','김포시','남양주시','동두천시','부천시','성남시','시흥시','안산시','안성시','안양시','양주시','여주시','오산시','의왕시','의정부시','이천시','파주시','평택시','포천시','하남시','화성시','가평군','양평군','연천군'],
        ['강릉시', '동해시', '삼척시','속초시','원주시','춘천시','태백시','고성군','양구군','양양군','영월군','인제군','정선군','철원군','평창군','홍천군','화천군','횡성군'],
        ['계룡시', '공주시', '논산시','당진시','보령시','서산시','아산시','천안시','금산군','부여군','서천군','예산군','청양군','태안군','홍성군'],
        ['제천시', '청주시', '충주시','괴산군','단양군','보은군','영동군','옥천군','음성군','증평군','진천군'],
        ['경산시', '경주시', '구미시','김천시','문경시','상주시','안동시','영주시','영천시','포항시'],
        ['창원시', '거제시', '김해시','밀양시','사천시','양산시','진주시','통영시'],
        ['군산시', '김제시', '남원시','익산시','전주시','정읍시', '장수군'],
        ['광양시', '나주시', '목포시','순천시','여수시'],
        ['서귀포시', '제주시']
    ];

    const [location, setLocation] = useState(36.3504,127.3845);
    
    const [selectedRegion, setSelectedRegion] = useState('대전광역시');
    const [selectedCity, setSelectedCity] = useState('동구');
    const [selectCount, setselectCount] = useState(5);
    const [chinge, setchinge] = useState(1);

    const [modalVisible, setModalVisible] = useState(false);

    const mapRef = useRef(null);

    const counter = [
        {value: 5, letter:'5'},{value: 10, letter:'10'},{value: 15, letter:'15'},{value: 20, letter:'20'},
    ];

      
    const handleFilterButtonClick = () => {
        setModalVisible(true);
    };

    const handleRegionChange = (value) => {
        setSelectedRegion(value);
        setSelectedCity(cities[regions.findIndex((region) => region.name === value)][0]);
    };

    const handleCityChange = (value) => {
        setSelectedCity(value);
    };

    const handleCountChange = (value) => {
        setselectCount(value);
    };

    //필터에서 적용 버튼 이벤트
    const handleFilterApply = () => {
        setModalVisible(false);
        const selectedRegionObj = regions.find((region) => region.name === selectedRegion);
        const newRegion = {
          latitude: selectedRegionObj.latitude,
          longitude: selectedRegionObj.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
        
        if(chinge == 1) setchinge(0);
        else setchinge(1);
        mapRef.current.animateToRegion(newRegion);
    
    };    


    //현재 위치 버튼을 눌렀을 때 맵 현재 위치로 이동되는 이벤트
    const handleNowPosition = () => {
        const newRegion = {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
        
        if(chinge == 1) setchinge(0);
        else setchinge(1);
        mapRef.current.animateToRegion(newRegion);
    
    };  
    async function requestPermissions(){
        await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );    
    }
    
    // const handleCheck=()=>{
    //     console.log(location.latitude)
    //     console.log(location.longitude)
    // }
    
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
    })
    

    const [mapRegion, setMapRegion] = useState({
        latitude: 36.3504,
        longitude: 127.3845,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });
    
    
    return(
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                region={mapRegion}
                style={styles.map}
            >
                
            </MapView>
            <TouchableOpacity style={styles.filterButton} onPress={handleFilterButtonClick}>
        <Text style={styles.filterButtonText}>위치 필터 기능</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.nowPosButton} onPress={handleNowPosition}>
        <Image source={require("../../assets/now_position_Icon.png")} style={styles.nowposIcon} /> 
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>기준 위치 설정</Text>
            <Text style={styles.label}>지역:</Text>
            <Picker
              selectedValue={selectedRegion}
              style={styles.picker}
              onValueChange={handleRegionChange}
            >
              {regions.map((region, index) => (
                <Picker.Item key={index} label={region.name} value={region.name} />
              ))}
            </Picker>
            <Text style={styles.label}>도시:</Text>
            <Picker
              selectedValue={selectedCity}
              style={styles.picker}
              onValueChange={handleCityChange}
            >
              {cities[regions.findIndex((region) => region.name === selectedRegion)].map(
                (city, index) => (
                  <Picker.Item key={index} label={city} value={city} />
                )
              )}
            </Picker>
            <Text style={styles.modalTitle}>위치 표시 개수 설정</Text>
            <Picker
              selectedValue={selectCount}
              style={styles.picker}
              onValueChange={handleCountChange}
            >
              {counter.map((count, index) => (
                <Picker.Item key={index} label={count.letter} value={count.value} />
              ))}
            </Picker>
            <TouchableOpacity style={styles.applyButton} onPress={handleFilterApply}>
              <Text style={styles.applyButtonText}>적용</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

        </View>
    )
}

export default Map;


const styles = StyleSheet.create({
    ImageSize:{
      margin:'5%',
      width:"90%",
      height:150,
    },
    PlaceContainer:{
      borderColor:"gray",
      borderWidth:2,
      margin:10,
    },
    name: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
      marginLeft:"5%",
    },
    location: {
      fontSize: 14,
      height: 20,
      marginLeft:"5%",
      width: '80%',
      marginBottom: 5,
    },
    infoContainer: {
      flex: 1,
      marginRight: 10,
    },
    onrow:{
      flexDirection:'row',
      alignItems:'flex-start',
    },
    like: {
      marginLeft: 5,
      marginRight: 5,
  },
  imagelike:{
      width: 20,
      height: 20,
      resizeMode: 'cover',
      marginLeft:"5%",
      marginBottom:"5%",
      borderRadius: 8,
  },
    container: {
      flex: 1,
    },
    map: {
      width: '100%',
      height: '100%',
    },
    ListButton:{
      position: 'absolute',
      bottom: '1%',
      alignSelf: 'center',
      backgroundColor: 'skyblue',
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    filterButton: {
      position: 'absolute',
      top: '1%',
      alignSelf: 'center',
      backgroundColor: 'skyblue',
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 16,
    },

    nowPosButton: {
      position: 'absolute',
      top: '90%',
      left: 0, // 화면의 왼쪽 가장자리에 정렬합니다.
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    
    nowposIcon:{
      width: 40,
      height: 40,
    },

    filterButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    scrollContainer:{
      backgroundColor: 'white',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 16,
      borderRadius: 8,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    label: {
      marginBottom: 8,
    },
    picker: {
      marginBottom: 16,
      height: 50,
      width: 200,
    },
    applyButton: {
      backgroundColor: 'skyblue',
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 16,
      alignSelf: 'flex-end',
    },
    applyButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
  });
  