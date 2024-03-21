export interface TreeParam {
  spId: number;
  pIdKey: string;
  idKey: string;
  intercept?: (args: TreeNode) => TreeNode;
  [key: string]: any;
}
export interface TreeNode {
  id: number;
  parentId: number;
  params?: TreeParam;
  children?: TreeNode[];
  [key: string]: any;
}
