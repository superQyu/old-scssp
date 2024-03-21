/**
 *@Author：Qy
 *@Package：commitlint.config.js
 *@name：commit 提交规范验证
 *@Date：2024-03-20
 *@Filename：commitlint.config.js
 **/

/** @type {import('cz-git').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'test',
        'build',
        'chore',
        'perf',
        'ci',
        'revert',
        'init',
        'merge',
      ],
    ],
    'type-case': [0, 'always', 'lower-case'],
    'type-empty': [0, 'never'],
    'subject-full-stop': [0, 'never', '.'],
    'header-max-length': [2, 'always', 100],
    'subject-case': [0, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
  },
  prompt: {
    useEmoji: true,
    allowCustomIssuePrefix: true,
    allowEmptyIssuePrefix: true,
    confirmColorize: true,
    messages: {
      type: '选择你要提交的类型 :',
      scope: '选择一个提交范围（可选）:',
      customScope: '请输入自定义的提交范围 :',
      subject: '简短精炼的变更描述 :\n',
      body: "详细的变更描述（可选）。使用 '|' 换行 :\n",
      breaking: "列举非兼容性重大的变更（可选）。使用 '|' 换行 :\n",
      footerPrefixesSelect: '选择关联issue前缀（可选）:',
      customFooterPrefix: '输入自定义issue前缀 :',
      footer: '列举关联issue (可选) 例如: #31, #I3244 :\n',
      confirmCommit: '是否提交或修改commit ?',
    },
    types: [
      {
        value: 'feat: :sparkles',
        name: '✨ feat:     新功能',
      },
      {
        value: 'fix: :bug',
        name: '🐛 fix:      修复bug',
      },
      {
        value: 'docs: :pencil2',
        name: '✏️  docs:     文档变更',
      },
      {
        value: 'perf: :zap',
        name: '⚡️ perf:     性能优化',
      },
      {
        value: 'style: :lipstick',
        name: '💄 style:    代码的样式美化',
      },
      {
        value: 'refactor: :recycle',
        name: '♻️  refactor: 重构',
      },
      {
        value: 'test: :white_check_mark',
        name: '✅ test:     测试',
      },
      {
        value: 'build: :package',
        name: '📦️ build:    打包',
      },
      {
        value: 'ci: :construction_worker',
        name: '👷 ci:       CI related changes',
      },
      {
        value: 'revert: :rewind',
        name: '⏪️ revert:   回退',
      },
      {
        value: 'chore: :rocket',
        name: '🚀 chore:    构建/工程依赖/工具',
      },
      {
        value: 'init: :tada',
        name: '🎉 init:    初始化仓库',
      },
      {
        value: 'merge: :twisted_rightwards_arrow',
        name: '🔀 merge:    合并分支',
      },
    ],
  },
};
