# edu-data-hub2
学校教育质量监测数据采集平台前端

## 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI 组件库**: Ant Design 5
- **状态管理**: Zustand
- **路由**: React Router v6
- **HTTP 客户端**: Axios
- **Mock 服务**: MSW (Mock Service Worker)

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 代码检查
npm run lint
```

## 项目结构

```
src/
├── api/                    # API 请求层
├── components/            # 通用组件
├── config/               # 配置文件（菜单、路由、常量）
├── hooks/                 # 自定义 Hooks
├── layouts/              # 布局组件
├── mocks/                # Mock 数据
├── pages/                # 页面组件
│   ├── Home/             # 首页仪表盘
│   ├── DataAcquisition/  # 数据采集
│   ├── DataGovernance/   # 数据治理
│   ├── IndicatorSystem/   # 指标体系
│   ├── MonitoringAnalysis/ # 监测分析
│   ├── ReportGeneration/  # 报告生成
│   ├── AssessmentCertification/ # 评估认证
│   ├── SystemManagement/  # 系统管理
│   ├── Integration/      # 开放集成
│   └── MobileExperience/ # 移动端体验
├── stores/               # Zustand 状态管理
├── styles/               # 全局样式
├── types/                # TypeScript 类型定义
└── utils/                # 工具函数
```

## 功能模块

本系统包含九大功能域：

1. **数据采集层** - 多源异构数据的统一入口
2. **数据治理层** - 确保数据"进得来、对得准、管得住"
3. **指标体系层** - 灵活可配置的"测量标尺"
4. **监测分析层** - 从"看数据"到"读数据"
5. **报告生成层** - 一键输出"专业级"质量报告
6. **评估认证层** - 支撑"以评促建、以评促改"
7. **系统管理层** - 保障平台稳定、安全、易用
8. **开放集成层** - 打破数据孤岛
9. **移动端体验层** - 让"用数据"更便捷

## 部署到 Vercel

本项目已配置好 Vercel 部署：

1. 将代码推送到 GitHub 仓库
2. 在 Vercel 中导入项目
3. Vercel 会自动检测为 Vite 项目
4. 点击 Deploy 开始部署

详细部署文档请参考：[docs/Vercel部署指南.md](docs/Vercel部署指南.md)

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `VITE_API_BASE_URL` | API 基础地址 | `/api` |
| `VITE_MOCK_ENABLED` | 是否启用 Mock | `true` |
| `VITE_API_TIMEOUT` | 请求超时时间 | `30000` |

## 许可证

MIT
