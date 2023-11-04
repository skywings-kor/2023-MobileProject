import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

import SignUp from "./components/SignUp"
import Login from "./components/Login"

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
          {/* <Tab.Screen
            name="Main"
            component={MainScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Image
                  source={require('./assets/homeIcon.png')}
                  style={{ width: 30, height: 30 }}
                />
              ),
            }}
          /> */}

          {/* <Tab.Screen
            name="MyPage"
            component={UI}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Image
                  source={require('./assets/mypageIcon.png')}
                  style={{ width: 30, height: 30 }}
                />
              ),
            }}
          /> */}

          {/* <Tab.Screen
            name="PET등록"
            component={AddPet}
            options={{
              tabBarIcon: ({ color, size }) => (
                // <Image
                //   source={require('./assets/addIcon.png')}
                //   style={{ width: 30, height: 30 }}
                // />
              ),
            }}
          /> */}

          {/* <Tab.Screen
            name="챗봇"
            component={Chat_Page}
            options={{
              tabBarIcon: ({ color, size }) => (
                // <Image
                //   source={require('./assets/chatIcon.png')}
                //   style={{ width: 30, height: 30 }}
                // />
              ),
            }}
          /> */}
          

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
          headerTitle: 'FindMyPet',
          headerTitleStyle: {
            fontSize: 24,
            color: 'rgb(182,20,45)',
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Detail_Page" component={Detail_Page} />
      <Stack.Screen name="MyPage" component={UI} />
      
    </Stack.Navigator>
  );
};