import { createSlice } from '@reduxjs/toolkit';

export interface SiteInitialState {
  siteInfor: object;
  [key: string]: any;
}
// 默认状态
const initialState: SiteInitialState = {
  siteInfor: {},
};

export const siteSlice: any = createSlice({
  name: 'site',
  initialState: initialState,
  reducers: {
    setSiteInfor: (state, action) => {
      state.siteInfor = action.payload;
    },
  },
});

export const { setSiteInfor } = siteSlice.actions;

export default siteSlice.reducer;
