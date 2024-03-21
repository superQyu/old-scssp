import './App.scss';

import { cloneDeep } from 'lodash';
import { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';

import {
  AuthContext,
  signIn,
  mockSignIn,
  signOut,
  saveUserInfor,
  saveSiteInfor,
  useAppSelector,
  useLocationListen,
} from 'hooks';
import { TOKEN, Settings } from 'utils';
import { defaultRoutes } from './routes';
import { filepathToElement } from './utils/routers';

import * as baseConf from '@/config';
import { autoInterface } from '@spms/web-request';
import apisGather from '@/apis';
const apiServer = autoInterface(apisGather, TOKEN);

function App() {
  const {
    user: { menu, userInfor },
  } = useAppSelector((state) => state) as { user: { menu: any; userInfor: object } };
  const cloneDefaultRoutes = cloneDeep(defaultRoutes);

  cloneDefaultRoutes[0].children = [...filepathToElement(menu), ...cloneDefaultRoutes[0].children];

  useLocationListen((r) => {
    document.title = `${Settings.title}: ${Settings.describe || r.pathname.replace('/', '')}`;
  });
  const element = useRoutes(cloneDefaultRoutes);
  useEffect(() => {
    // userInfor
  }, [menu]);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        mockSignIn,
        signOut,
        saveUserInfor,
        saveSiteInfor,
        BaseConf: baseConf as any,
        MountedApis: apiServer,
      }}
    >
      {element}
    </AuthContext.Provider>
  );
}

export default App;
