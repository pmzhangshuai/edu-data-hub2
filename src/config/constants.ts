export const APP_NAME = '高等教育质量监测数据采集系统';
export const APP_VERSION = '1.0.0';

export const DATA_SOURCE_TYPES = {
  academic: '教务系统',
  personnel: '人事系统',
  research: '科研系统',
  student: '学工系统',
  employment: '就业系统',
  financial: '财务系统',
  asset: '资产系统',
  card: '一卡通',
  other: '其他',
} as const;

export const DATABASE_TYPES = {
  mysql: 'MySQL',
  oracle: 'Oracle',
  sqlserver: 'SQL Server',
  postgresql: 'PostgreSQL',
} as const;

export const SYNC_MODES = {
  full: '全量同步',
  incremental: '增量同步',
} as const;

export const SYNC_STATUS = {
  running: '运行中',
  success: '成功',
  failed: '失败',
  paused: '已暂停',
} as const;

export const DATA_SOURCE_STATUS = {
  active: '活跃',
  inactive: '未激活',
  error: '异常',
} as const;

export const RULE_TYPES = {
  completeness: '完整性',
  format: '格式',
  range: '范围',
  logic: '逻辑',
  uniqueness: '唯一性',
} as const;

export const RULE_SEVERITY = {
  error: '错误',
  warning: '警告',
  info: '信息',
} as const;

export const USER_ROLES = {
  admin: '系统管理员',
  manager: '部门管理员',
  user: '普通用户',
} as const;
