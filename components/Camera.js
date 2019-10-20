<<<<<<< HEAD
import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
=======
import React, {Component} from 'react';
import { Text, View, TouchableOpacity, Alert } from 'react-native';
>>>>>>> 50956f71ecf398d186dc8abced1ac7ca896a476b
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';

const axios = require('axios');

export default class MyCamera extends React.Component {
  state = {
    hasCameraPermission: null,
    modalText: 'There are currently no categories found for this item',
    visible: false,
    confirmLoading: false,
    type: Camera.Constants.Type.back,
    url: "http://localhost:3000/upload"
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({
      ModalText: 'Saving your results',
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 2000);
  };

  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
    });
  };

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  showPopUpModel() {
    console.log("Whatup");
    return (
      <>
      </>
    );
  }

  async snapPhoto() {
    if (this.camera) {
      const options = {
        quality: 0.5, base64: true, fixOrientation: true,
        exif: false, skipProcessing: true
      };
      await this.camera.takePictureAsync(options).then(photo => {
        // photo.exif.Orientation = 1;
        console.log(photo);
        // this.showPopUpModel();
        axios.post('localhost:3000/image_upload', {
          photo
        })
        .then((res) => {
          console.log(`statusCode: ${res.statusCode}`)
          console.log(res)
        })
        .catch((error) => {
          console.error(error)
        })
        
        return true;
      });
    }
  }

  render() {
    const { hasCameraPermission } = this.state;
    const { visible, confirmLoading, modalText } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <>
        <View style={{ flex: 1 }}>
          <Camera style={{ flex: 1 }} type={this.state.type} ref={(ref) => { this.camera = ref }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.setState({
                    type:
                      this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back,
                  });
                }}>
                <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flip </Text>
              </TouchableOpacity>
              <View style={{
                width: '100%', height: 60, position: 'absolute', bottom: 35,
                flex: 1, justifyContent: 'center', flexDirection: 'row'
              }}>
                <TouchableOpacity
                  style={{
                    width: 60, height: 60, borderRadius: 30, backgroundColor: "#fff", margin: 'auto'
                  }}
                  onPress={this.snapPhoto.bind(this)} />
              </View>
            </View>
          </Camera>
        </View>
        </>
      );
    }
  }
}
