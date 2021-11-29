import React  from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import BluetoothReducer from './redux/reducers/BluetoothReducer';

import BluetoothIndex from './src/bluetooth/index'
import BleRowingSession from './src/bluetooth/view'

const store = createStore(BluetoothReducer);

const Stack = createNativeStackNavigator();

  export default class App extends React.Component {
   
    render() {
      return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={BluetoothIndex} options={{ title: 'Bluetooth' }} />
            <Stack.Screen name="View" component={BleRowingSession} options={({ route }) => ({ title: route.params.name })} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
      )
    }
  }