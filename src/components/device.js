import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Button } from 'react-native'; 
import Separator from "./separator";

function Device(props) {
  const [connecting, setConnecting] = useState(false)
  const calidadRssi = ( rssi ) => {
    if( rssi <= -39) 
      return 'Ideal';
    else if(rssi >= -40 && rssi < -60 ) 
     return 'Idónea';
    else if(rssi >= -60 && rssi < -70 ) 
     return 'Bueno';
    else if(rssi >= -70 && rssi < -80 ) 
     return 'Medio-bajo';
    else if(rssi >= -80 ) 
     return 'Señal mínima';
  };

  useEffect(() => {
    setConnecting(false);
  }, [props])
  
  const onConectedDevice = (device) =>{
    props.onPress(device)
    setConnecting(true);
  }

  const onStateDevice =() =>{
    if(props.connected && !connecting){
      return 'Conectado'
    } else if(props.connected && connecting){
      return 'Desconectando'
    } else if(!props.connected && connecting){
      return 'Conectando'
    } 
    
    return ''
  }
  const onStateIcon =() =>{
    if(props.connected && !connecting){
      return props.iconActive
    }
    return props.iconInactive
  }
  
  return(
    <>

        <View style={{flexDirection:'row' , flex: 1}}>
          <TouchableOpacity style={styles.wrapper} onPress={()=>onConectedDevice(props)} >
              <View style={styles.wrapperLeft}>
                <Image style={styles.iconLeft2} source={onStateIcon()} />
              </View>
          </TouchableOpacity>
          <View style={{flexDirection:'column' , flex: 1}}>
            <View style={{flexDirection:'column', marginBottom: 2}}>
              <Text style={styles.name}>{props.name}</Text>
              <Text style={styles.rssi}>Calidad: {calidadRssi(props.rssi)}</Text>
              {/* <Text style={styles.bluetoothId}>{props.id}</Text> */}
            </View>
              <Text style={styles.name}>{onStateDevice()}</Text> 
            <View style={{flexDirection:'row', marginBottom: 2}}>
            </View>
            {/* { open &&
              <View style={{flexDirection:'column' , flex: 1, marginBottom:10}}>
                <Text style={styles.rssi}>Permite Conexión: {props.advertising.isConnectable?'Si': 'No'}</Text>
                <Text style={styles.rssi}>Calidad: {calidadRssi(props.rssi)}</Text>
                <Text style={styles.bluetoothId}>Conectado: {props.connected?'Si': 'No'}</Text>
              </View>
            } */}
          </View>
          
          {
            props.connected &&
            <TouchableOpacity style={styles.wrapperRight} onPress={()=>props.onView(props)}>
              <Image style={styles.iconRight} source={props.iconView}/>
            </TouchableOpacity>
          }

        </View>
      <Separator/>
  </>
  )
}

const styles =  StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    // paddingLeft: 20,
    // paddingRight: 20,
    alignItems: 'center',
    padding: 10,
    justifyContent: 'space-between'
  },
  wrapperLeft: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 0,
    borderColor: '#ffffff',
    borderWidth: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  wrapperRight: {
    width: 40,
    height: 40,
    borderRadius: 0,
    borderColor: '#ffffff',
    borderWidth: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  iconLeft: {
    width: 25 ,
    height: 30,
    // color: 'red',
  },
  iconLeft2: {
    width: 23 ,
    height: 35,
    // color: 'red',
  },
  iconRight: {
    width: 20,
    height: 20
  },
  wrapperName: {
    flex: 1,
    justifyContent: 'flex-start', marginLeft: 15
  },
  rssi: {
    flex: 1,
    fontSize: 10,
  },
  bluetoothId: {
    flex: 1,
    fontSize: 10,
  },
})

export default Device;