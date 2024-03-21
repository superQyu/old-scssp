import React, { useContext, useState, useEffect } from 'react';
import { Button, Form, Input, message, Modal, Upload, Select } from 'antd';
import {
  ExclamationCircleTwoTone,
  PlusOutlined,
  CheckCircleTwoTone,
  LoadingOutlined,
} from '@ant-design/icons';
import type { FormInstance } from 'antd/es/form';

import { AuthContext } from 'hooks';
import { url2key } from 'utils';

interface Props {
  /** 控制 Modal 是否显示 */
  openModal: boolean;
  /** 表单初始化 */
  subForm: {};
  /** 监听Modal状态变化 */
  onStateChange: (state: boolean) => void;
}

type FieldType = {
  /** 站点标识 */
  siteKey?: string;
  /** 站点名称 */
  name?: string;
  /** 地址 */
  address?: string;
  /** 域名 */
  domainName?: string;
  /** 站点图标 */
  ico?: string;
  /** 描述 */
  description?: string;
};

type AddonsType = {
  address: string[];
  domainName: string[];
};

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18, flex: 1 },
  style: { maxWidth: 600 },
};

const AddSite: React.FC<Props> = ({ subForm, openModal, onStateChange }: Props) => {
  const { MountedApis } = useContext(AuthContext);
  const formRef = React.useRef<FormInstance>(null);
  const [title, setTitle] = useState<string>('新建站点');
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(openModal);

  const [siteKey, setSiteKey] = useState<string>('');
  const [addressStatus, setAddressStatus] = useState<boolean>(false);
  const [verAddress, setVerAddress] = useState<string>('');

  const [addons, setAddons] = useState<AddonsType>({
    address: ['http://'],
    domainName: ['http://', '.com'],
  });

  //  api server
  const { sites } = MountedApis as any;
  const { Option } = Select;

  // 字段提示
  const ItemTooltip = (tips: string | Array<string>) => {
    if (typeof tips === 'string') tips = [tips];
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ExclamationCircleTwoTone style={{ color: '#1677ff', marginRight: '5px' }} />
        <div style={{ display: 'inline-block' }}>
          {tips.map((item, index) => (
            <p key={index}>{item}</p>
          ))}
        </div>
      </div>
    );
  };

  useEffect(() => {
    setOpen(openModal);
  }, [openModal]);

  const onReset = () => {
    if (loading) {
      message.warning(`数据提交中,请稍等...`);
      return;
    }
    formRef.current?.resetFields();
    setSiteKey('');
    setAddressStatus(false);
  };

  const handleOk = async () => {
    try {
      const values: { [key: string]: string } = await formRef.current?.validateFields();
      const formParams: { [key: string]: any } = {};
      Object.entries(values).map(([key, val], index) => {
        if (addons.hasOwnProperty(key as keyof AddonsType)) {
          const [prefix, suffix] = addons[key as keyof AddonsType];
          val = val.replace(/^(https?:\/\/)?|(\.(com|jp|cn|org))$/gi, '');
          val = `${prefix || ''}${val}${suffix || ''}`;
        }
        formParams[key] = val;
      });
      if (!formParams.domainName || formParams.domainName == '') {
        formParams.domainName = formParams.address;
      }

      // console.log(JSON.stringify({ ...formParams }))
      sites.createSite(JSON.parse(JSON.stringify({ ...formParams }))).then((res: any) => {
        message.success('站点创建成功！');
      });
    } catch (errorInfo) {}
  };

  const handleCancel = () => {
    if (loading) {
      message.warning(`数据提交中,请稍等...`);
      return;
    }
    setOpen(false);
    onReset();
    onStateChange(false);
  };
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handlerAddressChange = async () => {
    formRef.current
      ?.validateFields(['address'])
      .then(({ address }) => {
        const sk = url2key(address);
        formRef.current?.setFieldsValue({ siteKey: sk });
        setSiteKey(sk);
      })
      .catch(() => {
        formRef.current?.setFieldsValue({ siteKey: '' });
        setSiteKey('');
      });
  };
  const handleInputBlur = (key: string) => {
    if (siteKey == '') return;
    setAddressStatus(true);
    setSiteKey(siteKey);
    // setVerAddress(formRef.current?.getFieldValue(key));
    sites
      .verSiteKey({ siteKey })
      .then((res: any) => {
        if (res?.length == 0) {
          setSiteKey(`${siteKey}@@`);
        } else {
          formRef.current?.setFieldsValue({ siteKey: '' });
          setSiteKey('');
          formRef.current?.validateFields(['address']).then().catch();
        }
        setAddressStatus(false);
      })
      .catch(() => {
        setSiteKey('');
        setAddressStatus(false);
      });
  };
  const selectBefore = (key: keyof AddonsType) => {
    return (
      <Select
        defaultValue={addons[key][0]}
        onChange={(e) => {
          const temp = addons;
          temp[key][0] = e;
          setAddons({
            ...addons,
            ...temp,
          });
        }}
      >
        <Option value="http://">http://</Option>
        <Option value="https://">https://</Option>
      </Select>
    );
  };
  const selectAfter = (key: keyof AddonsType) => {
    return (
      <Select
        defaultValue={addons[key][1]}
        onChange={(e) => {
          const temp = addons;
          temp[key][1] = e;
          setAddons({
            ...addons,
            ...temp,
          });
        }}
      >
        <Option value=".com">.com</Option>
        <Option value=".jp">.jp</Option>
        <Option value=".cn">.cn</Option>
        <Option value=".org">.org</Option>
      </Select>
    );
  };
  return (
    <Modal
      open={open}
      title={title}
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable={false}
      footer={[
        <Button key="back" onClick={handleCancel} disabled={loading}>
          取消
        </Button>,
        <Button key="reset" htmlType="reset" onClick={onReset} disabled={loading}>
          重置
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
          提交
        </Button>,
      ]}
    >
      <Form
        {...layout}
        ref={formRef}
        name="control-ref"
        labelAlign="left"
        colon={false}
        initialValues={{}}
      >
        <Form.Item<FieldType>
          name="siteKey"
          tooltip={ItemTooltip('依据站点地址自动生成')}
          label="站点标识"
          rules={[{ required: true, message: 'IP地址未正确填写,生成失败！' }]}
        >
          <Input
            disabled
            placeholder="自动生成"
            suffix={
              siteKey == '' ? (
                <></>
              ) : siteKey.indexOf('@@') != -1 ? (
                <CheckCircleTwoTone />
              ) : (
                <LoadingOutlined style={{ color: 'limegreen' }} />
              )
            }
          />
        </Form.Item>
        <Form.Item<FieldType> name="name" label="站点名称" rules={[{ required: true }]}>
          <Input allowClear />
        </Form.Item>
        <Form.Item<FieldType>
          name="address"
          label="IP访问地址"
          rules={[
            { required: true },
            {
              pattern:
                /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:\d+)?$/,
              message: '请输入有效的IP地址',
            },
            {
              validator: (rule: any, value: any) => {
                if (value && verAddress === value) return Promise.reject('站点已存在');
                return Promise.resolve();
              },
            },
          ]}
          tooltip={ItemTooltip('示例: http://127.0.0.1')}
        >
          <Input
            addonBefore={selectBefore('address')}
            placeholder="示例: http://127.0.0.1"
            allowClear
            disabled={addressStatus}
            onBlur={() => {
              handleInputBlur('address');
            }}
            onChange={() => {
              handlerAddressChange();
            }}
          />
        </Form.Item>
        <Form.Item<FieldType>
          name="domainName"
          label="域名访问地址"
          rules={[
            {
              pattern: /^(?:(?![0-9]+$)(?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\.)+(?:[a-zA-Z]{2,})$/,
              message: '请输入正确的域名地址',
            },
          ]}
          tooltip={ItemTooltip(['eg: http://www.xxx.com', '如果未填写默认设为IP访问地址'])}
        >
          <Input
            addonBefore={selectBefore('domainName')}
            addonAfter={selectAfter('domainName')}
            placeholder="eg: http://www.xxx.com"
            allowClear
          />
        </Form.Item>
        {/* <Form.Item<FieldType> name="ico" label="站点图标">
          <Input allowClear />
        </Form.Item> */}
        <Form.Item label="站点图标" valuePropName="fileList" getValueFromEvent={normFile}>
          <Upload listType="picture-circle">
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>上传图标</div>
            </div>
          </Upload>
        </Form.Item>
        <Form.Item<FieldType> name="description" label="描述">
          <Input.TextArea placeholder="站点描述" autoSize={{ minRows: 4 }} allowClear />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default AddSite;
