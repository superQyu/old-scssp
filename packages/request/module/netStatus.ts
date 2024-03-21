import { message } from 'antd';
import { isArray } from 'utils';

/**
 * @description 网络请求 状态统一处理
 * @param {res}
 * @return {status,data}
 */
const netStatus = (status: any, data: any) => {
  /**
   * 自定义接口状态码
   * requested:{
   *  success 成功,
   *  error 失败
   * }
   */
  const { success = [], error = [] } = status || {};
  const codeMap = new Map([
    [
      [...new Set([0, 200, ...(isArray(success) ? success : [success])])],
      () => {
        // 请求成功 //message.success(``);
      },
    ],
    [
      [...new Set([400, 401, 500, ...(isArray(error) ? error : [error])])],
      () => {
        const { message: m, msg, error } = data || {};
        message.error(`${m || msg || error || data}`);
      },
    ],
    [
      [-1, 404],
      () => {
        message.error(`请求失败，请联系管理员！状态码:${data.code}`);
      },
    ],
    [
      [504, 408],
      () => {
        message.error('连接超时，请重试！');
      },
    ],
  ]);
  const action = [...codeMap].filter(([keys, value]) => {
    return (isArray(keys) ? keys : [keys]).indexOf(data.code) != -1;
  });
  action.forEach(([key, value]) => value.call(this));
};

export default netStatus;
