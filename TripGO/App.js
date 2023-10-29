import React, {useState} from 'react';
import { Marker } from 'react-native-maps';
import MapView from 'react-native-maps';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

// import EL from "./Info/emoji_List"
// import LM from "./Info/List_info"
// import GM from "./components/GoogleMap"
// import HM from "./components/Home"
// import CameraScreen from './components/CameraScreen';
// import UI from "./Info/User_profile"
import Login from "./components/Login"
import SignUp from "./components/Signup"
// import Qrg from "./components/QrGener"
// import Calculate from "./components/Calculate"


import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";


const Stack = createStackNavigator()
const Tab = createBottomTabNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
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
            name="mainTab"
            component={/*MainScreen*/}
            options={{
              tabBarIcon: ({ color, size }) => (
                
              ),
            }}
          />
          <Tab.Screen
            name="지도"
            component={/*MapScreen*/}
            options={{
              tabBarIcon: ({ color, size }) => (
               
              ),
            }}
          />
          <Tab.Screen
            name="스팟 인증"
            component={/*CameraScreenM*/}
            options={{
              tabBarIcon: ({ color, size }) => (
                
              ),
            }}
          />
          <Tab.Screen
            name="QR코드"
            component={/*Qrg*/}
            options={{
              tabBarIcon: ({ color, size }) => (
                
              ),
            }}
          />
          <Tab.Screen
            name="마이페이지"
            component={/* UI */}
            options={{
              tabBarIcon: ({ color, size }) => (
               
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
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

// const MainScreen = () => {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="main"
//         component={HM}
//         options={{
//           headerTitle: 'TripGO',
//           headerTitleStyle: {
//             fontSize: 24,
//             color: 'rgb(182,20,45)',
//             fontWeight: 'bold',
//           },
//         }}
//       />
//       <Stack.Screen
//         name="EmojiList"
//         component={EL}
//         options={{
//           headerTitle: 'Emoji',
//           headerTitleStyle: {
//             fontSize: 24,
//             color: 'rgb(182,20,45)',
//             fontWeight: 'bold',
//           },
//         }}
//       />

//       <Stack.Screen name="Calculate"
//         component={Calculate}
//         options={{
//           headerTitle: '결재시스템',
//           headerTitleStyle: {
//             fontSize: 20,
//             color: 'rgb(182,20,45)',
//             fontWeight: 'bold',
//           },
//         }} />
//     </Stack.Navigator>
//   );
// };


// const CameraScreenM=()=>{
//   return(
//     <Stack.Navigator>
//       <Stack.Screen name="Camera" component={CameraScreen} options={{ headerTitle: '!스팟 인증!',unmountOnBlur: true }} />


//     </Stack.Navigator>
//   )
// }

// const MapScreen = ({ navigation }) => {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="map"
//         component={GM}
//         options={{
//           headerTitle: '지도',
//           headerTitleAlign: 'center',
//           headerLeft: () => (
//             <TouchableOpacity
//               style={{ marginLeft: 16 }}
//               onPress={() => navigation.goBack()}
//             >
//               <Ionicons name="chevron-back" size={24} color="black" />
//             </TouchableOpacity>
//           ),
//         }}
//       />
//     </Stack.Navigator>
//   );
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});