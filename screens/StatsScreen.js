import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

export default function LinksScreen() {
  return (
    <ScrollView style={styles.container}>
      {/**
       * Go ahead and delete ExpoLinksView and replace it with your content;
       * we just wanted to provide you with some helpful links.
       */}
      {/* <p>Show some user data here</p> */}
    </ScrollView>
  );
}

LinksScreen.navigationOptions = {
  title: 'Stats',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
