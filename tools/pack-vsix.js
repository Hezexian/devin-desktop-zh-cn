// 采用上游 VSIX 清单结构，以显式运行时白名单打包。
const fs = require('fs'), os = require('os'), path = require('path'), crypto = require('crypto');
const { execFileSync } = require('child_process');
const { check } = require('./check-release');
check();
const root = path.resolve(__dirname, '..'), pkg = require('../package.json');
const files = ['package.json', 'extension.js', 'compatibility.json', 'devin-zh.cmd',
  'README.md', 'LICENSE', 'CONTRIBUTORS.md', 'CHANGELOG.md', 'CONTRIBUTING.md', 'SOURCES.md',
  'third_party/devin-zh-LICENSE', 'third_party/KawaYiLab-LICENSE', 'tools/launch.js', 'tools/patch-devin.js',
  'translations/catalogs/zh.translation.json', 'translations/catalogs/zh.review.json', 'translations/catalogs/dom-dict.json',
  'translations/main.i18n.json', 'translations/legacy-main.i18n.json',
  'node_modules/acorn/package.json', 'node_modules/acorn/dist/acorn.js', 'node_modules/acorn/LICENSE',
  ...fs.readdirSync(path.join(root, 'lib')).filter(file => file.endsWith('.js')).map(file => 'lib/' + file)].sort();
const esc = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const stage = fs.mkdtempSync(path.join(os.tmpdir(), 'devin-gpt-pack-'));
const zip = path.join(stage, 'package.zip');
const output = path.join(root, 'dist', `${pkg.name}-${pkg.version}.vsix`);
try {
  for (const file of files) {
    const target = path.join(stage, 'extension', file);
    fs.mkdirSync(path.dirname(target), { recursive: true }); fs.copyFileSync(path.join(root, file), target);
  }
  const manifest = `<?xml version="1.0" encoding="utf-8"?>
<PackageManifest Version="2.0.0" xmlns="http://schemas.microsoft.com/developer/vsx-schema/2011">
<Metadata><Identity Language="zh-CN" Id="${esc(pkg.name)}" Version="${esc(pkg.version)}" Publisher="${esc(pkg.publisher)}"/>
<DisplayName>${esc(pkg.displayName)}</DisplayName><Description xml:space="preserve">${esc(pkg.description)}</Description>
<Tags>${esc(pkg.keywords.join(','))}</Tags><Categories>${esc(pkg.categories.join(','))}</Categories><GalleryFlags>Public</GalleryFlags>
<Properties><Property Id="Microsoft.VisualStudio.Code.Engine" Value="${esc(pkg.engines.vscode)}"/><Property Id="Microsoft.VisualStudio.Code.ExtensionKind" Value="ui"/><Property Id="Microsoft.VisualStudio.Code.ExecutesCode" Value="true"/></Properties>
<License>extension/LICENSE</License></Metadata><Installation><InstallationTarget Id="Microsoft.VisualStudio.Code"/></Installation><Dependencies/>
<Assets><Asset Type="Microsoft.VisualStudio.Code.Manifest" Path="extension/package.json" Addressable="true"/><Asset Type="Microsoft.VisualStudio.Services.Content.License" Path="extension/LICENSE" Addressable="true"/><Asset Type="Microsoft.VisualStudio.Services.Content.Details" Path="extension/README.md" Addressable="true"/></Assets></PackageManifest>`;
  fs.writeFileSync(path.join(stage, 'extension.vsixmanifest'), manifest);
  fs.writeFileSync(path.join(stage, '[Content_Types].xml'), '<?xml version="1.0" encoding="utf-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="json" ContentType="application/json"/><Default Extension="js" ContentType="application/javascript"/><Default Extension="md" ContentType="text/markdown"/><Default Extension="vsixmanifest" ContentType="text/xml"/><Default Extension="xml" ContentType="text/xml"/><Default Extension="cmd" ContentType="application/octet-stream"/><Default Extension="" ContentType="application/octet-stream"/></Types>');
  execFileSync(process.execPath, ['-e', 'require(process.argv[1]);', path.join(stage, 'extension/lib/workflow.js')], { stdio: 'pipe' });
  const tar = process.platform === 'win32' ? path.join(process.env.SystemRoot || 'C:/Windows', 'System32/tar.exe') : process.platform === 'darwin' ? 'tar' : 'bsdtar';
  execFileSync(tar, ['-a', '-c', '-f', zip, '-C', stage, 'extension.vsixmanifest', '[Content_Types].xml', 'extension'], { stdio: 'inherit' });
  fs.mkdirSync(path.dirname(output), { recursive: true }); fs.copyFileSync(zip, output);
  const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
  const receipt = { name: pkg.name, version: pkg.version, publisher: pkg.publisher,
    sha256: sha256(fs.readFileSync(output)), files: files.map(file => ({ path: 'extension/' + file, sha256: sha256(fs.readFileSync(path.join(root, file))) })) };
  fs.writeFileSync(path.join(root, 'dist/package-manifest.json'), JSON.stringify(receipt, null, 2) + '\n');
  console.log(JSON.stringify({ package: path.basename(output), bytes: fs.statSync(output).size, files: files.length, sha256: receipt.sha256 }));
} finally {
  if (path.dirname(path.resolve(stage)) !== path.resolve(os.tmpdir()) || !path.basename(stage).startsWith('devin-gpt-pack-')) throw Error('拒绝清理非打包临时目录');
  fs.rmSync(stage, { recursive: true, force: true });
}
