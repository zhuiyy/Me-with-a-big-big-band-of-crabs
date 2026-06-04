const fs = require("node:fs");
const path = require("node:path");

const issueNumber = process.env.ISSUE_NUMBER;
const issueTitle = process.env.ISSUE_TITLE || `WEB投稿 #${issueNumber}`;
const issueBody = process.env.ISSUE_BODY || "";
const today = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

function section(name) {
  const pattern = new RegExp(`## ${name}\\s*\\n([\\s\\S]*?)(?=\\n## |$)`);
  const match = issueBody.match(pattern);
  return match ? match[1].trim() : "";
}

const category = section("拟投稿分类") || "尚未分类";
const joke = section("投稿正文") || issueBody.trim();
const targetDir = path.join("投稿箱", today, `issue-${issueNumber}`);

fs.mkdirSync(targetDir, { recursive: true });
fs.writeFileSync(
  path.join(targetDir, "README.md"),
  [
    `# ${issueTitle.replace(/^WEB投稿：/, "") || `投稿 #${issueNumber}`}`,
    "",
    "> 来自WEB的投稿。",
    "",
    `原 Issue：#${issueNumber}`,
    "",
    `拟投稿分类：${category}`,
    "",
    "## 正文",
    "",
    joke,
    "",
    "## 审核状态",
    "",
    "人工审核前，此文件只证明它曾经试图成为一个文件。",
    "",
  ].join("\n"),
  "utf8",
);
