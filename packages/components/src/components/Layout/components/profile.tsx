import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Divider, Input, Space, theme } from 'antd';
import {
  LogoutOutlined,
  LoginOutlined,
  QuestionCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { AuthContext, useAppDispatch } from 'hooks';

import './profile.scss';

const Profile: React.FC<{ user: any }> = (props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { signOut } = useContext(AuthContext);
  const { user } = props || {};
  const { userName, avatar, nickName } = user.userInfor;
  const { token } = theme.useToken();

  return (
    <>
      <div className="profile-area">
        <div className="profile-inner">
          <div className="profile-infor">
            <p className="infor userName">{nickName}</p>
            <Avatar
              style={{ backgroundColor: '#efefef' }}
              size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
              src={<img src={avatar} alt="avatar" />}
            />
            <p className="infor nickName">{userName}</p>
            {/* <p><span>登录时间:</span>--:--</p> */}
          </div>
          <Divider />
          <div className="profile-btns-lists">
            <div className="item">
              <Space>
                <UserOutlined />
                <p>个人中心</p>
              </Space>
            </div>
            <div className="item">
              <Space>
                <QuestionCircleOutlined />
                <p>说明</p>
              </Space>
            </div>
            <div
              className="item"
              onClick={async () => {
                await signOut(dispatch);
                navigate('/');
              }}
            >
              <Space>
                <a title={'Sign Out'}>
                  <LoginOutlined style={{}} />
                </a>
                <Space />
                <p>退出</p>
              </Space>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Profile;
