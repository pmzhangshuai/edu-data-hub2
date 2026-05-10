# Vercel 部署指南

## 方案一：从 GitHub 导入（推荐）

### 步骤 1：推送代码到 GitHub

```bash
# 在项目根目录执行
git add .
git commit -m "refactor: 调整项目结构以适配 Vercel 部署"
git push origin main
```

### 步骤 2：在 Vercel 中导入项目

1. 登录 [Vercel](https://vercel.com)
2. 点击 **"Add New..."** → **"Project"**
3. 在 "Import Git Repository" 页面找到你的仓库
4. 点击仓库旁边的 **"Import"** 按钮

### 步骤 3：配置项目

Vercel 会自动检测到这是一个 Vite + React 项目，正确配置以下选项：

| 配置项 | 值 | 说明 |
|--------|-----|------|
| **Framework Preset** | `Vite` | ✅ 自动检测 |
| **Root Directory** | `.` | ✅ 默认就是根目录，无需修改 |
| **Build Command** | `npm run build` | ✅ 默认配置 |
| **Output Directory** | `dist` | ✅ Vite 默认输出目录 |
| **Install Command** | `npm install` | ✅ 默认配置 |

### 步骤 4：环境变量（可选）

点击 **"Environment Variables"** 添加：

```env
# 生产环境API地址（根据实际后端地址修改）
VITE_API_BASE_URL=https://your-api-domain.com/api

# 是否启用Mock（生产环境必须关闭）
VITE_MOCK_ENABLED=false
```

### 步骤 5：部署

点击 **"Deploy"** 按钮，等待部署完成。

---

## 方案二：使用 Vercel CLI

### 安装 Vercel CLI

```bash
npm install -g vercel
```

### 登录并部署

```bash
# 登录 Vercel
vercel login

# 部署项目
vercel

# 生产环境部署
vercel --prod
```

---

## 部署配置说明

### vercel.json

项目根目录已包含 `vercel.json` 配置文件：

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}
```

### vite.config.ts

已配置正确的部署设置：

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/',  // 确保静态资源从根路径加载
  build: {
    outDir: 'dist',
  },
})
```

---

## 验证部署成功

部署成功后，访问 Vercel 提供的 URL（如 `https://your-project.vercel.app`），应该能看到：

✅ 带有侧边栏的管理后台界面  
✅ 首页显示九大功能模块卡片  
✅ 点击菜单可以正常切换路由  
✅ 底部显示"高等教育质量监测数据采集系统"

---

## 常见问题排查

### ❌ 页面显示空白

**可能原因**：
1. 路由配置问题
2. 资源路径问题

**解决方法**：
- 确保 `vite.config.ts` 中 `base: '/'` 配置正确
- 检查浏览器控制台是否有资源加载错误

### ❌ 404 错误

**可能原因**：SPA 路由需要服务端配置

**解决方法**：
- 已通过 `vercel.json` 自动配置
- 如果仍有问题，添加以下配置到 `vercel.json`：

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### ❌ API 请求失败

**可能原因**：
1. CORS 问题
2. API 地址配置错误

**解决方法**：
- 在 Vercel 环境变量中设置正确的 `VITE_API_BASE_URL`
- 确保后端配置了 CORS 允许 Vercel 域名

---

## 后续配置

### 配置自定义域名（可选）

1. 进入 Vercel 项目设置
2. 点击 **"Domains"**
3. 添加你的域名（如 `edu-data.yourschool.edu.cn`）
4. 按提示配置 DNS 记录

### 配置生产环境 API

1. 在 Vercel 项目设置中添加环境变量：
   - `VITE_API_BASE_URL`: 指向生产环境后端 API
   - `VITE_MOCK_ENABLED`: `false`

2. 重新部署以使配置生效

---

## 部署检查清单

部署前确认以下文件都存在：

- ✅ `package.json` - 项目依赖配置
- ✅ `vite.config.ts` - Vite 构建配置
- ✅ `tsconfig.json` - TypeScript 配置
- ✅ `vercel.json` - Vercel 部署配置
- ✅ `index.html` - 应用入口 HTML
- ✅ `src/` - 源代码目录

---

## 获取帮助

- [Vercel 官方文档](https://vercel.com/docs)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html#vercel)
- [项目 GitHub Issues](https://github.com/pmzhangshuai/edu-data-hub2/issues)
