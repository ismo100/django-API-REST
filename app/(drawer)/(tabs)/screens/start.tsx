import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { TouchableOpacity } from "react-native-gesture-handler";
import { router } from "expo-router";
import * as FileSystem from "expo-file-system";
import * as Location from "expo-location";
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

const start = () => {

  const userEmail = useSelector((state: RootState) => state.userState.email);
  const FILE_URI = FileSystem.documentDirectory + `${userEmail}.json`;
  const [savedData, setSavedData] = useState([])

  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  const getPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Veuillez autoriser l'accès à votre position.");
      return;
    }
  };
 
  return (
    <View className="w-full justify-center items-center flex-1">
      <View className="mb-20">
        <Text className="text-4xl font-extrabold">Vous êtes en randonnée!</Text>
      </View>

      <TouchableOpacity onPress={() =>{router.push("/screens/camera")
      }}>
        <View className=" bg-green-500 p-5 rounded-3xl mb-10">
          <Feather name="camera" size={80} color="white" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={async() => {
          router.replace("/screens")
          getPermission();
          let currentLocation = await Location.getCurrentPositionAsync();
          let address = await Location.reverseGeocodeAsync({
            latitude : currentLocation.coords.latitude,
            longitude : currentLocation.coords.longitude,
          })

          const activity_data = {email: userEmail, uri: " ", coords: `${currentLocation.coords.latitude}, ${currentLocation.coords.longitude}`, location: `${address[0].city}, ${address[0].country}, ${address[0].region}`, date: formattedDate, sentier: ""};
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

        }}>
        <View className="bg-green-500 p-10 rounded-3xl items-center">
          <Text className="text-3xl color-white font-bold">STOP</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default start;
