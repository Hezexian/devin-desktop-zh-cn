const fs = require('fs'), os = require('os'), path = require('path'), assert = require('assert/strict'), vm = require('vm');
const { patch, restore, mergeFallback } = require('../lib/i18n-inject');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'devin-gpt-webhost-test-'));
const target = path.join(dir, 'devin-webapp-host', 'synthetic.js');
fs.mkdirSync(path.dirname(target), { recursive: true });
const source = 'var T={tip:"Tip: Go (<shortcut/>)",nested:{count:"{{count}} skills",keep:"Keep"}},q={title:"Changes"},x={},i={use(){return this},init(o){return o}};let r={en:{translation:T,review:q}};function f(){return i.use(x).init({resources:r,lng:`en`,fallbackLng:`en`})}';
try {
  fs.writeFileSync(target, source);
  const first = patch(target, JSON.stringify({ tip: '提示：跳转（<shortcut/>）', nested: { count: '{{count}} 个技能' } }), '{"title":"更改"}');
  assert.ok(first.applied);
  const result = vm.runInNewContext(fs.readFileSync(target, 'utf8') + ';f()');
  assert.equal(result.lng, 'en');
  assert.equal(result.resources.en.translation.tip, '提示：跳转（<shortcut/>）');
  assert.equal(result.resources.en.translation.nested.keep, 'Keep');
  assert.equal(result.resources.en.translation.nested.count, '{{count}} 个技能');
  assert.equal(result.resources.en.review.title, '更改');
  const object = { nested: { first: 'First', keep: 'Keep' }, list: ['One', 'Two'] };
  const before = structuredClone(object);
  const merged = mergeFallback(object, { nested: { first: '第一项' }, list: ['一'] });
  assert.deepEqual(object, before);
  assert.deepEqual(merged, { nested: { first: '第一项', keep: 'Keep' }, list: ['一', 'Two'] });
  assert.ok(patch(target, JSON.stringify({ tip: '提示：跳转（<shortcut/>）', nested: { count: '{{count}} 个技能' } }), '{"title":"更改"}').alreadyPatched);
  assert.ok(restore(target));
  assert.equal(fs.readFileSync(target, 'utf8'), source);
  console.log('ok 新版入口：语言偏好、递归回退、占位符、资源不变、幂等与还原');
} finally {
  assert.equal(path.dirname(path.resolve(dir)), path.resolve(os.tmpdir()));
  assert.ok(path.basename(dir).startsWith('devin-gpt-webhost-test-'));
  fs.rmSync(dir, { recursive: true, force: true });
}
