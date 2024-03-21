import React, { useContext, useEffect, useState } from 'react';
import { GithubFilled, InfoCircleFilled, QuestionCircleFilled } from '@ant-design/icons';
import type { ProSettings, MenuDataItem } from '@ant-design/pro-components';
import {
  PageContainer,
  ProConfigProvider,
  ProLayout,
  SettingDrawer,
} from '@ant-design/pro-components';
//  Watermark,
import { Switch, Tooltip, Space, Popover, Dropdown, Image, Skeleton } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import defaultProps, { route, appList } from './_defaultProps';

import ErrorBoundary from 'antd/es/alert/ErrorBoundary';
import { AuthContext, useAppDispatch, useAppSelector, KeepAlive, useLocationListen } from 'hooks';
import { MenuItem, sortMenu } from 'utils';

// 组件列表
import SearchInput from './components/SearchInput';
import MenuCard from './components/MenuCard';
import Profile from './components/profile';
import bgLayoutImgList from './components/bgLayoutImgList';

const layout: React.FC<{}> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user, site } = useAppSelector((state) => state);
  const [pathname, setPathname] = useState(location.pathname);
  const [isDark, setDark] = useState<boolean>(false);
  const [settings, setSetting] = useState<Partial<ProSettings> | undefined>({
    title: '----',
    contentWidth: 'Fluid',
    fixSiderbar: true,
    layout: 'mix',
    navTheme: 'light',
    splitMenus: true,
    colorPrimary: '#1677FF',
  });

  const [num, setNum] = useState(40);
  const [keyWord, setKeyWord] = useState('');
  const [shouldRender, setShouldRender] = useState<boolean>(false);

  const [loading, setLoading] = useState(true);
  const { userInfor = {}, menu = [] } = user as any; // 获取用户基本信息
  const { siteInfor = {} } = site as any; // 获取站点基本信息
  const [baseInfor, setBaseInfor] = useState<object>({
    avatar: '',
    userName: null,
    logo: '',
    siteName: '',
  });

  const [menus, setMenus] = useState<{ path: string; routes: MenuItem[] }>({
    path: '/',
    routes: [],
  });

  // css
  const SkeletonAvatarStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center' };
  const SkeletonInputStyle = { verticalAlign: 'middle' };

  useLocationListen(({ pathname }) => {
    setPathname(pathname);
  });

  const filterByMenuData = (data: MenuDataItem[], keyWord: string): MenuDataItem[] =>
    data
      .map((item) => {
        if (item.name?.includes(keyWord)) {
          return { ...item };
        }
        const children = filterByMenuData(item.children || [], keyWord);
        if (children.length > 0) {
          return { ...item, children };
        }
        return undefined;
      })
      .filter((item) => item) as MenuDataItem[];

  const loopMenuItem = (menus: any[]): MenuDataItem[] =>
    menus.map(({ icon, routes, ...item }) => ({
      ...item,
      children: routes && loopMenuItem(routes),
    }));
  // 左下角 主题切换按钮
  const handlerThemeSwitching = (v: boolean) => {
    const updatedSettings = { ...settings };
    updatedSettings.navTheme = v ? 'realDark' : 'light';
    setDark(v);
    setSetting(updatedSettings);
  };
  // SettingDrawer 控制按钮
  const handlerSetting = (v: any) => {
    setDark(v && v.navTheme !== 'light');
    setSetting(v);
  };

  if (typeof document === 'undefined') return <div />;
  useEffect(() => {
    if (menu.length != 0) {
      const _routes = { ...menus, routes: sortMenu([...[...route.routes, ...menu]]) };
      setMenus(_routes);
      // 默认跳转路由
      navigate(_routes.routes[2].path);
    }
  }, [menu]);
  useEffect(() => {
    setBaseInfor({
      avatar: userInfor.avatar,
      userName: userInfor.nickName,
      logo: siteInfor.ico,
      siteName: siteInfor.name,
    });
    // setTimeout(() => {}, 250);
    // console.log(user, site);
    if (siteInfor.ico && siteInfor.ico != '') setShouldRender(true);
    setLoading(false);
  }, [user, site]);
  return (
    // <Watermark content="Digital Chain Industrial Control by antd"></Watermark>
    <ProConfigProvider>
      <div id="qy-pro-layout" style={{ height: '100vh', overflow: 'auto' }}>
        <ProLayout
          prefixCls="my-prefix"
          {...settings}
          route={menus}
          appList={appList}
          location={{
            pathname,
          }}
          token={{
            header: {
              colorBgMenuItemSelected: 'rgba(0,0,0,0.04)',
            },
          }}
          siderMenuType="group"
          menu={{
            collapsedShowGroupTitle: true,
          }}
          // menuExtraRender={({ collapsed }) =>
          //   !collapsed && (
          //     <Space
          //       style={{
          //         marginBlockStart: 16,
          //       }}
          //       align="center"
          //     >
          //       <Input
          //         style={{
          //           borderRadius: 4,
          //           backgroundColor: 'rgba(0,0,0,0.03)',
          //         }}
          //         prefix={
          //           <SearchOutlined
          //             style={{
          //               color: 'rgba(0, 0, 0, 0.15)',
          //             }}
          //           />
          //         }
          //         placeholder="搜索方案"
          //         bordered={false}
          //         onPressEnter={(e) => {
          //           setKeyWord((e.target as HTMLInputElement).value);
          //         }}
          //       />
          //       <PlusCircleFilled
          //         style={{
          //           color: 'var(--ant-primary-color)',
          //           fontSize: 24,
          //         }}
          //       />
          //     </Space>
          //   )
          // }
          // menuDataRender={() => loopMenuItem(defaultProps.route.routes)}
          // postMenuData={(menus) => filterByMenuData(menus || [], keyWord)}
          avatarProps={{
            size: 'small',
            src: loading ? (
              <Skeleton.Avatar active style={SkeletonInputStyle} />
            ) : (
              (baseInfor as unknown as { avatar: '' })?.avatar
            ),
            title: loading ? (
              <Skeleton.Input
                active
                size={'small'}
                style={{ ...SkeletonInputStyle, marginTop: '-3px' }}
              />
            ) : (
              <div>{(baseInfor as unknown as { userName: '欢迎！' })?.userName}</div>
            ),
            render: (props, dom) => {
              return (
                <Popover
                  rootClassName="profile-popover"
                  placement="bottomRight"
                  trigger="click"
                  content={<Profile user={user} />}
                >
                  {dom}
                </Popover>
              );
            },
          }}
          actionsRender={(props) => {
            if (props.isMobile) return [];
            if (typeof window === 'undefined') return [];
            return [
              props.layout !== 'side' && document.body.clientWidth > 1400 ? (
                <SearchInput />
              ) : undefined,
              <InfoCircleFilled key="InfoCircleFilled" />,
              <QuestionCircleFilled key="QuestionCircleFilled" />,
              <GithubFilled key="GithubFilled" />,
            ];
          }}
          headerTitleRender={(logo, title, _) => {
            const defaultDom = (
              <a href="/">
                {!shouldRender ? (
                  <Skeleton.Avatar active style={SkeletonAvatarStyle} />
                ) : (
                  <img
                    src={(baseInfor as { logo: '' })?.logo}
                    title={(baseInfor as { siteName: '' })?.siteName}
                  />
                )}
              </a>
            );
            if (typeof window === 'undefined') return defaultDom;
            if (document.body.clientWidth < 1400) return defaultDom;
            if (_.isMobile) return defaultDom;
            return (
              <>
                {defaultDom}
                <MenuCard />
              </>
            );
          }}
          menuFooterRender={(props) => {
            if (props?.collapsed || props?.isMobile) return undefined;
            return (
              <div>
                <div key={1} style={{ height: '135px' }}>
                  <Image
                    width={'100%'}
                    preview={false}
                    height={132}
                    src="/static/siteimage/zos.png"
                  />
                  <Space
                    align="center"
                    size="middle"
                    style={{ width: '100%', marginBlockStart: '32px' }}
                  />
                </div>
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <QuestionCircleFilled key="QuestionCircleFilled" />
                    <InfoCircleFilled key="InfoCircleFilled" />
                    <Tooltip placement="bottom" title={'Theme switching'}>
                      <Switch
                        checkedChildren="🌜"
                        unCheckedChildren="🌞"
                        checked={isDark}
                        onChange={(v) => handlerThemeSwitching(v)}
                      />
                    </Tooltip>
                  </div>
                </div>
                <div style={{ textAlign: 'center', paddingBlockStart: 12 }}>
                  <div>© 2022 Made with love</div>
                  <div>by Ant Design</div>
                </div>
              </div>
            );
          }}
          onMenuHeaderClick={(e) => console.log(e)}
          menuItemRender={(item, dom) => (
            <div
              onClick={() => {
                setPathname(item.path || '/welcome');
              }}
            >
              {dom}
            </div>
          )}
          bgLayoutImgList={bgLayoutImgList}
        >
          <PageContainer
            token={{
              paddingInlinePageContainerContent: num,
            }}
            // extra={[
            //   <Button key="3">操作</Button>,
            //   <Button key="2">操作</Button>,
            //   <Button
            //     key="1"
            //     type="primary"
            //     onClick={() => {
            //       setNum(num > 0 ? 0 : 40);
            //     }}
            //   >
            //     主操作
            //   </Button>,
            // ]}
            // subTitle=""
            // footer={[
            //   <Button key="3">重置</Button>,
            //   <Button key="2" type="primary">
            //     提交
            //   </Button>,
            // ]}
          >
            {/* <ProCard
              style={{
                height: '200vh',
                minHeight: 800,
              }}
            >
              <div />
            </ProCard> */}
          </PageContainer>

          <SettingDrawer
            pathname={pathname}
            enableDarkTheme
            getContainer={(e: any) => {
              if (typeof window === 'undefined') return e;
              return document.getElementById('qy-pro-layout');
            }}
            settings={settings}
            onSettingChange={(v) => handlerSetting(v)}
            disableUrlParams={false}
          />
          <ErrorBoundary>{<KeepAlive include={[]} keys={[]} />}</ErrorBoundary>
        </ProLayout>
      </div>
    </ProConfigProvider>
  );
};
export default layout;
