import {ADD_LIST_DEVICE, DEVICE_SELECTED} from '../constants/index'

export const addListDevice = list => (
  {
    type: ADD_LIST_DEVICE,
    payload: list,
  }
);
export const deviceSelected = item => (
  {
    type: DEVICE_SELECTED,
    payload: item,
  }
);