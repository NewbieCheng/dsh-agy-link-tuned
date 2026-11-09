# dsh-agy-link-tuned · 优化版存档

基于 `dsh-agy-link v0.6.10`（上游：`amlyczz/dsh-agy-link`）的本地优化存档。
只改 UI 文案与样式，不碰配额、轮换、代理逻辑拿来即用：用本仓库的
`dist/client.js` 覆盖安装目录同名文件，重启 DSH 生效。

- 上游版本：`dsh-agy-link 0.6.10`
- 覆盖目标：`<DSH_HOME>/profiles/<profile>/node_modules/dsh-agy-link/dist/client.js`
- 生效方式：彻底退出 DSH（含托盘）后重开

## 改动说明

### 1. 控制台内部布局重排（参照 Codex 订阅面板语言）
定位：`dist/client.js` 末尾 `/* --- redesign refresh ... --- */` 段。

- 读数优先：quota 三行改成 `96px 标签 ＋ 自适应细条 ＋ 百分比` 网格，
  三条进度条左对齐，百分比等宽数字（`tabular-nums`）。
- 一道细线：控制台各大区块之间加 `1px` 分隔线，区块内边距 `16/18px`。
- 单一绿色：进度条统一 `6px` 胶囊＋翡翠渐变（`#34d399 → #10b981`），
  原来是 `8px` 粗条；低额度告警仍走原来的琥珀/红色 pill。
- 弹窗：`16px` 圆角、最大宽 `680px`。

### 2. 代理示例端口换成实际值（Clash 混合端口 7897）
- `README.md` 中/英文前置说明、`export` 示例、单账号代理示例：`7890 → 7897`
- 中文界面两个代理输入框占位：`7890 → 7897`
- 英文/葡语/西语占位保持 `7890`（示例而已，最小改动）。

### 3. 模型显示改为二级面板（数据驱动不断联）
- `模型显示`收起为一行二级入口：`模型显示：可见 X / 共 Y ▸`，
  点开才展开全部 chips 勾选；数据源仍是实时 `catalogModels`（单模型明细同源），
  不是写死的。
- 隐藏只影响模型选择器列表（`listModels` 过滤），实际调用走
  `resolveModel → findEntry` 不查隐藏表，隐藏的模型照样能调通。

## 文件

### 4. 干掉顶栏 `AGY·xx` 徽标
- 删除 `conversation.session.header.actions` 的 `agy-link-status` 注册，
  对话顶部不再显示；控制台改从「设置 → Antigravity」进入。

| 文件 | 说明 |
| --- | --- |
| `dist/client.js` | 改好的控制台前端包，直接覆盖 |
| `BASE-VERSION` | 基线版本记录 |
