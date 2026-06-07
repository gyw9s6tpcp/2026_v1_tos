# 神魔之塔 2026 上半年卡池強度票選網站

這是一個可直接開啟的靜態問卷網站，已包含：

- 投票表單
- 卡池多面向評分：強度、創新、保值、CP值、抽完爽度
- 即時排行榜
- 雷達圖
- 爭議度，也就是標準差
- 玩家留言
- JSON / CSV 匯出
- Supabase 雲端資料庫設定檔

## 1. 本機預覽

直接打開：

```text
index.html
```

或把整個資料夾丟到 VS Code，用 Live Server 開啟。

## 2. 目前內建卡池

你可以到 `app.js` 裡的 `pools` 陣列修改卡池名稱、時間、說明。

已先放入：

- 我獨自升級｜無限升級
- 阿賴耶識／帝釋天黑金｜因果重塑／命運臣服
- 膽大黨｜合作卡匣
- 幸福瞬間｜Happily Ever After
- 無職轉生｜未知的轉折點
- 承載萬千之眾願｜版本主題卡池，名稱可再依官方卡匣補齊

## 3. 改權重

在 `app.js` 最上方：

```js
const weights = {
  strength: 0.35,
  longevity: 0.20,
  value: 0.15,
  innovation: 0.15,
  satisfaction: 0.15,
};
```

想做「強度廚版本」可以把 strength 拉高；想做「無課友善版本」可以把 value 拉高。

## 4. 公開給大家投票：接 Supabase

### 步驟 A：建立資料表

到 Supabase 專案，打開 SQL Editor，貼上 `supabase-schema.sql` 並執行。

### 步驟 B：填入專案資訊

在 `app.js` 最上方把：

```js
const CONFIG = {
  mode: "local",
  supabaseUrl: "",
  supabaseAnonKey: "",
  tableName: "tos_2026_votes",
};
```

改成：

```js
const CONFIG = {
  mode: "supabase",
  supabaseUrl: "https://你的專案.supabase.co",
  supabaseAnonKey: "你的 anon public key",
  tableName: "tos_2026_votes",
};
```

### 步驟 C：部署

可以用其中一種：

- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages

這個專案是純前端，不需要 build 指令。

## 5. 防灌票提醒

這版是「輕量防重複」：同一瀏覽器送出第二次，會更新上一票。

若要更嚴格，可以增加：

- Google 登入
- Discord 登入
- reCAPTCHA / Turnstile
- 每個帳號每天只能投一次
- IP rate limit，需要後端或 Edge Function

## 6. 建議標題

公開時可以用：

> 【玩家票選】神魔之塔 2026 上半年卡池強度排行：誰最強？誰最雷？誰最有創意？

## 7. 非官方聲明

本網站為玩家自製統計頁，非官方活動。卡池資訊請以遊戲內與官方公告為準。
