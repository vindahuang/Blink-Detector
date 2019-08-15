import React, { Component } from 'react';
// import Navigator from './Navigation';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import HomeScreen from './Home'
import VerifScreen from './Verification'
import {AsyncStorage} from 'react-native';
import Cam_part from './Cam_part_2'
import show_pic from './show_pic'
import vid_part from './vid_part'
import show_vid from './show_vid'
import { Content } from 'native-base';
 
// import Permissions from "react-native-permissions";


const Navigator = createStackNavigator({
  Home: {screen: HomeScreen},
  Verif: {screen: VerifScreen},
  Cam_part:{screen: Cam_part},
  show:{screen: show_pic},
  vid_part:{screen: vid_part},
  show_vid:{screen: show_vid}
}
,
{
  initialRouteName: 'Home'
});

const AppContainer = createAppContainer(Navigator);

export default class App extends Component {
  render() {
    return (
      // <VerifScreen />
      // <Cam_part />
      <AppContainer />
      // _requestPermission = () => {
      //   Permissions.request('camera', {
      //     rationale: {
      //       title: 'Camera Permission',
      //       message:
      //         'this app needs access to your camera ' +
      //         'so we can take your pic.',
      //     },
      //   }).then(response => {
      //     this.setState({cameraPermission: response});
      //   });
      // }
    );
    }
  }
