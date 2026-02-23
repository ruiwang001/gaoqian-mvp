# 搞钱 MVP 💰

AI 驱动的赚钱路径拆解工具 - 从目标设定到每日执行，AI 帮你规划副业/轻创业路径。

![搞钱 MVP](https://img.shields.io/badge/搞钱-MVP-green)
![Next.js](https://img.shields.io/badge/Next.js-14.2-blue)
![Kimi AI](https://img.shields.io/badge/AI-Kimi-purple)

## 功能特点

- 🎯 **目标拆解**：输入你的收入目标和时间投入，AI 帮你分析
- 💡 **AI 推荐**：基于你的技能，推荐 3 条赚钱路径
- 📋 **任务板**：自动拆解为可执行的任务清单
- 🤖 **AI 执行**：每个任务可让 AI 直接完成或拆解为子任务
- 🌙 **深色模式**：支持浅色/深色主题切换

## 页面流程

1. **首页** - 介绍和开始入口
2. **信息收集** (`/onboarding`) - 填写年龄、收入、技能、时间等
3. **AI 推荐** (`/recommendations`) - AI 生成 3 条赚钱路径
4. **任务板** (`/plan`) - 选择路径后生成详细任务清单

## 技术栈

- **框架**: Next.js 14 + React 18 + TypeScript
- **样式**: Tailwind CSS
- **AI**: Kimi (Moonshot) API
- **部署**: Vercel

## 本地开发

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入你的 MOONSHOT_API_KEY

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## 部署

### 环境变量

部署前需要设置以下环境变量：

| 变量名 | 说明 |
|--------|------|
| `MOONSHOT_API_KEY` | Kimi API Key (必填) |
| `MOONSHOT_API_BASE` | API 基础地址 (默认: https://api.moonshot.cn/v1) |
| `KIMI_MODEL` | 模型名称 (默认: moonshot-v1-32k) |

获取 API Key: https://platform.moonshot.cn/

### 部署到 Vercel

1. Fork 或推送代码到 GitHub
2. 登录 [Vercel](https://vercel.com)
3. 创建新项目，导入 GitHub 仓库
4. 在 Environment Variables 中添加上述变量
5. 点击 Deploy

## 截图

![首页截图](./screenshots/home.png)

## License

MIT

---

**⚠️ 风险提示**: 本工具提供的收入估算仅供参考，实际结果取决于市场、执行质量等因素，不构成收益承诺或投资建议。
