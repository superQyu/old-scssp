import React, { Dispatch } from 'react';
import { setUserToken, setUserInfor, setSiteInfor } from 'store';

import { setToken, getStorage, removeToken, removeStorage, setStorage, sleep, TOKEN } from 'utils';

interface AuthContextType {
  signIn: (dispatch: Dispatch<any>, values: string) => Promise<unknown>;
  saveUserInfor: (dispatch: Dispatch<any>, values: any) => Promise<unknown>;
  saveSiteInfor: (dispatch: Dispatch<any>, values: any) => Promise<unknown>;
  mockSignIn: (dispatch: Dispatch<any>, values: string) => Promise<unknown>;
  signOut: (dispatch: Dispatch<any>) => Promise<unknown>;
  BaseConf: Object;
  MountedApis: Object;
}
// 用户登录
export const signIn = async (dispatch: any, values: string) => {
  setToken(TOKEN, values);
  dispatch(setUserToken(values));
};
// 保存用户信息
export const saveUserInfor = async (dispatch: any, values: any) => {
  dispatch(setUserInfor(values));
};
// 保存站点信息
export const saveSiteInfor = async (dispatch: any, values: any) => {
  dispatch(setSiteInfor(values));
};
// 基础配置
const BaseConf: object = { avatar: '', logo: '' };
// 模拟登录
export const mockSignIn = async (dispatch: any, values: string) => {
  await sleep(1000);
  setStorage(TOKEN, values, 1000 * 60 * 24);
  dispatch(setUserToken(getStorage(TOKEN)));
};
// 退出
export const signOut = (dispatch: any) => {
  return new Promise((resolve) => {
    try {
      removeStorage(TOKEN);
      removeToken(TOKEN);
      dispatch(setUserToken(''));
      dispatch(setUserInfor(''));
    } finally {
      resolve('');
    }
  });
};

export const AuthContext = React.createContext<AuthContextType>({
  signIn, //登录
  saveUserInfor, // 保存用户信息
  saveSiteInfor, //  保存站点信息
  mockSignIn, //模拟登录
  signOut, // 退出
  BaseConf: Object, // 基础参数配置
  MountedApis: Object, // 自动化接口
});
