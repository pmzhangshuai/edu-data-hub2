import {
  DatabaseOutlined,
  SafetyOutlined,
  BarChartOutlined,
  DashboardOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  SettingOutlined,
  ApiOutlined,
  MobileOutlined,
} from '@ant-design/icons';
import type { MenuItem } from '@/types/api';

export const menuItems: MenuItem[] = [
  {
    key: '/home',
    label: '首页',
    icon: <DashboardOutlined />,
  },
  {
    key: '/data-acquisition',
    label: '数据采集',
    icon: <DatabaseOutlined />,
    children: [
      { key: '/data-acquisition/sources', label: '数据源管理' },
      { key: '/data-acquisition/mapping', label: '映射配置' },
      { key: '/data-acquisition/tasks', label: '同步任务' },
      { key: '/data-acquisition/semi-auto', label: '半自动化采集' },
      { key: '/data-acquisition/manual', label: '人工补录' },
    ],
  },
  {
    key: '/data-governance',
    label: '数据治理',
    icon: <SafetyOutlined />,
    children: [
      { key: '/data-governance/quality', label: '质量管控' },
      { key: '/data-governance/metadata', label: '元数据管理' },
      { key: '/data-governance/lifecycle', label: '生命周期管理' },
      { key: '/data-governance/cleaning', label: '清洗工作台' },
    ],
  },
  {
    key: '/indicator-system',
    label: '指标体系',
    icon: <BarChartOutlined />,
    children: [
      { key: '/indicator-system/library', label: '指标库管理' },
      { key: '/indicator-system/views', label: '多维视图' },
      { key: '/indicator-system/dimensions', label: '监测维度' },
    ],
  },
  {
    key: '/monitoring-analysis',
    label: '监测分析',
    icon: <DashboardOutlined />,
    children: [
      { key: '/monitoring-analysis/dashboard', label: '领导驾驶舱' },
      { key: '/monitoring-analysis/analysis', label: '多维分析' },
      { key: '/monitoring-analysis/warning', label: '智能预警' },
    ],
  },
  {
    key: '/report-generation',
    label: '报告生成',
    icon: <FileTextOutlined />,
    children: [
      { key: '/report-generation/templates', label: '模板管理' },
      { key: '/report-generation/generate', label: '报告生成' },
      { key: '/report-generation/collaboration', label: '协作发布' },
    ],
  },
  {
    key: '/assessment-certification',
    label: '评估认证',
    icon: <CheckCircleOutlined />,
    children: [
      { key: '/assessment-certification/audit', label: '审核评估' },
      { key: '/assessment-certification/professional', label: '专业认证' },
      { key: '/assessment-certification/standards', label: '认证标准库' },
    ],
  },
  {
    key: '/system-management',
    label: '系统管理',
    icon: <SettingOutlined />,
    children: [
      { key: '/system-management/permissions', label: '权限管理' },
      { key: '/system-management/workflow', label: '流程引擎' },
      { key: '/system-management/logs', label: '日志审计' },
      { key: '/system-management/organization', label: '组织架构' },
    ],
  },
  {
    key: '/integration',
    label: '开放集成',
    icon: <ApiOutlined />,
    children: [
      { key: '/integration/interfaces', label: '标准接口' },
      { key: '/integration/push', label: '数据推送' },
      { key: '/integration/subscription', label: '订阅管理' },
    ],
  },
  {
    key: '/mobile-experience',
    label: '移动端体验',
    icon: <MobileOutlined />,
    children: [
      { key: '/mobile-experience/app', label: '移动应用' },
      { key: '/mobile-experience/assistant', label: '智能助手' },
    ],
  },
];

export default menuItems;
