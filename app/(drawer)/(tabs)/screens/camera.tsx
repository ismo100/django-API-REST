import {
  CameraView,
  CameraType,
  useCameraPermissions,
  CameraCapturedPicture,
  Camera,
} from "expo-camera";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as FileSystem from "expo-file-system";
import * as Location from "expo-location";
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

export default function App() {
  
  const userEmail = useSelector((state: RootState) => state.userState.email);
  const [savedData, setSavedData] = useState([])
  const [location, setLocation] = useState([]);

  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const cameraRef = useRef<any>()

  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;


  if (!permission) {
    return <View />;
  }
  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const getPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Veuillez autoriser l'accès à votre position.");
      return;
    }
  };

  return (
    <View className="flex-1">
      <CameraView
        style={styles.camera}
        ratio="16:9"
        facing={facing}
        ref={cameraRef}
        onCameraReady={() => {
          setCameraReady(true);
        }}
      >
        <View className="flex-row w-full">
          <View className=" m-3">
            <TouchableOpacity onPress={() => router.back()}>
              <FontAwesome6 name="arrow-left" size={35} color="white" />
            </TouchableOpacity>
          </View>

          <View className="absolute right-0 m-3">
            <TouchableOpacity onPress={toggleCameraFacing}>
              <FontAwesome6 name="rotate" size={35} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="items-center pb-5 bottom-0 absolute w-full">
          <TouchableOpacity
            onPress={async () => {
              if (cameraRef.current) {
                let newphotos = await cameraRef.current.takePictureAsync();
                getPermission();
                let currentLocation = await Location.getCurrentPositionAsync();
                let address = await Location.reverseGeocodeAsync({
                  latitude : currentLocation.coords.latitude,
                  longitude : currentLocation.coords.longitude,
                })

              const activity_data = {email: userEmail, uri: newphotos.uri , coords: `${currentLocation.coords.latitude}, ${currentLocation.coords.longitude}`, location: `${address[0].city}, ${address[0].country}, ${address[0].region}`, date: formattedDate, sentier: ""};
              try{
              const response = await fetch("http://192.168.2.29:8000/tp02_app/createActivity/", {
                method: "POST",
                headers: {
                  'content-type' : 'application/json',
                },
                body: JSON.stringify(activity_data),
              }); 
              const data = await response.json()
              console.log(data) 
              } catch(err){
              console.log(err);
              }
              }
            }}
          >
            <FontAwesome name="circle" size={90} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
});
