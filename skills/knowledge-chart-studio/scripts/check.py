#!/usr/bin/env python3
"""出图前自检：检查图表 JSON 是否符合使用者的铁律。

用法：python3 scripts/check.py spec.json
有「错误」就先改 JSON 再出图；「提醒」可以斟酌。退出码：0 通过、1 有错误。
"""
import json, sys

TYPES = {"mindmap", "logic", "flow", "cycle", "compare", "timeline", "matrix", "pyramid", "cards", "radial", "illus"}
PALETTES = {"mo", "ling"}
# 常见繁体字（出现就提醒改简体；书名、引文原文可保留）
TRAD = set("緒對與這們學習問題關係東頭電腦氣體會來為過國說時發經點現開動實讓應還進後總覺識處應壓變寫實際認幾種從麼樣歡")

errs, warns = [], []


def L(s):
    return len(str(s or ""))


def label(where, s, hard=6, soft=None):
    n = L(s)
    if n == 0:
        errs.append(f"{where}：是空的")
    elif n > hard:
        (errs if soft is None or n > soft else warns).append(f"{where}「{s}」有 {n} 个字，上限 {hard}")


def desc(where, s, lim=14):
    if L(s) > lim:
        warns.append(f"{where}「{s}」有 {L(s)} 个字，建议 {lim} 字内")


def count(where, arr, lo, hi):
    n = len(arr or [])
    if n < lo or n > hi:
        errs.append(f"{where}：有 {n} 项，应为 {lo}–{hi} 项")


def walk_text(o, out):
    if isinstance(o, str):
        out.append(o)
    elif isinstance(o, dict):
        for k, v in o.items():
            if k not in ("image", "source"):
                walk_text(v, out)
    elif isinstance(o, list):
        for v in o:
            walk_text(v, out)


def main():
    d = json.load(open(sys.argv[1], encoding="utf-8"))
    t = d.get("type")
    if t not in TYPES:
        errs.append(f"type「{t}」不支持，可用：{'、'.join(sorted(TYPES))}")
    if d.get("palette", "mo") not in PALETTES:
        errs.append("palette 只能是 mo（莫兰迪知性）或 ling（灵境晶光）")
    if not d.get("title"):
        warns.append("没有 title（图表标题）")
    if L(d.get("title")) > 18:
        warns.append(f"标题有 {L(d.get('title'))} 个字，建议 18 字内")
    if d.get("takeaway") and L(d["takeaway"]) > 24:
        warns.append(f"takeaway 有 {L(d['takeaway'])} 个字，建议一句话、24 字内")

    if t == "mindmap":
        label("中心", d.get("center") or d.get("title"), 8)
        count("分支", d.get("branches"), 2, 8)
        for i, b in enumerate(d.get("branches") or []):
            label(f"分支{i+1}", b.get("label"))
            count(f"分支{i+1}的子节点", b.get("children"), 1, 5)
            for k in b.get("children") or []:
                label(f"分支{i+1}子节点", k, 6, 8)
    elif t == "logic":
        count("项目", d.get("items"), 3, 6)
        label("中心", d.get("center"), 4)
        for i, x in enumerate(d.get("items") or []):
            label(f"项目{i+1}标题", x.get("title"), 4 if len(d.get("items") or []) > 3 else 5)
            desc(f"项目{i+1}说明", x.get("sub"), 6)
    elif t in ("flow", "cycle"):
        count("步骤", d.get("steps"), 3, 6 if t == "cycle" else 6)
        for i, x in enumerate(d.get("steps") or []):
            label(f"步骤{i+1}", x.get("label"), 5 if t == "flow" else 4, 6)
            desc(f"步骤{i+1}说明", x.get("desc"), 10)
    elif t == "compare":
        for side in ("left", "right"):
            s = d.get(side) or {}
            label(f"{side} 标题", s.get("label"))
            count(f"{side} 要点", s.get("points"), 2, 6)
            for p in s.get("points") or []:
                desc(f"{side} 要点", p, 16)
    elif t == "timeline":
        count("事件", d.get("events"), 3, 8)
        for i, x in enumerate(d.get("events") or []):
            label(f"事件{i+1}", x.get("label"), 8, 10)
            desc(f"事件{i+1}说明", x.get("desc"), 20)
    elif t == "matrix":
        count("象限", d.get("quadrants"), 4, 4)
        for i, q in enumerate(d.get("quadrants") or []):
            label(f"象限{i+1}", q.get("label"))
            count(f"象限{i+1}项目", q.get("items"), 1, 4)
    elif t == "pyramid":
        count("层级", d.get("levels"), 3, 6)
        for i, x in enumerate(d.get("levels") or []):
            label(f"层级{i+1}", x.get("label"))
            desc(f"层级{i+1}说明", x.get("desc"), 12)
    elif t == "cards":
        count("卡片", d.get("items"), 2, 8)
        for i, x in enumerate(d.get("items") or []):
            label(f"卡片{i+1}", x.get("label"))
            desc(f"卡片{i+1}说明", x.get("desc"), 16)
    elif t == "radial":
        label("中心", d.get("center"), 4)
        count("放射项目", d.get("items"), 4, 8)
        for i, x in enumerate(d.get("items") or []):
            label(f"放射项目{i+1}", x.get("label"), 4, 5)
            desc(f"放射项目{i+1}说明", x.get("desc"), 7)
    elif t == "illus":
        if not d.get("image"):
            errs.append("illus 需要 image（图片网址或 data URI）")
        for i, l in enumerate(d.get("labels") or []):
            label(f"标签{i+1}", l.get("text"))
            for k in ("x", "y"):
                v = l.get(k)
                if not isinstance(v, (int, float)) or not 0 <= v <= 100:
                    errs.append(f"标签{i+1} 的 {k} 要是 0–100 的百分比")

    texts = []
    walk_text(d, texts)
    bad = sorted({c for s in texts for c in s if c in TRAD})
    if bad:
        warns.append("出现繁体字：" + "".join(bad) + "（默认简体；书名或原文引用可保留）")

    for e in errs:
        print("错误　" + e)
    for w in warns:
        print("提醒　" + w)
    if not errs and not warns:
        print("通过")
    sys.exit(1 if errs else 0)


if __name__ == "__main__":
    main()
