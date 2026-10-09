#!/usr/bin/env python3
"""我的书房 · 有声书制作
输入：App 上传的请求 JSON（{key,title,voice,paras:[{h,t,s:[[a,b],...]}]}）
输出：<out>/<key>_partN.mp3（每档 ≤ 14MB）＋ <out>/<key>.json（给 App 的时间轴）
用法：python3 -I build_audio.py request.json outdir
需要：pip install edge-tts（在 Claude 云端环境需用代理 CA，见下方 certifi 设定）
"""
import asyncio, json, os, re, sys
try:
    import certifi
    if os.path.exists("/root/.ccr/ca-bundle.crt"):
        certifi.where = lambda: "/root/.ccr/ca-bundle.crt"
except ImportError:
    pass
import edge_tts

BYTES_PER_SEC = 48000 / 8          # edge 输出 audio-24khz-48kbitrate-mono-mp3
PART_LIMIT = 14 * 1024 * 1024
CONC = 6

def clean(t):
    t = re.sub(r"[•｜|*#＊◆●■□▪→←]", " ", t)
    return re.sub(r"\s+", " ", t).strip()

async def synth(text, voice, sem, tries=4):
    async with sem:
        for i in range(tries):
            try:
                buf = bytearray()
                async for ch in edge_tts.Communicate(text, voice).stream():
                    if ch["type"] == "audio":
                        buf += ch["data"]
                if buf:
                    return bytes(buf)
            except Exception as e:  # noqa
                err = e
            await asyncio.sleep(1.5 * (i + 1))
        print("合成失败：", text[:30], file=sys.stderr)
        return b""

async def main(req_path, out):
    req = json.load(open(req_path, encoding="utf-8"))
    key, voice = req["key"], req.get("voice") or "zh-CN-XiaoxiaoNeural"
    os.makedirs(out, exist_ok=True)
    jobs = []  # (p, s, text)
    for pi, p in enumerate(req["paras"]):
        for si, (a, b) in enumerate(p["s"]):
            jobs.append((pi, si, clean(p["t"][a:b])))
    sem = asyncio.Semaphore(CONC)
    audio = await asyncio.gather(*[synth(t, voice, sem) if t else asyncio.sleep(0, b"") for _, _, t in jobs])
    parts, cur, k, t = [], bytearray(), 0, 0.0
    paras = [{"h": p["h"], "k": 0, "s": []} for p in req["paras"]]
    last_p = -1
    for (pi, si, _), mp3 in zip(jobs, audio):
        if pi != last_p and len(cur) > PART_LIMIT * 0.92:   # 只在段落交界换档
            parts.append(bytes(cur)); cur = bytearray(); k += 1; t = 0.0
        if pi != last_p:
            paras[pi]["k"] = k; last_p = pi
        dur = len(mp3) / BYTES_PER_SEC
        paras[pi]["s"].append([round(t, 3), round(t + dur, 3)])
        cur += mp3; t += dur
    if cur:
        parts.append(bytes(cur))
    files = []
    for i, b in enumerate(parts):
        fn = f"{key}_part{i+1}.mp3"
        open(os.path.join(out, fn), "wb").write(b); files.append(fn)
    man = {"v": 1, "key": key, "title": req.get("title", ""), "voice": "晓晓", "files": files,
           "paras": paras, "total": round(sum(len(b) for b in parts) / BYTES_PER_SEC, 1)}
    json.dump(man, open(os.path.join(out, key + ".json"), "w", encoding="utf-8"), ensure_ascii=False)
    print(json.dumps({"files": files, "minutes": round(man["total"] / 60, 1),
                      "sentences": len(jobs), "empty": sum(1 for a in audio if not a)}, ensure_ascii=False))

if __name__ == "__main__":
    asyncio.run(main(sys.argv[1], sys.argv[2]))
