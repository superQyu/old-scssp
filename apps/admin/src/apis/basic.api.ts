import { ApiItem } from '@spms/web-request';

const user: ApiItem[] = [
  {
    key: 'siteInfor',
    url: '/api/v1/site/siteInfor',
    type: 'GET',
    name: '站点信息',
    description: '站点信息',
    // params: [{ key: 'Authorization', location: "header" }]
    params: [{ key: 'host' }, { key: 'protocol' }, { key: 'origin' }],
  },
];
export default user;
