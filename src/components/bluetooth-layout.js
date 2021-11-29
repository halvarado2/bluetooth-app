import React from "react";
import { View, Text, Button, StyleSheet } from 'react-native'; 

function BluetoothLayout(props) {
  return(
    <View style={styles.container}>
      <Text style={styles.title}>{props.title}</Text>
      {props.children}
    </View>
  )
}

const styles =  StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    // paddingVertical: 1,
    backgroundColor: '#ffff'
  },
  title: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold'
  }
})

export default BluetoothLayout;