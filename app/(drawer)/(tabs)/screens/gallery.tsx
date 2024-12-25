import { View, Text, Image, Button, Modal } from "react-native";
import React, { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";
import * as Location from "expo-location";
import { router } from "expo-router";
import MapView, { Callout, Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet } from "react-native";
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

const gallery = () => {

  const userEmail = useSelector((state: RootState) => state.userState.email);
  const [savedData, setSavedData] = useState<any> ([]);
  const [data, setData] = useState<any> ([]);
  const [markers, setMarkers] = useState<any>([])
  const [modal, setModal] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (savedData.length == 0) {
        setIsReady(false)
    }
    else{
      setIsReady(true)
    }
    loadData();
}, [savedData]);

  const loadData = async () => {
    // try {
    //   const fileExists = await FileSystem.getInfoAsync(FILE_URI);
    //   if (fileExists.exists) {
    //     const jsonData = await FileSystem.readAsStringAsync(FILE_URI);
    //     const data = JSON.parse(jsonData);
    //     setSavedData(data);
    //     setLocation(data[0].coords)
        
    //     const coords = data.map((location:any, index:any)=>({
    //       latitude: location.coords.latitude,
    //       longitude: location.coords.longitude,
    //     }))

    //     setMarkers(coords)
        
    //   }
    // } catch (error) {
    //   console.log(error);
    // }

          const username = {email: userEmail};

          try{
          const response = await fetch("http://192.168.2.29:8000/tp02_app/get_activities/", {
          method: "POST",
          headers: {
          'content-type' : 'application/json',
          },
          body: JSON.stringify(username),
          }); 
          const data = await response.json()
          setSavedData(data)
          // console.log(savedData)

          } catch(err){
          console.log(err);
          }
        
  };

  
  if(isReady){
  return (
    <View>
      <Modal
        visible={modal}
        onRequestClose={() => {
          setModal(false);
          router.back();
        }}
        onShow={()=>{
          loadData();
        }}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <Text className="font-bold color-white bg-green-500 border-2 border-white rounded-xl text-2xl pt-5 pb-5 text-center">Mon parcours</Text>
        
      <MapView style={styles.map}
    
     initialRegion={{
      latitude: 46.81930897000217,
      longitude: -71.15469089359487,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }}>
      {savedData.length > 0 && savedData.map((data : any) => (

        <Marker coordinate={{latitude : parseFloat(data.coords.split(",")[0]), longitude : parseFloat(data.coords.split(",")[1])}} >
          {data.uri == ""? <Callout><Text>Début/Fin</Text></Callout>:
          <Callout>
          <Image
                source={{ uri: data.uri }}
                style={{ width: 250, height: 250, margin: 4 }}
              />
               <Text>{`${data.date}`}</Text>
               <Text>{`${data.location}`}</Text>
               <Text className="font-bold">{`${data.sentier}`}</Text>
          </Callout>
          }
        </Marker>
      )
      )}

        <Polyline coordinates={markers}
        strokeColor="red"
        strokeWidth={3}
        />
    </MapView>
      </Modal>
    </View>
  );
}
}
export default gallery;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});