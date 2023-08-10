//import liraries
import { useNavigation } from '@react-navigation/native';
import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity ,ToastAndroid} from 'react-native';
import auth from '@react-native-firebase/auth';
import { scaledValue } from '../../Metrics';
// create a component
const Login = () => {
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [emailValidation,setEmailValidation]=useState(false)
    const [passwordValidation,setPasswordValidation]=useState(false)
    const navigation=useNavigation()

    const login=()=>{

        console.log(email, password)
        if( String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ) ) {
        auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                console.log('User login Done');
                navigation.navigate('UserList')
                setEmail('')
            setPassword('')
            })
            .catch(error => {
             console.log(error.code);
             setEmail('')
            setPassword('')
            ToastAndroid.showWithGravityAndOffset(
                error.code,
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50,
              );
            });
        }
        else
        setEmailValidation(true)

    }
    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 30, fontWeight: 'bold', marginVertical: '20%' }}>Chat</Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginVertical: '2%' }}>Login</Text>
            <TextInput placeholder='Enter Gmail' style={{
                borderRadius: 10, width: '90%', height: 50,
                borderWidth: 0.5, textAlign: 'center', marginVertical: '4%'
            }} 
            onChangeText={(t)=>{return(setEmail(t), setEmailValidation(false))}} 
            autoCapitalize={'none'} value={email}
            />
            <TextInput placeholder='Enter Password' style={{
                borderRadius: 10, width: '90%',
                height: 50, borderWidth: 0.5, textAlign: 'center', marginVertical: '4%'
            }} 
            onChangeText={(t)=>{setPassword(t)}} 
            autoCapitalize={'none'} value={password}/>
            <View style={{ flexDirection: 'row' ,marginVertical:'10%'}}>
                <TouchableOpacity onPress={login}> 

                    <Text style={{ fontSize: 18, color: 'blue' }}>Login </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ justifyContent: 'flex-end' }} 
                onPress={()=>(navigation.navigate('Register'))}>
                    <Text>New User!! Register</Text>
                </TouchableOpacity>
            </View>



        </View >
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: 'center',
        alignItems: 'center',
        marginTop:Platform.OS === 'ios' ? 0 : scaledValue(100),
    },
});

//make this component available to the app
export default Login;
