import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, NativeModules, NativeEventEmitter, ScrollView, Button } from 'react-native';
import { Toast } from 'native-base';
import { useSelector } from "react-redux";

import BleManager from 'react-native-ble-manager';
import base64 from 'react-native-base64';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const serviceId = "00001826-0000-1000-8000-00805F9B34FB";
const characteristicId = "00002AD1-0000-1000-8000-00805F9B34FB";

let readDataCache = "";

const BleRowingSession = () => {

  const peripheral = useSelector((state)=> state.deviceSelected);
  // const dispash = useDispatch();

  const [ readData, setReadData ] = useState("");
  const [ state, setState ] = useState({
    deviceid : '', 
    serviceUUID:'', 
    characteristicsUUID : '', 
    text1 : '',
    makedata : [],
    showToast: false,
    notificationReceiving : false,
    manufacturerData:{}
  });

  useEffect(()=>{
    setState({deviceid: peripheral.id, 
          manufacturerData: peripheral.advertising.manufacturerData
          // serviceUUID: props.advertising.serviceUUIDs,
          //  characteristicsUUID : characteristic.uuid,
          // device:device 
        })
        // console.log(props.advertising.serviceUUIDs)
        // console.log(props.advertising.serviceUUIDs)
  }, [peripheral])


  const setUpBleNotification = () => {
    BleManager.retrieveServices(peripheral.id).then((peripheralData) => {
              console.log('Retrieved peripheral services', peripheralData);

              setTimeout(() => {
                BleManager.startNotification(peripheral.id, serviceId, characteristicId).then(() => {
                  console.log('Started notification on ' + peripheral.id);
                  bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', (data) => {
                    readDataCache = readDataCache + "\n" + data.value.toString()
                    setReadData(readDataCache);
                  });
                  setTimeout(() => {

                  }, 500);
                }).catch((error) => {
                  console.log('Notification error', error);
                });
              }, 500)
            });
  }

  // useEffect(() => {
  //   setUpBleNotification()
  // }, [ ])

  
  async function writeMesage(code, message){

    var device= state.device;
    const senddata = base64.encode(message);
    if(device)
    {
        device.writeCharacteristicWithResponseForService(state.serviceUUID, state.characteristicsUUID, senddata).then((characteristic) => {
            
            console.log("write response");
            console.log(characteristic);
            alert(message,"success")
            
            //Sent message and start receiving data
            console.log("device")
            console.log(state.serviceUUID,"device",state.characteristicsUUID)
            console.log(state.device)
            let snifferService = null
            var SERVICE_SNIFFER_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e"
            var SNIFFER_VOLTAGE_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";
            
            device.services().then(services => {
                let voltageCharacteristic = null
                snifferService = services.filter(service => service.uuid === state.serviceUUID)[0]
                snifferService.characteristics().then(characteristics => {
                    console.log("characteristics characteristics")
                    console.log(characteristics)
                    setState({notificationReceiving:true})
                    // voltageCharacteristic is retrieved correctly and data is also seems correct
                    voltageCharacteristic = characteristics.filter(c => c.uuid === characteristics[0].uuid)[0]
                    voltageCharacteristic.monitor((error, c) => {
                        // RECEIVED THE ERROR HERE (voltageCharacteristic.notifiable === true)
                        if(error){
                            console.log("error in monitering",error)  
                            return;
                        }
                        else{
                            // console.log("c",base64.decode(c.value))  
                            const data1 = base64.decode(c.value);
                            var s = data1.split(" ");
                            var s1 = parseInt(s[1]);
                            if(isNaN(s1)) {count++;}
                            else{
                                if(count == 1){
                                    state.makedata.push(<Text key={moment().valueOf()}>{s[0]} : {s1/1000} {"\n"} </Text>);
                                    setState({dateTime : "Data Received at : "+moment().format("MMMM Do, h:mm:ss a"),makedata:state.makedata}); 
                                }
                                if(count == 3){count = 0;setState({makedata:[]})}
                            }
                        }
                    },transactionId)
                }).catch(error => console.log(error))
            })
            return 
        }).catch((error) => {
            alert("error in writing"+JSON.stringify(error))
        })
    }
    else{
        alert("No device is connected")
    }
}

function alert(message,type="danger"){
  Toast.show({
      text: message,
      buttonText: 'Okay',
      duration: 5000,
      type: type,
      Animated : false
  })
}

  return (
    <View style={styles.root}>
      <ScrollView>
        <View style={{flexDirection:'column', marginBottom: 2}}>
          <Text>Pemite conexion: {peripheral.advertising.isConnectable?'Si': 'No'}</Text>
          <Text>Nombre del dispositivo: {peripheral.advertising.localName}</Text>
        </View>
        <Text style={{marginTop:10, marginBottom:5, fontSize:20, fontWeight:'bold'}}>Datos de fabricación</Text>
        <View style={{flexDirection:'column', marginBottom: 2}}>
          <Text>CDVType: {state.manufacturerData.CDVType}</Text>
        </View>
        {/* {"CDVType": "ArrayBuffer", "bytes": [2, 1, 2, 8, 9, 71, 48, 51, 51, 48, 87, 87, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "data": "AgECCAlHMDMzMFdXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="} */}
        {console.log(state.manufacturerData)}
        {/* <View style={styles.footer}>
          <Button title="ACK" style={styles.buttonFooter} onPress={()=>writeMesage("ACK","ACK Writted")}>
          </Button>
          <Button title="RIS 0"  style={styles.buttonFooter} onPress={()=>writeMesage("ris 0","ris 0 Writted")}>
          </Button>
          <Button title="RIS 1"  style={styles.buttonFooter} onPress={()=>writeMesage("ris 1","ris 1 Writted")}>
          </Button>
        </View> */}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      // flex: 1,
      // justifyContent: "center",
      // alignItems: "center",
      flexDirection:'column'
    },

    viewState :{
        alignItems:'center',
        marginVertical : 10
    },
    root:{
        flexDirection: 'row',
        margin: 20
    },
    container:{
        flexDirection: 'row',
    },
    footer:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

    },
    text:{
        flex: 1
    },
    buttonFooter:{
        flex: 1, 
    }
})


export default BleRowingSession;