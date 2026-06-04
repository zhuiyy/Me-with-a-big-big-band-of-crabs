# WEB

一个 GitHub Pages 静态小网站，假装征集 GEB 笑话。

流程：

1. 用户在网页写一条文字笑话。
2. 第一次提交时，网页生成一个 GitHub Issue 投稿链接，并锁定本轮投稿。
3. 用户可以选择“退出”或“换另一个委员会评审”。
4. 换委员会只随机更换退稿意见，不会重新生成投稿链接。
5. GitHub Action 会把当天前 5 条 WEB Issue 转成 draft PR，交给人类审核。

## 改委员会

编辑 [committees.yml](./committees.yml)。

只需要写：

```yaml
- name: 委员会名字
  reason: |
    拒绝理由。
```

网页每次随机抽一个委员会；如果用户点“换另一个委员会评审”，会尽量避免连续抽到同一个。

## GitHub Pages

这个目录可以由 `.github/workflows/pages.yml` 部署为 Pages。网页本身不保存 GitHub token；真正转 PR 的动作在 GitHub Action 里执行。
