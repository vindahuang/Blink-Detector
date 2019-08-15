import {createStackNavigator, createAppContainer} from 'react-navigation';
import HomeScreen from './Home'
import VerifScreen from './Verification'

const Navigator = createStackNavigator({
  Home: {screen: HomeScreen},
  Profile: {screen: VerifScreen},
});

export default createAppContainer (Navigator)