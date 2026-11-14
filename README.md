# Devin Desktop 汉化包

为 Devin Desktop 提供简体中文汉化，覆盖菜单、首页、自定义页面和设置。

**[下载最新安装包](https://github.com/Hezexian/devin-desktop-zh-cn/releases/latest) · [查看发行记录](CHANGELOG.md) · [反馈漏译](https://github.com/Hezexian/devin-desktop-zh-cn/issues)**

## 让 AI 帮你安装

把下面这段话发给能操作本机的 AI 助手即可：

```text
请帮我安装并配置这个 Devin Desktop 汉化包：
https://github.com/Hezexian/devin-desktop-zh-cn

按 README 检查版本，下载兼容的最新发行包并完成汉化。保留现有配置和原文件备份，在 Devin 空闲时重启并检查效果。
```

当前支持 **Devin Desktop 3.12.59 · Windows x64**，新版本适配随 Release 发布。

<details>
<summary>手动安装步骤</summary>

1. 点击左上角的模式菜单进入编辑器，安装[微软简体中文语言包](https://marketplace.visualstudio.com/items?itemName=MS-CEINTL.vscode-language-pack-zh-hans)。执行 `Configure Display Language`，选择 `中文(简体) / zh-cn`。
2. 从 [Releases](https://github.com/Hezexian/devin-desktop-zh-cn/releases/latest) 下载 `.vsix` 文件。
3. 按 `Ctrl+Shift+P`，执行“**从 VSIX 安装**”（`Extensions: Install from VSIX...`），选择下载的文件。
4. 执行“**Devin GPT 汉化: 应用汉化**”，完成后完全退出并重新打开 Devin。

从其他汉化扩展迁移时，先用旧扩展还原补丁并禁用旧扩展，再安装本包。

</details>

## 翻译了哪些界面

- 文件、编辑、查看、转到、帮助菜单及常用子菜单。
- 首页侧栏、任务输入提示、云端／本地入口、入门清单。
- 自定义页面中的插件、技能、MCP、钩子、规则、子智能体和记忆。
- 插件介绍、安装提示、子智能体搜索框。
- 应用设置、智能体介绍、偏好设置。

品牌名、技能标识和用户内容保留原文。发现漏译，可以在 [Issues](https://github.com/Hezexian/devin-desktop-zh-cn/issues) 提供英文原文和所在页面。

## 命令与还原

| 命令面板中的名称 | 功能 |
|---|---|
| Devin GPT 汉化: 应用汉化 | 应用当前词典，解除自动应用暂停 |
| Devin GPT 汉化: 还原原版 | 校验备份后还原文件，并暂停自动汉化 |
| Devin GPT 汉化: 打开翻译词典 | 查看 DOM 显示层词典 |

卸载前执行“还原原版”，完全退出并重新打开 Devin，再卸载扩展。原文件备份保存在目标文件旁的 `.en-backup` 中。

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

完整配置保存在当前用户数据目录的 `devin-zh-gpt.json`。

## 从源码打包

开发需要 Node.js 22+。Windows 使用系统自带的 `tar.exe`，Linux 打包需安装 `libarchive-tools`。

```sh
git clone https://github.com/Hezexian/devin-desktop-zh-cn.git
cd devin-desktop-zh-cn
npm ci --ignore-scripts
npm test
npm run pack
```

安装包生成在 `dist/`。开发、版本适配和发行步骤见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 维护与致谢

由 [Codex／GPT](https://github.com/codex) 开发和维护，[Hezexian](https://github.com/Hezexian) 发布与管理。完整名单见 [贡献者](CONTRIBUTORS.md)。

基于 [N1n3VASthR33H/devin-zh](https://github.com/vvvvvvvvvashhh/devin-zh) 改进，整合 [KawaYiLab/Devin-Web-Chinese](https://github.com/KawaYiLab/Devin-Web-Chinese) 的中文词典。感谢上游作者。

社区汉化项目，采用 [MIT 许可](LICENSE)。来源版本及版权声明见 [SOURCES.md](SOURCES.md) 和 [third_party](third_party)。
