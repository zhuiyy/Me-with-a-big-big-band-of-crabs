const form = document.querySelector("#submission-form");
const verdict = document.querySelector("#verdict");
const template = document.querySelector("#verdict-template");
const titleInput = document.querySelector("#title");
const categoryInput = document.querySelector("#category");
const jokeInput = document.querySelector("#joke");

let currentSubmission = null;
let reviewCount = 0;
let lastCommitteeIndex = -1;

let committees = [
  {
    name: "委员会名称",
    reason: "失败理由",
  }
];

function stripQuotes(value) {
  return value.trim().replace(/^["']|["']$/g, "");
}

function parseCommittees(text) {
  const items = [];
  let current = null;
  let readingReason = false;

  for (const line of text.split(/\r?\n/)) {
    const nameMatch = line.match(/^-\s*name:\s*(.+)\s*$/);
    if (nameMatch) {
      if (current?.name && current?.reason) items.push(current);
      current = { name: stripQuotes(nameMatch[1]), reason: "" };
      readingReason = false;
      continue;
    }

    if (!current) continue;

    const blockReasonMatch = line.match(/^\s*reason:\s*\|\s*$/);
    if (blockReasonMatch) {
      current.reason = "";
      readingReason = true;
      continue;
    }

    const inlineReasonMatch = line.match(/^\s*reason:\s*(.+)\s*$/);
    if (inlineReasonMatch) {
      current.reason = stripQuotes(inlineReasonMatch[1]);
      readingReason = false;
      continue;
    }

    if (readingReason) {
      current.reason += `${line.replace(/^\s{2,4}/, "")}\n`;
    }
  }

  if (current?.name && current?.reason) items.push(current);
  return items.map((item) => ({ ...item, reason: item.reason.trim() })).filter((item) => item.reason);
}

async function loadCommittees() {
  try {
    const response = await fetch("committees.yml", { cache: "no-store" });
    const loaded = parseCommittees(await response.text());
    if (loaded.length > 0) committees = loaded;
  } catch {
    // Keep the fallback committee.
  }
}

function pickCommittee() {
  if (committees.length === 1) return committees[0];

  let index = lastCommitteeIndex;
  while (index === lastCommitteeIndex) {
    index = Math.floor(Math.random() * committees.length);
  }
  lastCommitteeIndex = index;
  return committees[index];
}

function buildIssueUrl({ id, title, category, joke }) {
  const issueTitle = `WEB投稿：${title}`;
  const body = [
    "<!-- TUTORIAL_WEB_SUBMISSION -->",
    "",
    `投稿编号：${id}`,
    "",
    "## 拟投稿分类",
    "",
    category,
    "",
    "## 投稿正文",
    "",
    joke,
    "",
    "## 网页说明",
    "",
    "这条投稿来自WEB。机器可以拒绝它，但不能替人类最终判断它。",
  ].join("\n");
  const params = new URLSearchParams({
    template: "geb-joke.md",
    title: issueTitle,
    body,
  });
  return `https://github.com/zhuiyy/Me-with-a-big-big-band-of-crabs/issues/new?${params.toString()}`;
}

function renderVerdict() {
  reviewCount += 1;
  const panel = template.content.cloneNode(true);
  const committee = pickCommittee();
  panel.querySelector("h2").textContent = "未通过";

  const meta = panel.querySelector(".meta");
  [
    `投稿编号：${currentSubmission.id}`,
    `评审轮次：${reviewCount}`,
  ].forEach((text) => {
    const item = document.createElement("p");
    item.textContent = text;
    meta.append(item);
  });

  const card = panel.querySelector(".committee-card");
  const name = document.createElement("h3");
  name.textContent = committee.name;
  const reason = document.createElement("p");
  reason.textContent = committee.reason;
  card.append(name, reason);

  verdict.replaceChildren(panel);
}

function lockSubmission() {
  form.classList.add("form-locked");
  titleInput.disabled = true;
  categoryInput.disabled = true;
  jokeInput.disabled = true;
  document.querySelector("#submit-actions").hidden = true;
}

function resetPage() {
  currentSubmission = null;
  reviewCount = 0;
  lastCommitteeIndex = -1;
  form.reset();
  form.classList.remove("form-locked");
  titleInput.disabled = false;
  categoryInput.disabled = false;
  jokeInput.disabled = false;
  document.querySelector("#submit-actions").hidden = false;
  verdict.innerHTML = `
    <div class="empty-state">
      <p>委员会已经离席。</p>
      <p>它们留下了一张空桌子，供下一条投稿误以为自己是第一条投稿。</p>
    </div>
  `;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (currentSubmission) {
    renderVerdict();
    return;
  }

  const joke = jokeInput.value.trim();
  if (joke.length < 2) return;

  const id = crypto.randomUUID().slice(0, 8);
  const title = titleInput.value.trim() || "未命名投稿";
  const category = categoryInput.value;
  const issueUrl = buildIssueUrl({ id, title, category, joke });

  currentSubmission = { id, issueUrl };
  lockSubmission();
  window.open(issueUrl, "_blank", "noopener,noreferrer");
  renderVerdict();
});

verdict.addEventListener("click", (event) => {
  const action = event.target?.dataset?.action;
  if (action === "reroll") {
    renderVerdict();
  }
  if (action === "exit") {
    resetPage();
  }
});

loadCommittees();
