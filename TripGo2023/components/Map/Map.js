import React, { useState,useEffect  } from 'react';
import { StyleSheet,View, Text, Button, TextInput, Image, Modal, TouchableOpacity,ScrollView } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import { launchImageLibrary } from 'react-native-image-picker';
import { Picker } from "@react-native-picker/picker";

import MapView, { Marker } from 'react-native-maps';
import { serverTimestamp,firestoreDB, firebaseAuth,collection, doc, setDoc, getDoc, query, orderBy, limit, getDocs, analytics, storage, ref, uploadBytes, getDownloadURL ,onAuthStateChanged, addDoc } from '../../firebaseConfig';

const Map=()=>{

    const [mapRegion, setMapRegion] = useState({
        latitude: 36.3504,
        longitude: 127.3845,
        latitudeDelta: 0.6,
        longitudeDelta: 0.6,
      });
      
    return(
        <View>
            <MapView
          style={{ flex: 1 }}
          region={mapRegion}
          style={{ flex: 1 ,width:300,height:300}}
        >
</MapView>
        </View>
    )
}



export default Map;
