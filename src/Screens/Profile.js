//import liraries
import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, PermissionsAndroid, Platform, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/Ionicons';
import { scaledValue } from '../../Metrics';
import firestore from '@react-native-firebase/firestore';
import VideoPlayer from 'react-native-video-controls';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import Video from 'react-native-video';
//import VideoPlayer from 'react-native-video-player'
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
// create a component

const Profile = ({ route }) => {
  MaterialCommunityIcons.loadFont();
   const {email}=route.params;
  const navigation = useNavigation()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [filePath, setFilePath] = useState({});
  const [showImage, setShowImage] = useState(false)
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

  //   const captureImage = async (type) => {
  //     let options = {
  //       mediaType: type,
  //       maxWidth: 300,
  //       maxHeight: 550,
  //       quality: 1,
  //       videoQuality: 'low',
  //       durationLimit: 30, //Video max duration in seconds
  //       saveToPhotos: true,
  //     };
  //     let isCameraPermitted = await requestCameraPermission();
  //     let isStoragePermitted = await requestExternalWritePermission();
  //     if (isCameraPermitted && isStoragePermitted) {
  //       launchCamera(options, (response) => {
  //         console.log('Response = ', response);

  //         if (response.didCancel) {
  //           alert('User cancelled camera picker');
  //           return;
  //         } else if (response.errorCode == 'camera_unavailable') {
  //           alert('Camera not available on device');
  //           return;
  //         } else if (response.errorCode == 'permission') {
  //           alert('Permission not satisfied');
  //           return;
  //         } else if (response.errorCode == 'others') {
  //           alert(response.errorMessage);
  //           return;
  //         }
  //         console.log('base64 -> ', response.base64);
  //         console.log('uri -> ', response.uri);
  //         console.log('width -> ', response.width);
  //         console.log('height -> ', response.height);
  //         console.log('fileSize -> ', response.fileSize);
  //         console.log('type -> ', response.type);
  //         console.log('fileName -> ', response.fileName);
  //         setFilePath(response);
  //       });
  //     }
  //   };

  const chooseFile = async (type) => {
    let isStoragePermitted = await requestExternalWritePermission();
    if (isStoragePermitted) {
      console.log("hello")
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true
      }).then(img => {
        console.log(img);
        setFilePath(img.path)
        setShowImage(true)

        uploadImage(img)
      });
    }
    // ImagePicker.openPicker({
    //   mediaType: "video",
    // }).then((video) => {
    //   console.log(video);
    //   setFilePath(video.sourceURL)

    //   uploadVideo(video)
    // });

    // const uploadVideo=async(video)=>{
    //   const uploadUri = Platform.OS === 'ios' ? video.sourceURL.replace('file://', '') : video.sourceURL
    //   let reference = storage().ref(video.filename);         // 2
    //   let task =  reference.putFile(uploadUri);               // 3

    //   task.then(() => {                                 // 4
    //     console.log('Video uploaded to the bucket!');
    //     downloadURL(reference)
    //   }).catch((e) => console.log('uploading image error => ', e));

    // }

    const uploadImage = async (img) => {
      console.log("hdgdh", img.path.substring(img.path.lastIndexOf('/') + 1))
      if (Platform.OS === 'android') { var fileName = img.path.substring(img.path.lastIndexOf('/') + 1) }
      else { var fileName = img.filename }
      let reference = storage().ref(fileName);       // 2
      let task = reference.putFile(img.path);
      task.then(() => {                                 // 4
        console.log('Image uploaded to the bucket!');
        downloadURL(reference)
      }).catch((e) => console.log('uploading image error => ', e));
      // 3


    }
    const downloadURL = async (reference) => {
      reference
        .getDownloadURL()
        .then((url) => {
          //from url you can fetched the uploaded image easily
          console.log("download url", url)
          setFilePath(url)
          setShowImage(true)
        })
        .catch((e) => console.log('getting downloadURL of image error => ', e));
    }
    // let options = {
    //   mediaType: type,
    //   maxWidth: 300,
    //   maxHeight: 550,
    //   quality: 1,
    // };
    // launchImageLibrary(options, (response) => {
    //   console.log('Response = ', response.assets[0].data);
    //   setFilePath(response.assets[0].uri);
    //   setShowImage(true)
    //   if (response.didCancel) {
    //     alert('User cancelled camera picker');
    //     return;
    //   } else if (response.errorCode == 'camera_unavailable') {
    //     alert('Camera not available on device');
    //     return;
    //   } else if (response.errorCode == 'permission') {
    //     alert('Permission not satisfied');
    //     return;
    //   } else if (response.errorCode == 'others') {
    //     alert(response.errorMessage);
    //     return;
    //   }
    //   console.log('base64 -> ', response.base64);
    //   console.log('uri -> ', response.uri);
    //   console.log('width -> ', response.width);
    //   console.log('height -> ', response.height);
    //   console.log('fileSize -> ', response.fileSize);
    //   console.log('type -> ', response.type);
    //   console.log('fileName -> ', response.fileName);

    // });
  };






  const submit = () => {
    if(name.length>0 &&   phone>0)
    //console.log(auth().currentUser.uid)
    {firestore()
      .collection('Users')
      .add({
        name: name,
        phoneNumber: phone,
          email: email,
        userId: auth().currentUser.uid
        //imageUrl: url,
      })
      .then(() => {
        console.log('User added!');
        navigation.navigate('UserList')
      });}
      else
      Alert.alert("Please fill name or phone no. properly")
    // uploadImage
  }


  // const uploadImage = async () => {
  //   const { uri } = filePath;
  //   const filename = uri.substring(uri.lastIndexOf('/') + 1);
  //   const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
  //   // setUploading(true);
  //   // setTransferred(0);
  //   const task = storage()
  //     .ref(filename)
  //     .putFile(uploadUri);
  //   // set progress state
  //   // task.on('state_changed', snapshot => {
  //   //   setTransferred(
  //   //     Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
  //   //   );
  //   // });
  //   try {
  //     await task;
  //   } catch (e) {
  //     console.error(e);
  //   }
  //   //setUploading(false);
  //   Alert.alert(
  //     'Photo uploaded!',
  //     'Your photo has been uploaded to Firebase Cloud Storage!'
  //   );
  //   setFilePath(null);
  // };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', marginVertical: '10%' }}>
        {
          showImage ? <Image source={{ uri: filePath }}
            style={{
              height: scaledValue(150), width: scaledValue(150),
              borderRadius: scaledValue(75),
            }} /> :
            <Image source={require('../../assets/user.png')}
              style={{
                height: scaledValue(150), width: scaledValue(150),
                borderRadius: scaledValue(75),
              }} />
        }



        <TouchableOpacity
          style={{ position: 'absolute', bottom: 0, right: scaledValue(5) }}
          onPress={() => { chooseFile('photo') }} >
          <MaterialCommunityIcons name="images" size={scaledValue(40)} color='black' />
        </TouchableOpacity>
      </View>
      {/* {
          showImage? <Video
          style={{height:scaledValue(200),width:scaledValue(200),}}
          source={require('../../assets/pexels_videos_2693.mp4')}
          controls={true}
          repeat={true}
          resizeMode="contain"
        /> :<Text>hello</Text>
        } */}
      {/* {
          showImage? <VideoPlayer
          source={{uri:filePath}}
    // videoWidth={1600}
    // videoHeight={900}
    // thumbnail={{ uri: 'https://i.picsum.photos/id/866/1600/900.jpg' }}
/>:<Text>hello</Text>
        } */}
      <TextInput placeholder='Enter Name' style={{
        borderRadius: 10, width: '90%', height: 50,
        borderWidth: 0.5, textAlign: 'center', marginVertical: '4%'
      }}
        onChangeText={(t) => { setName(t) }}
        autoCapitalize={'none'} value={name}
      />
      <TextInput placeholder='Enter phone' keyboardType='numeric'  style={{
        borderRadius: 10, width: '90%',
        height: 50, borderWidth: 0.5, textAlign: 'center', marginVertical: '4%'
      }}
        onChangeText={(t) => { setPhone(t) }}
        autoCapitalize={'none'} value={phone} />
      <TextInput style={{
        borderRadius: 10, width: '90%', height: 50,
        borderWidth: 0.5, textAlign: 'center', marginVertical: '4%'
      }}
        value={email}
        editable={false}
      />
      <TouchableOpacity style={styles.rateButtonContainer} onPress={submit}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#2c3e50',
    marginTop:Platform.OS === 'ios' ? 0 : scaledValue(100),
  },
  rateButtonContainer: {
    borderRadius: 10, backgroundColor: '#000C66',
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', width: '80%', height: '7%', alignSelf: 'center',

  }
});

//make this component available to the app
export default Profile;
