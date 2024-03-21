import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthContext, useAppDispatch } from 'hooks';
import { setMenu } from 'store';
import { TOKEN, buildTree } from 'utils';

export default ({ children }: any) => {
  const navigate = useNavigate();
  const { signOut } = useContext(AuthContext);
  const dispatch = useAppDispatch();
  const { saveUserInfor, saveSiteInfor, BaseConf, MountedApis } = useContext(AuthContext);
  const location = window.location;

  const { prefix, fieldConversion = {} } = BaseConf as any; // 基本设置
  const { user: U, basic } = MountedApis as any; //  api server

  const getAvatar = (a: any) => {
    return `${prefix.static}${a}`;
  };
  // 获取用户信息
  const getUserInfor = async (callback: Function) => {
    await U.userInfor()
      .then((res: any) => {
        const { user: uKey = 'user' } = fieldConversion;
        res[uKey]['avatar'] = getAvatar(res[uKey]['avatar']);
        saveUserInfor(dispatch, res[uKey]);
        callback && callback();
      })
      .catch(async () => {
        await signOut(dispatch);
        navigate('/');
      });
  };
  // 获取站点详情
  const getSiteInfor = async () => {
    await basic.siteInfor({ ...location }).then((res: any) => {
      const { ico: uKey = 'ico' } = fieldConversion;
      res[uKey] = getAvatar(res[uKey]);
      saveSiteInfor(dispatch, res);
    });
  };
  // 获取路由列表
  const getRoutes = async () => {
    await U.getRoute({ siteKey: TOKEN.replace(/^Qy_/, '') }).then((res: any) => {
      const menus = buildTree(res, {
        intercept: ({
          id,
          parentId,
          name,
          ico,
          path,
          filepath,
          routes,
          orderNum,
        }: {
          [key: string]: string;
        }) => {
          return {
            id,
            parentId,
            name,
            icon: `/static${ico}`,
            path,
            filepath,
            component: filepath,
            routes,
            orderNum,
          };
        },
      });
      dispatch(setMenu([...menus]));
      setMenu(menus);
    });
  };

  useEffect(() => {
    getUserInfor(() => {
      getSiteInfor();
      getRoutes();
    });
  }, []);

  return <>{children}</>;
};
