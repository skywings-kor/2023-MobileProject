import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

//메인
import SignUp from "./components/SignUp"
import Login from "./components/Login"
import HM from "./components/Main"
import UI from "./components/MyPage"

//지역상품
import PD from "./components/AreaProduct/Product"
import detailPD from "./components/AreaProduct/ProductDetail"
import productAdd from "./components/AreaProduct/ProductAdd"

//지도 관련
import Map from "./components/Map/Map"

//카메라 관련
import Camera from "./components/Camera/Camera"
import Review from "./components/Camera/Review"
import Option from "./components/Camera/Option"

//QR관련
import Payment from "./components/QRFunction/Payment"
import QrGener from "./components/QRFunction/QrGener"
import QRScannerScreen from "./components/QRFunction/QRScannerScreen"



import React, {useState} from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator();

const App =()=>{
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // 로그인 처리 로직
    // 로그인 성공 시 setIsLoggedIn(true) 호출
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // 로그아웃 처리 로직
    // 로그아웃 성공 시 setIsLoggedIn(false) 호출
    signOut(firebaseAuth)
      .then(() => {
        setIsLoggedIn(false);
        console.log('로그아웃 성공');
      })
      .catch((error) => {
        console.log('로그아웃 실패:', error);
      });
  };


  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator
          initialRouteName="mainTab"
          screenOptions={{
            activeBackgroundColor: 'white',
            tabBarActiveTintColor: 'rgb(182,20,45)',
            style: {
              borderTopWidth: 0, // 상단 경계선 제거
            },
            headerShown: false,
          }}
        >
          <Tab.Screen
            name="홈"
            component={MainScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Image
                  source={require('./assets/Main_Icon.png')}
                  style={{ width: 30, height: 30 }}
                />
              ),
            }}
          />

          <Tab.Screen
            name="마이페이지"
            component={UI}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Image
                  source={require('./assets/mypageIcon.png')}
                  style={{ width: 30, height: 30 }}
                />
              ),
            }}
          />

          <Tab.Screen
            name="지역특산품"
            component={PD}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Image
                  source={require('./assets/goods_Icon.png')}
                  style={{ width: 30, height: 30 }}
                />
              ),
            }}
          />

          <Tab.Screen
            name="QR결재"
            component={QrGener}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Image
                  source={require('./assets/qr_Icon.png')}
                  style={{ width: 30, height: 30 }}
                />
              ),
            }}
          />

          <Tab.Screen
            name="지도"
            component={Map}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Image
                  source={require('./assets/map_Icon.png')}
                  style={{ width: 30, height: 30 }}
                />
              ),
            }}
          />

          <Tab.Screen
            name="관광인증"
            component={Camera}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Image
                  source={require('./assets/tour_Icon.png')}
                  style={{ width: 30, height: 30 }}
                />
              ),
            }}
          />

          

        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={(props) => <Login {...props} handleLogin={handleLogin} />}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ headerShown: true }}
          /> 


          
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );

}

export default App;

const MainScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="main"
        component={HM}
        
        options={{
          headerShown: false,
          headerTitle: 'TripGO',
          headerTitleStyle: {
            fontSize: 24,
            color: 'rgb(182,20,45)',
            fontWeight: 'bold',
          },
        }}
        
      />

      <Stack.Screen name="상세페이지" component={detailPD} />

      <Stack.Screen name="리뷰등록" component={Review} />

      <Stack.Screen name="특산물추가" component={productAdd} />
      <Stack.Screen name="QR결재" component={Payment} />
      {/* <Stack.Screen name="QrGener" component={QrGener} /> */}
      <Stack.Screen name="QR스캔" component={QRScannerScreen} />

      <Stack.Screen name="선택" component={QRScannerScreen} />

      {/*
      <Stack.Screen name="MyPage" component={UI} />
     */}
    </Stack.Navigator>
  );
};