# 有声书制作流程（给 Claude 看的）

App 里按「🎙 请 Claude 制作有声书」后，App 会：
1. 把这本书目前显示的段落文字、每段分句位置（与 App 的 `ttsSplit` 一致）、段落指纹 `h` 打包成 JSON，上传到 App 素材库；
2. 透过 Claude Code Remote 的 `send_message` 传「【我的书房·有声书制作请求】… 内容素材 asset：<id>」到制作对话。

收到请求后：
1. `Artifact read`（url＝我的书房，path＝asset id）把请求 JSON 存到本机。
2. `pip install edge-tts`（若未安装），执行
   `python3 -I apps/my-study/tts/build_audio.py <请求.json> <输出资料夹>`
   声音：zh-CN-XiaoxiaoNeural（使用者选定的「晓晓」）。
3. 把输出的 `<key>_partN.mp3` 用 `Artifact publish asset:true` 上传到我的书房素材库，记下 `/_blob/<id>`。
4. `python3 -I apps/my-study/tts/install_manifest.py apps/my-study/index.html <输出>/<key>.json /_blob/<id1> [...]`
5. 发布 App（同一个档案路径／网址），提交并推送；可删除那份请求 JSON 素材。
6. 回报：书名、总长度、几个语音档。

App 播放时会比对每段指纹；之后 Notion 内容改了，指纹对不上的段落会被跳过，需要重新制作。
