import React, {Component} from 'react';
import { Button, Text, Header, Body, Icon, Title, Left, Right, Card, CardItem, Form} from 'native-base';
import { StyleSheet, View} from 'react-native';
import * as FileSystem from "expo-file-system";
import { Video } from "expo-av";
import 'form-data';
// import 'https-browserify'
// import 'fs'
// import { RNFetchBlob } from "rn-fetch-blob";
import shortid from 'shortid';
//import console = require('console');

class RedirectTo extends Component {
  componentDidMount() {
    const { scene, navigation } = this.props;
    navigation.navigate(scene);
  }

  render() {
    return <View/>;
  }
}

export default class TampilVid extends Component {
  static navigationOptions = {
    header: () => (
      <Header>
        <Body>
          <Title>Videos</Title>
        </Body>
      </Header>
    )
  };

  state = {
    videos: [],
    play: null,
    redirect: false
  };

  async componentDidMount() {
    const videos = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory + 'vid');
    this.setState({ videos: videos});
  }

  // cara kirim video 1 RN g support modul node stl
  
  // postVideo = (video) => {
  //   var FormData = require('form-data')
  //   var fs = require('fs')

  //   var form = new FormData();
  //   form.append('video' , fs.createReadStream( `${FileSystem.documentDirectory}vid/${video}`))
  //   form.submit('http://localhost:5000/', function(err, res) {
  //     if (err) throw err;
  //     console.log('Done');
  //   });
  // }

  //
  // cara kirim video 2

  // postVideo = (video) =>  {
  //   var RNFetchBlob = require('rn-fetch-blob').default
    // RNFetchBlob.fetch('POST','http://localhost:5000/', {
    //      'content-type': 'multipart/form-data',
    //      "Accept":"multipart/form-data"
    //   },[
    //     //the value of name depends on the key from server
    //     {name: 'video', filename: video, data: RNFetchBlob.wrap(video.uri) },
    //   ]).then(response => response.json())
    //     .then(response => {
    //         if (response.status === 'success') {
    //             alert("Upload success");
    //             // this.props.navigation.navigate('publish');
    //         } else {
    //            alert(response.msg); 
    //         }})
    //      .catch((err) => {
    //          alert(err);
    //     })
    // }

  //


  // cara kirim video 3 
    // postVideo = (video) =>  {
    //   var FormData = require('form-data')
    //   var form = new FormData(); 
    //   form.append('video', {uri: `${FileSystem.documentDirectory}vid/${video}` , type: 'video/mp4', name: video });
    //   fetch('https://blink-and-capture.herokuapp.com/', {
    //     method: 'POST',
    //     body: form
    //   }).then(res => {
    //     if (res == 'success') {
    //       alert('success')
    //     } else {
    //       alert('failed')
    //     }
    //   }).catch((err) => {
    //     alert(err);
    //   });
    // }
  //

  //cara kirim video ke 4

  postVideo = (video) => {
    let formData = new FormData();
    formData.append("video", {
        name: video,
        uri: `${FileSystem.documentDirectory}vid/${video}`,
        type: 'video/mp4'
    });
    // formData.append("id", "1234567");

    try {
        let response = fetch( 'https://blink-and-capture.herokuapp.com/', {
            method: 'post',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData
        });
        
    }
    catch (error) {
        // console.log('error : ' + error);
        return alert(error);
    }
  }
  // 
  playVideo(video) {
    this.setState({ play: video });
  }
  
  render() {
    const { videos, play, redirect } = this.state;
    if (redirect) {
      return <RedirectTo scene={redirect} navigation={this.props.navigation} />;
    }

    return (
      <View style={styles.container}>
        <View style={styles.videoContainer}>
          {/* <Text>ADA</Text> */}
          {play && (
            <Video 
            style={{ height: 500, width: 640, alignSelf: "center" }}
            source= {{
              uri: `${FileSystem.documentDirectory}vid/${play}`
            }}
            shouldPlay={true}
            isPortrait={true}
            />
            )}
          <View style={styles.actionButtons}>
            <Button iconRight small onPress={() => {this.setState({ redirect: 'Home' }); 
              const videoo = FileSystem.readDirectoryAsync(FileSystem.documentDirectory + 'vid')
              if (videoo){
                FileSystem.deleteAsync(FileSystem.documentDirectory + 'vid')
              }
            }}>
              <Text>Back to</Text>
              <Icon ios="ios-home" android="md-home" />
            </Button>
          </View>
        </View>
         <Card>
            {videos.map(video => (
              <CardItem key={video}>
                <Left>
                  <Text>{video}</Text>
                </Left>
                <Right>
                  <Button danger onPress={() => {this.postVideo(video);
                  this.setState({ redirect: 'Home' })
                  const videoo = FileSystem.readDirectoryAsync(FileSystem.documentDirectory + 'vid')
                  if (videoo){
                    FileSystem.deleteAsync(FileSystem.documentDirectory + 'vid')
                  }
                  }}>
                    <Icon ios="ios-play" android="md-play" />
                  </Button>
                </Right>
              </CardItem>
            ))}
          </Card>
        {/* <Button onPress={() => this.playVideo()}>
          <Icon ios="ios-play" android="md-play" />
          <Text>PLAY VIDEO RECORDED BEFORE</Text>
        </Button> */}
                
        </View>
    );
  }
}

const styles = StyleSheet.create({
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10
  },
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  videoContainer: {
    flexDirection: 'column',
    flexGrow: 1
  }
});
