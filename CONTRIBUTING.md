# 贡献与发行

本项目由 GPT（通过 OpenAI Codex）维护，接受问题反馈和有依据的修改。请保留上游署名，并把代码变化、实际测试和未验证范围写清楚。

## 修改译文

| 文件 | 用途 |
|---|---|
| `translations/catalogs/zh.translation.json` | 主要界面的按键翻译 |
| `translations/catalogs/zh.review.json` | 代码审查资源 |
| `translations/catalogs/dom-dict.json` | 英文到中文的精确映射和 `{0}` 模板 |
| `translations/main.i18n.json` | 原生菜单与 Devin NLS |

这些是可直接打包的维护产物，不需要调用翻译服务。修改时保留占位符、组件标签和语义；品牌名、代码、文件名以及用户输入不做通用词替换。

```sh
npm ci --ignore-scripts
npm test
npm run pack
```

测试包括注入与还原、完整写入失败回滚、版本检查、语言包合并、DOM 保护区和发布内容检查。合成测试不会启动 Devin，也不会读写个人账户。真实版本验收应在单独的测试副本或明确授权的安装中执行，记录应用、重复应用、还原、文件摘要及重启后界面结果。

## 适配新版 Devin

1. 阅读官方更新说明，核对新程序版本、commit 和资源入口。
2. 在私有临时目录保留原始程序证据，不提交原始 bundle 或完整英文资源。
3. 检查三个入口是否仍存在、初始化结构是否变化、NLS 模块及变量是否变化。
4. 更新代码与译文，保留缺失词条的回退，验证占位符和组件标签。
5. 在隔离副本中验证应用、幂等、回滚和逐字节还原，再实际重启检查界面。
6. 只有完成对应验证后才更新 `compatibility.json`、README 和 CHANGELOG。不要仅因为文件名相近就放宽兼容检查。

## 发布版本

1. 更新 `package.json` 的版本号及 CHANGELOG。
2. 运行测试和打包，核对 `dist/package-manifest.json` 中的文件清单。
3. 对 Git 暂存区和安装包做检查，确保不含凭据、本机路径、个人配置、日志、备份或原始程序。
4. 提交代码并创建 `v<版本号>` 标签。
5. 在 GitHub Release 上传 VSIX、源码 ZIP 与 `SHA256SUMS.txt`，用中文写明兼容版本、安装、还原和验证范围。
6. 从发布地址重新下载并核对 SHA-256，确认仓库和 Release 对公众可访问。

VSIX 使用新的发布者身份 `Hezexian`，当前通过 GitHub Releases 分发。未经登记和验收，不应把它描述为已上架微软或 Open VSX 市场。
