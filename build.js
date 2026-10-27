// Tiny Markdown -> HTML site builder for the PhotoVibe legal pages.
// No dependencies. Run: node build.js
// Sources: src/*.md  ->  output: <slug>/index.html + index.html
//
// Supported Markdown: # ## ###, paragraphs, **bold**, *italic*, `code`,
// bare https:// links, "- " bullet lists, "---" rules, pipe tables.

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const SITE_NAME = 'PhotoVibe';
const PAGES = [
  { slug: 'privacy', file: 'privacy.md', nav: 'Privacy Policy' },
  { slug: 'terms', file: 'terms.md', nav: 'Terms of Service' },
  { slug: 'delete-account', file: 'delete-account.md', nav: 'Delete your account' },
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function inline(text) {
  let s = esc(text);
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s).,;:]|$)/g, '$1<em>$2</em>');
  s = s.replace(/(https?:\/\/[^\s<)]+[^\s<).,])/g, '<a href="$1">$1</a>');
  s = s.replace(/([a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,})/gi, '<a href="mailto:$1">$1</a>');
  return s;
}

function render(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let para = [];
  let list = null;
  let table = null;
  let title = '';

  const flushPara = () => {
    if (!para.length) return;
    const meta = para.every((l) => l.startsWith('**'));
    out.push(`<p${meta ? ' class="meta"' : ''}>${para.map(inline).join(meta ? '<br>' : ' ')}</p>`);
    para = [];
  };
  const flushList = () => {
    if (!list) return;
    out.push(`<ul>${list.map((li) => `<li>${inline(li)}</li>`).join('')}</ul>`);
    list = null;
  };
  const flushTable = () => {
    if (!table) return;
    const [head, ...rows] = table;
    const th = head.map((c) => `<th>${inline(c)}</th>`).join('');
    const tr = rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('');
    out.push(`<div class="table-wrap"><table><thead><tr>${th}</tr></thead><tbody>${tr}</tbody></table></div>`);
    table = null;
  };
  const flushAll = () => { flushPara(); flushList(); flushTable(); };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) { flushAll(); continue; }

    const h = /^(#{1,3})\s+(.*)$/.exec(line);
    if (h) {
      flushAll();
      const level = h[1].length;
      const text = h[2].trim();
      if (level === 1 && !title) title = text;
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      out.push(`<h${level} id="${id}">${inline(text)}</h${level}>`);
      continue;
    }
    if (/^---+$/.test(line.trim())) { flushAll(); out.push('<hr>'); continue; }

    if (line.startsWith('|')) {
      flushPara(); flushList();
      const cells = line.split('|').slice(1, -1).map((c) => c.trim());
      if (cells.every((c) => /^:?-{2,}:?$/.test(c))) continue; // separator row
      if (!table) table = [];
      table.push(cells);
      continue;
    } else if (table) {
      flushTable();
    }

    if (/^- /.test(line)) {
      flushPara(); flushTable();
      if (!list) list = [];
      list.push(line.slice(2));
      continue;
    } else if (list) {
      flushList();
    }

    para.push(line.trim());
  }
  flushAll();
  return { title, html: out.join('\n') };
}

const CSS = `
:root{--bg:#fbf9f4;--fg:#1f1b16;--muted:#6a6158;--rule:#e3dccf;--accent:#8a6a1d;--code:#f1ebdd;--link:#5c4a12}
@media (prefers-color-scheme:dark){:root{--bg:#161310;--fg:#ece5d8;--muted:#a79d8f;--rule:#332c23;--accent:#d8b45a;--code:#262019;--link:#e3c678;color-scheme:dark}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.6 -apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;padding:0 max(16px,env(safe-area-inset-left)) 48px max(16px,env(safe-area-inset-right))}
header.site{max-width:760px;margin:0 auto;padding:20px 0 8px;display:flex;flex-wrap:wrap;gap:8px 20px;align-items:baseline;border-bottom:1px solid var(--rule)}
header.site .brand{font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);text-decoration:none}
header.site nav a{color:var(--muted);text-decoration:none;font-size:14px}
header.site nav a[aria-current]{color:var(--fg);font-weight:600}
main{max-width:760px;margin:0 auto}
h1{font-size:clamp(26px,5vw,34px);line-height:1.15;margin:28px 0 8px}
h2{font-size:21px;margin:36px 0 10px;padding-top:12px;border-top:1px solid var(--rule)}
h3{font-size:17px;margin:22px 0 6px}
p.meta{color:var(--muted);font-size:14px}
a{color:var(--link)}
code{background:var(--code);padding:1px 5px;border-radius:4px;font-size:.92em}
ul{padding-left:22px}
li{margin:4px 0}
hr{border:0;border-top:1px solid var(--rule);margin:28px 0}
.table-wrap{overflow-x:auto;margin:12px 0}
table{border-collapse:collapse;width:100%;font-size:15px}
th,td{text-align:left;vertical-align:top;padding:8px 10px;border-bottom:1px solid var(--rule)}
th{color:var(--muted);font-weight:600}
footer{max-width:760px;margin:48px auto 0;color:var(--muted);font-size:13px;border-top:1px solid var(--rule);padding-top:16px}
`;

function page({ title, html, slug }) {
  const nav = PAGES.map((p) =>
    `<a href="../${p.slug}/"${p.slug === slug ? ' aria-current="page"' : ''}>${p.nav}</a>`).join('');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)} · ${SITE_NAME}</title>
<meta name="description" content="${esc(title)} for the PhotoVibe app (ai.photovibe.app).">
<style>${CSS}</style>
</head>
<body>
<header class="site"><a class="brand" href="../">${SITE_NAME}</a><nav>${nav}</nav></header>
<main>
${html}
</main>
<footer>© ${new Date().getFullYear()} PhotoVibe · App id ai.photovibe.app</footer>
</body>
</html>
`;
}

function index() {
  const links = PAGES.map((p) => `<li><a href="./${p.slug}/">${p.nav}</a></li>`).join('');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${SITE_NAME} · Legal</title>
<style>${CSS}</style>
</head>
<body>
<header class="site"><a class="brand" href="./">${SITE_NAME}</a></header>
<main>
<h1>PhotoVibe legal pages</h1>
<p>PhotoVibe turns a single jewellery photo into an on-model product shoot. These pages govern the Android app with id <code>ai.photovibe.app</code>.</p>
<ul>${links}</ul>
<p class="meta">Support: support@photovibe.ai</p>
</main>
</body>
</html>
`;
}

for (const p of PAGES) {
  const md = fs.readFileSync(path.join(SRC, p.file), 'utf8');
  const { title, html } = render(md);
  const dir = path.join(ROOT, p.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page({ title: title || p.nav, html, slug: p.slug }));
  console.log('built', `${p.slug}/index.html`, '<-', p.file);
}
fs.writeFileSync(path.join(ROOT, 'index.html'), index());
fs.writeFileSync(path.join(ROOT, '.nojekyll'), '');
console.log('built index.html');
