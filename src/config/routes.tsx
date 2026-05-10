export const routesConfig = [
  {
    path: '/home',
    name: '首页',
    meta: { title: '首页' },
  },
  {
    path: '/data-acquisition',
    name: '数据采集',
    meta: { title: '数据采集层' },
    children: [
      { path: 'sources', name: '数据源管理', meta: { title: '数据源管理' } },
      { path: 'mapping', name: '映射配置', meta: { title: '映射配置' } },
      { path: 'tasks', name: '同步任务', meta: { title: '同步任务' } },
      { path: 'semi-auto', name: '半自动化采集', meta: { title: '半自动化采集' } },
      { path: 'manual', name: '人工补录', meta: { title: '人工补录' } },
    ],
  },
  {
    path: '/data-governance',
    name: '数据治理',
    meta: { title: '数据治理层' },
    children: [
      { path: 'quality', name: '质量管控', meta: { title: '质量管控' } },
      { path: 'metadata', name: '元数据管理', meta: { title: '元数据管理' } },
      { path: 'lifecycle', name: '生命周期管理', meta: { title: '生命周期管理' } },
      { path: 'cleaning', name: '清洗工作台', meta: { title: '清洗工作台' } },
    ],
  },
  {
    path: '/indicator-system',
    name: '指标体系',
    meta: { title: '指标体系层' },
    children: [
      { path: 'library', name: '指标库管理', meta: { title: '指标库管理' } },
      { path: 'views', name: '多维视图', meta: { title: '多维视图' } },
      { path: 'dimensions', name: '监测维度', meta: { title: '监测维度' } },
    ],
  },
  {
    path: '/monitoring-analysis',
    name: '监测分析',
    meta: { title: '监测分析层' },
    children: [
      { path: 'dashboard', name: '领导驾驶舱', meta: { title: '领导驾驶舱' } },
      { path: 'analysis', name: '多维分析', meta: { title: '多维分析' } },
      { path: 'warning', name: '智能预警', meta: { title: '智能预警' } },
    ],
  },
  {
    path: '/report-generation',
    name: '报告生成',
    meta: { title: '报告生成层' },
    children: [
      { path: 'templates', name: '模板管理', meta: { title: '模板管理' } },
      { path: 'generate', name: '报告生成', meta: { title: '报告生成' } },
      { path: 'collaboration', name: '协作发布', meta: { title: '协作发布' } },
    ],
  },
  {
    path: '/assessment-certification',
    name: '评估认证',
    meta: { title: '评估认证层' },
    children: [
      { path: 'audit', name: '审核评估', meta: { title: '审核评估' } },
      { path: 'professional', name: '专业认证', meta: { title: '专业认证' } },
      { path: 'standards', name: '认证标准库', meta: { title: '认证标准库' } },
    ],
  },
  {
    path: '/system-management',
    name: '系统管理',
    meta: { title: '系统管理层' },
    children: [
      { path: 'permissions', name: '权限管理', meta: { title: '权限管理' } },
      { path: 'workflow', name: '流程引擎', meta: { title: '流程引擎' } },
      { path: 'logs', name: '日志审计', meta: { title: '日志审计' } },
      { path: 'organization', name: '组织架构', meta: { title: '组织架构' } },
    ],
  },
  {
    path: '/integration',
    name: '开放集成',
    meta: { title: '开放集成层' },
    children: [
      { path: 'interfaces', name: '标准接口', meta: { title: '标准接口' } },
      { path: 'push', name: '数据推送', meta: { title: '数据推送' } },
      { path: 'subscription', name: '订阅管理', meta: { title: '订阅管理' } },
    ],
  },
  {
    path: '/mobile-experience',
    name: '移动端体验',
    meta: { title: '移动端与用户体验层' },
    children: [
      { path: 'app', name: '移动应用', meta: { title: '移动应用' } },
      { path: 'assistant', name: '智能助手', meta: { title: '智能助手' } },
    ],
  },
  {
    path: '/404',
    name: 'NotFound',
    meta: { title: '页面不存在' },
  },
];

export default routesConfig;
