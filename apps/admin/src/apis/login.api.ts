import { ApiItem } from '@spms/web-request';

const login: Record<string, ApiItem> = {
  captcha: {
    url: '/api/v1/captcha',
    type: 'GET',
    name: '验证码',
    description: '获取验证码',
    params: [
      { key: 'height', cn: '图片高度' },
      { key: 'type', value: 'string', cn: '数据返回类型' },
    ],
  },
  login: {
    url: '/api/v1/login',
    type: 'POST',
    name: '用户登录',
    params: [
      { key: 'userName', cn: '用户名' },
      { key: 'password', cn: '密码' },
      { key: 'captcha', cn: '验证码' },
      { key: 'location', cn: '站点信息' },
    ],
  },
};
export default login;
