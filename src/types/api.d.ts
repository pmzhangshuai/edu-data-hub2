// 数据源类型
export type DataSourceType =
  | 'academic'
  | 'personnel'
  | 'research'
  | 'student'
  | 'employment'
  | 'financial'
  | 'asset'
  | 'card'
  | 'other';

export type DatabaseType = 'mysql' | 'oracle' | 'sqlserver' | 'postgresql';

export type DataSourceStatus = 'active' | 'inactive' | 'error';

export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  dbType: DatabaseType;
  host: string;
  port: number;
  databaseName: string;
  username: string;
  status: DataSourceStatus;
  lastSyncTime?: string;
  createdAt: string;
  updatedAt: string;
}

// 同步任务类型
export type SyncMode = 'full' | 'incremental';
export type SyncStatus = 'running' | 'success' | 'failed' | 'paused';

export interface SyncTask {
  id: string;
  name: string;
  sourceDataSourceId: string;
  sourceTable: string;
  targetTable: string;
  syncMode: SyncMode;
  incrementalField?: string;
  status: SyncStatus;
  lastRunTime?: string;
  lastRunDuration?: number;
  lastRunRecords?: number;
  createdAt: string;
  updatedAt: string;
}

// 同步实例类型
export interface SyncInstance {
  id: string;
  taskId: string;
  status: SyncStatus;
  startTime: string;
  endTime?: string;
  totalCount: number;
  successCount: number;
  errorCount: number;
  logs?: string[];
}

// 字段映射配置
export interface FieldMapping {
  sourceField: string;
  targetField: string;
  transformRule?: string;
  isPrimaryKey?: boolean;
}

export interface MappingConfig {
  id: string;
  taskId: string;
  mappings: FieldMapping[];
  filterCondition?: string;
}

// 监测指标类型
export interface IndicatorThreshold {
  green: number;
  yellow: number;
  red: number;
}

export interface MonitoringIndicator {
  id: string;
  name: string;
  code: string;
  category: string;
  formula?: string;
  threshold?: IndicatorThreshold;
  unit?: string;
  currentValue?: number;
  updateFrequency: string;
  responsibleDept: string;
}

// 数据质量规则
export type RuleType = 'completeness' | 'format' | 'range' | 'logic' | 'uniqueness';
export type RuleSeverity = 'error' | 'warning' | 'info';
export type HandleStrategy = 'reject' | 'allow' | 'replace';

export interface DataQualityRule {
  id: string;
  taskId: string;
  ruleName: string;
  ruleType: RuleType;
  field: string;
  operator: string;
  value?: string;
  errorMessage: string;
  severity: RuleSeverity;
  handleStrategy: HandleStrategy;
  status: 'enabled' | 'disabled';
}

// 异常数据
export interface AnomalyRecord {
  id: string;
  ruleId: string;
  dataId: string;
  originalValue: string;
  errorMessage: string;
  status: 'pending' | 'resolved' | 'ignored';
  resolvedValue?: string;
  resolvedBy?: string;
  resolvedAt?: string;
}

// 用户类型
export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'user';
  department: string;
  permissions: string[];
}

// 登录响应
export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
  expiresIn: number;
}

// API响应封装
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  success: boolean;
}

// 分页参数
export interface PaginationParams {
  page: number;
  pageSize: number;
  total?: number;
}

// 分页响应
export interface PaginatedResponse<T> {
  list: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// 菜单项
export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  path?: string;
  component?: React.ComponentType;
}
