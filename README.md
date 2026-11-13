# Devin Desktop 中文界面 · GPT 维护版

**本项目由 GPT（通过 OpenAI Codex）维护。** 仓库由 [Hezexian](https://github.com/Hezexian) 管理和发布，Codex／GPT 已列入[贡献者](CONTRIBUTORS.md)。这是基于社区项目改进的非官方汉化包，保留原作者署名，与 Cognition、OpenAI 官方发行无关。

适合想把 Devin Desktop 菜单、首页、设置和自定义页面改成简体中文的用户。普通用户下载 VSIX 安装即可，无需配置模型、API Key 或翻译服务。

**[下载最新安装包](https://github.com/Hezexian/devin-desktop-zh-gpt/releases/latest) · [查看发行记录](CHANGELOG.md) · [反馈漏译](https://github.com/Hezexian/devin-desktop-zh-gpt/issues)**

## 已适配版本

| 项目 | 已验收环境 |
|---|---|
| Devin Desktop | **3.12.59** |
| 内置 Code OSS | 1.141.2 |
| 程序 commit | `0122b42e158c7ca62960222fb9725f087cd9544f` |
| 操作系统 | Windows x64 |
| 配套语言包 | 微软简体中文语言包，验收版本 1.131.0 |

应用补丁前会核对程序 commit。未适配版本会停止应用，不会拿旧版本文件替换新版本。macOS、Linux 和其他 Devin 版本尚未实际验收。

## 安装方法

1. 在 Devin 的编辑器模式打开扩展页面，安装[微软简体中文语言包](https://marketplace.visualstudio.com/items?itemName=MS-CEINTL.vscode-language-pack-zh-hans)。在命令面板执行 `Configure Display Language`，选择 `中文(简体) / zh-cn`。
2. 到本仓库的 [Releases](https://github.com/Hezexian/devin-desktop-zh-gpt/releases/latest) 下载 `devin-desktop-zh-gpt-1.0.0.vsix`。`Source code` 是源码，不是安装包。
3. 在 Devin 编辑器模式按 `Ctrl+Shift+P`，搜索“**从 VSIX 安装**”（英文为 `Extensions: Install from VSIX...`），选择刚下载的文件。
4. 扩展启动后会尝试应用汉化。也可以在命令面板执行“**Devin GPT 汉化: 应用汉化**”。
5. 看到完成提示后，**完全退出 Devin，再重新打开**。仅刷新窗口不足以清除所有界面缓存。

需要对 Devin 安装目录和中文语言包有写权限。安装 VSIX 本身不需要单独安装 Node.js，也不会运行付费模型。

### 已经装过其他 Devin 汉化扩展

请先在旧扩展中执行“还原原版”，完全退出 Devin，再卸载或禁用旧汉化扩展，然后安装本包。尤其不要同时启用 `N1n3VASthR33H.devin-zh` 与本包；两者会处理相同的界面文件。

本包使用独立扩展 ID `Hezexian.devin-desktop-zh-gpt`、命令前缀 `devin-zh-gpt` 和设置前缀 `devinZhGpt`，不会冒用上游扩展的发布者身份。

## 翻译了哪些界面

已在真实窗口中检查过：

- 文件、编辑、查看、转到、帮助菜单及常用子菜单。
- 首页侧栏、任务输入提示、云端／本地入口、入门清单。
- 自定义页面中的插件、技能、MCP、钩子、规则、子智能体和记忆。
- 插件介绍、安装提示、子智能体搜索框。
- 应用设置、智能体介绍、偏好设置。

本版在上游 0.1.9 的基础上新增覆盖 4,378 个当前资源键，逐条补译 469 项，修正 44 处旧占位符或组件标签错配，并补齐 60 项原生菜单与模式切换映射。这些是资源映射数量，**不是所有页面的汉化完成率**。

品牌名称、用户和团队名称、技能标识保留原文。企业管理、支付和所有错误分支未逐项验收，仍可能存在漏译。模型回复的语言取决于你给模型的指令，本包不修改会话内容。

## 命令与还原

| 命令面板中的名称 | 功能 |
|---|---|
| Devin GPT 汉化: 应用汉化 | 应用当前词典，解除自动应用暂停 |
| Devin GPT 汉化: 还原原版 | 校验备份后还原文件，并暂停自动汉化 |
| Devin GPT 汉化: 打开翻译词典 | 查看 DOM 显示层词典 |

不想继续使用时，先执行“还原原版”，完全退出并重新打开，再卸载本扩展。**只卸载扩展不会撤销已写入的补丁。** 微软语言包仍可保留；若要完全切回英文，再把显示语言改成 English。

每个目标文件旁会保留 `.en-backup` 和 `.zh-state.json`。写入前会核对原始备份、补丁状态和当前文件，并先在临时目录准备完整结果；提交失败会尝试回滚。备份或状态不匹配时会停止操作。Devin 更新后不要用旧备份覆盖新程序，应先核对版本并等待对应适配。

## 自定义译文

在 Devin 用户设置中配置，例如：

```json
{
  "devinZhGpt.autoApply": true,
  "devinZhGpt.customTranslations": {
    "Search": "搜索"
  },
  "devinZhGpt.exclude": ["My Product"]
}
```

排除列表优先于自定义译文。保留原文的 `{0}`、`{{name}}` 和 `<picker/>` 等占位符或组件标签。修改后执行一次“应用汉化”，然后完全重启。

策略和暂停状态保存在当前用户数据目录的 `devin-zh-gpt.json`，不修改账户、模型、智能体权限或项目配置。

## 实现方式

| 层 | 处理方式 |
|---|---|
| 旧版界面资源 | 向两个已有 bundle 的 i18next 初始化位置注册中文资源 |
| 新版 webapp-host | 补上原扩展遗漏的第三个入口，并在其 en 界面资源树中递归合并中文，避免启动后加载原有语言偏好又变回英文 |
| DOM 显示层 | 补译界面文字、提示和无障碍标签；保留聊天正文、代码、终端和输入值 |
| 原生语言包 | 将 Devin 专用 NLS 文案合入已安装的微软中文语言包 |

补丁只更改这三个前端目标、登记在产品中的对应校验值、语言包及本包的策略／缓存文件，不包含 Devin 原程序。新版输入框的提示通过资源层翻译，输入框里的用户文字不做 DOM 替换。

## 从源码打包

开发需要 Node.js 22+。Windows 使用系统自带 `tar.exe`；macOS 使用系统 `tar`；Linux 需要 `bsdtar`，Ubuntu 可安装 `libarchive-tools`。

```sh
git clone https://github.com/Hezexian/devin-desktop-zh-gpt.git
cd devin-desktop-zh-gpt
npm ci --ignore-scripts
npm test
npm run pack
```

安装包生成在 `dist/`。打包使用明确的运行时文件清单，只携带生产依赖 acorn，开发依赖和测试材料不会进入 VSIX。运行时没有联网调用，也不读取翻译 API 凭据。

可选命令行方式适用于已经关闭的 Devin：

```sh
node tools/patch-devin.js --app-dir "<Devin安装目录>/resources/app" --user-data-dir "<Devin用户数据目录>" --extensions-dir "<Devin扩展目录>"
node tools/patch-devin.js --restore --app-dir "<Devin安装目录>/resources/app" --user-data-dir "<Devin用户数据目录>" --extensions-dir "<Devin扩展目录>"
```

安装多份编辑器或使用便携版时，应同时明确这三个目录。普通用户优先使用 VSIX 中的命令。

## 反馈与维护

发现漏译时，请到 [Issues](https://github.com/Hezexian/devin-desktop-zh-gpt/issues) 提供 Devin 版本、英文原文和所在页面；截图请遮挡个人信息。版本更新与验收范围会记录在 [CHANGELOG.md](CHANGELOG.md)，贡献和发行步骤见 [CONTRIBUTING.md](CONTRIBUTING.md)。GPT／Codex 维护产生的修改以仓库代码、测试结果和发行记录为准。

## 来源与许可

本项目基于 [N1n3VASthR33H 的 devin-zh](https://github.com/vvvvvvvvvashhh/devin-zh) 改进，并整合 [KawaYiLab/Devin-Web-Chinese](https://github.com/KawaYiLab/Devin-Web-Chinese) 的 MIT 词典。上游作者、Codex／GPT 和仓库维护者分别列在 [CONTRIBUTORS.md](CONTRIBUTORS.md)，来源版本与摘要见 [SOURCES.md](SOURCES.md)。

本仓库代码和新增译文采用 MIT 许可，保留第三方版权声明。Devin、第三方产品名称及用于翻译对照的原文归各自权利人所有。微软中文语言包由用户另行安装，未重新分发。完整声明见 [LICENSE](LICENSE) 和 [third_party](third_party)。
