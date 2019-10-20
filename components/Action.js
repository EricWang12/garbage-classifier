import React from 'react';
import { Text, View, TouchableOpacity, Alert } from 'react-native';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'

const options = [
    'Cancel',
    'Toss it'
]

export default class Action extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidUpdate() {
        this.showActionSheet();
    }
    showActionSheet = () => {
        this.ActionSheet.show()
      }
    render() {
        return (
            <ActionSheet
            ref={o => this.ActionSheet = o}
            title={<View><Text style={{color: '#000', fontSize: 18}}>We got the results for you!</Text><Text>Your item is {this.props.name}, and it is {this.props.category}.</Text></View>}
            options={options}
            cancelButtonIndex={0}
            destructiveButtonIndex={4}
            onPress={(index) => { /* do something */ }}
            />
        );
    }
}