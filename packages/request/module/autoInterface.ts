import { notification } from 'antd';
import { isArray, isJSON, getToken } from 'utils';
import { fetchRequest as fetchService } from './fetch';
import { Method, jsonObject } from './type';
/***
 * title: autoInterface.js
 * Author: qy
 * Email:
 * Time: 2023/07/12
 * last: --
 * Desc: 自动化接口 封装
 */
interface Item {
  key: string;
  url: string;
  type: string;
}
interface verifyedParam {
  params: jsonObject;
  config: jsonObject;
}
interface IHttpFn<T = any> {
  (): Promise<T>;
}
const request = (url: string, setting: any) => {};
const paramsValidate = (obj: object = {}, os: jsonObject = {}) => {};

class AutoInterface {
  [prop: string]: any;
  constructor(list: jsonObject, platformKey: string) {
    this.platformKey = platformKey;
    Object.entries(list).forEach((item, index) => {
      const [key, value]: [string, jsonObject | []] = item;
      const filePath = `@/api/${key}.api.ts`;
      if (isJSON(value)) {
        // json
        const v: jsonObject = value;
        for (const k in v) {
          v[k]['key'] = k;
        }
        this.mountMethods(
          key,
          Object.entries(value).map(([, v], index) => v),
          `${filePath}>>${key}`
        );
      } else if (isArray(value)) {
        // 数组
        this.mountMethods(key, value, `${filePath}>>${key}`);
      } else {
        notification.error({
          message: '接口解析错误!',
          description: `${filePath},文件解析失败,请参考标准格式！`,
        });
      }
    });
  }
  mountMethods(key: string, param: any, path: string) {
    if (isArray(param)) {
      const v: Item[] = param;
      v.forEach((item, index) => {
        if (!this.hasOwnProperty(key)) this[`${key}`] = {};
        this[`${key}`][`${item.key}`] = this.mountedMethod(item, path);
      });
    }
  }
  /**
   * 动态挂载 service
   */
  mountedMethod(item: jsonObject, path: string) {
    const _this = this;
    return (args: jsonObject = {}) => {
      /** 参数验证开始 */
      if (!isJSON(args)) return _this.errorMethod();
      let verifyed: verifyedParam = { params: {}, config: {} },
        unPassed: jsonObject[] = [],
        required: jsonObject[] = [];

      const { key, url, type, params = [] } = item;
      for (let i = 0, j = params.length; i < j; i++) {
        // 校验主参数
        const {
          key: k,
          targetKey: tk,
          valueAttrs = {},
          location,
          cn,
          description: desc,
        }: jsonObject = params[i];
        // 校验key 属性
        const { mandatorykey, required: reqd, value: dv } = valueAttrs;
        let rdv: string = args[k] || dv || '';

        if (!args.hasOwnProperty(k) && !mandatorykey && location && location != 'header') {
          unPassed = [...unPassed, params[i]];
        } else {
          const rtk: string = tk || k;

          if (reqd && rdv == '') {
            required = [...required, params[i]];
            continue;
          }
          if (location === 'header') {
            if (rtk.toLocaleLowerCase() === 'Authorization'.toLocaleLowerCase())
              rdv = `Bearer ${rdv || getToken(_this.platformKey)}`;
            verifyed.config[rtk] = rdv;
          } else if (location === 'query' || !location) {
            if (rdv != '') verifyed.params[rtk] = rdv;
            if (rdv == '' && mandatorykey) verifyed.params[rtk] = rdv;
          }
        }
      }
      if (required.length > 0)
        return _this.errorMethod(
          `文件路径:${path}；${required
            .map((i) => {
              return `${i.key}(${i.cn || '无描述'}) 为必填项`;
            })
            .join('、')}，请检查！！！`
        );
      if (unPassed.length > 0)
        return _this.errorMethod(
          `文件路径:${path}；缺少字段： ${unPassed
            .map((i) => {
              return `${i.key}(${i.cn || '无描述'})`;
            })
            .join('、')}，请检查！！！`
        );
      /** 参数验证结束 */

      // service
      const xhrType: Method = type.toLowerCase();
      const service: jsonObject = fetchService;
      if (service.hasOwnProperty(xhrType))
        return service[xhrType](url, verifyed.params, verifyed.config);
      return _this.errorMethod(`请填写正确的请求类型!`);
    };
  }
  /**
   * error
   */
  errorMethod(
    msg = "['validation failed']:Parameter validation failed, please check the parameters!"
  ) {
    notification.error({
      message: '参数解析错误!',
      duration: null,
      description: `${msg}`,
      style: { color: '#ff4d4f' },
    });
    return new Promise((resolve, reject) => {
      reject(`${msg}`);
    });
  }
}
export const autoInterface = (list: jsonObject, platformKey: string) => {
  return new AutoInterface(list, platformKey);
};
