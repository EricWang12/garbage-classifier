import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { VictoryPie, VictoryChart, VictoryTheme } from "victory-native";

const data = [
  { x: "Recyclable", y: 5 },
  { x: "Compost", y: 12 },
  { x: "Hazardous", y: 2 },
  { x: "Trash", y: 23}
];

const recycleableColor = '#3EE084';
const compostColor = '#FEBA02';
const hazardousColor = '#FA876E';
const trashColor= '#ffffff';
const colors = [recycleableColor, compostColor, hazardousColor, trashColor];

export default function LinksScreen() {
  return (

    <ScrollView style={styles.scroll}>
      <View style={styles.container}>
        <VictoryPie
          colorScale={colors}
          data={data}
          height={300}
          style={{labels: { fontSize: 18, padding: 15, fill: "white" }}}
        />
      </View>

    </ScrollView>
  );
}

LinksScreen.navigationOptions = {
  title: 'Stats',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scroll:{
    backgroundColor: "#303030",
  }
});
