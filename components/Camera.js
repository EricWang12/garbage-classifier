import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Alert } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import Action from './Action';

const axios = require('axios');

export default class MyCamera extends React.Component {
  state = {
    name: "",
    category: "",
    hasCameraPermission: null,
    modalText: 'There are currently no categories found for this item',
    visible: false,
    confirmLoading: false,
    type: Camera.Constants.Type.back,
    url: "https://garbage-classi.appspot.com/imageUpload"
  };

  showActionSheet = () => {

    this.ActionSheet.show()
  }

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
    this.setState({ modalVisible: visible });
  }

  handleRes(res) {
    // console.log(res);
    this.props.onHandleRes(res);
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

  base64ToBlob(base64, mime) {
    mime = mime || '';
    var sliceSize = 1024;
    var byteChars = window.atob(base64);
    var byteArrays = [];

    for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
      var slice = byteChars.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mime });
  }

  async snapPhoto() {
    if (this.camera) {
      const options = {
        quality: 0.5, base64: true, fixOrientation: true,
        exif: false, skipProcessing: true
      };
      await this.camera.takePictureAsync(options).then(photo => {
        // photo.exif.Orientation = 1;
        // console.log(photo);

        axios.post('https://garbage-classi.appspot.com/imageUpload', {
          "base64": photo.base64
        })
          .then((res) => {
            // console.log(res);
            this.setState({
              name: res.data.name,
              category: res.data.category
            });
            this.handleRes(res);
            // console.log(this.state.name);
            // console.log(this.state.category);
            // Do our pop up modal here
          })
          .catch((error) => {
            console.error(error);
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
              <Action name={this.state.name} category={this.state.category}/>
            </Camera>
          </View>
        </>
      );
    }
  }
}
