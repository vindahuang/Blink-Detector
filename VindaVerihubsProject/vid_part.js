import React from 'react';
import { Button, Text, Header, Body, Icon, Title, Spinner } from 'native-base';
// import { FileSystem } from 'expo';
import * as FileSystem from "expo-file-system";
import { Camera } from 'expo-camera'
import * as Permissions from 'expo-permissions';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
// import Layout from './Layout';
import delay from 'delay';
import shortid from 'shortid'

class RedirectTo extends React.Component {
  componentDidMount() {
    const { scene, navigation } = this.props;
    navigation.navigate(scene);
  }

  render() {
    return <View/>;
  }
}

const printChronometer = seconds => {
  const minutes = Math.floor(seconds / 60);
  const remseconds = seconds % 60;
  return '' + (minutes < 10 ? '0' : '') + minutes + ':' + (remseconds < 10 ? '0' : '') + remseconds;
};

export default class VideoRecorder extends React.Component {
  static navigationOptions = {
    header: () => (
      <Header>
        <Body>
          <Title>Recorded</Title>
        </Body>
      </Header>
    )
  };

  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.front,
    recording: false,
    duration: 0,
    redirect: false,
  };

  async componentDidMount() {
    const { status: cameraStatus } = await Permissions.askAsync(Permissions.CAMERA);
    const { status: audioStatus } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    this.setState({ hasCameraPermission: cameraStatus === 'granted' && audioStatus === 'granted' });
  }

  async registerRecord() {
    const { recording, duration } = this.state;

    if (recording) {
      await delay(1000);
      this.setState(state => ({
        ...state,
        duration: state.duration + 1
      }));
      if (this.state.duration < 3 ) {
        this.registerRecord();
      }
      else{
        this.toggleRecording();
      }
    }
  }

  async startRecording() {
    if (!this.camera) {
      return;
    }

    await this.setState(state => ({ ...state, recording: true }));
    this.registerRecord();
    const record = await this.camera.recordAsync();
    // console.log(record);
    const videoId = shortid.generate();

    await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}vid/`, {
      intermediates: true
    });

    await FileSystem.moveAsync({
      from: record.uri,
      to: `${FileSystem.documentDirectory}vid/VINDA${videoId}.mp4`
    });
    // <Text>{JOSN.stringify(${FileSystem.documentDirectory}videos/)}</Text>
    // console.log(`${FileSystem.documentDirectory}videos/demo_${videoId}.mov`);
    this.setState(state => ({ ...state, redirect: 'show_vid' }));
  }

  async stopRecording() {
    if (!this.camera) {
      return;
    }
    
    await this.camera.stopRecording();
    this.setState(state => ({ ...state, recording: false, duration: 0 }));
  }

  toggleRecording() {
    const { recording } = this.state;

    return recording ? this.stopRecording() : this.startRecording();
  }

  render() {
    const { hasCameraPermission, recording, duration, redirect } = this.state;

    if (redirect) {
      return <RedirectTo scene={redirect} navigation={this.props.navigation} />;
    }

    if (hasCameraPermission === null) {
      return (
        <View style={styles.containerCenter}>
          <Spinner />
        </View>
      );
    } else if (hasCameraPermission === false) {
      return (
        <View style={styles.containerCenter}>
          <Text>No access to camera</Text>;
        </View>
      );
    } else {
      return (
        <View style={styles.containerCenter}>
          <Camera
            style={styles.containerCamera}
            type={this.state.type}
            ref={ref => {
              this.camera = ref;
            }}
          >
            <View style={styles.topActions}>
              {recording && (
                <Button iconLeft transparent light small style={styles.chronometer}>
                  <Icon ios="ios-recording" android="md-recording" />
                  <Text>{printChronometer(duration)}</Text>
                </Button>
              )}
              {!recording && <View />}

              <Button
                small
                transparent
                success
                style={styles.flipCamera}
                onPress={() => {
                  this.setState({
                    type:
                      this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back
                  });
                }}
              >
                <Icon ios="ios-reverse-camera" android="md-reverse-camera" />
              </Button>
            </View>
            <View style={styles.bottonActions}>
              <Button transparent onPress={() => this.setState({ redirect: 'Home' })}>
                <Icon ios="ios-home" android="md-home" />
              </Button>
              <Button
                danger
                onPress={() => {
                  this.toggleRecording();
                }}
              >
                {recording ? (
                  // <Icon ios="ios-square" android="md-square">
                    <Text> BLINK ! </Text>
                  // </Icon>
                ) : (
                  <Icon ios="ios-radio-button-on" android="md-radio-button-on" >
                    {/* <Text> Start recording</Text> */}
                  </Icon>
                )}
              </Button>
              <Button transparent onPress={() => this.setState({ redirect: 'show_vid' })}>
                <Icon ios="ios-folder" android="md-folder" />
              </Button>
            </View>
          </Camera>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  topActions: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  flipCamera: {
    margin: 10
  },
  chronometer: {
    margin: 10
  },
  bottonActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 10
  },
  containerCenter: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  containerCamera: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  }
});