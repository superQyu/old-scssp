import { ApiItem } from '@spms/web-request';

const sites: ApiItem[] = [
  {
    key: 'sitesList',
    url: '/api/v1/site/sitesList',
    type: 'GET',
    name: '站点列表',
    description: '站点列表信息',
    params: [
      { key: 'Authorization', location: 'header' },
      { key: 'pageSize ', cn: '条数' },
      { key: 'pageNum', cn: '页码' },
      { key: 'description', cn: '描述' },
      { key: 'createdBy', cn: '创建者' },
    ],
  },
  {
    key: 'createSite',
    url: '/api/v1/site/createSite',
    type: 'POST',
    name: '新建站点',
    description: '新建站点',
    params: [
      { key: 'Authorization', location: 'header' },
      { key: 'siteKey', cn: '站点唯一标识' },
      { key: 'name', cn: '站点名称' },
      { key: 'description', cn: '描述' },
      { key: 'address', cn: '站点IP地址' },
      { key: 'domainName', cn: '域名' },
      { key: 'ico', cn: '站点图标' },
      { key: 'description', cn: '描述' },
    ],
  },
  {
    key: 'verSiteKey',
    url: '/api/v1/site/verSiteKey',
    type: 'GET',
    name: '验证标识',
    description: '验证标识是否唯一',
    params: [
      { key: 'Authorization', location: 'header' },
      { key: 'siteKey', cn: '站点标识' },
    ],
  },
  {
    key: 'deleteSites',
    url: '/api/v1/site/deleteSites',
    type: 'DELETE',
    name: '删除站点',
    description: '删除站点',
    params: [
      { key: 'Authorization', location: 'header' },
      { key: 'ids', cn: '数据ID集合' },
    ],
  },
];
export default sites;
