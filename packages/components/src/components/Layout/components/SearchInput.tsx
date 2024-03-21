import React, { useContext, useEffect, useState } from 'react';
import { theme, Input } from 'antd';
import { css } from '@emotion/css';
import { SearchOutlined, PlusCircleFilled } from '@ant-design/icons';

const SearchInput = () => {
  const { token } = theme.useToken();
  return (
    <div
      key="SearchOutlined"
      aria-hidden
      style={{ display: 'flex', alignItems: 'center', marginInlineEnd: 24 }}
      onMouseDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <Input
        style={{ borderRadius: 4, marginInlineEnd: 12, backgroundColor: token.colorBgTextHover }}
        prefix={<SearchOutlined style={{ color: token.colorTextLightSolid }} />}
        placeholder="搜索方案"
        bordered={false}
      />
      <PlusCircleFilled style={{ color: token.colorPrimary, fontSize: 24 }} />
    </div>
  );
};
export default SearchInput;
