import { StarTwoTone, StopTwoTone, EllipsisOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { TableDropdown } from '@ant-design/pro-components';
import { Space, Tag, Switch, message, Dropdown, MenuProps } from 'antd';

type objJson = Record<string, any>;

type ColumnsType = {
  /** 站点标识 */
  apis?: objJson;
};

export default ({ apis }: ColumnsType) => {
  //  api server
  const { sites } = apis as objJson;

  const columns: ProColumns[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      editable: false,
      hideInSearch: true,
      title: '站点标识',
      dataIndex: 'siteKey',
      copyable: true,
      ellipsis: true,
      tip: '站点唯一标识',
    },
    {
      title: '站点名称',
      dataIndex: 'name',
      copyable: true,
      ellipsis: true,
      tip: '标题过长会自动收缩',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      disable: true,
      width: 150,
      title: '站点状态',
      dataIndex: 'isDelete',
      ellipsis: true,
      valueType: 'select',
      valueEnum: {
        '0': {
          text: (
            <>
              <StarTwoTone twoToneColor="#50a14f" style={{ marginRight: '10px' }} />
              使用中
            </>
          ),
          status: 'Success',
        },
        '1': {
          text: (
            <>
              <StopTwoTone twoToneColor="red" style={{ marginRight: '10px' }} />
              已停运
            </>
          ),
          status: 'Error',
        },
      },
      render: (_, record) => (
        <Switch
          checkedChildren="正常"
          unCheckedChildren="停运"
          disabled
          defaultChecked={record?.isDelete == '0' ? true : false}
        />
      ),
    },
    {
      disable: true,
      title: '创建者',
      dataIndex: 'createdBy',
      search: false,
      renderFormItem: (_, { defaultRender }) => {
        return defaultRender(_);
      },
      render: (_, record) => (
        <Space>
          <Tag color="green">{_}</Tag>
        </Space>
      ),
    },
    {
      title: '创建时间',
      key: 'createdAt',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      // sorter: true,
      hideInSearch: true,
    },
    {
      disable: true,
      editable: false,
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            startTime: value[0],
            endTime: value[1],
          };
        },
      },
    },
    {
      title: '操作',
      width: 160,
      valueType: 'option',
      key: 'option',
      render: (_text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            // console.log(action);
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
          查看
        </a>,
        <TableDropdown
          key="actionGroup"
          onSelect={(key) => {
            if (key === 'delete') {
              sites
                .deleteSites({
                  ids: record.id,
                })
                .then((res: any) => {
                  message.success('操作成功!');
                  action?.reload();
                });
            }
          }}
          menus={[
            { key: 'copy', name: '复制' },
            { key: 'delete', name: '删除' },
          ]}
        />,
      ],
    },
  ];

  return columns;
};
