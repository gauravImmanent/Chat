//import liraries
import React, { Component, useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Alert,
    FlatList, Linking, Modal, Pressable, PermissionsAndroid, Platform
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { scaledValue, windowWidth } from '../../Metrics'
import auth from '@react-native-firebase/auth';
import DocumentPicker, { types } from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import VideoPlayer from 'react-native-video-controls';
import Video from 'react-native-video';
//import firestore from '@react-native-firebase/firestore';
// create a component
const ChatScreen = ({ route }) => {
    const { id, name } = route.params
    if (id > auth().currentUser.uid) {
        var chatId = `${id}_${auth().currentUser.uid}`;
    }
    else {
        var chatId = `${auth().currentUser.uid}_${id}`;
    }
    // console.log("chat id ", chatId, name)
    const [message, setMessage] = useState('')
    const [list, setList] = useState([])
    const [idChat, setIdChat] = useState('')
    const [visible, setVisible] = useState(false)
    const handleDocumentSelection = async () => {
        try {
            const response = await DocumentPicker.pick({
                presentationStyle: 'fullScreen',
            });
          //  console.log(response)
        } catch (err) {
            console.warn(err);
        }
    }


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
                Alert.alert('Write permission err', err);
            }
            return false;
        } else return true;
    };

    const openDeviceCamera = async () => {
        let isCameraPermitted = await requestCameraPermission();
        let isStoragePermitted = await requestExternalWritePermission();
        if (isCameraPermitted && isStoragePermitted) {
            ImagePicker.openCamera({
                width: 300,
                height: 400,
                cropping: true,
            }).then(image => {
                //console.log(image);
                uploadImage(image)
            });
        }
        const uploadImage = async (img) => {
            if (Platform.OS === 'android') { var fileName = img.path.substring(img.path.lastIndexOf('/') + 1) }
            else { var fileName = img.filename }
            let reference = storage().ref(fileName);         // 2
            let task = reference.putFile(img.path);               // 3

            task.then(() => {                                 // 4
                console.log('Image uploaded to the bucket!');
                downloadURL(reference)
            }).catch((e) => console.log('uploading image error => ', e));

        }
        const downloadURL = async (reference) => {
            reference
                .getDownloadURL()
                .then((url) => {
                    //from url you can fetched the uploaded image easily
                    console.log("download url", url)
                    send(url, '', '')
                    // setFilePath(url)
                    // setShowImage(true)
                })
                .catch((e) => console.log('getting downloadURL of image error => ', e));
        }
    }

    const openDeviceVideo = async () => {
        let isCameraPermitted = await requestCameraPermission();
        let isStoragePermitted = await requestExternalWritePermission();
        if (isCameraPermitted && isStoragePermitted) {
            ImagePicker.openCamera({
                mediaType: 'video',
            }).then(video => {
                //console.log(video);
                uploadVideo(video)
            });
        }
        const uploadVideo = async (video) => {
            const uploadUri = Platform.OS === 'ios' ? video.sourceURL.replace('file://', '') : video.path
            if (Platform.OS === 'android') { var fileName = video.path.substring(video.path.lastIndexOf('/') + 1) }
            else { var fileName = video.filename }
            let reference = storage().ref(fileName);         // 2
            let task = reference.putFile(uploadUri);               // 3

            task.then(() => {                                 // 4
                console.log('Video uploaded to the bucket!');
                downloadURL(reference)
            }).catch((e) => console.log('uploading image error => ', e));

        }
        const downloadURL = async (reference) => {
            reference
                .getDownloadURL()
                .then((url) => {
                    //from url you can fetched the uploaded image easily
                    console.log("download url", url)
                    send('', '', url)
                    // setFilePath(url)
                    // setShowImage(true)
                })
                .catch((e) => console.log('getting downloadURL of image error => ', e));
        }
    }





    const choosePhoto = async () => {
        let isStoragePermitted = await requestExternalWritePermission();
        if (isStoragePermitted) {
            ImagePicker.openPicker({
                width: 300,
                height: 400,
                cropping: true
            }).then(img => {
              //  console.log(img);
                //setFilePath(img.sourceURL)
                //setShowImage(true)

                uploadImage(img)
                // const imageBlob = fetch(img.path).then((response) => response.blob).catch((e)=>console.log("error".e))
                // upload(imageBlob, img)
            });
        }
        // const upload = async (imageBlob, img) => {
        //     console.log("hjgfjasdjasfgjhhsdjasfkjfh",img.filename)
        //     const storageRef = storage().ref()
        //     const imageRef = storageRef.child(img.filename)
        //     try {
        //         await imageRef.put(imageBlob)
        //         console.log("success")

        //     } catch (e) {
        //         Alert.alert(e)
        //     }
        // }
        const uploadImage = async (img) => {
            if (Platform.OS === 'android') { var fileName = img.path.substring(img.path.lastIndexOf('/') + 1) }
            else { var fileName = img.filename }
            let reference = storage().ref(fileName);         // 2
            let task = reference.putFile(img.path);               // 3

            task.then(() => {     
               // console.log("task",task)                            // 4
                console.log('Image uploaded to the bucket!');
                downloadURL(reference)
            }).catch((e) => console.log('uploading image error => ', e));

        }
        const downloadURL = async (reference) => {
            reference
                .getDownloadURL()
                .then((url) => {
                    //from url you can fetched the uploaded image easily
                    console.log("download url", url)
                    send(url, '', '')
                    // setFilePath(url)
                    // setShowImage(true)
                })
                .catch((e) => console.log('getting downloadURL of image error => ', e));
        }
    }
    const chooseVideo = async () => {
        let isStoragePermitted = await requestExternalWritePermission();
        if (isStoragePermitted) {
            ImagePicker.openPicker({
                mediaType: "video",
            }).then((video) => {
                //console.log(video);
                //setFilePath(video.sourceURL)

                uploadVideo(video)
            });
        }
        const uploadVideo = async (video) => {
            const uploadUri = Platform.OS === 'ios' ? video.sourceURL.replace('file://', '') : video.path
            if (Platform.OS === 'android') { var fileName = video.path.substring(video.path.lastIndexOf('/') + 1) }
            else { var fileName = video.filename }
            let reference = storage().ref(fileName);         // 2
            let task = reference.putFile(uploadUri);               // 3

            task.then(() => {                                 // 4
                console.log('Video uploaded to the bucket!');
                downloadURL(reference)
            }).catch((e) => console.log('uploading image error => ', e));

        }
        const downloadURL = async (reference) => {
            reference
                .getDownloadURL()
                .then((url) => {
                    //from url you can fetched the uploaded image easily
                    console.log("download url", url)
                    send('', '', url)
                    // setFilePath(url)
                    // setShowImage(true)
                })
                .catch((e) => console.log('getting downloadURL of image error => ', e));
        }
    }


    const chooseDocs = async () => {
        try {
            const response = await DocumentPicker.pickSingle({
                presentationStyle: 'fullScreen',
                copyTo: "cachesDirectory"
            });
           // console.log("docs", response)
            uploadDocs(response)
        } catch (err) {
            console.warn(err);
        }
    }
    const uploadDocs = async (response) => {
        if (Platform.OS === 'android') {
            let reference = storage().ref(response.name);         // 2
            let task = reference.putFile(response.fileCopyUri);               // 3

            task.then((res) => {                                 // 4
                console.log('docs uploaded to the bucket!', res);
                downloadURL(reference)
            }).catch((e) => console.log('uploading docs error => ', e));
        }
        else {
            let reference = storage().ref(response.name);         // 2
            let task = reference.putFile(response.uri);               // 3

            task.then((res) => {                                 // 4
                console.log('docs uploaded to the bucket!', res);
                downloadURL(reference)
            }).catch((e) => console.log('uploading docs error => ', e));
        }

    }
    const downloadURL = async (reference) => {
        reference
            .getDownloadURL()
            .then((url) => {
                //from url you can fetched the uploaded image easily
                console.log("download docs url", url)
                send('', url, '')
                // setFilePath(url)
                // setShowImage(true)
            })
            .catch((e) => console.log('getting downloadURL of docs error => ', e));
    }




    useEffect(() => {
        const subscriber = firestore()
            .collection('Chat')
            .onSnapshot((shot) => {
                const arr = []
                const newdata = shot.docs.map((documentSnapshot) => {
                    const { timestamp } = documentSnapshot.data()
                    arr.push({
                        id: documentSnapshot.id,
                    })
                    return {
                        timestamp
                    }
                })
                //console.log("list data", newdata)

                count = 0;
                ;
                if (arr.length > 0) {
                    for (i = 0; i < arr.length; i++) {
                        if (arr[i].id == chatId)
                            count++;
                    }
                    if (count > 0) {
                        setIdChat(chatId)
                    }
                    else
                        addChat()

                }
                else { addChat() }
            });

        // Stop listening for updates when no longer required
        return () => subscriber();
    }, []);
    useEffect(() => {
        const subscriber = firestore()
            .collection('Chat')
            .doc(chatId)
            .collection('messages')
            .orderBy('timestamp')
            .onSnapshot((shot) => {
                const arr = []
                const newdata = shot.docs.map((documentSnapshot) => {
                    const { message, senderId, timestamp, url, fileUrl, videoUrl } = documentSnapshot.data()

                    return {
                        message,
                        senderId,
                        timestamp,
                        url,
                        fileUrl,
                        videoUrl
                    }
                })
               // console.log("chat list", newdata)
                setList(newdata)


            });

        // Stop listening for updates when no longer required
        return () => subscriber();
    }, []);





    const addChat = () => {
      //  console.log("add chat ", chatId, firestore.FieldValue.serverTimestamp())
        try {
            firestore()
                .collection('Chat')
                .doc(chatId)
                .set({
                    timestamp: firestore.FieldValue.serverTimestamp(),
                })
                .then(() => {
                    console.log('Chat added');

                });
        } catch {
            Alert.alert("Error !!")
            console.log('error')
        }

    }
    const send = (url, fileUrl, videoUrl) => {
        setVisible(false)
      // console.log("hdgfgajsgasfadfgasdgsdghyjyrtuykyj")
        try {
            firestore()
                .collection('Chat')
                .doc(chatId)
                .collection('messages')
                .add({
                    //name: name,
                    //phoneNumber: phone,
                    senderId: auth().currentUser.uid,
                    timestamp: firestore.FieldValue.serverTimestamp(),
                    message: message,
                    url: url,
                    fileUrl: fileUrl,
                    videoUrl: videoUrl
                })
                .then(() => {
                    console.log('message send');
                    setMessage('')
                });
        } catch {
            Alert.alert("Error !!")
        }
        // uploadImage
    }


    const pressVideo = () => {
        this.player.presentFullscreenPlayer()
    }

    return (
        <View style={styles.container}>
            <View style={{ width: '100%', height: '10%', backgroundColor: 'lightgrey', justifyContent: 'flex-end' }}>
                <Text style={{ alignSelf: 'center', marginBottom: '2%', fontSize: 18, fontWeight: '400' }}>{name}</Text>
            </View>
            <View style={{ justifyContent: 'flex-end', flex: 1 }}>


                <FlatList
                    data={list}
                    renderItem={({ item }) => {
                        if (item.senderId == auth().currentUser.uid) {
                            //console.log(item)
                            return (
                                <View style={{
                                    padding: '2%', margin: '1%',
                                    minWidth: scaledValue(50), maxWidth: scaledValue(200), borderRadius: scaledValue(5),
                                    backgroundColor: '#A1F7A1', alignSelf: 'flex-end'
                                }}>
                                    {item.url &&

                                        <Image source={{ uri: item.url }}
                                            style={{ width: scaledValue(115), height: scaledValue(150), }}
                                            resizeMode='stretch' />}
                                    {item.message && <Text>
                                        {item.message}
                                    </Text>}
                                    {item.fileUrl && <Text style={{ fontSize: 15 }}
                                        onPress={() => Linking.openURL(item.fileUrl)} >Docs(Click on Me!)</Text>}
                                    {item.videoUrl &&
                                        <TouchableOpacity onPress={pressVideo} style={{}}>
                                            <Video
                                                style={{ height: scaledValue(100), width: scaledValue(180), zIndex: -1 }}
                                                source={{ uri: item.videoUrl }}
                                                controls={true}
                                                repeat={false}
                                                resizeMode="stretch"
                                                ref={(ref) => {
                                                    this.player = ref
                                                }}
                                            />
                                            <Image source={require('../../assets/play-buttton.png')}
                                                style={{
                                                    zIndex: 1, width: scaledValue(30), height: scaledValue(30),
                                                    position: 'absolute', alignSelf: 'center', top: scaledValue(35), opacity: scaledValue(0.8)
                                                }} />
                                        </TouchableOpacity>}
                                </View>
                            )
                        }
                        else {
                            return (
                                <View style={{
                                    padding: '2%', margin: '1%',
                                    minWidth: scaledValue(50), maxWidth: scaledValue(200), borderRadius: scaledValue(5),
                                    backgroundColor: '#A1F7A1', alignSelf: 'flex-start'
                                }}>
                                    {item.url &&

                                        <Image source={{ uri: item.url }}
                                            style={{ width: scaledValue(115), height: scaledValue(150), }}
                                            resizeMode='contain' />}
                                    {item.message && <Text>
                                        {item.message}
                                    </Text>}
                                    {item.fileUrl && <Text style={{ fontSize: 15 }}
                                        onPress={() => Linking.openURL(item.fileUrl)} >Docs(Click on Me!)</Text>}
                                    {item.videoUrl &&
                                        <TouchableOpacity style={{}}>
                                            <Video
                                                style={{ height: scaledValue(100), width: scaledValue(180), }}
                                                source={{ uri: item.videoUrl }}
                                                controls={false}
                                                repeat={false}
                                                resizeMode="contain"

                                            />
                                        </TouchableOpacity>}
                                </View>
                            )
                        }
                    }} />


                <View style={{
                    flexDirection: 'row', borderRadius: scaledValue(5), borderWidth: scaledValue(0.5),
                    height: scaledValue(35), margin: '2%',
                }}>
                    <TextInput placeholder='Type here' onChangeText={(t) => { setMessage(t) }}
                        style={{
                            width: windowWidth - scaledValue(105) - 0.04 * windowWidth,
                            textAlign: 'center',
                        }}
                        value={message} />
                    <TouchableOpacity style={{ position: 'absolute', right: scaledValue(5),
                     bottom: scaledValue(5),zIndex:10}}
                        onPress={() => (send('', '', ''))}>
                        <Image source={require('../../assets/send.png')}
                            style={{
                                width: scaledValue(25), height: scaledValue(25),

                            }} />
                    </TouchableOpacity>

                    <View style={styles.centeredView}>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={visible}
                            onRequestClose={() => {
                                Alert.alert('Modal has been closed.');
                                setVisible(!modalVisible);
                            }}>
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <View style={{ flexDirection: 'row', marginBottom: scaledValue(10) }}>
                                        <TouchableOpacity onPress={choosePhoto}>
                                            <Image source={require('../../assets/image1.png')}
                                                style={{ height: scaledValue(40), width: scaledValue(40), marginRight: scaledValue(10) }} /></TouchableOpacity>
                                        <TouchableOpacity onPress={chooseVideo}>
                                            <Image source={require('../../assets/video-camera.png')}
                                                style={{ height: scaledValue(40), width: scaledValue(40) }} onPress={choosePhoto} />
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <Text onPress={openDeviceCamera}
                                            style={{ marginBottom: scaledValue(10), color: 'blue' }}>Device Camera(Image)</Text>
                                        <Text onPress={openDeviceVideo}
                                            style={{ marginBottom: scaledValue(10), color: 'blue' }}>Device Camera(Video)</Text>
                                    </View>
                                    <Pressable
                                        style={[styles.button, styles.buttonClose]}
                                        onPress={() => setVisible(!visible)}>
                                        <Text style={styles.textStyle}>Hide Modal</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </Modal>
                    </View>
                    <TouchableOpacity style={{ position: 'absolute', right: scaledValue(35), bottom: scaledValue(5) }}
                        onPress={() => (setVisible(true))}>
                        <Image source={require('../../assets/image.png')}
                            style={{
                                width: scaledValue(25), height: scaledValue(25),

                            }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ position: 'absolute', right: scaledValue(70), bottom: scaledValue(5) }}
                        onPress={chooseDocs}>
                        <Image source={require('../../assets/docs.png')}
                            style={{
                                width: scaledValue(25), height: scaledValue(25),

                            }} />
                    </TouchableOpacity>
                </View>
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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //marginTop: 22,
    },
    modalView: {
        margin: scaledValue(15),
        backgroundColor: 'white',
        borderRadius: scaledValue(20),
        padding: scaledValue(30),
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 8,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});

//make this component available to the app
export default ChatScreen;
