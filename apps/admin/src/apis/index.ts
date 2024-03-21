/**
 * @description auto2Apis
 * 遍历当前目录下 *.api.ts文件 合并所有的数据
 * *.api.ts 导出json/arrary 对象数据
 * // json对象
 * {key:{name:"",description:"",url:"",type:"",config:{},params:[]}}
 * // array
 * [{key:"",name:"",description:"",url:"",type:"",config:{},params:[]}]
 * @param {
 *  eager: true  //  异步方式
 * }
 * @return {{}|[]}
 */
const module: Record<string, any> = {};
const moduleFiles = import.meta.glob(`./*.api.ts`, { eager: true });

Object.entries(moduleFiles).forEach(([key, value]) => {
  const name = key.replace(/^\.\/(.*)\.api.\w+$/, '$1');
  if (Object.hasOwnProperty.call(value, 'default')) module[name] = (value as any).default;
});

export default module;
