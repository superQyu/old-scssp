import { MenuItem } from './common';
import { TreeNode, TreeParam } from './type';
/**
 * @description json2url
 * @param {url,params}
 * @return {string}
 */

export const json2url = ({ url = '', params = {} } = {}) => {
  if (Object.keys(params).length === 0) return url;
  return (
    url +
    '?' +
    Object.entries(params)
      .map(([key, value = '']) => {
        return `${encodeURIComponent(key)}=${value}`;
      })
      .join('&')
  );
};

/**
 * @description url2json
 * @param {url}
 * @return {array:[path,params]}
 */

export const url2json = (url = '?') => {
  if (!url) url = location.search;
  const [u, p = ''] = url.split('?');
  return [
    u,
    p.split('&').reduce((acc: Record<string, string>, cur) => {
      const [key, value] = cur.split('=') as string[];
      acc[key] = value;
      return acc;
    }, {}),
  ];
};

/**
 * @description 判断是否为数组
 * @param {arr}
 * @return {boolean}
 */
export const isArray = (arr: any) => {
  return Object.prototype.toString.call(arr) === '[object Array]';
};

/**
 * @description 判断是否为正则表达式
 * @param {obj}
 * @return {boolean}
 */
export const isRegexp = (obj: any) => {
  return Object.prototype.toString.call(obj) === '[object RegExp]';
};

/**
 * @description 判断是否为JSON对象
 * @param {obj}
 * @return {boolean}
 */
export const isJSON = (obj: any) => {
  return (
    typeof obj == 'object' &&
    Object.prototype.toString.call(obj).toLowerCase() == '[object object]' &&
    !obj.length
  );
};

/**
 * @description 将url转换成key
 * @param {}
 * @return {string}
 */
export const url2key = (url?: string) => {
  const { hostname, port } = window.location;
  if (!url) url = hostname + port;
  const [firstSegment] = url.split('/');
  const numberString = parseInt(firstSegment.replace(/\./g, '').replace(/\:/g, ''));
  return numberString.toString(36);
};

/**
 * @description 将array转换成 tree
 * @param {}
 * @return {Array}
 */
export const buildTree = (arr: TreeNode[], params?: {}) => {
  const map: Record<number, TreeNode> = {};
  const roots: TreeNode[] = [];
  const defaultParams: TreeParam = {
    spId: 0,
    idKey: 'id',
    pIdKey: 'parentId',
    ...params,
  };

  for (const node of arr) {
    map[node.id] = { ...node, routes: [] };
  }

  for (const node of arr) {
    let curItem = map[node[defaultParams.idKey]];
    if (defaultParams.intercept && typeof defaultParams.intercept === 'function')
      curItem = defaultParams.intercept(curItem);
    if (node[defaultParams.pIdKey] * 1 === 0) {
      roots.push(curItem);
    } else {
      const parent = map[node[defaultParams.pIdKey]];
      parent && parent.routes?.push(curItem);
      //else { roots.push(map[node[params.idKey]]); };
    }
  }

  return roots;
};
/**
 * @description 菜单排序
 * @param {}
 * @return {Array}
 */
export const sortMenu = (arr: TreeNode[], sortByKey = 'orderNum'): MenuItem[] => {
  const sortedArr = [...arr]; // 创建副本数组
  return sortedArr
    .sort((a, b) => a[sortByKey] - b[sortByKey])
    .map((menu) => {
      if (menu.routes && menu.routes.length > 0) menu = { ...menu, routes: sortMenu(menu.routes) };
      return menu as unknown as MenuItem;
    });
};
