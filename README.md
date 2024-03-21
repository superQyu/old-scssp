## 项目介绍

智慧工地监管平台是一种基于先进技术和数据分析的创新解决方案，旨在提升工地管理的效率、安全性和可持续性。该平台整合了物联网（IoT）、人工智能（AI）、大数据等技术，实现对工地各项活动和资源的实时监测、分析和管理。

通过智慧工地监管平台，管理人员可以远程监控工地运行情况，实时获取各项指标数据，并进行智能化分析预测。平台能够帮助管理者及时发现潜在风险和问题，提供数据支持和决策建议，从而有效优化工地运营和资源利用。

此外，智慧工地监管平台还支持视频监控、人员考勤、设备管理、环境监测等功能，为工地管理提供全方位的信息化支持。通过平台的数字化管理和自动化控制，工地管理者能够更好地实现工地监管与运营的智能化、精准化和高效化，为建设行业的发展注入新的动力和活力。

## 子应用

- 单独部署
- 单独开发
- 相当于微前端
- .....

## 代码简介，致力打造成一个标准的模版，可直接用于生产环境开发

## 相关技术栈

- `react`，`react18`，`vite`，`vite3`，`antd`，`antd5.x`，`ts`，`typescript`，`redux`，`react-redux`，`@reduxjs/toolkit`
- [Monorepo](https://turbo.build/repo/docs)
- [ReactJS](https://reactjs.org)
- [Vite](https://vitejs.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Antd5](https://ant.design)
- [ProComponents](https://procomponents.ant.design)
- [Redux](https://react-redux.js.org)
- [Redux-toolkit](https://redux-toolkit.js.org)
- [ESLint](https://eslint.org)
- [Prettier](https://prettier.io)

## 环境

- nodejs >= 16
- npm
- pnpm

### pnpm 相关命令 [pnpm](https://www.pnpm.cn/cli/add)

- pnpm add sax 保存到 dependencies 配置项下
- pnpm add -D sax 保存到 devDependencies 配置项下
- pnpm add -O sax 保存到 optionalDependencies 配置项下
- pnpm add -g sax 安装软件包到全局环境中
- pnpm add sax@next 安装标记为 next 的版本
- pnpm add sax@3.0.0 安装指定版本 3.0.0

### 推荐使用 webstrom vscode 开发

### 代码目录结构

- 生成 `pnpm run treer`

```markdown
Smart construction site supervision platform
├─dist // 项目打包存放路劲
├─packages // 公共包存放路径
| ├─apis // 公共 API 存储
| ├─utils // 公共工具
| ├─ui // ui 组件库
| ├─store // 全局状态管理
| ├─request // 封装 ajax fetch
| ├─hooks // 公共 hooks
| ├─tsconfig // ts 配置文件
| ├─components // 公共业务组件
| ├─eslint-config-custom // 全局 eslint
├─apps // 项目存放路径
| ├─demo // 示例项目
| ├─admin // 后台管理 app
| | ├─src // 主文件
| | | ├─routes // 路由
| | | ├─pages // 页面
| | | ├─components // 组件
| | | ├─common // 公共资源
| | | ├─assets 静态资源
| | ├─admin // 打包出口
├─.husky // 代码提交脚本
```

### 包划分

packages:

- [components](components) 存放功能性组件，更偏向系统功能，比如`Layout`公共布局组件
- [eslint-config-custom](eslint-config-custom) `eslint`统一管理，所有`package`统一引入
- [hooks](hooks) 自定义`react hooks`，比如`KeepAlive`
- [store](store) 全局状态管理器，封装了`redux`，`store`树，提供`useSelector`，`useDispatch`
- [tsconfig](tsconfig) ts 配置文件，有`base.json`，`vite.json`
- [ui](ui) `ui`组件和`components`不一样的地方就是`ui`只专注纯组件开发，不带业务
- [utils](utils) 工具库，常用的工具函数
- [apis](apis) 公共接口封装
- [request](request) ajax，fetch 封装 包括 axios

### 开始

1. 启动项目，访问链接：http://localhost:项目名启动端口
   ```bash
   pnpm run dev-app  项目名
   ```

### 发布

- 生产环境打包
  ```bash
  pnpm build
  ```
- 测试环境打包
  ```bash
  pnpm build:sit
  ```

### 推荐使用`nginx`部署

- config 如下

```bash
# 后台管理模板
location ^~ /{
  index index.html;

  if ($request_uri ~* .*[.](js|css|map|jpg|png|svg|ico)$) {
    #设置过期时间120秒，120秒过后向服务器重新请求数据
    add_header Cache-Control max-age=120;
  }

  if ($request_filename ~* ^.*[.](html|htm)$) {
    add_header Cache-Control "public, no-cache";
    #html文件协商缓存，也就是每次都询问服务器，浏览器本地是是否是最新的，是最新的就直接用，非最新的服务器就会返回最新
  }


  try_files $uri $uri/ /index.html;
}
```

### 校验代码 格式化代码

- 提交代码自动执行

```bash
pnpm run format
```

## License

This project is licensed under the MIT License. .

## 相关指令操作

- 所有项目安装 workspace 依赖

```bash
  pnpm i {依赖名} -w
```

- 指定项目安装 workspace 依赖

```bash
  pnpm i {依赖名} --filter {项目名}
```
