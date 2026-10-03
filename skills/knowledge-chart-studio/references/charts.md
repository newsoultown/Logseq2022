# 图表类型与 JSON 格式

所有类型共用的栏位：

| 栏位 | 必填 | 说明 |
|---|---|---|
| `type` | ✓ | 下列 11 种之一 |
| `palette` | | `mo`（莫兰迪知性，预设）或 `ling`（灵境晶光） |
| `title` | ✓ | 图表标题，18 字内 |
| `subtitle` | | 副标，例如章节出处 |
| `takeaway` | | 一句结论，24 字内，显示在图下方的色条 |
| `source` | | 来源，例如「《破解情绪密码》第四章」 |

字数上限是硬规则（`scripts/check.py` 会检查），因为使用者明确要求字大、字少。超过时改写得更精炼，或拆成两张图。

可用图示（`icon`）：need（裂开的心）、heart、ice（冰山）、signal（讯号）、body（人形）、doc（病历）、tea、sun、brain、people、book、leaf、key、eye、star、lotus。

---

## mindmap 框线心智图
用在：整本书、一章、一个主题的全貌。分支平均分到左右两侧；手机上自动改成直列。

```json
{"type":"mindmap","title":"…","center":"破解\n情绪密码",
 "branches":[{"label":"核心概念","children":["情绪诱发病","检查都正常"]}]}
```
- `center` 8 字内，可用 `\n` 换行
- `branches` 2–8 个；`label` 6 字内
- `children` 每支 1–5 个，6 字内（最多容许 8 字）

## logic 立体圆球逻辑图
用在：三个要素缺一不可（3 项，三角排列）；或一个核心带 4–6 个面向（中心球＋外圈）。

```json
{"type":"logic","title":"…","center":"情绪",
 "items":[{"title":"主观感受","sub":"心里的感觉"}],
 "note":{"title":"三者同时出现\n才算一种情绪","sub":"缺一个就不成立"}}
```
- `items` 3–6 项；3 项时 `title` 5 字内，4–6 项时 4 字内；`sub` 6 字内
- `note` 只在 3 项时显示，放在右侧（手机在下方）

## flow 箭头流程
用在：因果链、步骤。

```json
{"type":"flow","title":"…","steps":[{"label":"需求缺口","icon":"need","desc":"爱与安全感不足"}]}
```
- `steps` 3–6 步；`label` 5 字内；`desc` 10 字内

## cycle 循环图
用在：会绕回起点的循环。

```json
{"type":"cycle","title":"…","center":"越想越痛","steps":[{"label":"担心","desc":"反复预演最坏情况"}]}
```
- `steps` 3–6 个；`label` 4 字内（写在圆球里）；`desc` 10 字内（列在图下）

## compare 左右对比
```json
{"type":"compare","title":"…","left":{"label":"表面情绪","points":["脸上看得到"]},"right":{"label":"基础情绪","points":["埋在背景里"]},"vs":"VS"}
```
- 每边 2–6 点，每点 16 字内

## timeline 时间轴
```json
{"type":"timeline","title":"…","events":[{"time":"5 岁","label":"目睹父亲遭雷击","desc":"恐惧埋进心底"}]}
```
- `events` 3–8 个；`label` 8 字内；`desc` 20 字内

## matrix 四象限
```json
{"type":"matrix","title":"…","x":"横轴含义（左→右）","y":"纵轴含义（下→上）",
 "quadrants":[{"label":"左上","items":["…"]},{"label":"右上","items":["…"]},{"label":"左下","items":["…"]},{"label":"右下","items":["…"]}]}
```
- 依序左上、右上、左下、右下；每格 1–4 项

## pyramid 金字塔
```json
{"type":"pyramid","title":"…","levels":[{"label":"付出","desc":"给予带来平和"}]}
```
- 由上（最高／最核心）到下（最基础），3–6 层；`desc` 12 字内

## cards 重点卡片
```json
{"type":"cards","title":"…","items":[{"label":"补上需求","icon":"heart","desc":"儿子平安归来，绞痛就好了"}]}
```
- 2–8 张；`desc` 16 字内

## radial 放射图
```json
{"type":"radial","title":"…","center":"基础情绪","items":[{"label":"新奇体验","short":"新奇","desc":"情绪麻木"}]}
```
- 4–8 项；`label` 4 字内（较长时给 `short` 放进圆球）；`desc` 7 字内

## illus 手绘插画＋中文标签
先照 `illustration.md` 画好不带字的插画，再用这个类型把中文排上去。

```json
{"type":"illus","title":"…","image":"https://…png 或 data:image/png;base64,…",
 "labels":[{"text":"胃","x":52,"y":61}],
 "captions":[{"label":"补上需求","desc":"儿子平安归来"}]}
```
- `labels` 的 `x`、`y` 是百分比（0–100），对准插画里预留的空白圆圈或标签框；看一眼成品再微调位置
- `captions` 选填，显示在插画下方
- Artifact 页面只能载入 data URI 图片，外部网址会被挡；要先下载转成 data URI（见 `delivery.md`）
