/**
 * Production build for VishalRavi's Portfolio OS.
 *
 *   npm install     (once)
 *   npm run build   -> dist/
 *
 * Locally the page compiles its own JSX in the browser, which means every
 * visitor downloads ~3 MB of Babel and waits for it before anything paints.
 * This does that work once, ahead of time:
 *
 *   - transpiles os/*.jsx -> dist/os/*.js
 *   - swaps React's development builds for the minified production ones,
 *     vendored locally so the deployed site makes no third-party JS requests
 *   - rewrites index.html to load the compiled files and drops Babel entirely
 *
 * Source files are untouched — local dev keeps working exactly as before.
 */

const fs = require('fs');
const path = require('path');
const Babel = require('@babel/standalone');

const ROOT = __dirname;
const SRC_OS = path.join(ROOT, 'os');
const OUT = path.join(ROOT, 'dist');

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

function copyDir(from, to) {
  if (!fs.existsSync(from)) return 0;
  fs.mkdirSync(to, { recursive: true });
  let bytes = 0;
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, entry.name);
    const b = path.join(to, entry.name);
    if (entry.isDirectory()) bytes += copyDir(a, b);
    else { fs.copyFileSync(a, b); bytes += fs.statSync(a).size; }
  }
  return bytes;
}

// ── clean ──────────────────────────────────────────────────────────────
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'os'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'vendor'), { recursive: true });

// ── 1. JSX -> JS ───────────────────────────────────────────────────────
const jsxFiles = fs.readdirSync(SRC_OS).filter((f) => f.endsWith('.jsx'));
let appBytes = 0;
for (const f of jsxFiles) {
  const src = fs.readFileSync(path.join(SRC_OS, f), 'utf8');
  let out;
  try {
    out = Babel.transform(src, { presets: ['react'], filename: f }).code;
  } catch (e) {
    console.error(`\n  build failed in os/${f}\n  ${e.message.split('\n')[0]}\n`);
    process.exit(1);
  }
  const dest = path.join(OUT, 'os', f.replace(/\.jsx$/, '.js'));
  fs.writeFileSync(dest, out);
  appBytes += Buffer.byteLength(out);
  console.log(`  compiled  os/${f} -> os/${path.basename(dest)}  (${kb(Buffer.byteLength(out))})`);
}

// ── 2. plain JS (data, themes, image-slot) copied as-is ────────────────
for (const f of fs.readdirSync(SRC_OS).filter((f) => f.endsWith('.js'))) {
  fs.copyFileSync(path.join(SRC_OS, f), path.join(OUT, 'os', f));
  appBytes += fs.statSync(path.join(SRC_OS, f)).size;
}

// ── 3. assets ──────────────────────────────────────────────────────────
const assetBytes = copyDir(path.join(ROOT, 'assets'), path.join(OUT, 'assets'));

// ── 4. vendor React (production, minified) ─────────────────────────────
const VENDOR = [
  ['react', 'umd/react.production.min.js'],
  ['react-dom', 'umd/react-dom.production.min.js'],
];
let vendorBytes = 0;
for (const [pkg, rel] of VENDOR) {
  const from = path.join(ROOT, 'node_modules', pkg, rel);
  if (!fs.existsSync(from)) {
    console.error(`\n  missing ${pkg}. Run: npm install\n`);
    process.exit(1);
  }
  const name = path.basename(rel);
  fs.copyFileSync(from, path.join(OUT, 'vendor', name));
  vendorBytes += fs.statSync(from).size;
  console.log(`  vendored  ${name}  (${kb(fs.statSync(from).size)})`);
}

// ── 5. index.html ──────────────────────────────────────────────────────
let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

// React/Babel CDN tags -> local production React, no Babel.
html = html.replace(
  /[ \t]*<!-- React -->[\s\S]*?babel\.min\.js"[^>]*><\/script>/,
  [
    '  <!-- React (production, vendored — no third-party JS at runtime) -->',
    '  <script src="vendor/react.production.min.js"></script>',
    '  <script src="vendor/react-dom.production.min.js"></script>',
  ].join('\n')
);

// text/babel module tags -> plain compiled scripts.
html = html.replace(
  /<script type="text\/babel" src="os\/([\w-]+)\.jsx"><\/script>/g,
  '<script src="os/$1.js"></script>'
);

// The inline mount block is JSX too — compile it in place.
html = html.replace(
  /<script type="text\/babel">([\s\S]*?)<\/script>/,
  (_, code) => `<script>${Babel.transform(code, { presets: ['react'] }).code}</script>`
);

// Match real references only — attributes and src paths. Looser patterns
// catch the word "babel" inside surviving code comments and false-alarm.
const leftovers = [/type="text\/babel"/, /src="[^"]*babel[^"]*"/, /src="[^"]*\.jsx"/]
  .filter((re) => re.test(html));
if (leftovers.length) {
  console.error(`\n  index.html still loads Babel or .jsx after rewrite (${leftovers.join(', ')}) — aborting.\n`);
  process.exit(1);
}

fs.writeFileSync(path.join(OUT, 'index.html'), html);

// Tells GitHub Pages to serve the files as-is.
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');

const total = appBytes + vendorBytes;
console.log(`
  dist/ ready
    app code   ${kb(appBytes)}
    react      ${kb(vendorBytes)}
    javascript ${kb(total)}   (was ~4.2 MB with in-browser Babel)
    assets     ${kb(assetBytes)}

  Preview:  python serve.py 8080   then open http://localhost:8080/dist/
`);
