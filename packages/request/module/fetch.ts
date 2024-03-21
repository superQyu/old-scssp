/***
 * title: fetch.js
 * Author: qy
 * Email:
 * Time: --
 * last: --
 * Desc: 对fetch的封装
 */
import { json2url } from 'utils';
import netStatus from './netStatus';

type stringKey = Record<string, any>;
// fetch 拦截器
const interceptor = {
  request: (request: any) => {
    // 在发送请求之前的处理逻辑
    return request;
  },
  response: (response: any) => {
    // 在接收到响应后的处理逻辑
    return response;
  },
};

const request = (url: string, setting: any) => {
  const opts = {
    // 设置参数的初始值
    method: 'GET', // 请求方式
    headers: {}, // 请求头设置
    credentials: 'include', // 设置cookie是否一起发送 可设置'include' | 'same-origin' | 'omit'
    // mode: 'no-cors', // 可以设置 cors, no-cors, same-origin
    redirect: 'follow', // follow, error, manual
    cache: 'default', // 设置 cache 模式 (default, reload, no-cache)
    ...setting, //合并自定义参数
  };
  opts.method = opts.method.toUpperCase();
  const dataType = setting.dataType || 'json'; // 解析方式

  const { requested = {} } = setting;

  return new Promise((resolve, reject) => {
    fetch(url, opts)
      .then(async (res) => {
        const resObject =
          dataType === 'text'
            ? await res.text()
            : dataType === 'blob'
            ? await res.blob()
            : await res.json();

        // if (interceptor.response) interceptor.response(resObject);

        netStatus(requested || {}, resObject);

        !res.ok
          ? reject(resObject)
          : resolve(resObject[requested.dataKeyName || 'data'] || resObject);
      })
      .catch((e) => {
        netStatus(requested || {}, { code: -1, message: e });
        reject(e);
      });
  });
};
// 分离出除header 以外的字段
const paramsApart = (obj: object = {}, os: stringKey = {}) => {
  const fileds = ['requested'];
  const headers: stringKey = {};
  const excepted: stringKey = {};
  Object.entries(obj).forEach(([key, value], index) => {
    fileds.indexOf(key) == -1 ? (headers[key] = value) : (excepted[key] = value);
  });
  os['headers'] = { ...os['headers'], ...headers };
  return { ...excepted, ...os };
};

export const fetchRequest = {
  async get(url: string, params: Object = {}, config = {}) {
    // get
    try {
      const res = await request(json2url({ url, params }), {
        method: 'GET',
        ...paramsApart(config, {
          headers: {},
        }),
      });
      return new Promise((resolve) => {
        resolve(res);
      });
    } catch (err) {
      return Promise.reject(err);
    }
  },
  async post(url: string, params = {}, config = {}) {
    // post
    try {
      const res = await request(url, {
        body: JSON.stringify(params),
        method: 'POST',
        ...paramsApart(config, {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
        }),
      });
      return new Promise((resolve, reject) => {
        resolve(res);
      });
    } catch (err) {
      return Promise.reject(err);
    }
  },
  async delete(url: string, params: Object = {}, config = {}) {
    // delete
    try {
      const res = await request(json2url({ url, params }), {
        method: 'delete',
        ...paramsApart(config, {
          headers: {},
        }),
      });
      return new Promise((resolve) => {
        resolve(res);
      });
    } catch (err) {
      return Promise.reject(err);
    }
  },
};
