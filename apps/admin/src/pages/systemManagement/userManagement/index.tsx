import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';

import type { ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Dropdown, message, Modal } from 'antd';
import React, { useContext, useRef, useState } from 'react';
import { AuthContext } from 'hooks';

import { TOKEN, getToken } from 'utils';

// Current usage CSS stylesheet
import styles from './index.module.scss';

import { copyToken } from '@/utils';
import AddSite from './components/sites/structural';
// 站点表格模型
import type { ModesApi } from '@/modes/model.d';
import siteModel from '@/modes/site.model';

export default () => {
  const { MountedApis } = useContext(AuthContext);
  const actionRef = useRef<ActionType>();

  const [subForm, setSubForm] = useState<Record<string, any>>({});
  const [formModal, setFormModal] = useState<boolean>(false);

  //  api server
  const { sites } = MountedApis as any;

  const iinitColumns = siteModel({ apis: MountedApis });

  const handleModalStateChange = (state: boolean) => setFormModal(state);
  const handleCancel = (state: boolean) => setFormModal(state);

  return (
    <>
      <ProTable<ModesApi.SitesItem>
        columns={iinitColumns}
        actionRef={actionRef}
        cardBordered
        request={async (params = {}) => {
          const { count, rows } = await sites.sitesList(params as ModesApi.pageItemType);
          return {
            ...params,
            data: rows,
            total: count,
          } as ModesApi.pageItemType;
        }}
        onSubmit={async (params: {}) => {
          console.log(params);
        }}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
          onChange(value) {
            // console.log('value: ', value);
          },
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        form={{
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return {
                ...values,
                created_at: [values.startTime, values.endTime],
              };
            }
            return values;
          },
        }}
        pagination={{
          pageSize: 20,
          // onChange: (page) => console.log(page),
        }}
        dateFormatter="string"
        headerTitle="站点列表"
        toolBarRender={() => [
          <Button
            key="button"
            // icon={React.createElement(PlusOutlined)}
            onClick={() => setFormModal(true)}
            type="primary"
          >
            新建
          </Button>,
          <Button
            key="button"
            onClick={() => {
              copyToken(`Bearer ${getToken(TOKEN)}`, () =>
                message.success('Text copied to clipboar')
              );
            }}
            type="primary"
          >
            Copy Token
          </Button>,
          <Dropdown
            key="menu"
            menu={{
              items: [
                {
                  label: '1st item',
                  key: '1',
                },
              ],
            }}
          >
            <Button>{React.createElement(EllipsisOutlined)}</Button>
          </Dropdown>,
        ]}
      />
      <AddSite subForm={subForm} openModal={formModal} onStateChange={handleModalStateChange} />
    </>
  );
};
