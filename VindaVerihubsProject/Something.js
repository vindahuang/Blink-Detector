import Permissions from "react-native-permissions";
import {Component} from "React"

export default class Perm extends Component{
  _requestPermission = () => {
    Permissions.request('camera', {
      rationale: {
        title: 'Camera Permission',
        message:
          'this app needs access to your camera ' +
          'so we can take your pic.',
      },
    }).then(response => {
      this.setState({cameraPermission: response});
    });
  }
}