//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { scaledValue } from '../../Metrics';
import { SafeAreaView } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
// create a component
const UserList = () => {
  const navigation = useNavigation();
  const [list, setList] = useState([])
  useEffect(() => {
    const subscriber = firestore()
      .collection('Users')
      .onSnapshot((shot) => {
        const newdata = shot.docs.map((documentSnapshot) => {
          const { name, phoneNumber, email, userId } = documentSnapshot.data()
          return {
            name, email, phoneNumber, userId
          }
        })
        console.log(newdata)
        const ids = newdata.map(({ name }) => name);
const filtered = newdata.filter(({ name }, index) =>
    !ids.includes(name, index + 1));
        setList(filtered)
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);

  const chat = (n, m) => {
    console.log("idd   ", n)
    count = 0;
    if (n != auth().currentUser.uid) { count++ }
    if (count != 0)
      navigation.navigate('Chat', { id: n, name: m })
    else
      Alert.alert("error")

  }
  return (
    <View style={styles.container}>
      <View style={{ width: '100%', height: '10%', backgroundColor: 'lightgrey', justifyContent: 'flex-end' }}>
                <Text style={{ alignSelf: 'center', marginBottom: '2%' ,fontSize:18,fontWeight:'400'}}>User List</Text>
            </View>
            <View style={{flex:1}}>
      <FlatList
        data={list}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity style={{
              height: scaledValue(40), borderRadius: scaledValue(5),
              borderWidth: scaledValue(0.5), alignItems: 'center',
              justifyContent: 'center', width: '80%', alignSelf: 'center', marginVertical: '2%'
            }} onPress={() => (chat(item.userId, item.name))}>
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )
        }} />
        </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#2c3e50',
  },
});

//make this component available to the app
export default UserList;
