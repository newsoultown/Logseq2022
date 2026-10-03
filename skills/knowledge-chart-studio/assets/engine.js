/* 知识图表工坊 · 出图引擎
 * 用法：KCS.render(元素, spec)。spec 是一份 JSON，格式见 references/charts.md。
 * 支持类型：mindmap logic flow cycle compare timeline matrix pyramid cards radial illus
 * 配色：mo（莫兰迪知性，预设）、ling（灵境晶光）。
 * 版面会依容器宽度自动切换：宽 ≥ 700px 用横式，窄的用直式（手机）。
 */
(function (root) {
  "use strict";

  var PAL = {
    mo:   { name: "莫兰迪知性", bg: "#f2efe9", paper: "#fdfbf8", ink: "#37332f", muted: "#6b655e", line: "#dcd5cb",
            c: ["#6f8a78", "#6f84a0", "#b67f70", "#a88f68", "#8d7d9c", "#7f9393"],
            n: ["灰绿", "灰蓝", "陶土粉", "燕麦", "雾紫", "青灰"] },
    ling: { name: "灵境晶光", bg: "#f4f2fa", paper: "#fdfcff", ink: "#2c2843", muted: "#67628a", line: "#d8d3ea",
            c: ["#7562cf", "#4f86c6", "#c4729e", "#3f9e96", "#9a7fd8", "#d1955a"],
            n: ["淡紫", "雾蓝", "珍珠粉", "青碧", "藤紫", "晨金"] }
  };

  var ICON = {
    need: '<path d="M16 27C6 20 3 14 5 9 7 4 13 4 16 9 19 4 25 4 27 9 29 14 26 20 16 27Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 9 14 14 18 17 15 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    heart: '<path d="M16 27C6 20 3 14 5 9 7 4 13 4 16 9 19 4 25 4 27 9 29 14 26 20 16 27Z" fill="currentColor" fill-opacity=".25" stroke="currentColor" stroke-width="2"/>',
    ice: '<path d="M3 13H29" stroke="currentColor" stroke-width="2"/><path d="M13 13 16 7 19 10 21 13" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 13 6 20 11 28 22 29 27 21 23 13" fill="currentColor" fill-opacity=".2" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    signal: '<circle cx="16" cy="17" r="3" fill="currentColor"/><path d="M10 11A8 8 0 0 0 10 23M22 11A8 8 0 0 1 22 23M6 7A13 13 0 0 0 6 27M26 7A13 13 0 0 1 26 27" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    body: '<circle cx="16" cy="7" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 30V18C9 13 12 11 16 11 20 11 23 13 23 18V30" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="18" cy="20" r="3" fill="currentColor"/>',
    doc: '<rect x="7" y="5" width="18" height="24" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M11 13 14 16 20 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M14 21C14 19 19 19 19 21.5 19 23 17 23 17 25M17 27.5V28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    tea: '<path d="M6 13H22V19C22 24 18 27 14 27 10 27 6 24 6 19Z" fill="currentColor" fill-opacity=".2" stroke="currentColor" stroke-width="2"/><path d="M22 15C27 15 27 21 22 21M11 9C10 7 12 6 11 4M16 9C15 7 17 6 16 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    sun: '<path d="M3 23H29" stroke="currentColor" stroke-width="2"/><path d="M8 23A8 8 0 0 1 24 23Z" fill="currentColor" fill-opacity=".3" stroke="currentColor" stroke-width="2"/><path d="M16 8V11M7 12 9 14M25 12 23 14M3 18H5M27 18H29" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    brain: '<path d="M16 6C12 4 7 6 7 11 4 12 4 17 7 19 6 23 10 27 14 25 15 27 16 27 16 27V6ZM16 6C20 4 25 6 25 11 28 12 28 17 25 19 26 23 22 27 18 25 17 27 16 27 16 27" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    people: '<circle cx="11" cy="10" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="22" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 27C3 20 7 17 11 17 15 17 19 20 19 27M18 19C19 18 21 17 22 17 26 17 29 20 29 26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    book: '<path d="M4 7C9 5 13 6 16 9 19 6 23 5 28 7V26C23 24 19 25 16 28 13 25 9 24 4 26Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M16 9V28" stroke="currentColor" stroke-width="2"/>',
    leaf: '<path d="M6 26C6 14 14 6 27 5 27 18 19 26 6 26Z" fill="currentColor" fill-opacity=".2" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M6 26 19 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    key: '<circle cx="10" cy="16" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 16H28M24 16V21M28 16V20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    eye: '<path d="M3 16C7 9 11 7 16 7 21 7 25 9 29 16 25 23 21 25 16 25 11 25 7 23 3 16Z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="16" cy="16" r="4" fill="currentColor"/>',
    star: '<path d="M16 4 19.5 12 28 12.8 21.5 18.5 23.5 27 16 22.5 8.5 27 10.5 18.5 4 12.8 12.5 12Z" fill="currentColor" fill-opacity=".25" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    lotus: '<path d="M16 26C10 22 9 16 16 7 23 16 22 22 16 26ZM16 26C9 26 4 22 3 15 9 15 13 19 16 26ZM16 26C23 26 28 22 29 15 23 15 19 19 16 26Z" fill="currentColor" fill-opacity=".2" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>'
  };

  var CSS = '' +
  '.kcs-frame{position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;border-radius:14px;background:var(--bg)}' +
  '.kcs-stage{position:absolute;left:0;top:0;width:1280px;height:720px;transform-origin:0 0}' +
  '.kcs.kcs-169{width:1280px;height:720px;border-radius:0;padding:40px 56px 30px;font-size:21px;display:flex;flex-direction:column}' +
  '.kcs-169 .kcs-h{margin-bottom:12px;flex:none}.kcs-169 .kcs-t{font-size:1.75em}.kcs-169 .kcs-s{font-size:.95em}' +
  '.kcs-169 .kcs-body{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;overflow:hidden}.kcs-169 .kcs-bi{flex:none;transform-origin:center center}' +
  '.kcs-169 .kcs-take{margin-top:12px;flex:none;font-size:1.05em;padding:10px 16px}.kcs-169 .kcs-src{margin-top:6px;flex:none;font-size:.75em}' +
  '.kcs-169 .kcs-fig svg{max-height:470px}.kcs-169 .kcs-split{gap:40px}' +
  '.kcs-169 .kcs-side{gap:12px}.kcs-169 .kcs-kids{gap:5px}.kcs-169 .kcs-kid{padding:2px 12px}.kcs-169 .kcs-bn{padding:6px 14px}.kcs-169 .kcs-br{gap:22px}' +
  '.kcs-169 .kcs-ol.v{gap:12px}.kcs-169 .kcs-ol.v li{align-items:center}.kcs-169 .kcs-ol.v b{display:inline;margin-right:.6em}.kcs-169 .kcs-ol.v div span{display:inline}' +
  '.kcs-169 .kcs-tl{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:20px;border-left:none;border-top:3px solid var(--line);padding:30px 0 0;margin-top:14px}' +
  '.kcs-169 .kcs-tl li::before{left:0;top:-41px}' +
  '.kcs-zoom{position:absolute;right:10px;bottom:10px;border:1px solid var(--line);background:var(--paper);color:var(--ink);border-radius:999px;padding:4px 12px;font:600 13px/1.4 "Noto Sans SC",sans-serif;cursor:pointer;opacity:.85}.kcs-zoom:hover,.kcs-zoom:focus-visible{opacity:1}' +
  '.kcs-ov{position:fixed;inset:0;z-index:9999;background:rgba(20,18,24,.86);display:grid;place-items:center;align-content:center;gap:10px;padding:12px}.kcs-ovbox{max-width:100%}.kcs-ovtip{color:#ddd;font:14px "Noto Sans SC",sans-serif;margin:0}' +
  '.kcs{--bg:#f2efe9;background:var(--bg);color:var(--ink);font-family:"Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif;font-size:16px;line-height:1.7;padding:clamp(18px,3.5vw,40px);border-radius:16px;box-sizing:border-box}' +
  '.kcs *{box-sizing:border-box}' +
  '.kcs-h{margin-bottom:22px}' +
  '.kcs-t{font-family:"Noto Serif SC","Songti SC",serif;font-weight:900;font-size:clamp(1.6em,3.6vw,2.1em);line-height:1.25;margin:0 0 4px;text-wrap:balance}' +
  '.kcs-s{color:var(--muted);margin:0;font-size:1.02em}' +
  '.kcs-take{margin-top:24px;padding:13px 18px;border-left:5px solid var(--c1);background:color-mix(in srgb,var(--c1) 11%,var(--paper));font-weight:700;font-size:1.15em;border-radius:0 8px 8px 0}' +
  '.kcs-src{margin-top:14px;color:var(--muted);font-size:.85em}' +
  '.kcs svg{display:block;width:100%;height:auto}' +
  /* mindmap */
  '.kcs-mm{position:relative}.kcs-mm>svg.w{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible}' +
  '.kcs-mmg{position:relative;display:grid;grid-template-columns:1fr auto 1fr;gap:18px 40px;align-items:center}' +
  '.kcs-side{display:grid;gap:20px}.kcs-br{display:flex;align-items:center;gap:28px}.kcs-side.l .kcs-br{flex-direction:row-reverse}' +
  '.kcs-bn{flex:none;border:2.5px solid var(--c);background:color-mix(in srgb,var(--c) 13%,var(--paper));color:color-mix(in srgb,var(--c) 68%,var(--ink));font-weight:700;font-size:1.15em;border-radius:12px;padding:8px 16px;white-space:nowrap}' +
  '.kcs-kids{display:grid;gap:8px}.kcs-side.l .kcs-kids{justify-items:end}' +
  '.kcs-kid{border:1.6px solid color-mix(in srgb,var(--c) 70%,var(--paper));background:var(--paper);border-radius:8px;padding:3px 12px;white-space:nowrap}' +
  '.kcs-hub{background:var(--ink);color:var(--paper);font-family:"Noto Serif SC",serif;font-weight:900;font-size:1.45em;border-radius:16px;padding:16px 22px;text-align:center;line-height:1.3;border:3px double var(--paper);box-shadow:0 0 0 3px var(--ink)}' +
  '.kcs.narrow .kcs-mmg{grid-template-columns:1fr;gap:16px}.kcs.narrow .kcs-hub{justify-self:start;order:-1}.kcs.narrow .kcs-side{gap:14px}' +
  '.kcs.narrow .kcs-br,.kcs.narrow .kcs-side.l .kcs-br{flex-direction:column;align-items:flex-start;gap:8px}.kcs.narrow .kcs-side.l .kcs-kids{justify-items:start}' +
  '.kcs.narrow .kcs-kids{padding-left:16px;border-left:2.5px solid color-mix(in srgb,var(--c) 50%,var(--paper));margin-left:14px}.kcs.narrow .kcs-mm>svg.w{display:none}' +
  /* flow */
  '.kcs-fl{display:grid;grid-auto-flow:column;grid-auto-columns:1fr}.kcs-fs{display:grid;justify-items:center;gap:10px;text-align:center;min-width:0}' +
  '.kcs-rib{width:100%;min-height:84px;display:grid;place-items:center;color:#fff;font-weight:700;font-size:1.08em;line-height:1.3;clip-path:polygon(0 0,86% 0,100% 50%,86% 100%,0 100%,14% 50%);background:linear-gradient(135deg,color-mix(in srgb,var(--c) 75%,#fff),var(--c) 60%,color-mix(in srgb,var(--c) 80%,#000));padding:6px 16% 6px 18%}' +
  '.kcs-fs:first-child .kcs-rib{clip-path:polygon(0 0,86% 0,100% 50%,86% 100%,0 100%);padding-left:8%}' +
  '.kcs-ico{width:58px;height:58px;border-radius:50%;background:var(--paper);border:2px solid var(--c);color:var(--c);display:grid;place-items:center}.kcs-ico svg{width:32px;height:32px}' +
  '.kcs-fs p{margin:0;color:var(--muted);line-height:1.5;padding:0 6px}' +
  '.kcs.narrow .kcs-fl{grid-auto-flow:row;gap:8px}.kcs.narrow .kcs-fs{grid-template-columns:64px 1fr;justify-items:start;text-align:left;align-items:center;column-gap:12px}' +
  '.kcs.narrow .kcs-rib,.kcs.narrow .kcs-fs:first-child .kcs-rib{grid-column:1/-1;min-height:54px;clip-path:polygon(0 0,100% 0,100% 72%,52% 100%,48% 100%,0 72%);padding:4px 0 10px}' +
  /* list (cycle/radial 窄版、通用编号列表) */
  '.kcs-split{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:clamp(18px,3vw,36px);align-items:center}.kcs-fig svg{max-height:500px;margin:0 auto}' +
  '.kcs.narrow .kcs-split{grid-template-columns:1fr;gap:14px}.kcs.narrow .kcs-fig svg{max-width:400px}' +
  '.kcs-ol.v{grid-template-columns:1fr;margin:0;gap:14px}.kcs-ol.v b{font-size:1.15em}.kcs-ol.v span{font-size:1.02em}' +
  '.kcs-note{margin-top:18px;border:2px solid var(--c1);border-radius:12px;padding:12px 16px;background:color-mix(in srgb,var(--c1) 8%,var(--paper))}.kcs-note b{display:block;font-size:1.12em}.kcs-note span{color:var(--muted)}' +
  '.kcs-ol{list-style:none;margin:18px 0 0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}' +
  '.kcs-ol li{display:grid;grid-template-columns:34px 1fr;gap:10px;align-items:start}.kcs-ol .n{width:32px;height:32px;border-radius:50%;background:var(--c);color:#fff;display:grid;place-items:center;font-weight:700;font-variant-numeric:tabular-nums}' +
  '.kcs-ol b{display:block;font-size:1.08em}.kcs-ol span{color:var(--muted)}' +
  /* compare */
  '.kcs-cmp{display:grid;grid-template-columns:1fr auto 1fr;gap:16px;align-items:stretch}.kcs-cmp>div{border:2.5px solid var(--c);border-radius:14px;padding:16px 18px;background:color-mix(in srgb,var(--c) 8%,var(--paper));min-width:0}' +
  '.kcs-cmp h4{margin:0 0 8px;font-size:1.25em;color:color-mix(in srgb,var(--c) 70%,var(--ink))}.kcs-cmp ul{margin:0;padding-left:1.1em;display:grid;gap:6px}' +
  '.kcs-vs{align-self:center;font-family:"Noto Serif SC",serif;font-weight:900;font-size:1.4em;color:var(--muted)}' +
  '.kcs.narrow .kcs-cmp{grid-template-columns:1fr}.kcs.narrow .kcs-vs{justify-self:center}' +
  /* timeline */
  '.kcs-tl{list-style:none;margin:0;padding:0 0 0 22px;border-left:3px solid var(--line);display:grid;gap:18px}.kcs-tl li{position:relative}' +
  '.kcs-tl li::before{content:"";position:absolute;left:-33px;top:5px;width:18px;height:18px;border-radius:50%;background:var(--c);box-shadow:0 0 0 4px var(--bg)}' +
  '.kcs-tl em{font-style:normal;font-weight:700;color:var(--c);display:block}.kcs-tl b{display:block;font-size:1.12em}.kcs-tl span{color:var(--muted)}' +
  /* matrix */
  '.kcs-mx{display:grid;grid-template-columns:1fr 1fr;gap:10px}' +
  '.kcs-mx .q{border:2.5px solid var(--c);border-radius:14px;padding:14px 16px;background:color-mix(in srgb,var(--c) 9%,var(--paper));min-width:0}.kcs-mx .q b{display:block;font-size:1.12em;color:color-mix(in srgb,var(--c) 70%,var(--ink));margin-bottom:4px}' +
  '.kcs-mx .ay{grid-column:1/-1;color:var(--muted);font-weight:700}.kcs-mx .ax{grid-column:1/-1;text-align:right;color:var(--muted);font-weight:700}' +
  /* pyramid */
  '.kcs-py{display:grid;justify-items:center;gap:6px}.kcs-py>div{color:#fff;text-align:center;padding:10px 14px;border-radius:6px;background:linear-gradient(135deg,color-mix(in srgb,var(--c) 80%,#fff),color-mix(in srgb,var(--c) 85%,#000))}' +
  '.kcs-py b{display:block;font-size:1.12em}.kcs-py span{display:block;font-size:.95em;opacity:.92}' +
  /* cards */
  '.kcs-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}' +
  '.kcs-card{border:2.5px solid var(--c);border-radius:14px;padding:16px;background:var(--paper);display:grid;grid-template-columns:auto 1fr;gap:12px;align-items:start}' +
  '.kcs-card b{display:block;font-size:1.15em;color:color-mix(in srgb,var(--c) 70%,var(--ink))}.kcs-card span{color:var(--muted)}' +
  /* illus */
  '.kcs-il{position:relative;border-radius:12px;overflow:hidden;background:#fff}.kcs-il img{display:block;width:100%;height:auto}' +
  '.kcs-lab{position:absolute;transform:translate(-50%,-50%);background:var(--paper);border:2px solid var(--c);color:var(--ink);border-radius:999px;padding:3px 12px;font-weight:700;font-size:clamp(13px,1.6vw,17px);white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,.08)}' +
  '.kcs-cap{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;margin-top:14px}.kcs-cap div{border-top:3px solid var(--c);padding-top:6px}.kcs-cap b{display:block}.kcs-cap span{color:var(--muted)}';

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function mix(h1, h2, t) { var a = parseInt(h1.slice(1), 16), b = parseInt(h2.slice(1), 16); function r(s) { return Math.round(((a >> s) & 255) * t + ((b >> s) & 255) * (1 - t)); } return "rgb(" + r(16) + "," + r(8) + "," + r(0) + ")"; }
  function icon(name, cls) { var p = ICON[name]; return p ? '<svg class="' + (cls || "") + '" viewBox="0 0 32 32" aria-hidden="true">' + p + "</svg>" : ""; }
  function cvar(i) { return "var(--c" + ((i % 6) + 1) + ")"; }

  function injectCSS() {
    if (document.getElementById("kcs-css")) return;
    var s = document.createElement("style"); s.id = "kcs-css"; s.textContent = CSS; document.head.appendChild(s);
  }
  function applyPalette(el, key) {
    var p = PAL[key] || PAL.mo;
    el.style.setProperty("--bg", p.bg); el.style.setProperty("--paper", p.paper); el.style.setProperty("--ink", p.ink);
    el.style.setProperty("--muted", p.muted); el.style.setProperty("--line", p.line);
    p.c.forEach(function (c, i) { el.style.setProperty("--c" + (i + 1), c); });
    return p;
  }

  /* ---------- 立体圆球（logic / cycle / radial 共用） ---------- */
  function sphere(uid, x, y, r, color, lines, fs) {
    var g = "sg" + uid, s = '<defs><radialGradient id="' + g + '" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="' + mix(color, "#ffffff", .45) + '"/><stop offset=".55" stop-color="' + color + '"/><stop offset="1" stop-color="' + mix(color, "#000000", .7) + '"/></radialGradient></defs>';
    s += '<circle cx="' + x + '" cy="' + y + '" r="' + (r + 14) + '" fill="' + color + '" fill-opacity=".08" stroke="' + color + '" stroke-opacity=".35" stroke-dasharray="3 6"/>';
    s += '<circle cx="' + x + '" cy="' + (y + 9) + '" r="' + r + '" fill="#000" opacity=".12" filter="url(#kcsblur)"/>';
    s += '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="url(#' + g + ')"/>';
    s += '<ellipse cx="' + (x - r * .28) + '" cy="' + (y - r * .5) + '" rx="' + (r * .38) + '" ry="' + (r * .17) + '" fill="#fff" opacity=".28"/>';
    var n = lines.length, lh = fs * 1.25, y0 = y - (n - 1) * lh / 2 + fs * .35;
    lines.forEach(function (ln, i) {
      var big = i === (ln.main ? i : -1);
      s += '<text x="' + x + '" y="' + (y0 + i * lh) + '" text-anchor="middle" font-family="Noto Sans SC,sans-serif" font-weight="' + (ln.w || 700) + '" font-size="' + (ln.s || fs) + '" fill="#fff" fill-opacity="' + (ln.o || 1) + '">' + esc(ln.t) + "</text>";
    });
    return s;
  }
  var BLUR = '<defs><filter id="kcsblur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="10"/></filter></defs>';

  /* ---------- 各类型 ---------- */
  var R = {};

  R.mindmap = function (d, el, ctx) {
    var br = d.branches || [], half = Math.ceil(br.length / 2);
    function one(b, i) { return '<div class="kcs-br" style="--c:' + cvar(i) + '"><div class="kcs-bn">' + esc(b.label) + '</div><div class="kcs-kids">' + (b.children || []).map(function (k) { return '<div class="kcs-kid">' + esc(k) + "</div>"; }).join("") + "</div></div>"; }
    var html = '<div class="kcs-mm"><svg class="w" aria-hidden="true"></svg><div class="kcs-mmg"><div class="kcs-side l">' + br.slice(0, half).map(one).join("") + '</div><div class="kcs-hub">' + esc(d.center || d.title).replace(/\n/g, "<br>") + '</div><div class="kcs-side r">' + br.slice(half).map(function (b, i) { return one(b, i + half); }).join("") + "</div></div></div>";
    ctx.after.push(function () { mmWires(el, half); });
    return html;
  };
  function curve(x1, y1, x2, y2, c, w) { var mx = (x1 + x2) / 2; return '<path d="M' + x1 + " " + y1 + " C" + mx + " " + y1 + " " + mx + " " + y2 + " " + x2 + " " + y2 + '" fill="none" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round"/>'; }
  /* 用版面座标（offset）算连线，图在 16:9 舞台里被缩放时也不会歪 */
  function relPos(e, anc) { var x = 0, y = 0; while (e && e !== anc) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; } return { x: x, y: y }; }
  function box(e, anc) { var p = relPos(e, anc); return { l: p.x, t: p.y, r: p.x + e.offsetWidth, b: p.y + e.offsetHeight, cy: p.y + e.offsetHeight / 2 }; }
  function mmWires(el, half) {
    var mm = el.querySelector(".kcs-mm"); if (!mm) return; var sv = mm.querySelector("svg.w"); if (getComputedStyle(sv).display === "none") return;
    var hub = box(mm.querySelector(".kcs-hub"), mm), h = "", cs = getComputedStyle(el);
    sv.setAttribute("viewBox", "0 0 " + mm.offsetWidth + " " + mm.offsetHeight);
    mm.querySelectorAll(".kcs-br").forEach(function (b, i) {
      var left = i < half, c = cs.getPropertyValue("--c" + ((i % 6) + 1)).trim(), bn = box(b.querySelector(".kcs-bn"), mm);
      h += curve(left ? hub.l : hub.r, hub.cy, left ? bn.r : bn.l, bn.cy, c, 2.6);
      b.querySelectorAll(".kcs-kid").forEach(function (k) { var r = box(k, mm); h += curve(left ? bn.l : bn.r, bn.cy, left ? r.r : r.l, r.cy, c, 1.6); });
    });
    sv.innerHTML = h;
  }

  R.logic = function (d, el, ctx) {
    var it = d.items || [], p = ctx.pal, n = it.length, s;
    if (n === 3) {
      var pts = [[260, 118], [138, 326], [382, 326]];
      s = '<svg viewBox="0 0 520 452" role="img" aria-label="' + esc(d.title) + '">' + BLUR;
      s += '<circle cx="260" cy="257" r="150" fill="' + p.c[0] + '" fill-opacity=".07"/>';
      s += '<text x="260" y="268" text-anchor="middle" font-family="Noto Serif SC,serif" font-weight="900" font-size="30" fill="' + p.ink + '">' + esc(d.center || "") + "</text>";
      it.forEach(function (x, i) { s += sphere("l" + i, pts[i][0], pts[i][1], 96, p.c[i % 6], [{ t: "0" + (i + 1), s: 22, w: 900, o: .85 }, { t: x.title, s: x.title.length > 4 ? 24 : 28 }], 26); });
      s += "</svg>";
    } else {
      var W = 540, cx = 270, cy = 270, RR = 186;
      s = '<svg viewBox="0 0 ' + W + " " + W + '" role="img" aria-label="' + esc(d.title) + '">' + BLUR;
      it.forEach(function (x, i) { var a = -Math.PI / 2 + i * 2 * Math.PI / n; s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + Math.cos(a) * RR) + '" y2="' + (cy + Math.sin(a) * RR) + '" stroke="' + p.c[i % 6] + '" stroke-width="2" stroke-dasharray="4 6" opacity=".7"/>'; });
      s += sphere("hub", cx, cy, 78, p.ink, [{ t: d.center || "", s: (d.center || "").length > 3 ? 24 : 28, w: 900 }], 26);
      it.forEach(function (x, i) { var a = -Math.PI / 2 + i * 2 * Math.PI / n; s += sphere("o" + i, cx + Math.cos(a) * RR, cy + Math.sin(a) * RR, 66, p.c[i % 6], [{ t: x.title, s: x.title.length > 3 ? 21 : 25 }], 24); });
      s += "</svg>";
    }
    var side = sideList(it.map(function (x) { return { label: x.title, desc: x.sub }; }));
    if (d.note && n === 3) side += '<div class="kcs-note"><b>' + esc(String(d.note.title || "").replace(/\n/g, "")) + "</b>" + (d.note.sub ? "<span>" + esc(d.note.sub) + "</span>" : "") + "</div>";
    return split(s, side);
  };
  function split(fig, side) { return '<div class="kcs-split"><div class="kcs-fig">' + fig + '</div><div class="kcs-aside">' + side + "</div></div>"; }
  function sideList(items) {
    return '<ol class="kcs-ol v">' + items.map(function (x, i) { return '<li style="--c:' + cvar(i) + '"><span class="n">' + (i + 1) + "</span><div><b>" + esc(x.label) + "</b>" + (x.desc ? "<span>" + esc(x.desc) + "</span>" : "") + "</div></li>"; }).join("") + "</ol>";
  }
  function noteText(x, y, note, p, fs) {
    var lines = String(note.title || "").split("\n"), s = "";
    lines.forEach(function (l, i) { s += '<text x="' + x + '" y="' + (y + i * (fs + 12)) + '" text-anchor="middle" font-family="Noto Sans SC,sans-serif" font-weight="700" font-size="' + fs + '" fill="' + p.ink + '">' + esc(l) + "</text>"; });
    if (note.sub) s += '<text x="' + x + '" y="' + (y + lines.length * (fs + 12) + 4) + '" text-anchor="middle" font-family="Noto Sans SC,sans-serif" font-size="17" fill="' + p.muted + '">' + esc(note.sub) + "</text>";
    return s;
  }
  function listHTML(items) {
    return '<ol class="kcs-ol">' + items.map(function (x, i) { return '<li style="--c:' + cvar(i) + '"><span class="n">' + (i + 1) + "</span><div><b>" + esc(x.label) + "</b>" + (x.desc ? "<span>" + esc(x.desc) + "</span>" : "") + "</div></li>"; }).join("") + "</ol>";
  }

  R.flow = function (d) {
    return '<div class="kcs-fl">' + (d.steps || []).map(function (x, i) { return '<div class="kcs-fs" style="--c:' + cvar(i) + '"><div class="kcs-rib">' + esc(x.label) + '</div><div class="kcs-ico">' + icon(x.icon || "star") + "</div>" + (x.desc ? "<p>" + esc(x.desc) + "</p>" : "") + "</div>"; }).join("") + "</div>";
  };

  R.cycle = function (d, el, ctx) {
    var st = d.steps || [], n = st.length, p = ctx.pal, W = 540, cx = 270, cy = 270, RR = 180, r = 70;
    var s = '<svg viewBox="0 0 ' + W + " " + W + '" role="img" aria-label="' + esc(d.title) + '">' + BLUR + '<defs><marker id="kcsar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z" fill="' + p.muted + '"/></marker></defs>';
    st.forEach(function (x, i) {
      var a = -Math.PI / 2 + i * 2 * Math.PI / n, a2 = -Math.PI / 2 + (i + 1) * 2 * Math.PI / n, off = (r + 16) / RR;
      var sx = cx + Math.cos(a + off) * RR, sy = cy + Math.sin(a + off) * RR, ex = cx + Math.cos(a2 - off) * RR, ey = cy + Math.sin(a2 - off) * RR;
      s += '<path d="M' + sx + " " + sy + " A " + RR + " " + RR + " 0 0 1 " + ex + " " + ey + '" fill="none" stroke="' + p.muted + '" stroke-width="2.4" marker-end="url(#kcsar)"/>';
    });
    if (d.center) s += '<text x="' + cx + '" y="' + (cy + 11) + '" text-anchor="middle" font-family="Noto Serif SC,serif" font-weight="900" font-size="' + (d.center.length > 4 ? 26 : 32) + '" fill="' + p.ink + '">' + esc(d.center) + "</text>";
    st.forEach(function (x, i) { var a = -Math.PI / 2 + i * 2 * Math.PI / n; s += sphere("c" + i, cx + Math.cos(a) * RR, cy + Math.sin(a) * RR, r, p.c[i % 6], [{ t: x.label, s: x.label.length > 3 ? 21 : 25 }], 24); });
    s += "</svg>";
    return split(s, sideList(st));
  };

  R.compare = function (d) {
    function side(x, i) { return '<div style="--c:' + cvar(i) + '"><h4>' + esc(x.label) + "</h4><ul>" + (x.points || []).map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul></div>"; }
    return '<div class="kcs-cmp">' + side(d.left || {}, 0) + '<span class="kcs-vs">' + esc(d.vs || "VS") + "</span>" + side(d.right || {}, 2) + "</div>";
  };

  R.timeline = function (d) {
    return '<ol class="kcs-tl">' + (d.events || []).map(function (x, i) { return '<li style="--c:' + cvar(i) + '"><em>' + esc(x.time) + "</em><b>" + esc(x.label) + "</b>" + (x.desc ? "<span>" + esc(x.desc) + "</span>" : "") + "</li>"; }).join("") + "</ol>";
  };

  R.matrix = function (d) {
    var q = d.quadrants || [];
    function cell(k) { var x = q[k] || {}; return '<div class="q" style="--c:' + cvar(k) + '"><b>' + esc(x.label) + "</b>" + (x.items || []).map(function (c) { return "<div>· " + esc(c) + "</div>"; }).join("") + "</div>"; }
    return '<div class="kcs-mx"><div class="ay">↑ 纵轴：' + esc(d.y || "") + "</div>" + cell(0) + cell(1) + cell(2) + cell(3) + '<div class="ax">横轴：' + esc(d.x || "") + " →</div></div>";
  };

  R.pyramid = function (d) {
    var L = d.levels || [], n = L.length;
    return '<div class="kcs-py">' + L.map(function (x, i) { var w = n > 1 ? 38 + i * (62 / (n - 1)) : 100; return '<div style="--c:' + cvar(i) + ';width:' + w + '%"><b>' + esc(x.label) + "</b>" + (x.desc ? "<span>" + esc(x.desc) + "</span>" : "") + "</div>"; }).join("") + "</div>";
  };

  R.cards = function (d) {
    return '<div class="kcs-cards">' + (d.items || []).map(function (x, i) { return '<div class="kcs-card" style="--c:' + cvar(i) + '"><div class="kcs-ico">' + icon(x.icon || "star") + "</div><div><b>" + esc(x.label) + "</b>" + (x.desc ? "<span>" + esc(x.desc) + "</span>" : "") + "</div></div>"; }).join("") + "</div>";
  };

  R.radial = function (d, el, ctx) {
    var it = d.items || [], n = it.length, p = ctx.pal, W = 560, cx = 280, cy = 280, RR = 200;
    var s = '<svg viewBox="0 0 ' + W + " " + W + '" role="img" aria-label="' + esc(d.title) + '">' + BLUR;
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + RR + '" fill="none" stroke="' + p.line + '" stroke-width="1.5" stroke-dasharray="3 6"/>';
    it.forEach(function (x, i) { var a = -Math.PI / 2 + i * 2 * Math.PI / n, lb = x.short || x.label; s += sphere("r" + i, cx + Math.cos(a) * RR, cy + Math.sin(a) * RR, 58, p.c[i % 6], [{ t: lb, s: lb.length > 3 ? 19 : lb.length > 2 ? 22 : 26 }], 22); });
    s += sphere("rc", cx, cy, 82, p.ink, [{ t: d.center || "", s: (d.center || "").length > 3 ? 25 : 30, w: 900 }], 26);
    s += "</svg>";
    return split(s, sideList(it));
  };

  R.illus = function (d) {
    var h = '<div class="kcs-il"><img src="' + esc(d.image) + '" alt="' + esc(d.alt || d.title || "插画") + '">';
    (d.labels || []).forEach(function (l, i) { h += '<span class="kcs-lab" style="--c:' + cvar(i) + ";left:" + (+l.x) + "%;top:" + (+l.y) + '%">' + esc(l.text) + "</span>"; });
    h += "</div>";
    if (d.captions && d.captions.length) h += '<div class="kcs-cap">' + d.captions.map(function (c, i) { return '<div style="--c:' + cvar(i) + '"><b>' + esc(c.label) + "</b>" + (c.desc ? "<span>" + esc(c.desc) + "</span>" : "") + "</div>"; }).join("") + "</div>";
    return h;
  };

  /* ---------- 主入口 ----------
   * 预设固定 16:9：在 1280×720 的舞台上排版，再整张等比缩放到容器宽度；内容超出舞台时自动缩小塞进去。
   * spec.aspect = "fluid" 时改用旧的自适应版面（宽横排、窄直排）。
   * 点图表可放大成全屏检视。
   */
  var SW = 1280, SH = 720;
  function inner(spec, el, ctx) {
    var fn = R[spec.type];
    if (!fn) return '<p class="kcs-s">不支持的图表类型：' + esc(spec.type) + "</p>";
    var head = (spec.title || spec.subtitle) ? '<div class="kcs-h">' + (spec.title ? '<p class="kcs-t">' + esc(spec.title) + "</p>" : "") + (spec.subtitle ? '<p class="kcs-s">' + esc(spec.subtitle) + "</p>" : "") + "</div>" : "";
    var body = fn(spec, el, ctx), foot = (spec.takeaway ? '<p class="kcs-take">' + esc(spec.takeaway) + "</p>" : "") + (spec.source ? '<p class="kcs-src">来源：' + esc(spec.source) + "</p>" : "");
    return { head: head, body: body, foot: foot };
  }
  function render(el, spec, opt) {
    injectCSS(); opt = opt || {};
    var pal = applyPalette(el, spec.palette), half = Math.ceil((spec.branches || []).length / 2);
    if (spec.aspect === "fluid") {
      el.classList.add("kcs");
      var draw = function () {
        var narrow = el.clientWidth < 700; el.classList.toggle("narrow", narrow);
        var ctx = { pal: pal, narrow: narrow, after: [] }, x = inner(spec, el, ctx);
        el.innerHTML = typeof x === "string" ? x : x.head + x.body + x.foot;
        ctx.after.forEach(function (f) { f(); });
      };
      draw();
      var last = el.clientWidth < 700, t;
      if (root.ResizeObserver) new ResizeObserver(function () { clearTimeout(t); t = setTimeout(function () { var nw = el.clientWidth < 700; if (nw !== last) { last = nw; draw(); } else if (spec.type === "mindmap") mmWires(el, half); }, 100); }).observe(el);
      return;
    }
    el.classList.add("kcs-frame");
    var ctx = { pal: pal, narrow: false, after: [] }, x = inner(spec, el, ctx);
    el.innerHTML = '<div class="kcs-stage"><div class="kcs kcs-169">' + (typeof x === "string" ? x : x.head + '<div class="kcs-body"><div class="kcs-bi">' + x.body + "</div></div>" + x.foot) + "</div></div>" +
      (opt.noZoom ? "" : '<button class="kcs-zoom" aria-label="放大检视">⤢ 放大</button>');
    var stage = el.querySelector(".kcs-stage"), card = stage.firstChild;
    function fitInner() {
      var bd = card.querySelector(".kcs-body"), bi = card.querySelector(".kcs-bi"); if (!bd || !bi) return;
      var bw = bd.clientWidth, bh = bd.clientHeight, k = 1;
      bi.style.transform = "";
      for (var it = 0; it < 4; it++) { bi.style.width = (bw / k) + "px"; k = Math.max(.45, Math.min(1.3, bh / bi.offsetHeight)); }
      bi.style.width = (bw / k) + "px";
      if (Math.abs(k - 1) > .02) bi.style.transform = "scale(" + k.toFixed(3) + ")";
      ctx.after.forEach(function (f) { f(); });
    }
    function fit() { var k = el.clientWidth / SW; stage.style.transform = "scale(" + k + ")"; }
    ctx.after.forEach(function (f) { f(); });
    fitInner(); fit();
    if (root.ResizeObserver) new ResizeObserver(fit).observe(el);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fitInner(); });
    var zb = el.querySelector(".kcs-zoom");
    if (zb) zb.onclick = function (e) { e.stopPropagation(); zoom(spec); };
  }
  function zoom(spec) {
    var ov = document.createElement("div"); ov.className = "kcs-ov";
    var vw = innerWidth, vh = innerHeight, w = Math.min(vw - 24, (vh - 70) * 16 / 9);
    ov.innerHTML = '<div class="kcs-ovbox" style="width:' + w + 'px"></div><p class="kcs-ovtip">' + (vw < vh ? "把手机横过来看会更大　·　" : "") + "点任何地方关闭</p>";
    document.body.appendChild(ov); render(ov.firstChild, spec, { noZoom: true });
    ov.onclick = function () { ov.remove(); };
  }

  root.KCS = { render: render, palettes: PAL, icons: Object.keys(ICON) };
})(typeof window !== "undefined" ? window : this);
