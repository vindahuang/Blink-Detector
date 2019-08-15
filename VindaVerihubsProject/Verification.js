import React, { Component} from "react";
import { Button, View, Text } from 'react-native';
import { Content } from "native-base";

// import Cam_part from './Cam_part_2'
import Cam_part from './Cam_part'

export default class Verif extends Component{
    render(){
        return(
            // <Content>
            //     <Button
            //         onPress={() => 
            //             {
            //                 return this.props.navigation.navigate({ routeName : 'Home'});
            //             }
            //         }
            //         title="Back to home"
            //     />
            //     {/* <Cam_part /> */}
            // </Content>
            <Cam_part />

       );
    }
 }