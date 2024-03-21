export declare namespace ModesApi {
  type ParamsType = Record<string, any>;

  type GithubIssueItem = {
    url: string;
    id: number;
    number: number;
    title: string;
    labels?: {
      name: string;
      color: string;
    }[];
    state: string;
    comments: number;
    created_at: string;
    updated_at: string;
    closed_at?: string;
  };

  type SitesItem = ParamsType & {
    id: number;
    siteKey: string;
    name: string;
    address: string;
    domainName: string;
    ico: string;
    description: string;
    isDelete: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
  };

  type pageItemType = ParamsType & {
    pageSize: number | undefined;
    current: number | undefined;
    keyword: string | undefined;
  };
}
