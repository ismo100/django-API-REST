import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Button,
} from "react-native";
import React, { useState } from "react";
import Fontisto from "@expo/vector-icons/Fontisto";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, Redirect, router } from "expo-router";
import * as FileSystem from "expo-file-system";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { setEmail } from '../../redux/action';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

const index = () => {
  const dispatch = useDispatch();
  const [isSecureEntry, setIsSecureEntry] = useState(true);
  const [IsEmail, setIsEmail] = useState<boolean>()
  const [isPassword, setIsPassword] = useState<boolean>()
  const [isError, setIsError] = useState<boolean>(false)
  const [user, setUser] =useState({
    email : "",
    password : ""
  })

  // GoogleSignin.configure({
  //   webClientId: '815959567920-05a4sjvo0965k5vq6egvn9nsrrqifpj7.apps.googleusercontent.com',
  // });

  // const onGoogleButtonPress = async () => {
  //   // Check if your device supports Google Play
  //   await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  //   // Get the users ID token
  //   const { idToken }:any = await GoogleSignin.signIn();
  
  //   // Create a Google credential with the token
  //   const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  
  //   // Sign-in the user with the credential
  //   const user_sign_in = auth().signInWithCredential(googleCredential);
  //   user_sign_in.then((user) => {console.log(user)
  //   }).catch((error) =>{
  //     console.log(error)
  //   })
  // }

  const loadData = async()=>{
        // const existFile = await FileSystem.getInfoAsync(USERS_FILE)
        // if(existFile.exists){
        //   const data = await FileSystem.readAsStringAsync(USERS_FILE)
        //   const saved = JSON.parse(data)
        //   const result = saved.find((element : any) =>  element.email === user.email);

        //     if((result.email == user.email) && (result.password == user.password)){
        //       setIsEmail(true)
        //       setIsPassword(true)
        //     }
        //     else{
        //       setIsEmail(false)
        //       setIsPassword(false)
        //       setIsError(true)
        //       console.log(user.email)
        //     }
        //     }

          try{

            const token = await fetch("http://192.168.2.29:8000/tp02_app/get_token/", {
              method: "POST",
              headers : {
                "content-type" : "application/json",
              },
              body : JSON.stringify(user),
            });
            const resp = await token.json()
            console.log(resp)

                const response = await fetch("http://192.168.2.29:8000/tp02_app/sign_in/", {
                  method: "POST",
                  headers: {
                    'content-type' : 'application/json',
                    'Authorization': `Token ${resp.token}`,
                  },
                  body: JSON.stringify(user),
                });
                const data = await response.json()
                if(response.ok){
                  console.log(data)
                  setIsEmail(true)
                  setIsPassword(true)
                }
                else{
                  alert("Nom d'utilisateur ou mot de passe incorrect!")
                  setIsEmail(false)
                  setIsPassword(false)
                  setIsError(true)
                }
              } catch(err){
                console.log(err);
                alert("Nom d'utilisateur ou mot de passe incorrect!")
              }

          }

  return (
    
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="bg-white h-full w-full">
        <Image
          className="h-full w-full absolute"
          source={require("../../../assets/images/background.png")}
        />
        <View className="w-full h-full justify-center">
          <View className="flex items-center">
            <Text className="text-black text-3xl mb-10 font-extralight">
              Connectez-Vous à votre compte
            </Text>
          </View>

          <View className="flex items-center p-10 gap-10">
            <View  className={`bg-white rounded-full w-full p-3 border ${isError && !IsEmail? "border-red-500" : "border-green-500"} flex-row gap-5 items-center pl-5`}>
              <Fontisto name="email" size={25} color="gray" />
              <TextInput
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                className="w-full text-2xl font-extralight pb-1"
                placeholderTextColor={"gray"}
                value={user.email}
                onChangeText={(text) =>{setUser({...user, email: text})}}
              />
            </View>
            {isError && !IsEmail ? (
              <Text className="color-red-500 left-0 w-full -mt-8 -mb-4 pl-5 font-extralight">
                *Email invalide
              </Text>
            ) : null}

            <View  className={`bg-white rounded-full w-full p-3 border ${isError && !isPassword? "border-red-500" : "border-green-500"} flex-row gap-5 items-center pl-5`}>
              <AntDesign name="lock" size={24} color="gray" />
              <TextInput
                placeholder="Mot de passe"
                secureTextEntry={isSecureEntry}
                className="flex-1 text-2xl font-extralight pb-1"
                placeholderTextColor={"gray"}
                value={user.password}
                onChangeText={(text) =>{setUser({...user, password: text})}}
              />
              <TouchableOpacity
                onPress={() => {
                  setIsSecureEntry((value) => !value);
                }}
              >
                {isSecureEntry ? (
                  <Ionicons name="eye-outline" size={24} color="gray" />
                ) : (
                  <Ionicons name="eye-off-outline" size={24} color="gray" />
                )}
              </TouchableOpacity>
            </View>
            {isError && !isPassword ? (
              <Text className="color-red-500 left-0 w-full -mt-8 -mb-4 pl-5 font-extralight">
                *Mot de passe invalide
              </Text>
            ) : null}

            <View className=" -mt-5 w-full">
              <TouchableOpacity style={styles.forgotPassword}>
                <Text className="text-right font-extralight text-xl">
                  Mot de passe oublié?
                </Text>
              </TouchableOpacity>
            </View>

            <View className="w-full">
              <TouchableOpacity style={styles.connexionButton} onPress={() => {
                 loadData()
                 IsEmail && isPassword? router.replace("/screens"): null
                 dispatch(setEmail(user.email))
                 }}>
                <Text className="text-2xl text-center font-extralight color-white">
                  Connexion
                </Text>
              </TouchableOpacity>
            </View>

            <View className="w-full">
              <TouchableOpacity style={styles.connexionButton}  onPress={() => onGoogleButtonPress().then(() => console.log('Signed in with Google!'))}>
                <Text className="text-2xl text-center font-extralight color-white">
                  Se connecter avec Google
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-center">
              <Text className="font-extralight">
                Vous n'avez pas de compte ?{" "}
              </Text>
              <Link href="/auth/register" asChild>
                <TouchableOpacity>
                  <Text className="color-green-500 font-extralight underline">
                    Inscrivez-Vous
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default index;

const styles = StyleSheet.create({
  connexionButton: {
    backgroundColor: "#22c55e",
    padding: 15,
    borderRadius: 100,
  },
  forgotPassword: {
    marginLeft: 200,
  },
});
