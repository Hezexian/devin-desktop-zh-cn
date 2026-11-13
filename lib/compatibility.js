const fs = require('fs');
const path = require('path');
const supported = require('../compatibility.json').supported;

function assertCompatible(app) {
  const product = JSON.parse(fs.readFileSync(path.join(app, 'product.json'), 'utf8'));
  const entry = supported.find(item => item.commit === product.commit);
  if (!entry) throw new Error('当前 Devin 版本尚未适配，已停止应用。请查看兼容列表并提交版本信息；不要使用旧备份覆盖新版。');
  return entry;
}
module.exports = { assertCompatible };
