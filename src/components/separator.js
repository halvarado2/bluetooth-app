import React from "react";
import { View, Text, StyleSheet } from 'react-native'; 

function Separator(props) {
  return(
      <View style={styles.separator} />
  )
}

const styles =  StyleSheet.create({
  wrapper: {
    flex: 1,
    borderTopWidth: 1,
    marginLeft: 60,
    marginRight: 25,
    borderColor:'#eceff1',
    marginBottom: 10
  },
 
})

export default Separator;