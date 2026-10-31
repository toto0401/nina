# 妮娜 Nina · 个人作品集

Nina · 余知宴的中英双语作品集，以太空传送门连接关于我、作品与分享经历。

GitHub 仓库：https://github.com/toto0401/nina

## 本地预览

在本文件夹运行 `python3 -m http.server 8080`，打开 http://localhost:8080。
网站使用原生 HTML、CSS 和 JavaScript，不需要安装依赖或构建。

## 添加作品

在 `index.html` 的 `projects` 数组中维护作品。每个独立作品使用自己的
GitHub 仓库，已发布源码映射在 `github-links.js` 中维护。页面顶部、底部、
作品卡片与详情页均有 GitHub 入口，支持中英切换后的重新渲染。
没有完成源码发布的作品应显示真实进度，不添加虚构仓库链接。

## 作品源码

| 作品 | GitHub |
|---|---|
| 学习助手前端 | https://github.com/toto0401/learn |
| 辅助学习 APP 与后端 | https://github.com/toto0401/learn-app |
| 霓虹残响 | https://github.com/toto0401/neon-afterimage |
| 潮汐灯塔 | https://github.com/toto0401/tidal-lighthouse |
| 逐页 | https://github.com/toto0401/zhuye |
| 古人朋友圈 | https://github.com/toto0401/ancient-friends |
| 轨迹之城 | https://github.com/toto0401/neon-trace-city |
| 评论区人格测试 | https://github.com/toto0401/comment-persona |

星图为团队项目，目前保留介绍，尚未找到可发布源码。

## 上传前检查

- 检查待提交文件和 Git 历史里的短信密钥、API 密钥、访问令牌及私钥。
- 将真实密钥改为服务端环境变量，提供不含真实值的 `.env.example`。
- 前端代码、网页和安装包中不能保存服务端密钥。
- `.env`、私钥和本地凭据已加入 `.gitignore`；忽略规则不能清除已提交的文件和历史。
- 不上传本地聊天、用户数据库、登录状态或私人资料。
- 如果历史中出现真实密钥，先停止发布并处理历史；已泄露的密钥还需在服务商处撤销或更换。

## 媒体

`assets/nina-2050.mp4` 为大会分享视频。头像可按 `assets/README.md` 的说明添加。
