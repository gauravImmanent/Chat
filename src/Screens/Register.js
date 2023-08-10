//import liraries
import { useNavigation } from '@react-navigation/native';
import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform ,ToastAndroid} from 'react-native';
import auth from '@react-native-firebase/auth';
import { scaledValue } from '../../Metrics';
// create a component
const Register = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailValidation,setEmailValidation]=useState(false)
    const [passwordValidation,setPasswordValidation]=useState(false)
    const navigation = useNavigation()

    const register = () => {
        console.log(email, password)
        if( String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ) ) {
        auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
                console.log('User account created & signed in!');
                navigation.navigate('Profile',{email:email})
                console.log( "hjfjflkaakl ",auth().currentUser)
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    console.log('That email address is already in use!');
                }

                if (error.code === 'auth/invalid-email') {
                    console.log('That email address is invalid!');
                }

                console.log(error);
                ToastAndroid.showWithGravityAndOffset(
                    error.code,
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50,
                  );
            }); }
            else
            setEmailValidation(true)
    }
    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 30, fontWeight: 'bold', marginVertical: '20%' }}>Chat</Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginVertical: '2%' }}>Register</Text>
            <TextInput placeholder='Enter Gmail' style={{
                borderRadius: 10, width: '90%', height: 50,
                borderWidth: 0.5, textAlign: 'center', marginTop: '4%'
            }}
                onChangeText={(t) => { return(setEmail(t),setEmailValidation(false)) }}
                autoCapitalize={'none'} />
                {emailValidation?<Text style={{marginBottom:'3%',color:'red'}}>Please fill validate email</Text>
                :<View style={{marginBottom:'3%'}}></View>}
            <TextInput placeholder='Enter Password' style={{
                borderRadius: 10, width: '90%',
                height: 50, borderWidth: 0.5, textAlign: 'center', marginVertical: '4%'
            }}
                onChangeText={(t) => { setPassword(t) }}
                autoCapitalize={'none'} />
            <View style={{ flexDirection: 'row', marginVertical: '10%' }}>
                <TouchableOpacity onPress={register}>

                    <Text style={{ fontSize: 18, color: 'blue' }}>Register </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ justifyContent: 'flex-end' }} onPress={() => (navigation.navigate('Login'))}>
                    <Text>Already registered!! Login</Text>
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
export default Register;
