import {Navigation} from 'react-native-navigation';

export function registerScreens() {
  Navigation.registerComponent('Home', () => require('./App').default);
  Navigation.registerComponent('verif', () => require('./Verification').default);
}