import { ADD_LIST_DEVICE, DEVICE_SELECTED } from '../constants/index' 
const INITIAL_STATE = {
  listDevice:[],
  deviceSelected:[]
};
 
const BluetoothReducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {
    case ADD_LIST_DEVICE:
      return {...state, listDevice: action.payload};

    case DEVICE_SELECTED:
      return {...state, deviceSelected: action.payload};

    default:
      return state
  }
};

export default BluetoothReducer;