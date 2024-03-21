import './main.css';

import { ConfigProvider } from 'antd';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './app';
import { store, Provider } from 'store';

import 'virtual:uno.css';

const root = createRoot(document.getElementById('root') as HTMLDivElement);
root.render(
  <Provider store={store}>
    <BrowserRouter
      // 生产环境配置二级路径
      basename={'/' + import.meta.env.BASE_URL.replaceAll('/', '')}
    >
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: 'pink',
          },
        }}
      >
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </Provider>
);
