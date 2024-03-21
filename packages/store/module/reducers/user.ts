import { createSlice } from '@reduxjs/toolkit';
import { MenuItem, TOKEN, getStorage } from 'utils';

export interface IUserInitialState {
  role: string[];
  userInfor: object;
  token: string;
  menu: MenuItem[];
  [key: string]: any;
}

export interface Type {
  type: string;
}
// 默认状态
const initialState: IUserInitialState = {
  role: [],
  userInfor: {},
  token: getStorage(TOKEN) ?? '',
  menu: [],
};

export const userSlice: any = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setUserToken: (state, action) => {
      state.token = action.payload;
    },
    setUserInfor: (state, action) => {
      state.userInfor = action.payload;
    },
    setMenu: (state, action) => {
      state.menu = action.payload;
    },
  },
});

export const { setUserToken, setUserInfor, setMenu } = userSlice.actions;

export default userSlice.reducer;
