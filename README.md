# 【站名】 · 个人主页

一个纯静态的单页个人主页：**HTML5 + CSS3 + 原生 JavaScript（ES6）**，零依赖、零构建。

- 双击 `index.html` 就能在本地看到完整效果，**不需要本地服务器、不需要联网**
- 直接推到 GitHub，用 **GitHub Pages** 托管，靠根目录的 `CNAME` 绑定自己的域名
- 没有任何 npm 依赖、没有 `node_modules`、没有构建工具、没有 CDN、没有第三方字体和图标（图标全部是内联 SVG）
- 所有资源引用都是**相对路径**（`css/style.css`、`js/main.js`、`assets/images/...`），因此放在子路径或自定义域名下都不会 404

---

## 目录结构

```text
D:\WorkProgram\whyselftest\
├─ index.html            # 单页入口，锚点式导航（首页 / 关于 / 技能 / 作品 / 联系）
├─ CNAME                 # GitHub Pages 自定义域名，内容只有一行：whyselftest.top
├─ README.md             # 本文件：部署步骤 + 占位内容替换清单
├─ css\
│  └─ style.css          # 全部样式：CSS 变量主题、响应式、动画
├─ js\
│  └─ main.js            # 导航高亮、移动端菜单、主题切换、年份、入场动画
└─ assets\
   └─ images\            # 图片目录（当前只有 .gitkeep 占位）
```

---

## 本地预览

三种方式任选，第一种最简单：

1. **直接双击** `index.html`（已按 `file://` 场景验证：脚本用普通 `<script defer>` 加载，不是 ES module，所以不会触发 CORS 报错）
2. 在 VS Code 里装 Live Server 插件，右键 `index.html` → Open with Live Server
3. 起一个临时静态服务器：`python -m http.server 8000`，然后访问 http://localhost:8000

---

## 一、替换占位内容（必做）

所有占位符都用中文书名号 `【】` 包着，在编辑器里全局搜索 `【` 就能逐个改完。`index.html` 顶部有一段 `TODO` 注释，列了同样的清单。

| 占位符 | 出现位置 | 替换成 |
| --- | --- | --- |
| `【站名】` | `<title>`、导航栏左侧站名 | 你的站名，例如 `Zhang San` |
| `【你的名字】` | Hero 大标题、关于我首句、页脚版权、头像 `alt`、`meta author` | 你的名字 |
| `【一句话简介】` | `meta description`、Hero 副标题 | 一句话介绍自己（会出现在搜索结果里） |
| `【你的方向】` | Hero 描述、关于我 | 例如「后端开发」「数据可视化」 |
| `【你的城市】` | 关于我正文 + 信息卡（共 2 处） | 城市 |
| `【你的身份】` | 关于我正文 + 信息卡（共 2 处） | 例如「后端开发」「在校学生」 |
| `【你的兴趣】` | 关于我正文 + 信息卡（共 2 处） | 例如「开源工具、摄影、长跑」 |
| `【你最近在学的东西】` | 信息卡 | 最近在学的东西 |
| `【you@example.com】` | 联系方式（文字 + `mailto:` 链接，共 2 处） | 你的邮箱 |
| `【你的微信号】` | 联系方式 | 你的微信号 |
| `Tud0uK1ng` | 联系方式 + 6 张作品卡片 | ✅ 已替换 |
| `whyselftest` | 6 张作品卡片 | ✅ 已替换 |
| `【你的博客/其他主页】` | 联系方式的「其他主页」（文字 + `href`，共 2 处） | 完整网址，例如 `https://example.com` |
| `whyselftest.top` | `CNAME` 文件 | ✅ 已替换 |

除了占位符，这两块也是示例内容，建议按实际情况改写：

- **技能**（`index.html` 的 `#skills`）：技能名、熟练度文字、`aria-valuenow` 数值，以及进度条上的 `style="--level: 90%"`（两者保持一致即可）
- **作品卡片**（`index.html` 的 `#works`）：现在有 6 张示例卡片，改成自己的项目；暂时没有开源的项目可以删掉卡片里的 `<a class="card-link">` 那一段

> ✅ `CNAME` 文件已经填好 `whyselftest.top`（内容只有一行、末尾一个换行）。以后换域名时改这个文件即可：只能写域名本身，不要写 `https://`、不要带路径，否则 GitHub Pages 会判定域名格式非法。

---

## 二、换成自己的头像

页面当前用的是内联 SVG 占位头像（所以没有任何图片请求，打开就是完整的）。换成真实照片：

1. 把照片命名为 `avatar.jpg`（或 `.png`），放进 `assets/images/` 目录
2. 打开 `index.html`，找到 `class="avatar-wrap"` 那一段，把里面的整段 `<svg class="avatar" ...>...</svg>` 替换成：

```html
<img class="avatar" src="assets/images/avatar.jpg" alt="【你的名字】的头像" width="168" height="168">
```

样式不用改：`.avatar` 已经定义了圆形裁切（`border-radius: 50%`）和 `object-fit: cover`。建议图片是正方形、边长 400px 以上、体积控制在 200KB 以内。

---

## 三、把代码推到 GitHub

先在 GitHub 上新建一个**空仓库**（不要勾选 Add a README / .gitignore，避免和本地冲突）。仓库名随便取，叫 `whyselftest` 或者 `<你的用户名>.github.io` 都可以。

如果你机器上还没装 Git，先装：<https://git-scm.com/download/win>（装完重开一次终端，`git --version` 能出版本号即可）。

然后在项目目录里执行：

```powershell
cd D:\WorkProgram\whyselftest

git init -b main
git add .
git commit -m "feat: 个人主页首个版本"
git remote add origin https://github.com/Tud0uK1ng/whyselftest.git
git push -u origin main
```

如果推送时要你登录，用浏览器弹出的 GitHub 授权窗口登录即可（或者改用 SSH 地址 `git@github.com:Tud0uK1ng/whyselftest.git`）。

以后每次改完内容，三条命令重新发布：

```powershell
git add .
git commit -m "content: 更新作品"
git push
```

---

## 四、开启 GitHub Pages

1. 打开仓库页面 → **Settings** → 左侧 **Pages**
2. **Source** 选 `Deploy from a branch`
3. **Branch** 选 `main`、目录选 `/(root)`，点 **Save**
4. 等 1–2 分钟，页面上方会出现站点地址。此时用默认地址就能访问：
   - 仓库名叫 `<用户名>.github.io` → `https://<用户名>.github.io/`
   - 仓库名是别的 → `https://<用户名>.github.io/<仓库名>/`

因为站内全是相对路径，上面两种地址都能正常显示，不需要改任何代码。

---

## 五、绑定自己的域名

### 1. 在仓库里填域名

**Settings → Pages → Custom domain** 填你的域名（例如 `example.com`）→ **Save**。

仓库根目录的 `CNAME` 文件已经准备好，GitHub 会自动读取它；页面提示 "DNS check successful" 之后，勾选 **Enforce HTTPS**（证书通常几分钟内签发，最长可能要 24 小时）。

### 2. 到域名服务商处加 DNS 记录

**如果绑定的是根域名（example.com）**，加 4 条 A 记录：

| 类型 | 主机记录 | 记录值 |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |

想同时支持 IPv6 可以再加 4 条 AAAA：`2606:50c0:8000::153`、`2606:50c0:8001::153`、`2606:50c0:8002::153`、`2606:50c0:8003::153`（这些是 GitHub Pages 官方文档里的当前地址）。

**如果绑定的是 www 子域（www.example.com）**，加 1 条 CNAME 记录：

| 类型 | 主机记录 | 记录值 |
| --- | --- | --- |
| CNAME | `www` | `Tud0uK1ng.github.io` |

> 根域名用 CNAME 是不合规的（很多 DNS 服务商会直接拒绝），所以根域名请用上面的 A 记录。如果你的服务商支持 `ALIAS` / `ANAME`，也可以把根域名指向 `【GitHub 用户名】.github.io`。

### 3. 等待生效

DNS 一般几分钟到几小时生效（TTL 决定）。可以用 `nslookup example.com` 检查是否已经解析到 `185.199.108.153`。生效后访问 `https://你的域名` 即可。

---

## 常见问题

**打开页面样式全丢 / 控制台报 404**
检查 `css/`、`js/` 目录是否一起推上去了，以及文件大小写是否一致（GitHub Pages 的服务器区分大小写，Windows 本地不区分）。

**改了内容但线上没变**
GitHub Pages 有 CDN 缓存，等 1–2 分钟并强制刷新（`Ctrl+F5`）。确认改动确实 `git push` 上去了。

**自定义域名打开是 404，默认的 github.io 地址却正常**
九成是 DNS 还没生效或记录写错了；先在 **Settings → Pages** 里看 DNS check 的状态提示。

**深色主题怎么工作的**
`:root` 定义浅色变量，`[data-theme="dark"]` 定义深色变量。首次访问跟随系统的 `prefers-color-scheme`；点右上角按钮手动切换后写入 `localStorage`，刷新保持不变。不想用 JS 也能跟随系统（CSS 里有对应的媒体查询兜底）。

**为什么不用 ES module / 为什么没有 `package.json`**
用 `file://` 直接双击打开时，ES module 会被 CORS 拦住、控制台直接报错，所以脚本写成普通 `<script defer>`。整个项目不需要任何依赖，因此也就没有 `package.json`。

**无障碍与兼容性**
语义化标签（`header / nav / main / section / footer`）、所有 `<img>` 带 `alt`、键盘可用的跳转链接与按钮、`aria-expanded` / `aria-current` / `role="progressbar"` 同步更新；配色对文字与背景的对比度满足 WCAG AA；动画在 `prefers-reduced-motion: reduce` 下自动关闭。目标浏览器是 Chrome / Edge 最新版，控制台无报错与警告。
