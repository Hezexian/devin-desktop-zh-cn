const assert = require('assert/strict');
const { JSDOM } = require('jsdom');
const { buildRuntime } = require('../lib/dom-runtime');
const dict = { Search: '搜索', Automations: '自动化', 'Open file': '打开文件', 'Open folder': '打开文件夹',
  'Open {0}': '打开 {0}', '{0} rules': '{0} 条规则', 'MCP server': 'MCP 服务器',
  'Install for me {0}': '为我安装 {0}', DeepWiki: 'DeepWiki', 'Search subagents': '搜索子智能体' };

(async () => {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', { runScripts: 'outside-only' });
  const { window } = dom, { document } = window;
  const wait = () => new Promise(resolve => window.setTimeout(resolve, 15));
  const element = (tag, text, className) => {
    const node = document.createElement(tag); node.textContent = text; if (className) node.className = className;
    document.body.appendChild(node); return node;
  };
  let passed = 0;
  async function test(name, setup, verify) {
    const value = setup(); await wait(); verify(value); value.remove(); passed++; console.log('ok', name);
  }
  try {
    window.eval(buildRuntime(dict).code);
    await test('界面按钮精确翻译', () => element('button', 'Automations'), value => assert.equal(value.textContent, '自动化'));
    await test('同控件的相邻文字合并', () => { const value = element('button', ''); value.append('Open ', 'file'); return value; }, value => assert.equal(value.textContent, '打开文件'));
    await test('不清空嵌套语义元素', () => { const value = element('button', 'Open '); const child = document.createElement('b'); child.textContent = 'file'; value.appendChild(child); return value; }, value => assert.equal(value.lastChild.textContent, 'file'));
    await test('聊天正文保持英文', () => element('div', 'Search', 'markdown-body'), value => assert.equal(value.textContent, 'Search'));
    await test('代码保持英文', () => element('code', 'Automations'), value => assert.equal(value.textContent, 'Automations'));
    await test('终端输出保持英文', () => element('div', 'Search', 'xterm'), value => assert.equal(value.textContent, 'Search'));
    await test('输入值不变，仅翻译占位提示', () => { const value = element('input', ''); value.value = 'Search'; value.placeholder = 'Search subagents'; return value; }, value => { assert.equal(value.value, 'Search'); assert.equal(value.placeholder, '搜索子智能体'); });
    await test('可编辑输入正文不变', () => { const value = element('div', 'Search'); value.setAttribute('contenteditable', 'true'); return value; }, value => assert.equal(value.textContent, 'Search'));
    await test('安装标签保留独立品牌词', () => { const value = element('button', '+'); value.setAttribute('aria-label', 'Install for me DeepWiki'); return value; }, value => assert.equal(value.getAttribute('aria-label'), '为我安装 DeepWiki'));
    await test('安装标签保留多词品牌', () => { const value = element('button', '+'); value.setAttribute('aria-label', 'Install for me Agent Toolkit for AWS'); return value; }, value => assert.equal(value.getAttribute('aria-label'), '为我安装 Agent Toolkit for AWS'));
    await test('计数模板不误吞命令', () => element('button', 'Manage rules'), value => assert.equal(value.textContent, 'Manage rules'));
    await test('计数模板保留数量', () => element('button', '3 rules'), value => assert.equal(value.textContent, '3 条规则'));
    await test('长句不被通用模板误吞', () => element('button', 'Open a new session in this space now'), value => assert.equal(value.textContent, 'Open a new session in this space now'));
    const moving = element('button', 'Search'); await wait(); assert.equal(moving.textContent, '搜索');
    const protectedZone = element('div', '', 'markdown-body'); protectedZone.appendChild(moving); await wait();
    assert.equal(moving.textContent, 'Search'); protectedZone.remove(); passed++; console.log('ok 移入聊天保护区后恢复原文');
    const reactive = element('button', 'Search'); await wait(); reactive.firstChild.data = 'Search'; await wait();
    assert.equal(reactive.textContent, '搜索'); reactive.remove(); passed++; console.log('ok 界面重渲染后重新翻译');
    console.log(`${passed} DOM tests passed (jsdom；真实界面验收另见发行记录)`);
  } finally { window.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
