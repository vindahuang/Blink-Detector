import React from 'react';
import { Text, View, TouchableOpacity, Image  } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import * as FaceDetector from "expo-face-detector";
import delay from 'delay'
// import { FaceDetector } from "react-native-camera";
import { stringify } from 'querystring';
import { onCameraDidChangeTrackingState } from 'expo/build/AR';
import { Colors } from 'react-native/Libraries/NewAppScreen';

class RedirectTo extends React.Component {
  componentDidMount() {
    const { scene, navigation } = this.props;
    navigation.navigate(scene);
  }

  render() {
    return <View/>;
  }
}

export default class CameraExample extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    faces: [],
    redirect: false,
    close: false
  };

  evaluate= ()=>{
    if(this.state.faces.length> 0 ) {
      const hasil= this.state.faces.map(this.getProb)
      // alert(hasil)
      if (hasil > 0.2 && this.state.close == true ){
        this.state.close= false
        return true
      }
      else{
        if(hasil <= 0.1) {this.state.close= true}
        return false
      }
    }
    return false
  }

  getProb({leftEyeOpenProbability,rightEyeOpenProbability}){
    const open_prob = leftEyeOpenProbability+rightEyeOpenProbability
    return(open_prob/2.00)
  }

  async snap(){
    const par = this.evaluate()
    if (this.camera && par) {
      await delay(80)
      const photo = await this.camera.takePictureAsync()
      this.props.navigation.navigate("show", { photouri : photo.uri})
    }
    else{
      await delay(10)
      this.snap()
    }
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  handleFacesDetected = async ({faces}) => {
    if(faces.length > 0){
      this.setState({faces})
      // this.setState(state => ({ ...state,faces:faces }));
        // alert(this.camera)
        // this.setState({faceok: true})
        // await this.camera.stopRecording()
      // const photo = await this.camera.takePictureAsync()
      // this.props.navigation.navigate("show", { photouri : photo.uri})
    }
  }; 

  redi(){
    this.state.redirect= 'show'
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (this.state.redirect) {
      return <RedirectTo scene={this.state.redirect} navigation={this.props.navigation} />;
    }
    if (hasCameraPermission === null) {
      return <Text>GAADA</Text>;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          {/* <Camera ref={ref => {
          this.camera = ref;
          }} 
          // onCameraReady = {SetCameraReady} 
          style={{ flex: 1 }} type={this.state.type}
          > */}

          <Camera
          ref={ref => {
            this.camera = ref;
            }}
              style={{ flex: 1 }}
              type={'front'}
              onFacesDetected={this.handleFacesDetected.bind(this)}
              faceDetectorSettings={{
                  mode: FaceDetector.Constants.Mode.fast,
                  detectLandmarks: FaceDetector.Constants.Landmarks.all,
                  runClassifications: FaceDetector.Constants.Classifications.all,
              }
              }
              
            >
            
          {/* </Camera> */}
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
                }}
                >
                <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flip </Text>
              </TouchableOpacity>
              <TouchableOpacity style={{
                   position: 'absolute',
                   bottom: 15,
                   width: "90%",
                   height:"10%",
                  //  alignContent: 'center',
                   alignItems: 'center',
                   backgroundColor: '#FFCCFF',
                   opacity: '50%'
                }} onPress={this.snap.bind(this) }>
               <Text style={{color: '#CCFFCC'}}>START</Text>
            </TouchableOpacity>
            </View>
          </Camera>
          {/* {
            this.sebuahfungsi
          } */}
          {/* {alert(this.state.faces.length)} */}
          {/* {this.state.prob=this.state.faces.length ? this.sebuahfungsi() : undefined} */}
          {/* {alert(this.state.prob)} */}
        </View>
        );
    }
  }
}