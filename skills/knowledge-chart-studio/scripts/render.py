#!/usr/bin/env python3
"""把图表 JSON 画成独立的 HTML（必出），可选另存高清 PNG。

用法：
  python3 scripts/render.py spec.json -o out.html
  python3 scripts/render.py spec.json -o out.html --png out.png            # 横式（讲义、Notion）
  python3 scripts/render.py spec.json -o out.html --png out.png --mobile   # 直式（手机）

HTML 内含整份引擎，单档即可打开或当 Artifact 发布。
PNG 需要浏览器：依序尝试 Python playwright、Node playwright；都没有就只出 HTML 并说明原因。
"""
import argparse, json, os, shutil, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HERE, "..", "assets")
PALETTE_BG = {"mo": "#f2efe9", "ling": "#f4f2fa"}


def build_html(spec):
    tpl = open(os.path.join(ASSETS, "template.html"), encoding="utf-8").read()
    engine = open(os.path.join(ASSETS, "engine.js"), encoding="utf-8").read()
    spec_js = json.dumps(spec, ensure_ascii=False).replace("</", "<\\/")
    return (tpl.replace("__TITLE__", spec.get("title", "知识图表"))
               .replace("__BG__", PALETTE_BG.get(spec.get("palette", "mo"), "#f2efe9"))
               .replace("__ENGINE__", engine)
               .replace("__SPEC__", spec_js))


def png_python(html_path, png_path, width):
    from playwright.sync_api import sync_playwright  # noqa
    with sync_playwright() as p:
        kw = {}
        if os.path.exists("/opt/pw-browsers/chromium"):
            kw["executable_path"] = "/opt/pw-browsers/chromium"
        b = p.chromium.launch(**kw)
        pg = b.new_page(viewport={"width": width, "height": 900}, device_scale_factor=2)
        pg.goto("file://" + os.path.abspath(html_path))
        pg.wait_for_timeout(1500)
        pg.add_style_tag(content=".kcs-zoom{display:none}")
        pg.locator("#chart").screenshot(path=png_path)
        b.close()


NODE_JS = r"""
const path=require('path');let pw;
for(const m of ['playwright','@playwright/test']){try{pw=require(m);break}catch(e){}}
if(!pw){try{pw=require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright')}catch(e){}}
if(!pw){console.error('NO_PLAYWRIGHT');process.exit(3)}
(async()=>{const fs=require('fs');const opt=fs.existsSync('/opt/pw-browsers/chromium')?{executablePath:'/opt/pw-browsers/chromium'}:{};
const b=await pw.chromium.launch(opt);const pg=await b.newPage({viewport:{width:+process.argv[4],height:900},deviceScaleFactor:2});
await pg.goto('file://'+path.resolve(process.argv[2]));await pg.waitForTimeout(1500);await pg.addStyleTag({content:'.kcs-zoom{display:none}'});
await (await pg.$('#chart')).screenshot({path:process.argv[3]});await b.close();})();
"""


def png_node(html_path, png_path, width):
    if not shutil.which("node"):
        raise RuntimeError("没有 node")
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False) as f:
        f.write(NODE_JS)
        js = f.name
    r = subprocess.run(["node", js, html_path, png_path, str(width)], capture_output=True, text=True)
    os.unlink(js)
    if r.returncode != 0:
        raise RuntimeError(r.stderr.strip()[-300:] or "node 执行失败")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("spec")
    ap.add_argument("-o", "--out", default="chart.html")
    ap.add_argument("--png")
    ap.add_argument("--mobile", action="store_true", help="以手机宽度（430px）截图；图表固定 16:9，只是整张缩小")
    ap.add_argument("--width", type=int, default=1280)
    a = ap.parse_args()

    spec = json.load(open(a.spec, encoding="utf-8"))
    open(a.out, "w", encoding="utf-8").write(build_html(spec))
    print("HTML：" + a.out)
    if not a.png:
        return
    width = (430 if a.mobile else a.width) + 32  # 页面左右各 16px 边距
    errs = []
    for fn in (png_python, png_node):
        try:
            fn(a.out, a.png, width)
            print("PNG：" + a.png)
            return
        except Exception as e:  # noqa
            errs.append(fn.__name__ + "：" + str(e)[:200])
    print("PNG 没有产生（这个环境没有可用的浏览器）。HTML 已完成，可直接发布成 Artifact。\n" + "\n".join(errs))
    sys.exit(2)


if __name__ == "__main__":
    main()
