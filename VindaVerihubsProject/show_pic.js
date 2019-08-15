import React, { Component } from 'react';
import HomeScreen from './Home'
import VerifScreen from './Verification'
import {AsyncStorage , Text, Image} from 'react-native';
import Cam_part from './Cam_part'
import { Content } from 'native-base';

export default class picture extends Component{
    render(){
        const { navigation } = this.props;
        const otherParam = navigation.getParam('photouri');
        return(
            <Content>
                <Text>otherParam: {JSON.stringify(otherParam)}</Text>
                <Image
                style={{ height: 700, width: 850, alignSelf: "center" }}
                source={{ uri: this.props.navigation.state.params.photouri }}
                // source={otherParam}
                resizeMode="contain"
                />
            </Content>
            // <Text>HALO :V</Text>
        );
    }
}