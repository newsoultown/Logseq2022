#!/usr/bin/env python3
"""把有声书时间轴写进 App：python3 -I install_manifest.py index.html manifest.json url1 [url2 ...]
url 是素材库上传后的 /_blob/<id>，顺序对应 manifest 的 files。"""
import json, re, sys
html, man_path, urls = sys.argv[1], sys.argv[2], sys.argv[3:]
man = json.load(open(man_path, encoding="utf-8"))
assert len(urls) == len(man["files"]), "网址数量要和语音档数量一致"
entry = {"voice": man["voice"], "total": man["total"], "parts": urls,
         "paras": [{"h": p["h"], "k": p["k"], "s": p["s"]} for p in man["paras"]]}
s = open(html, encoding="utf-8").read()
m = re.search(r"var AUDIO=\{/\*AUDIO\*/(.*?)\};\n", s, re.S)
cur = json.loads("{" + m.group(1) + "}") if m.group(1).strip() else {}
cur[man["key"]] = entry
body = json.dumps(cur, ensure_ascii=False, separators=(",", ":"))[1:-1]
s = s[:m.start()] + "var AUDIO={/*AUDIO*/" + body + "};\n" + s[m.end():]
open(html, "w", encoding="utf-8").write(s)
print("已写入", man["key"], "共", len(cur), "本有声书")
