import React from 'react';
import { Text, View, TouchableOpacity, Image  } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { Video } from "expo";
// import { FaceDetector } from "expo";
import { FaceDetector } from "react-native-camera";
import { stringify } from 'querystring';


export default class CameraExample extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
  };

  // createFormData = (photo, body) => {
  //   const data = new FormData();
  
  //   data.append("photo", {
  //     name: photo.fileName,
  //     type: photo.type,
  //     uri:
  //       Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
  //   });
  
  //   Object.keys(body).forEach(key => {
  //     data.append(key, body[key]);
  //   });
  
  //   return data;
  // };


  // handleUploadPhoto = () => {
  //   const data = new FormData();
  //   data.append('file', this.uploadInput.files[0]);
  //   data.append('filename', this.fileName.value);

  //   fetch('http://localhost:8000/upload', {
  //     method: 'POST',
  //     body: data,
  //   }).then((response) => {
  //     response.json().then((body) => {
  //       this.setState({ imageURL: `http://localhost:8000/${body.file}` });
  //     });
  //   });

    // fetch("linkAPI", {
    //   method: "POST",
    //   body: createFormData(this.state.photo, { userId: "123" })
    // })
    //   .then(response => response.json())
    //   .then(response => {
    //     console.log("upload succes", response);
    //     alert("Upload success!");
    //     this.setState({ photo: null });
    //   })
    //   .catch(error => {
    //     console.log("upload error", error);
    //     alert("Upload failed!");
    //   });
  // };

  // isCameraReady = false;

  // onStartRecording= () => async () => {
  //   if (this.isCameraReady) {
  //     this.setState({ isRecording: true, fileUrl: null });
  //     this.setVideoDuration();
  //     this.cameraRef.recordAsync({ quality: '4:3' })
  //       .then((file) => {
  //         this.setState({ fileUrl: file.uri });
  //       });
  //   }
  // };

  // stopRecording= () => {
  //   if (this.isRecording) {
  //     this.cameraRef.stopRecording();
  //     this.setState({ isRecording: false });
  //     clearInterval(this.interval);
  //   }
  // };

  snap = async () => {
    if (this.camera) {
      // const options = { quality: 0.5, base64: true }
      const photo = await this.camera.takePictureAsync()
      // var req = require(photo.uri)
      // this.handleUploadPhoto.bind(this)
      this.props.navigation.navigate("show", { photouri : photo.uri})
    }
  };

  // setCameraReady= () => ({ isCameraReady: true });

//   snap = async (recognize) => {
//     try {
//         if (this.camera) {
//             let photo = await this.camera.takePictureAsync({ base64: true });
//             if(!faceDetected) {
//                 alert('No face detected!');
//                 return;
//             }

//             const userId = makeId();
//             const { base64 } = photo;
//             this[recognize ? 'recognize' : 'enroll']({ userId, base64 });
//         }
//     } catch (e) {
//         console.log('error on snap: ', e)
//     }
// };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <Text>GAADA</Text>;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera ref={ref => {
          this.camera = ref;
          }} 
          // onCameraReady = {SetCameraReady} 
          style={{ flex: 1 }} type={this.state.type}
          >

          {/* <Camera
          ref={ref => {
            this.camera = ref;
            }}
              style={{ flex: 1 }}
              type={'front'}
              onFacesDetected={this.handleFacesDetected}
              faceDetectorSettings={{
                  mode: FaceDetector.Constants.Mode.fast,
                  detectLandmarks: FaceDetector.Constants.Mode.none,
                  runClassifications: FaceDetector.Constants.Mode.none
              }}>
          </Camera> */}

            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  paddingVertical: 17 ,
                  paddingLeft:'87%'
                }}
                onPress={() => {
                  this.setState({
                    type:
                      this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back,
                  });
                }}>
                <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flip </Text>
              </TouchableOpacity>
              <TouchableOpacity style={{
                   position: 'absolute',
                   bottom:15,
                   width: "100%",
                   height:"10%",
                   alignContent: 'center',
                   alignItems: 'center'
                }} onPress={this.snap.bind(this) }>
                <Image style={{width: 65, height: 65}} source={require('./assets/cam_icon.png')}          
                />
            </TouchableOpacity>
            </View>
          </Camera>
        </View>
        );
    }
  }
}