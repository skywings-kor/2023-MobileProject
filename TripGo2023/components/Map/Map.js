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



  const cities_copy = [
    [ 
      { name:'동구', latitude: 36.35218384, longitude: 127.4170933 }, 
      { name:'중구', latitude: 36.32582989, longitude: 127.421381 } , 
      { name:'서구', latitude: 36.35707299, longitude: 127.3834158 }, 
      { name:'유성구', latitude: 36.36405586, longitude: 127.3561363 } ,
      { name:'대덕구', latitude: 36.35218384, longitude: 127.4170933 }
    ],
    
    [
      {name: '강남구', latitude: 37.514575, longitude: 127.0495556},
      {name: '강동구', latitude: 37.52736667, longitude: 127.1258639},
      {name: '강북구', latitude: 37.63695556, longitude: 127.0277194},
      {name: '강서구', latitude: 37.54815556, longitude: 126.851675},
      {name: '관악구', latitude: 37.47538611, longitude: 126.9538444},
      {name: '광진구', latitude: 37.53573889, longitude: 127.0845333},
      {name: '구로구', latitude: 37.49265, longitude: 126.8895972},
      {name: '금천구', latitude: 37.44910833, longitude: 126.9041972},
      {name: '노원구', latitude: 37.65146111, longitude: 127.0583889},
      {name: '도봉구', latitude: 37.66583333, longitude: 127.0495222},
      {name: '동대문구', latitude: 37.571625, longitude: 127.0421417},
      {name: '동작구', latitude: 37.50965556, longitude: 126.941575},
      {name: '마포구', latitude: 37.56070556, longitude: 126.9105306},
      {name: '서대문구', latitude: 37.57636667, longitude: 126.9388972},
      {name: '서초구', latitude: 37.48078611, longitude: 127.0348111},
      {name: '성동구', latitude: 37.56061111, longitude: 127.039},
      {name: '성북구', latitude: 37.58638333, longitude: 127.0203333},
      {name: '송파구', latitude: 37.51175556, longitude: 127.1079306},
      {name: '양천구', latitude: 37.51423056, longitude: 126.8687083},
      {name: '영등포구', latitude: 37.52361111, longitude: 126.8983417},
      {name: '용산구', latitude: 37.53609444, longitude: 126.9675222},
      {name: '은평구', latitude: 37.59996944, longitude: 126.9312417},
      {name: '종로구', latitude: 37.57037778, longitude: 126.9816417},
      {name: '중구', latitude: 37.56100278, longitude: 126.9996417},
      {name: '중랑구', latitude: 37.60380556, longitude: 127.0947778}
    ],

    //부산
    [
      {name: '강서구', latitude: 35.20916389, longitude: 128.9829083},
      {name: '금정구', latitude: 35.24007778, longitude: 129.0943194},
      {name: '남구', latitude: 35.13340833, longitude: 129.0865},
      {name: '동구', latitude: 35.13589444, longitude: 129.059175},
      {name: '동래구', latitude: 35.20187222, longitude: 129.0858556},
      {name: '부산진구', latitude: 35.15995278, longitude: 129.0553194},
      {name: '북구', latitude: 35.19418056, longitude: 128.992475},
      {name: '사상구', latitude: 35.14946667, longitude: 128.9933333},
      {name: '사하구', latitude: 35.10142778, longitude: 128.9770417},
      {name: '서구', latitude: 35.09483611, longitude: 129.0263778},
      {name: '수영구', latitude: 35.14246667, longitude: 129.115375},
      {name: '연제구', latitude: 35.17318611, longitude: 129.082075},
      {name: '영도구', latitude: 35.08811667, longitude: 129.0701861},
      {name: '중구', latitude: 35.10321667, longitude: 129.0345083},
      {name: '해운대구', latitude: 35.16001944, longitude: 129.1658083},
      {name: '기장군', latitude: 35.24477541, longitude: 129.2222873}
    ],

    //광주
    [
      {name: '광산구', latitude: 35.13995836, longitude: 126.793668},
      {name: '남구', latitude: 35.13301749, longitude: 126.9025572},
      {name: '동구', latitude: 35.14627776, longitude: 126.9230903},
      {name: '북구', latitude: 35.1812138, longitude: 126.9010806},
      {name: '서구', latitude: 35.1525164, longitude: 126.8895063}
    ],

    //세종
    [{name: '남세종로', latitude: 36.479522, longitude: 127.289448}],

    //대구
    [
      {name: '달서구', latitude: 35.82692778, longitude: 128.5350639},
      {name: '수성구', latitude: 35.85520833, longitude: 128.6328667},
      {name: '남구', latitude: 35.84621351, longitude: 128.597702},
    
      {name: '달서구', latitude: 35.82997744, longitude: 128.5325905},
      {name: '달성군', latitude: 35.77475029, longitude: 128.4313995},
      {name: '동구', latitude: 35.88682728, longitude: 128.6355584},
      {name: '북구', latitude: 35.8858646, longitude: 128.5828924},
      {name: '서구', latitude: 35.87194054, longitude: 128.5591601},
      
      {name: '수성구', latitude: 35.85835148, longitude: 128.6307011},
      {name: '중구', latitude: 35.86952722, longitude: 128.6061745}
    ] ,

    [
      {name: '중구', latitude: 37.47384843, longitude: 126.6217617},
      { name: '동구', latitude: 37.47401607, longitude: 126.6432441},
      {name: '미추홀구', latitude: 37.46369169, longitude: 126.6502972},
      {name: '연수구', latitude: 37.41038125, longitude: 126.6782658},
      {name: '남동구', latitude: 37.44971062, longitude: 126.7309669},
      {name: '부평구', latitude: 37.50784204, longitude: 126.7219068},
      {name: '계양구', latitude: 37.53770728, longitude: 126.737744},
      {name: '서구', latitude: 37.54546372, longitude: 126.6759616},
      {name: '강화군', latitude: 37.74692907, longitude: 126.4878417},
      //{name: '옹진군', latitude: , longitude: } 경기도?
  ],

  [
    {name: '중구', latitude: 35.56971228, longitude: 129.3328162},
    {name: '남구', latitude: 35.54404265, longitude: 129.3301754},
    {name: '동구', latitude: 35.50516996, longitude: 129.4166919},
    {name: '북구', latitude: 35.58270783, longitude: 129.361245},
    {name: '울주군', latitude: 35.52230648, longitude: 129.2424748}
  ],

  [
    {name: '고양시', latitude: 37.65590833, longitude: 126.7770556},
    {name: '수원시', latitude: 37.30101111, longitude: 127.0122222},
    {name: '용인시', latitude: 37.23147778, longitude: 127.2038444},
    {name: '과천시', latitude: 37.42637222, longitude: 126.9898},
    {name: '광명시', latitude: 37.47575, longitude: 126.8667083},
    {name: '광주시', latitude: 37.41450556, longitude: 127.2577861},
    {name: '구리시', latitude: 37.591625, longitude: 127.1318639},
    {name: '군포시', latitude: 37.35865833, longitude: 126.9375},
    {name: '김포시', latitude: 37.61245833, longitude: 126.7177778},
    {name: '남양주시', latitude: 37.63317778, longitude: 127.2186333},
    {name: '동두천시', latitude: 37.90091667, longitude: 127.0626528},
    {name: '부천시', latitude: 37.5035917, longitude: 126.766},
    {name: '성남시', latitude: 37.44749167, longitude: 127.1477194},
    {name: '시흥시', latitude: 37.37731944, longitude: 126.8050778},
    {name: '안산시', latitude: 37.29851944, longitude: 126.8468194},
    {name: '안성시', latitude: 37.005175, longitude: 127.2818444},
    {name: '안양시', latitude: 37.3897, longitude: 126.9533556},
    {name: '양주시', latitude: 37.78245, longitude: 127.0478194},
    {name: '여주시', latitude: 37.29535833, longitude: 127.6396222},
    {name: '오산시', latitude: 37.14691389, longitude: 127.0796417},
    {name: '의왕시', latitude: 37.34195, longitude: 126.9703889},
    {name: '의정부시', latitude: 37.73528889, longitude: 127.0358417},
    {name: '이천시', latitude: 37.27543611, longitude: 127.4432194},
    {name: '파주시', latitude: 37.75708333, longitude: 126.7819528},
    {name: '평택시', latitude: 36.98943889, longitude: 127.1146556},
    {name: '포천시', latitude: 37.89215556, longitude: 127.2024194},
    {name: '하남시', latitude: 37.53649722, longitude: 127.217},
    {name: '화성시', latitude: 37.19681667, longitude: 126.8335306},
    {name: '가평군', latitude: 37.83138889, longitude: 127.5094444},
    {name: '양평군', latitude: 37.49116667, longitude: 127.4877778},
    {name: '연천군', latitude: 38.09647222, longitude: 127.0749167}
  ],

  [
    {name: '강릉시', latitude: 37.74913611, longitude: 128.8784972},
    {name: '동해시', latitude: 37.52193056, longitude: 129.1166333},
    {name: '삼척시', latitude: 37.44708611, longitude: 129.1674889},
    {name: '속초시', latitude: 38.204275, longitude: 128.5941667},
    {name: '원주시', latitude: 37.33908333, longitude: 127.9220556},
    {name: '춘천시', latitude: 37.87854167, longitude: 127.7323111},
    {name: '태백시', latitude: 37.16122778, longitude: 128.9879972},
    {name: '고성군', latitude: 38.37796111, longitude: 128.4701639},
    {name: '양구군', latitude: 38.10729167, longitude: 127.9922444},
    {name: '양양군', latitude: 38.07283333, longitude: 128.6213556},
    {name: '영월군', latitude: 37.18086111, longitude: 128.4640194},
    {name: '인제군', latitude: 38.06697222, longitude: 128.1726972},
    {name: '정선군', latitude: 37.37780833, longitude: 128.6630861},
    {name: '철원군', latitude: 38.14405556, longitude: 127.3157333},
    {name: '평창군', latitude: 37.36791667, longitude: 128.3923528},
    {name: '홍천군', latitude: 37.69442222, longitude: 127.8908417},
    {name: '화천군', latitude: 38.10340833, longitude:127.71035556},
    {name: '횡성군', latitude: 37.48895833, longitude:127.98722222}
  ],

    [ {name: '계룡시', latitude: 36.27183611, longitude: 127.2509306},
      {name: '공주시', latitude: 36.44361389, longitude: 127.1211194},
      {name: '논산시', latitude: 36.188994, longitude: 127.29562},
      {name: '당진시', latitude: 36.881997, longitude: 127.684597},
      {name: '보령시', latitude: 36.330575, longitude: 126.6148861},
      {name: '서산시', latitude: 36.78209722, longitude: 126.4521639},
      {name: '아산시', latitude: 36.77980556, longitude: 126.850875},
      {name: '천안시', latitude: 36.804125, longitude: 127.1524667},
      {name: '금산군', latitude: 36.10586944, longitude: 127.4903083},
      {name: '부여군', latitude: 36.27282222, longitude: 126.9118639},
      {name: '서천군', latitude: 36.07740556, longitude: 126.6938889},
      {name: '예산군', latitude: 36.67980556, longitude: 126.850875},
      {name: '청양군', latitude: 36.45626944, longitude: 126.8042556},
      {name: '태안군', latitude: 36.74266667, longitude: 126.299975},
      {name: '홍성군', latitude: 36.59836111, longitude: 126.6629083}],

      [ {name: '제천시', latitude: 37.12976944, longitude: 128.1931528},
      {name: '청주시', latitude: 36.58399722, longitude: 127.5117306},
      {name: '충주시', latitude: 36.98818056, longitude: 127.9281444},
      {name: '괴산군', latitude: 36.81243056, longitude: 127.7888306},
      {name: '단양군', latitude: 36.98178056, longitude: 128.3678417},
      {name: '보은군', latitude: 36.48653333, longitude: 127.7316083},
      {name: '영동군', latitude: 36.17205833, longitude: 127.7856111},
      {name: '옥천군', latitude: 36.30355, longitude: 127.5736333},
      {name: '음성군', latitude: 36.93740556, longitude: 127.6926222},
      {name: '증평군', latitude: 36.78118056, longitude: 127.5832889},
      {name: '진천군', latitude: 36.85253889, longitude: 127.4376444}],

      [{name: '경산시', latitude: 35.82308889, longitude: 128.7434639},
      {name: '경주시', latitude: 35.85316944, longitude: 129.2270222},
      {name: '구미시', latitude: 36.11655, longitude: 128.3467778},
      {name: '김천시', latitude: 36.13689722, longitude: 128.1158},
      {name: '문경시', latitude: 36.58363056, longitude: 128.1890194},
      {name: '상주시', latitude: 36.40796944, longitude: 128.1612639},
      {name: '안동시', latitude: 36.56546389, longitude: 128.7316222},
      {name: '영주시', latitude: 36.80293611, longitude: 128.6263444},
      {name: '영천시', latitude: 35.97005278, longitude: 128.940775},
      {name: '포항시', latitude: 36.00568611, longitude: 129.3616667}],

      [ {name: '창원시', latitude: 35.2540033, longitude: 128.6401544},
      {name: '거제시', latitude: 34.87735833, longitude: 128.6233556},
      {name: '김해시', latitude: 35.22550556, longitude: 128.8916667},
      {name: '밀양시', latitude: 35.50077778, longitude: 128.7489444},
      {name: '사천시', latitude: 35.00028333, longitude: 128.0667778},
      {name: '양산시', latitude: 35.33192778, longitude: 129.0394111},
      {name: '진주시', latitude: 35.17703333, longitude: 128.1100000},
      {name: '통영시', latitude: 34.85125833, longitude: 128.4352778}],

      [{name: '군산시', latitude: 35.96464167, longitude: 126.7388444},
      {name: '김제시', latitude: 35.800575, longitude: 126.8827528},
      {name: '남원시', latitude: 35.41325556, longitude: 127.3925},
      {name: '익산시', latitude: 35.945275, longitude: 126.9598528},
      {name: '전주시', latitude: 35.80918889, longitude: 127.1219194},
      {name: '정읍시', latitude: 35.56687222, longitude: 126.8581111},
      {name: '장수군', latitude: 35.64429722, longitude: 127.5233}],

      [{name: '광양시', latitude: 34.93753611, longitude: 127.6981778},
      {name: '나주시', latitude: 35.01283889, longitude: 126.7128667},
      {name: '목포시', latitude: 34.80878889, longitude: 126.3944194},
      {name: '순천시', latitude: 34.94760556, longitude: 127.4893306},
      {name: '여수시', latitude: 34.75731111, longitude: 127.6643861}],

      [{name: '서귀포시', latitude: 33.25235, longitude: 126.512555555555},
      {name: '제주시', latitude: 33.4963111111111, longitude: 126.533208333333}]
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
    const [selectCount, setselectCount] = useState(10);
    const [chinge, setchinge] = useState(1);

    const [modalVisible, setModalVisible] = useState(false);

    const [festival_Data, setFestival_Data] = useState();

    const mapRef = useRef(null);





    const counter = [
        {value: 5, letter:'5'},{value: 10, letter:'10'},{value: 15, letter:'15'},{value: 20, letter:'20'},
    ];

    //이쪽은 useState 핸들링 위한거입니다 ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
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

    //ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

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
    const handleNowPosition = async () => {
      const newRegion = {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      
      if(chinge == 1) setchinge(0);
      else setchinge(1);
      mapRef.current.animateToRegion(newRegion);
    
      const url = `https://apis.data.go.kr/B551011/KorService1/locationBasedList1?serviceKey=${process.env.TOUR_API_KEY}&numOfRows=${selectCount}&pageNo=1&MobileOS=AND&MobileApp=TripGO&_type=json&listYN=Y&arrange=A&mapX=${location.longitude}&mapY=${location.latitude}&radius=10000&contentTypeId=12`;
    
      try {
        const response = await fetch(url);

        
        const data = await response.json();
        setFestival_Data(data.response.body.items.item);

      } catch (error) {
        console.error('Error:', error);
      }

      
    };
    

    async function requestPermissions(){
        await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );    
    }

    //개발 중 테스트용(콘솔)
    // const handleCheck=()=>{
    //     console.log(location.latitude)
    //     console.log(location.longitude)
    // }
    
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
    })


    //좌표 값에 들어있는 것이 바뀌는 경우를 감지했을 때, 작동되도록(마커찍는것을)
    useEffect(() => {
      console.log(festival_Data);
      renderMarkers();

    }, [festival_Data]);

    

    const [mapRegion, setMapRegion] = useState({
        latitude: 36.3504,
        longitude: 127.3845,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });
    

    // festivalData가 업데이트 되면 map에 마커로 표시
    const renderMarkers = () => {
      // console.log(festival_Data)
      if (Array.isArray(festival_Data)) {
        return festival_Data.map((place, index) => (
          <Marker
            key={place.contentid} // 고유한 key를 사용하는 것이 좋습니다.
            coordinate={{
              latitude: parseFloat(place.mapy),
              longitude: parseFloat(place.mapx),
            }}
            title={place.title}
            description={place.addr1}
          />
        ));

        console.log(festival_Data)
      }

      return null;
    };

    
    return(
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          region={mapRegion}
          style={styles.map}
        >
          {renderMarkers()}
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
      color: 'black',
    },
    location: {
      fontSize: 14,
      height: 20,
      marginLeft:"5%",
      width: '80%',
      marginBottom: 5,
      color: 'black',
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
      color: 'black',
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
  