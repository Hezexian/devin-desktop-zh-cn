# 来源与版本

## 上游桌面扩展

- 项目：[vvvvvvvvvashhh/devin-zh](https://github.com/vvvvvvvvvashhh/devin-zh)。
- 发布身份：`N1n3VASthR33H.devin-zh`，本次基础包版本 `0.1.9`。
- 本次检出的源码 commit：`3bd7703a86aaf623b670888bec0467a812df57d2`。
- 许可：MIT，原声明保存在 `third_party/devin-zh-LICENSE`，根 LICENSE 也保留原版权行。
- 当前运行时代码来自本机已验收的 0.1.9 补齐版本；上游测试按三个目标及兼容校验更新。上游版本号与本仓库的 1.0.0 是不同的发行序列。

## 网页汉化词典

- 项目：[KawaYiLab/Devin-Web-Chinese](https://github.com/KawaYiLab/Devin-Web-Chinese)。
- 数据文件：`extension/dictionary.js`，获取日期 `2026-11-13`。
- 获取文件 SHA-256：`088d7e9176889e8560a8f1e39cb42fd208dbe8da82f878875daa01f9b98ee906`。
- 使用方式：静态解析纯数据，提取 3,734 条映射后合并，没有执行下载的脚本，也没有安装其浏览器扩展。
- 许可：MIT，完整声明保存在 `third_party/KawaYiLab-LICENSE`。

## 本仓库新增维护

Codex／GPT 完成了 469 条逐条补译、新版入口适配、原生菜单补齐、格式修正及发行整理。当前适配的程序 commit、目标文件和原始摘要保存在 `compatibility.json`。其中的程序摘要用于校验，不包含 Devin 原始 bundle。

## 依赖与外部前提

- acorn 8.19.0：运行时解析补丁后的 JavaScript，MIT；VSIX 内包含依赖及其 LICENSE。
- jsdom 26.1.0：仅用于开发期 DOM 测试，MIT，不进入 VSIX。
- 微软简体中文语言包：独立安装，不随本仓库分发。

Devin 原始安装程序、完整英文资源、用户配置、日志、会话和本机备份均不属于公开发行内容。
