# 手绘插画

## 什么时候画
内容需要「人」或「情境」才讲得清楚时：情绪姿态、身体感受、生活场景、步骤里的动作。纯结构性内容（架构、比较、层级）用图表就好，不要硬加插画。

## 两种画风
| 画风 | 适合 | 参考图（见 illustration-refs.md） |
|---|---|---|
| 日式编辑线描（预设） | 情绪、心理、身心灵、教学步骤 | 33be2f5d 潘先生、0449b11b 智能手机、75c90a13 上色三阶段 |
| 细线手绘＋一种点缀色 | 多格人物姿态、前后对比、场景说明 | 7ef84322、3db143e3、a9043c74、41ad33c6 |

## 模型设定（使用者实测后选定）
- 工具：Higgsfield `generate_image`
- 模型：`gpt_image_2_5`，`quality: "xhigh"`，`resolution: "2k"`，`variant` 用 `flare` 或 `sunburst` 都可以
- `medias`：带 3 张参考图，role 用 `image_references`
- 测试过的 FLUX 3、Nano Banana、Seedream 5.0 Pro、FLUX.2 Max，画风都没有比较像，不要换模型

## 提示词范本（定案的 G／H 版）
把【】里的内容换掉，其余照抄。重点在线条的描述：使用者否决过「数位光滑」「线条太粗」「像铅笔画、有排线」三种结果。

```
Match the line style of the reference pages exactly: clean black fineliner INK lines (like a 0.3mm Micron pen), uniform and consistent stroke width, every contour drawn ONCE as a single confident stroke, slightly organic hand-drawn feel but crisp and clean. NO pencil texture, NO sketchy overlapping strokes, NO hatching, NO shading, NO gradients. Simplified shapes with minimal detail, generous white space, flat solid color fills with crisp edges. Colors: only 【soft lavender (#9a8be0) and misty blue (#6f9bd2)】 as flat fills, plus pale gray (#ececec) circle backgrounds. Layout: 【one large circle vignette on top, four smaller circle vignettes in a row below, each small circle with an EMPTY rounded label tab above】. Content: 【…用英文描述画面，人物要成熟比例…】. Do not copy reference characters or compositions. Absolutely no text, letters or numbers.
```

常用版式：
- 大圆框＋下排四个小圆框（一个主题＋四个面向）
- 三格或六格分格（步骤、姿态对照）
- 3×3 小插画网格，每格下方留说明空位（词汇表、症状表）
- 单张场景，引线末端留空白圆圈（标注身体部位）

## 排上中文
插画不带字，中文由 `illus` 图表类型排上去：
1. 生成后取得图片网址。
2. 需要发布成 Artifact 时，先下载图片转成 data URI（Artifact 会挡外部图片网址）。下载不了（网络受限）就改用连结交给使用者看，并说明原因。
3. 写 `illus` JSON：`labels` 的 x、y 用百分比对准插画里的空白标签框；`captions` 放每格说明。
4. 出图后看一眼，标签没对准就调 x、y 再出一次。

## 注意
- 参考图有版权，只能当画风参考，提示词要写明画新的构图与人物。
- 每张图消耗少量点数；一次画 1–2 张让使用者挑，挑定再继续。
- 生成前不必再问使用者要参考图，编号已在 illustration-refs.md。使用者上传新的参考图时，把新编号补进那份文件。
