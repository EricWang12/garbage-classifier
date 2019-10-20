import React from 'react';
import { ScrollView, StyleSheet, Text, View, Button } from 'react-native';
import { VictoryPie, VictoryChart, VictoryTheme } from "victory-native";

const recycleableColor = '#3EE084';
const compostColor = '#FEBA02';
const hazardousColor = '#FA876E';
const trashColor = '#ffffff';
const colors = [recycleableColor, compostColor, hazardousColor, trashColor];

export default class LinksScreen extends React.Component{
  constructor(props){
    super(props);

    let param = props.navigation.state.params;
    console.log(param);
  }
  render(){

    const data = [
      { x: "Recyclable", y: 5 },
      { x: "Compost", y: 12 },
      { x: "Hazardous", y: 2 },
      { x: "Trash", y: 23 }
    ];
    
  return (

    <ScrollView style={styles.scroll}>
      <Text style={styles.display}>Summary</Text>
      <View style={styles.container}>
        <VictoryPie
          colorScale={colors}
          data={data}
          height={300}
          style={{ labels: { fontSize: 18, padding: 15, fill: "white" } }}
        />
      </View>

      {/* <Button onPress={handlePress}></Button> */}

    </ScrollView>
  );
  }
}

const handlePress = (e)=>{
  console.log(this.props);
}

LinksScreen.navigationOptions = {
  title: 'Stats',
  header: null
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "nunito"
  },
  scroll: {
    backgroundColor: "#303030",
  },
  display: {
    color: recycleableColor,
    fontFamily: 'nunito-blk',
    fontSize: 60,
    margin: 30,
    marginTop: 50
  }
});
