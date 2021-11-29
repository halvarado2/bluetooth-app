import React, { useState, useEffect, } from 'react';
import { StyleSheet, View, NativeModules, NativeEventEmitter, Button, Platform, PermissionsAndroid, FlatList } from 'react-native';

import { useSelector, useDispatch } from "react-redux";
import {addListDevice, deviceSelected} from '../../redux/actions/BluetoothActions';

import BleManager from '../../BleManager';
import Empty from '../components/empty';
import Device from '../components/device';
import Subtitle from '../components/subtittle'
import BluetoothLayout from '../components/bluetooth-layout';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

  const Index = (props) => {

    const listDevice = useSelector((state)=> state.listDevice);
    const dispash = useDispatch();
    const { navigation } = props
    const [isScanning, setIsScanning] = useState(false);
    const peripherals = new Map();
  
    const handleUpdateValueForCharacteristic = (data) => {
      console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
    }
    const updateList = (list) =>{
      dispash(addListDevice(Array.from(list.values())))
    }
  
    const retrieveConnected = () => {
      BleManager.getConnectedPeripherals([]).then((results) => {
        if (results.length == 0) {
          console.log('No se pudo conectar al dispositivo')
        }

        for (var i = 0; i < results.length; i++) {
          var peripheral = results[i];
          peripheral.connected = true;
          peripherals.set(peripheral.id, peripheral);
          updateList(Array.from(peripherals.values()))
        }
      });
    }
  
    const handleDiscoverPeripheral = (peripheral) => {
      console.log('Got ble peripheral', peripheral);
      if (!peripheral.name) {
        peripheral.name = peripheral.id;
        peripheral.connected = false;
      }
      peripherals.set(peripheral.id, peripheral);
      updateList(Array.from(peripherals.values()))
    }


    const startScan = () => {
      if (!isScanning) {
        BleManager.scan([], 3, true).then((results) => {
          console.log('Buscando...');
          setIsScanning(true);
        }).catch(err => {
          console.error(err);
        });
      }
    }
  
    const handleStopScan = () => {
      console.log('Escaneo detenido');
      setIsScanning(false);
    }
  
    const handleDisconnectedPeripheral = (data) => {
      let peripheral = peripherals.get(data.peripheral);
      if (peripheral) {
        peripheral.connected = false;
        peripherals.set(peripheral.id, peripheral);
        updateList(Array.from(peripherals.values()))

      }
      console.log('Desconectado de ' + data.peripheral);
    }
  
    const testPeripheral = (peripheral) => {
      if (peripheral){

        if (peripheral.connected){
          BleManager.disconnect(peripheral.id);
        }else{

          BleManager.connect(peripheral.id).then(() => {
            let p = peripherals.get(peripheral.id);

            if (p) {
              p.connected = true;
              peripherals.set(peripheral.id, p);
              updateList(Array.from(peripherals.values()))

            }
            const newList = listDevice.map((item)=>{
              if( item.id === peripheral.id)
                item.connected = true;
              return item;
            })
            updateList(Array.from(newList))

            setTimeout(() => {
              /* Test read current RSSI value */
              BleManager.retrieveServices(peripheral.id).then((peripheralData) => {
                console.log('Servicio recuperado', peripheralData);
  
                BleManager.readRSSI(peripheral.id).then((rssi) => {
                  console.log('RSSI actual', rssi);
                  let p = peripherals.get(peripheral.id);
                  if (p) {
                    p.rssi = rssi;
                    peripherals.set(peripheral.id, p);
                    updateList(Array.from(peripherals.values()))
                  }                
                });                                          
              }); 
            }, 90);
          }).catch((error) => {
            console.log('Connection error', error);
          });
        }
      }
    }

    const viewDevice =(device) =>{
      dispash(deviceSelected(device))
      navigation.push('View', { name: device.name ?? device.id });
    }
  
    useEffect(() => {
  
        bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
        bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan );
        bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral );
        bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic );
    
        if (Platform.OS === 'android' && Platform.Version >= 23) {
          PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
              if (result) {
                console.log("Permission is OK");
              } else {
                PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
                  if (result) {
                    console.log("Usuario accept0");
                  } else {
                    console.log("Usuario rechazo");
                  }
                });
              }
          });
        }  
  
        BleManager.start({showAlert: false}).then(() => {
          console.log("GM: BLE inicializado")
        })

      return (() => {
        console.log('unmount');
        bleManagerEmitter.remove('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
        bleManagerEmitter.remove('BleManagerStopScan', handleStopScan );
        bleManagerEmitter.remove('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral );
        bleManagerEmitter.remove('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic );
      })
    }, []);
  
    const renderEmpty = () => <Empty text='No hay dispositivos' />
    
    const renderItem = ({item})=> {
      return <Device {...item} 
              onPress={testPeripheral} 
              onView={viewDevice}
              iconInactive={require('../icons/ic_bluetooth.png')} 
              iconActive={require('../icons/ic_bluetooth_active.png')} 
              iconView={require('../icons/ic_setting.jpg')}
               />
    }
  
    return (
      <BluetoothLayout>
        <View style={styles.buttonScan}>
          <Button 
            title={(isScanning ? 'Buscando Dispositivos ...' : 'Buscar Dispositivos')}
            onPress={() => startScan() } 
            />      
        </View>
        <View>
          <Button title="Dispositivos Conectados" onPress={() => retrieveConnected() } />
        </View>
        <Subtitle text="Lista" />
        <FlatList 
            data={listDevice}
            ListEmptyComponent={ renderEmpty }
            renderItem={ renderItem }
            keyExtractor={item => item.id}
            />              
      </BluetoothLayout>
    );
  };
  
  const styles = StyleSheet.create({
    buttonScan: {
      marginBottom: 10,
    },
  });
  
  export default Index;