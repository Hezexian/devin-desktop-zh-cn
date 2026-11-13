const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const root = path.resolve(__dirname, '..');
const pkg = require('../package.json');
const compatibility = require('../compatibility.json');
const { validPair } = require('../lib/rules');

function check() {
  assert.match(pkg.version, /^\d+\.\d+\.\d+$/);
  assert.equal(pkg.publisher, 'Hezexian');
  assert.equal(pkg.name, 'devin-desktop-zh-gpt');
  assert.deepEqual(require('../lib/devin-files').TARGETS, compatibility.targets.map(item => item.relative));
  for (const item of compatibility.supported) assert.match(item.commit, /^[a-f0-9]{40}$/);
  const docs = ['README.md', 'CONTRIBUTORS.md', 'CHANGELOG.md', 'CONTRIBUTING.md', 'SOURCES.md',
    'LICENSE', 'third_party/devin-zh-LICENSE', 'third_party/KawaYiLab-LICENSE'];
  for (const file of docs) assert.ok(fs.statSync(path.join(root, file)).size > 0, file);
  const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
  assert.match(readme, /GPT[^\n]*维护/);
  assert.ok(fs.readFileSync(path.join(root, 'CONTRIBUTORS.md'), 'utf8').includes('Codex／GPT'));
  const dictionary = require('../translations/catalogs/dom-dict.json');
  const invalid = Object.entries(dictionary).filter(([en, zh]) => !validPair(en, zh));
  assert.equal(invalid.length, 0, '词典占位符不一致：' + JSON.stringify(invalid.slice(0, 5)));
  for (const file of ['translations/catalogs/zh.translation.json', 'translations/catalogs/zh.review.json', 'translations/main.i18n.json', 'translations/legacy-main.i18n.json']) {
    JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
  }
  let sourceFiles = 0;
  const secret = /(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{30,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)/;
  const localPath = /[CD]:[\\/]+(?:Users[\\/]+hezex(?:[\\/]|\b)|Library[\\/])/i;
  function walk(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.isDirectory() && ['.git', 'node_modules', 'dist'].includes(entry.name)) continue;
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) { walk(file); continue; }
      const relative = path.relative(root, file).replace(/\\/g, '/');
      assert.ok(!/\.en-backup$|\.zh-state\.json$|nls\.metadata\.json$|(?:^|\/)\.env(?:\.|$)|\.log$|\.vsix$|\.zip$/i.test(relative), '禁止发布：' + relative);
      const value = fs.readFileSync(file, 'utf8');
      // This scanner contains its own regex, not a credential or a local path.
      assert.ok(!secret.test(value), '疑似凭据：' + relative);
      assert.ok(!localPath.test(value), '个人本机路径：' + relative);
      sourceFiles++;
    }
  }
  walk(root);
  console.log(JSON.stringify({ releaseCheck: 'passed', sourceFiles, dictionaryEntries: Object.keys(dictionary).length, supportedVersions: compatibility.supported.map(item => item.productVersion) }));
}
if (require.main === module) check();
module.exports = { check };
