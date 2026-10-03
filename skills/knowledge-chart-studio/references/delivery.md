# 交付方式

## Artifact（网页、手机 App 都能看）
最通用的交付方式，任何平台都能用。
- 有 Python：`python3 scripts/render.py spec.json -o chart.html`，把 chart.html 发布成 Artifact。
- 没有 Python：读 `assets/template.html`，把 `__ENGINE__` 换成 `assets/engine.js` 全文、`__SPEC__` 换成 JSON、`__TITLE__` 换成标题、`__BG__` 换成配色底色（mo #f2efe9／ling #f4f2fa），整份当 Artifact 发布。
- 图表固定 16:9，依容器宽度整张缩放；右下角有「⤢ 放大」可全屏检视（手机横放更大）。
- 字型来自 Google Fonts（思源宋体、思源黑体），载入失败时自动用系统字型。

## 高清 PNG（讲义、简报、Notion）
`python3 scripts/render.py spec.json -o chart.html --png chart.png`
- 固定 16:9，输出 2560×1440（1280×720 的 2 倍解析度）。
- 需要浏览器（Python 或 Node 的 playwright）。没有就只产生 HTML，并告诉使用者 PNG 没产生、原因是什么。

## Notion
1. 有 PNG 且 Notion 工具能上传档案：上传 PNG 放进页面。
2. 一定附上文字版，方便日后搜寻：
   - mindmap → mermaid `mindmap`
   - flow → mermaid `flowchart LR`
   - cycle → mermaid `flowchart LR`（最后一步连回第一步）
   - timeline → mermaid `timeline`
   - compare、matrix → Notion 表格
   - 其他 → 编号清单
3. 页尾注明「由知识图表工坊整理」与来源。

## 「我的书房」App
App 的研读心得数据库（研读心得 collection）有「类型」与「图表数据」两个栏位：
- 类型填「图表」
- 图表数据填 spec JSON（上限约 2000 字元；超过时精简文字或拆图）
App 会在书摘段落下方显示图表，用的就是本技能的同一份引擎，样式一致。
