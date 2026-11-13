const { spawnSync } = require('child_process');
for (const file of ['check-release.js', 'test-inject.js', 'test-langpack.js', 'test-workflow.js', 'test-webhost.js', 'test-dom.js']) {
  const result = spawnSync(process.execPath, [require('path').join(__dirname, file)], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
}
