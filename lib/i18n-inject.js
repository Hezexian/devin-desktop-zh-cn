// Inject at the i18next init expression, never execute the input bundle.
const fs = require('fs');
const acorn = require('../node_modules/acorn');
const { sha, commit } = require('./files');
const ps = require('./patch-state');
const { overlayCatalog, validateRules } = require('./rules');
const escSingle = s => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r/g, '\\r').replace(/\n/g, '\\n')
  .replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

// Standalone, serialized into the new webapp-host bundle. The host reloads its
// supported locale (currently en) from preferences after init. Overlay only its
// English UI resource tree; preserve every untranslated key and source object.
function mergeFallback(source, translated) {
  if (typeof source === 'string') return typeof translated === 'string' ? translated : source;
  if (!source || typeof source !== 'object') return source;
  const out = Array.isArray(source) ? [] : {};
  for (const key of Object.keys(source)) {
    Object.defineProperty(out, key, { value: mergeFallback(source[key], translated && translated[key]),
      enumerable: true, writable: true, configurable: true });
  }
  return out;
}

function restore(file) {
  if (!fs.existsSync(file)) return false;
  const current = fs.readFileSync(file, 'utf8');
  if (!ps.marked(current)) return false;
  const { original } = ps.source(file);
  commit(new Map([[file, original], [file + '.zh-state.json', null]]), new Map([[file, current]]));
  return true;
}

function patch(file, zhTranslationJson, zhReviewJson, rules = {}) {
  validateRules(rules);
  JSON.parse(zhTranslationJson);
  if (zhReviewJson) JSON.parse(zhReviewJson);
  const { current, original: src, st, patched } = ps.source(file);
  const zhHash = sha(JSON.stringify([zhTranslationJson, zhReviewJson || null, rules]));
  if (patched && st.engineVersion === ps.ENGINE_VERSION && st.zhHash === zhHash && st.i18nApplied) {
    return { applied: false, alreadyPatched: true };
  }
  const initRe = /let ([\w$]+)=\{en:\{translation:[^}]+,review:([\w$]+)\}\};[^]{0,3000}?([\w$]+)\.use\([\w$]+\)\.init\(\{resources:\1,lng:(["`])en\4,/;
  const m = initRe.exec(src);
  if (!m) {
    if (!patched) commit(new Map([[file + '.en-backup', src], [file + '.zh-state.json', JSON.stringify({
      engineVersion: ps.ENGINE_VERSION, sourceHash: sha(src), patchedHash: sha(current), i18nApplied: false,
    })]]), new Map([[file, current]]));
    return { applied: false, alreadyPatched: false, reason: 'init-site-not-found' };
  }
  const [, variable, , i18n, quote] = m;
  const webHost = /[\\/]devin-webapp-host[\\/]/.test(file);
  if (webHost && quote !== '`') throw new Error('Webapp-host init structure changed; no files modified');
  const at = src.indexOf(`${i18n}.use(`, m.index);
  // Resolve overrides against actual EN resources; no upstream catalog needs
  // to be duplicated in the release just to implement custom/excluded strings.
  const cat = (namespace, text) => `(${overlayCatalog.toString()})(${variable}.en.${namespace},JSON.parse('${escSingle(text || '{}')}'),${JSON.stringify(rules)})`;
  let inject = `/*devin-zh-i18n*/${variable}["zh"]={translation:${cat('translation', zhTranslationJson)},review:${cat('review', zhReviewJson)}},`;
  if (webHost) inject += ['translation', 'review'].map(ns =>
    `${variable}.en.${ns}=(${mergeFallback.toString()})(${variable}.en.${ns},${variable}["zh"].${ns}),`).join('');
  let out = src.slice(0, at) + inject + src.slice(at);
  const lngText = `lng:${quote}en${quote}`;
  const lngAt = out.indexOf(lngText, at + inject.length);
  if (lngAt < 0 || lngAt > at + inject.length + 2000) throw new Error('未能定位 i18next 语言设置，未修改');
  if (!webHost) out = out.slice(0, lngAt) + `lng:${quote}zh${quote}` + out.slice(lngAt + lngText.length);
  acorn.parse(out, { ecmaVersion: 'latest', sourceType: 'module' });
  const next = {
    engine: 'devin-zh-i18n', engineVersion: ps.ENGINE_VERSION, i18nApplied: true,
    sourceHash: sha(src), patchedHash: sha(out), zhHash, injectedBytes: inject.length,
    localeMode: webHost ? 'local-english-ui-overlay' : 'zh',
  };
  commit(new Map([[file + '.en-backup', src], [file, out], [file + '.zh-state.json', JSON.stringify(next, null, 2)]]),
    new Map([[file, current]]));
  return { applied: out !== current, alreadyPatched: false, injectedBytes: inject.length, var: variable, i18n };
}
module.exports = { patch, restore, mergeFallback };
