type xhrType = 'fetch' | 'axios' | 'ajax' | 'xhr';
export type Method = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'HEAD';
export type jsonObject = Record<string, any>;

export interface paramsItem {
  key: string; //参数名称
  targetKey?: string; //目标参数名称
  value?: any; //值
  location?: 'header' | 'query'; //参数设置位置 header(请求头中)|query(正常位置)
  cn?: any; //参数中文名称
  description?: any; //参数描述
  valueAttrs?: {
    // 参数属性
    required?: boolean; // 参数是否必填
    value?: any; // 默认值
    mandatorykey?: boolean; // 必传参数
  };
}

export interface ApiItem {
  key?: string; //api关键字 每个文件下的key 都是唯一;（必填）
  xhrType?: xhrType; // 接口请求使用的工具 fecth|axios|ajax|xhr
  name?: string; //接口名称;
  description?: any; //接口描述;
  url: string; //接口地址;（必填）
  type: Method; //接口类型;（必填）
  config?: Record<string, any>; //server 其他的参数配置
  params?: paramsItem[]; // 参数配置
}
