import React, { Component } from 'react' 
import { ImageBackground ,StyleSheet , View } from 'react-native'
import { Container, Header, Content, Card, CardItem, Text, Body, Button, Icon } from "native-base";
import * as Font from "expo-font";
// import {NavigationAction} from 'react-navigation' 

 
// const NavigateAction = NavigationAction.navigate({
//    routeName: 'Verif',
//    params: {},
// })

class BlinkingText extends Component {
   constructor(props) {
     super(props);
     this.state = {showText: true};
  
     // Change the state every second 
     setInterval(() => {
       this.setState(previousState => {
         return { showText: !previousState.showText };
       });
     }, 
     // Define any blinking time.
     1000);
   }

   render() {
      let display = this.state.showText ? this.props.text : ' ';
      return (
        <Text style={{fontWeight: 'bold', fontStyle:'italic', fontSize: 30, fontFamily:'Futura-CondensedExtraBold' ,color: 'white', position: 'relative', textAlign: "center"}}>{display}</Text>
      );
    }
}

export default class Homepages extends Component{

   state={
      loadedFont: null
   };
   
   async componentDidMount(){
      await Font.loadAsync({
         'Pacifico':require('./assets/Pacifico.ttf')
      });
      this.setState( {loadedFont : true});
   }

   render(){
      return (
      this.state.loadedFont ? (
      <ImageBackground source = {require('./assets/wall1.gif')} style={{height: '100%', width: '100%', position: 'relative', top: 0, left: 0}}>
            {/* <Content padder> */}
               <View style={styles.container}>
               <Text style={{fontWeight: 'bold', fontSize: 20, fontFamily:'Pacifico' ,color: '#fffaf0', position: 'relative', textAlign: "center"}}>Verification by </Text>
               <BlinkingText text="BLINK"/>
               <Text style={{fontWeight: 'normal',fontFamily:'Futura', color: 'white', position: 'relative', bottom: 0, left: 10 , paddingTop: 15, paddingRight: 10}}>
                  Welcome to this app. To verify your identity click start and blink to submit your live taken picture!
               </Text>
               <Button danger
                  onPress={() => 
                     {
                        return this.props.navigation.navigate('Cam_part');
                     }
                  }
               >
                  <Icon ios="md-arrow-dropright-circle" android="md-arrow-dropright-circle" >
                     <Text> START</Text>
                  </Icon>
               </Button>
               </View>
            {/* </Content> */}
      </ImageBackground>
      ) : <View/>
      );
   }
}

const styles = StyleSheet.create({
   container: {
     flex: 1,
     alignItems: 'center',
     justifyContent: 'center'
   },
   buttonStyle: {
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#336633',
      paddingTop: 4,
      paddingBottom: 4,
      paddingRight: 25,
      paddingLeft: 25,
      marginTop: 10,
      width: 300
    }
 })

// import React from 'react';
// import { Button, Text, Header, Body, Icon, Title } from 'native-base';
// import { StyleSheet, View } from 'react-native';
// import Layout from './Layout';

// export default class App extends React.Component {
//   static navigationOptions = {
//     header: () => (
//       <Header>
//         <Body>
//           <Title>Video recorder</Title>
//         </Body>
//       </Header>
//     )
//   };

//   render() {
//     return (
//       <Layout style={styles.container}>
//         <View style={styles.actionButtons}>
//           <Button primary onPress={() => this.props.navigation.navigate('vid_part')}>
//             <Text>Record Video</Text>
//           </Button>
//           <Button primary onPress={() => this.props.navigation.navigate('show_vid')}>
//             <Text>My Videos</Text>
//           </Button>
//         </View>
//       </Layout>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   actionButtons: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-around'
//   },
//   container: {
//     flex: 1,
//     flexDirection: 'column',
//     justifyContent: 'center'
//   }
// });