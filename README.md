# WEB

一个 GitHub Pages 静态小网站，假装征集 GEB 笑话。

流程：

1. 用户在网页写一条文字笑话。
2. 第一次提交时，网页打开一个预填好的 GitHub Issue，并锁定本轮投稿。
3. 用户可以选择“退出”或“换另一个委员会评审”。
4. 换委员会只随机更换退稿意见，不会重新生成投稿链接。
5. Issue 留给人类阅读和处理；网页不会自动创建文件或 Pull Request。

网页直接通过 GitHub 的 URL 参数预填 Issue，不依赖 Issue 模板或 GitHub Actions。

## 发布

GitHub Pages 从 `gh-pages` 分支的根目录发布。修改本站后，需要把本目录的内容同步到该分支；仓库刻意不使用自动发布工作流。

## 改委员会

编辑 [committees.yml](./committees.yml)。

只需要写：

```yaml
- name: 委员会名字
  reason: |
    拒绝理由。
```

网页每次随机抽一个委员会；如果用户点“换另一个委员会评审”，会尽量避免连续抽到同一个。

# Warning
There are no more jokes in WEB. W means 'Without Gödel', therefore there may be four bugs or less or more.
