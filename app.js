/*
  神魔之塔 2026 上半年卡池強度票選
  可直接打開 index.html 使用。本機版資料存在 localStorage。
  若要公開投票，請看 README.md 與 supabase-schema.sql。
*/

const CONFIG = {
  mode: "supabase",
  supabaseUrl: "https://aqzkspvejazwcikewgcg.supabase.co/rest/v1/",
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxemtzcHZlamF6d2Npa2V3Z2NnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4MzMyOTAsImV4cCI6MjA5NjQwOTI5MH0.9sW6G7RCH1ELv0R1c9SQ_6N0tCMw1aB0zd7HgzJTtrU",
  tableName: "tos_2026_votes",
};

const STORAGE_KEY = "tos_2026_h1_votes_v1";
const CLIENT_KEY = "tos_2026_h1_client_id";

const weights = {
  strength: 0.35,
  longevity: 0.20,
  value: 0.15,
  innovation: 0.15,
  satisfaction: 0.15,
};

const criteria = [
  { key: "strength", label: "強度", hint: "通關力、傷害、解盾、泛用" },
  { key: "innovation", label: "創新", hint: "機制新鮮感、玩法辨識度" },
  { key: "longevity", label: "保值", hint: "半年後是否仍可能上場" },
  { key: "value", label: "CP值", hint: "石頭成本、保底、複製需求" },
  { key: "satisfaction", label: "爽度", hint: "抽完與使用時的快樂程度" },
];

const pools = [
  {
    id: "solo_leveling",
    name: "《我獨自升級》",
    seal: "2026.100 「獨自升級在神魔」",
    type: "合作",
    period: "2026/01/05",
    notes: "成振宇、崔鐘仁、白允浩、車海印",
  },
  {
    id: "black_gold_2026",
    name: "阿賴耶識／帝釋天 26年黑",
    seal: "v2026.110 「擺脫因果的未來」",
    type: "黑金",
    period: "2026/02/16",
    notes: "萬法根念 ‧ 阿賴耶識、最勝龍雷 ‧ 帝釋天",
  },
  {
    id: "dan_da_dan",
    name: "《膽大黨》",
    seal: "v2026.210 「膽大才能闖神魔」",
    type: "合作",
    period: "2026/03/16",
    notes: "厄卡倫、小桃、愛羅",
  },
  {
    id: "happily_ever_after",
    name: "《幸福瞬間》",
    seal: "v2026.220 「只為你穿上婚紗」",
    type: "自家石抽",
    period: "2026/04/06",
    notes: "曼陀羅、莉莉絲",
  },
  {
    id: "mushoku_tensei",
    name: "《無職轉生》",
    seal: "v2026.300 「到了神魔大陸也要拿出真本事」",
    type: "合作",
    period: "2026/04/27",
    notes: "魯迪烏斯、洛琪希、艾莉絲",
  },
  {
    id: "wishes_2026",
    name: "成吉思汗 黑金",
    seal: "v2026.310 「承載萬千之眾願」",
    type: "黑金",
    period: "2026/05/25",
    notes: "氣運承鼎 ‧ 成吉思汗",
  },
];

const awardQuestions = [
  { key: "strongest", label: "你認為上半年最強卡池是？" },
  { key: "bestValue", label: "你認為最值得抽 / CP值最高的是？" },
  { key: "mostCreative", label: "你認為最有創意的是？" },
  { key: "mostDisappointing", label: "你認為最失望的是？（包含活動排程）" },
  { key: "fastestOutdated", label: "你覺得最容易退環境的是？" },
  { key: "favorite", label: "你個人最喜歡的是？" },
];

const bestLeaderOptions = [
  {
    group: "我獨自升級",
    names: ["闇影君主 ‧ 成振宇", "成振宇", "崔鐘仁", "車海印", "高健熙"],
  },
  {
    group: "阿賴耶識／帝釋天 26年黑",
    names: ["萬法根念 ‧ 阿賴耶識", "最勝龍雷 ‧ 帝釋天"],
  },
  {
    group: "膽大黨",
    names: ["厄卡倫", "小桃", "愛羅", "高速婆婆", "厄卡倫與小桃"],
  },
  {
    group: "幸福瞬間",
    names: ["曼陀羅", "莉莉絲"],
  },
  {
    group: "無職轉生",
    names: ["迷宮攻略者 ‧ 魯迪烏斯", "轉生者 ‧ 魯迪烏斯", "水王級魔術師 ‧ 洛琪希", "真紅的狂犬 ‧ 艾莉絲", "枕邊絮語 ‧ 洛琪希"],
  },
    {
    group: "成吉思汗 黑金",
    names: ["氣運承鼎 ‧ 成吉思汗"],
  },
  {
    group: "其他",
    names: ["其他 / 未列出", "棄權 / 沒有特別想選"],
  },
];

function leaderOptionList(selected = "") {
  return bestLeaderOptions.map(group => `
    <optgroup label="${group.group}">
      ${group.names.map(name => `<option value="${name}" ${selected === name ? "selected" : ""}>${name}</option>`).join("")}
    </optgroup>
  `).join("");
}

const demoVotes = [
  ["闇隊信徒", "5 年以上", "小課 / 月卡", [9, 7, 9, 7, 9], [10, 8, 9, 6, 8], [8, 9, 7, 7, 8], [7, 8, 7, 8, 8], [9, 8, 8, 7, 9], [7, 7, 7, 7, 7], "solo_leveling", "mushoku_tensei", "dan_da_dan", "happily_ever_after", "wishes_2026", "solo_leveling", "闇影君主 ‧ 成振宇", "洛琪希", "黑金強，但我獨自升級真的玩起來最有存在感。"],
  ["無課觀察員", "3～5 年", "無課", [8, 7, 8, 6, 8], [9, 6, 8, 5, 7], [7, 8, 6, 8, 7], [7, 9, 7, 9, 9], [8, 8, 8, 8, 8], [6, 7, 6, 6, 6], "black_gold_2026", "happily_ever_after", "happily_ever_after", "black_gold_2026", "wishes_2026", "happily_ever_after", "帝釋天", "希露菲葉特", "無課看 CP 值，保底跟複製需求真的會影響評價。"],
  ["合作控", "5 年以上", "中課", [9, 8, 8, 7, 9], [8, 7, 8, 6, 7], [8, 10, 7, 7, 10], [6, 8, 6, 7, 8], [9, 9, 9, 8, 9], [7, 7, 7, 6, 7], "mushoku_tensei", "mushoku_tensei", "dan_da_dan", "wishes_2026", "happily_ever_after", "dan_da_dan", "魯迪烏斯", "艾莉絲", "合作卡池最好玩的是情懷和技能梗，但也最怕抽完很快沒舞台。"],
  ["回鍋仔", "回鍋玩家", "小課 / 月卡", [8, 7, 7, 7, 8], [8, 8, 9, 6, 8], [7, 9, 7, 6, 7], [8, 8, 8, 8, 8], [8, 7, 8, 7, 8], [6, 6, 6, 6, 6], "black_gold_2026", "solo_leveling", "dan_da_dan", "wishes_2026", "wishes_2026", "black_gold_2026", "阿賴耶識", "車海印", "回鍋看起來每池都很強，但真的要抽就會怕石頭不夠。"],
  ["巴哈潛水員", "5 年以上", "無課", [8, 6, 8, 7, 8], [9, 7, 9, 5, 7], [7, 9, 6, 6, 8], [6, 8, 6, 8, 8], [9, 8, 8, 7, 9], [7, 7, 6, 6, 7], "black_gold_2026", "solo_leveling", "dan_da_dan", "happily_ever_after", "wishes_2026", "mushoku_tensei", "成振宇", "洛琪希", "最想看的其實是標準差，吵起來才有討論度。"],
  ["婚紗收藏派", "1～3 年", "中課", [7, 7, 7, 7, 7], [8, 7, 8, 6, 7], [7, 9, 7, 7, 8], [8, 10, 8, 9, 10], [8, 8, 8, 8, 9], [7, 7, 7, 7, 7], "mushoku_tensei", "happily_ever_after", "happily_ever_after", "wishes_2026", "wishes_2026", "happily_ever_after", "希露菲葉特", "婚紗系列角色", "我承認我是外觀派，抽完爽度也是強度的一部分吧。"],
  ["強度廚", "5 年以上", "重課", [10, 8, 9, 7, 9], [10, 7, 10, 5, 8], [8, 8, 7, 6, 8], [7, 8, 7, 7, 8], [9, 8, 9, 7, 9], [7, 6, 7, 6, 6], "black_gold_2026", "solo_leveling", "solo_leveling", "wishes_2026", "happily_ever_after", "black_gold_2026", "阿賴耶識", "闇影君主 ‧ 成振宇", "強度榜不該只看傷害，也要看解盾和穩定度。"],
  ["只看免費石", "3～5 年", "無課", [8, 7, 8, 8, 8], [9, 7, 8, 5, 6], [7, 8, 6, 7, 7], [7, 8, 7, 9, 8], [8, 8, 8, 8, 8], [6, 6, 6, 6, 6], "solo_leveling", "happily_ever_after", "dan_da_dan", "black_gold_2026", "wishes_2026", "solo_leveling", "成振宇", "車海印", "黑金一定強，但不是每個人都適合追。"],
];

let votes = [];
let activeTab = "overall";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function getClientId() {
  let id = localStorage.getItem(CLIENT_KEY);
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : `client_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(CLIENT_KEY, id);
  }
  return id;
}

function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => el.classList.remove("show"), 2600);
}

function scoreFromArray(values) {
  const obj = {};
  criteria.forEach((c, index) => obj[c.key] = Number(values[index] ?? 7));
  return obj;
}

function makeVoteFromDemo(row, index) {
  const [nickname, tenure, spending, ...rest] = row;
  const scores = {};
  pools.forEach((pool, poolIndex) => {
    scores[pool.id] = scoreFromArray(rest[poolIndex]);
  });
  const offset = pools.length;
  return {
    id: `demo_${index}`,
    client_id: `demo_${index}`,
    demo: true,
    nickname,
    tenure,
    spending,
    scores,
    awards: {
      strongest: rest[offset],
      bestValue: rest[offset + 1],
      mostCreative: rest[offset + 2],
      mostDisappointing: rest[offset + 3],
      fastestOutdated: rest[offset + 4],
      favorite: rest[offset + 5],
    },
    bestLeader: rest[offset + 6],
    bestMember: rest[offset + 7],
    comment: rest[offset + 8],
    created_at: new Date(Date.now() - (demoVotes.length - index) * 8640000).toISOString(),
  };
}

function composite(score) {
  return Object.entries(weights).reduce((sum, [key, weight]) => sum + (Number(score[key]) || 0) * weight, 0);
}

function avg(nums) {
  const clean = nums.filter(n => Number.isFinite(n));
  if (!clean.length) return 0;
  return clean.reduce((a, b) => a + b, 0) / clean.length;
}

function std(nums) {
  const clean = nums.filter(n => Number.isFinite(n));
  if (clean.length < 2) return 0;
  const mean = avg(clean);
  const variance = avg(clean.map(n => (n - mean) ** 2));
  return Math.sqrt(variance);
}

function fmt(num, digits = 2) {
  return Number(num || 0).toFixed(digits);
}

function poolName(poolId) {
  return pools.find(p => p.id === poolId)?.name || "—";
}

function optionList(selected = "") {
  return pools.map(p => `<option value="${p.id}" ${selected === p.id ? "selected" : ""}>${p.name}</option>`).join("");
}

function renderForm() {
  $("#poolCount").textContent = String(pools.length);

  $("#poolRatings").innerHTML = pools.map(pool => `
    <article class="pool-card">
      <div class="pool-head">
        <div>
          <h3>${pool.name}</h3>
          <p>${pool.seal}｜${pool.period}</p>
        </div>
        <span class="badge">${pool.type}</span>
      </div>
      <p style="margin-bottom: 12px;">${pool.notes}</p>
      <div class="field" style="margin-bottom: 10px;">
        <label for="pulled_${pool.id}">你的接觸程度</label>
        <select id="pulled_${pool.id}" name="pulled_${pool.id}">
          <option value="有抽且常用">有抽且常用</option>
          <option value="有抽但少用">有抽但少用</option>
          <option value="沒抽，看攻略/朋友使用">沒抽，看攻略 / 朋友使用</option>
          <option value="只看資料雲評">只看資料雲評</option>
        </select>
      </div>
      ${criteria.map(c => `
        <div class="slider-row" title="${c.hint}">
          <label for="${pool.id}_${c.key}">${c.label}</label>
          <input type="range" min="1" max="10" value="7" id="${pool.id}_${c.key}" name="${pool.id}_${c.key}" data-score-output="${pool.id}_${c.key}_out" />
          <span class="score-pill" id="${pool.id}_${c.key}_out">7</span>
        </div>
      `).join("")}
    </article>
  `).join("");

  $("#awardFields").innerHTML = awardQuestions.map(q => `
    <div class="field">
      <label for="award_${q.key}">${q.label}</label>
      <select id="award_${q.key}" name="award_${q.key}">${optionList()}</select>
    </div>
  `).join("");

  $("#bestLeader").innerHTML = leaderOptionList("闇影君主 ‧ 成振宇");																			  
  $("#radarPool").innerHTML = optionList();
  $("#poolList").innerHTML = pools.map(p => `<li><strong>${p.name}</strong>：${p.seal}｜${p.type}｜${p.period}<br><span>${p.notes}</span></li>`).join("");

  $$('input[type="range"]').forEach(input => {
    input.addEventListener("input", () => {
      const out = document.getElementById(input.dataset.scoreOutput);
      if (out) out.textContent = input.value;
    });
  });
}

function serializeForm() {
  const form = $("#voteForm");
  const data = new FormData(form);
  const scores = {};
  const pulled = {};

  pools.forEach(pool => {
    pulled[pool.id] = data.get(`pulled_${pool.id}`);
    scores[pool.id] = {};
    criteria.forEach(c => {
      scores[pool.id][c.key] = Number(data.get(`${pool.id}_${c.key}`));
    });
  });

  const awards = {};
  awardQuestions.forEach(q => awards[q.key] = data.get(`award_${q.key}`));

  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `vote_${Date.now()}`,
    client_id: getClientId(),
    demo: false,
    nickname: (data.get("nickname") || "召喚師").trim().slice(0, 24) || "召喚師",
    tenure: data.get("tenure"),
    spending: data.get("spending"),
    pulled,
    scores,
    awards,
    bestLeader: (data.get("bestLeader") || "").trim().slice(0, 40),
    bestMember: (data.get("bestMember") || "").trim().slice(0, 40),
    comment: (data.get("comment") || "").trim().slice(0, 240),
    created_at: new Date().toISOString(),
  };
}

function loadLocalVotes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveLocalVotes(nextVotes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextVotes));
}

async function fetchSupabaseVotes() {
  if (CONFIG.mode !== "supabase" || !CONFIG.supabaseUrl || !CONFIG.supabaseAnonKey) return [];
  const url = `${CONFIG.supabaseUrl.replace(/\/$/, "")}/rest/v1/${CONFIG.tableName}?select=*&order=created_at.desc`;
  const res = await fetch(url, {
    headers: {
      apikey: CONFIG.supabaseAnonKey,
      Authorization: `Bearer ${CONFIG.supabaseAnonKey}`,
    },
  });
  if (!res.ok) throw new Error("Supabase 讀取失敗");
  const rows = await res.json();
  return rows.map(row => ({
    id: row.id,
    client_id: row.client_id,
    demo: false,
    nickname: row.nickname,
    tenure: row.tenure,
    spending: row.spending,
    pulled: row.pulled || {},
    scores: row.scores || {},
    awards: row.awards || {},
    bestLeader: row.best_leader || "",
    bestMember: row.best_member || "",
    comment: row.comment || "",
    created_at: row.created_at,
  }));
}

async function saveSupabaseVote(vote) {
  if (CONFIG.mode !== "supabase" || !CONFIG.supabaseUrl || !CONFIG.supabaseAnonKey) return;
  const url = `${CONFIG.supabaseUrl.replace(/\/$/, "")}/rest/v1/${CONFIG.tableName}?on_conflict=client_id`;
  const payload = {
    client_id: vote.client_id,
    nickname: vote.nickname,
    tenure: vote.tenure,
    spending: vote.spending,
    pulled: vote.pulled,
    scores: vote.scores,
    awards: vote.awards,
    best_leader: vote.bestLeader,
    best_member: vote.bestMember,
    comment: vote.comment,
    created_at: vote.created_at,
  };
  const res = await fetch(url, {
    method: "POST",
    headers: {
      apikey: CONFIG.supabaseAnonKey,
      Authorization: `Bearer ${CONFIG.supabaseAnonKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Supabase 寫入失敗");
}

async function loadVotes() {
  if (CONFIG.mode === "supabase") {
    try {
      votes = await fetchSupabaseVotes();
    } catch (err) {
      console.warn(err);
      votes = loadLocalVotes();
      toast("雲端讀取失敗，暫時顯示本機資料。請檢查 Supabase 設定。");
    }
  } else {
    votes = loadLocalVotes();
  }
  renderResults();
}

async function saveVote(vote) {
  const withoutSameClient = votes.filter(v => v.client_id !== vote.client_id);
  votes = [vote, ...withoutSameClient];
  saveLocalVotes(votes.filter(v => !v.demo));
  renderResults();

  if (CONFIG.mode === "supabase") {
    try {
      await saveSupabaseVote(vote);
      toast("已送出！你的投票已同步到雲端。");
    } catch (err) {
      console.warn(err);
      toast("雲端寫入失敗，但已先存在本機。請檢查 Supabase 設定。");
    }
  } else {
    toast("已送出！目前是本機版，資料存在這台瀏覽器。");
  }
}

function calculateStats() {
  const stat = pools.map(pool => {
    const poolScores = votes.map(v => v.scores?.[pool.id]).filter(Boolean);
    const composites = poolScores.map(score => composite(score));
    const metricAvg = {};
    criteria.forEach(c => {
      metricAvg[c.key] = avg(poolScores.map(score => Number(score[c.key])));
    });
    return {
      ...pool,
      count: poolScores.length,
      overall: avg(composites),
      controversy: std(composites),
      metrics: metricAvg,
    };
  });
  return stat;
}

function sortedBy(tab) {
  const stat = calculateStats();
  if (tab === "controversy") return stat.sort((a, b) => b.controversy - a.controversy);
  if (tab === "overall") return stat.sort((a, b) => b.overall - a.overall);
  return stat.sort((a, b) => (b.metrics?.[tab] || 0) - (a.metrics?.[tab] || 0));
}

function renderLeaderboard() {
  const list = sortedBy(activeTab);
  const metricLabel = {
    overall: "綜合平均",
    strength: "強度平均",
    innovation: "創新平均",
    value: "CP值平均",
    controversy: "標準差",
  }[activeTab];

  $("#leaderboard").innerHTML = list.map((item, index) => {
    const score = activeTab === "overall" ? item.overall : activeTab === "controversy" ? item.controversy : item.metrics[activeTab];
    return `
      <div class="rank-item">
        <div class="rank-no">${index + 1}</div>
        <div class="rank-title"><strong>${item.name}</strong><span>${metricLabel}｜樣本 ${item.count} 票｜${item.type}</span></div>
        <div class="rank-score">${fmt(score)}</div>
      </div>
    `;
  }).join("");
}

function renderBarChart() {
  const stat = sortedBy("overall");
  const max = Math.max(10, ...stat.map(s => s.overall));
  $("#barChart").innerHTML = stat.map(item => `
    <div class="bar-row">
      <div class="bar-label" title="${item.name}">${item.name}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${Math.max(3, item.overall / max * 100)}%"></div></div>
      <div class="bar-value">${fmt(item.overall)}</div>
    </div>
  `).join("");
}

function countBy(key) {
  const map = new Map();
  votes.forEach(v => {
    const id = v.awards?.[key];
    if (!id) return;
    map.set(id, (map.get(id) || 0) + 1);
  });
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

function countTextField(field) {
  const map = new Map();
  votes.forEach(v => {
    const value = String(v[field] || "").trim();
    if (!value) return;
    map.set(value, (map.get(value) || 0) + 1);
  });
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}
function renderAwards() {
  const poolAwardCards = awardQuestions.map(q => {
    const top = countBy(q.key)[0];
    return `
      <div class="award-card">
        <span>${q.label}</span>
        <strong>${top ? `${poolName(top[0])}（${top[1]} 票）` : "—"}</strong>
      </div>
    `;
  }).join("");

  const bestLeaderTop = countTextField("bestLeader")[0];
  const leaderAwardCard = `
    <div class="award-card highlight-award">
      <span>你心中的上半年最佳隊長</span>
      <strong>${bestLeaderTop ? `${escapeHtml(bestLeaderTop[0])}（${bestLeaderTop[1]} 票）` : "—"}</strong>
    </div>
  `;

  $("#awardResults").innerHTML = leaderAwardCard + poolAwardCards;
}

function renderDetails() {
  const stat = calculateStats().sort((a, b) => b.overall - a.overall);
  $("#detailRows").innerHTML = stat.map(item => `
    <tr>
      <td><strong style="color:#eef2ff">${item.name}</strong><br><small>${item.seal}</small></td>
      <td>${item.type}</td>
      <td>${item.count}</td>
      <td>${fmt(item.overall)}</td>
      <td>${fmt(item.metrics.strength)}</td>
      <td>${fmt(item.metrics.innovation)}</td>
      <td>${fmt(item.metrics.longevity)}</td>
      <td>${fmt(item.metrics.value)}</td>
      <td>${fmt(item.metrics.satisfaction)}</td>
      <td>${fmt(item.controversy)}</td>
    </tr>
  `).join("");
}

function renderComments() {
  const comments = votes
    .filter(v => v.comment)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 8);

  $("#comments").innerHTML = comments.length ? comments.map(v => `
    <div class="comment">
      <p>${escapeHtml(v.comment)}</p>
      <small>— ${escapeHtml(v.nickname || "匿名召喚師")}｜${escapeHtml(v.tenure || "")}${v.demo ? "｜示範資料" : ""}</small>
    </div>
  `).join("") : `<div class="helper">還沒有留言。送出第一句玩家觀點吧。</div>`;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
}

function renderHeroStats() {
  const stat = calculateStats();
  const top = [...stat].sort((a, b) => b.overall - a.overall)[0];
  const controversy = [...stat].sort((a, b) => b.controversy - a.controversy)[0];
  $("#totalVotes").textContent = String(votes.length);
  $("#topPool").textContent = top?.overall ? top.name : "—";
  $("#controversialPool").textContent = controversy?.controversy ? controversy.name : "—";
}

function renderRadar() {
  const canvas = $("#radarCanvas");
  const ctx = canvas.getContext("2d");
  const stat = calculateStats();
  const selectedId = $("#radarPool").value || pools[0].id;
  const item = stat.find(s => s.id === selectedId) || stat[0];
  const width = canvas.width;
  const height = canvas.height;
  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.34;
  const labels = criteria.map(c => c.label);
  const values = criteria.map(c => item?.metrics?.[c.key] || 0);

  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.font = "24px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(246,247,255,.95)";
  ctx.fillText(item?.name || "—", cx, 42);
  ctx.font = "16px system-ui, sans-serif";
  ctx.fillStyle = "rgba(185,192,220,.9)";
  ctx.fillText(`樣本 ${item?.count || 0} 票｜綜合 ${fmt(item?.overall || 0)}`, cx, 68);

  for (let ring = 1; ring <= 5; ring++) {
    const r = radius * ring / 5;
    drawPolygon(ctx, cx, cy, r, labels.length, "rgba(255,255,255,.10)", "transparent");
  }

  labels.forEach((label, index) => {
    const angle = -Math.PI / 2 + index * Math.PI * 2 / labels.length;
    const x = cx + Math.cos(angle) * (radius + 46);
    const y = cy + Math.sin(angle) * (radius + 46);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    ctx.strokeStyle = "rgba(255,255,255,.12)";
    ctx.stroke();
    ctx.fillStyle = "rgba(246,247,255,.9)";
    ctx.font = "18px system-ui, sans-serif";
    ctx.fillText(label, x, y + 6);
  });

  const points = values.map((value, index) => {
    const angle = -Math.PI / 2 + index * Math.PI * 2 / labels.length;
    const r = radius * Math.min(10, value) / 10;
    return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r];
  });

  ctx.beginPath();
  points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.closePath();
  const gradient = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
  gradient.addColorStop(0, "rgba(167,139,250,.65)");
  gradient.addColorStop(1, "rgba(34,211,238,.55)");
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.85)";
  ctx.lineWidth = 3;
  ctx.stroke();

  points.forEach(([x, y], index) => {
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.fillStyle = "rgba(11,16,32,.95)";
    ctx.font = "bold 15px system-ui, sans-serif";
    ctx.fillText(fmt(values[index], 1), x, y - 12);
  });

  ctx.restore();
}

function drawPolygon(ctx, cx, cy, radius, sides, strokeStyle, fillStyle) {
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const angle = -Math.PI / 2 + i * Math.PI * 2 / sides;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = fillStyle;
  ctx.fill();
  ctx.strokeStyle = strokeStyle;
  ctx.stroke();
}

function renderResults() {
  renderHeroStats();
  renderLeaderboard();
  renderBarChart();
  renderAwards();
  renderDetails();
  renderComments();
  renderRadar();
}

function exportJson() {
  downloadFile(`tos-2026-h1-votes-${dateStamp()}.json`, JSON.stringify({ pools, criteria, weights, votes }, null, 2), "application/json");
}

function exportCsv() {
  const rows = [];
  rows.push([
    "created_at", "nickname", "tenure", "spending", "pool", "type", "overall",
    ...criteria.map(c => c.label), "strongest", "bestValue", "mostCreative", "mostDisappointing", "fastestOutdated", "favorite", "bestLeader", "bestMember", "comment"
  ]);

  votes.forEach(v => {
    pools.forEach(pool => {
      const score = v.scores?.[pool.id];
      if (!score) return;
      rows.push([
        v.created_at, v.nickname, v.tenure, v.spending, pool.name, pool.type, fmt(composite(score)),
        ...criteria.map(c => score[c.key]),
        ...awardQuestions.map(q => poolName(v.awards?.[q.key])),
        v.bestLeader || "", v.bestMember || "", v.comment || "",
      ]);
    });
  });

  const csv = rows.map(row => row.map(cell => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
  downloadFile(`tos-2026-h1-votes-${dateStamp()}.csv`, "\ufeff" + csv, "text/csv;charset=utf-8");
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function dateStamp() {
  return new Date().toISOString().slice(0, 10).replaceAll("-", "");
}

function loadDemo() {
  const currentLocal = votes.filter(v => !v.demo);
  votes = [...demoVotes.map(makeVoteFromDemo), ...currentLocal];
  renderResults();
  toast("已載入示範資料。送出自己的票後也會一起統計。清除本機票不會移除示範資料，重新整理會回到本機資料。 ");
}

function quickFill() {
  $$('input[type="range"]').forEach(input => {
    input.value = 7;
    const out = document.getElementById(input.dataset.scoreOutput);
    if (out) out.textContent = "7";
  });
  toast("已把全部評分填成 7 分，可再微調。 ");
}

function bindEvents() {
  $("#voteForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const vote = serializeForm();
    await saveVote(vote);
    $("#results").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  $("#voteForm").addEventListener("reset", () => {
    setTimeout(() => $$('input[type="range"]').forEach(input => {
      const out = document.getElementById(input.dataset.scoreOutput);
      if (out) out.textContent = input.value;
    }), 0);
  });

  $$(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      $$(".tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      activeTab = tab.dataset.tab;
      renderLeaderboard();
    });
  });

  $("#radarPool").addEventListener("change", renderRadar);
  $("#loadDemoBtn").addEventListener("click", loadDemo);
  $("#quickFillBtn").addEventListener("click", quickFill);
  $("#exportJsonTopBtn").addEventListener("click", exportJson);
  $("#exportCsvBtn").addEventListener("click", exportCsv);

  $("#clearLocalBtn").addEventListener("click", () => {
    if (!confirm("確定要清除這台瀏覽器裡的本機投票資料嗎？")) return;
    localStorage.removeItem(STORAGE_KEY);
    votes = votes.filter(v => v.demo);
    renderResults();
    toast("已清除本機投票資料。 ");
  });
}

async function init() {
  renderForm();
  bindEvents();
  await loadVotes();
}

init();
