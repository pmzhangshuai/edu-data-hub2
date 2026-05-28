// 映射配置相关类型定义

export interface TableField {
  name: string;
  type: string;
  comment?: string;
  isPrimaryKey: boolean;
  nullable?: boolean;
  length?: number;
}

export interface SourceTable {
  name: string;
  comment?: string;
  fieldCount: number;
  rowCount: number;
  mappingStatus: 'unmapped' | 'mapping' | 'mapped';
  fields: TableField[];
}

export type TransformRuleType = 
  | 'direct' 
  | 'code-convert' 
  | 'date-format' 
  | 'unit-convert' 
  | 'string-substring' 
  | 'custom-sql' 
  | 'constant';

export interface FieldMapping {
  id: string;
  sourceField: string;
  targetField: string;
  transformRule: TransformRuleType;
  ruleConfig?: any; // 根据不同规则有不同配置
}

export interface MappingConfig {
  id?: string;
  name: string;
  description?: string;
  sourceDataSourceId: string;
  sourceTableName: string;
  targetTableName: string;
  fieldMappings: FieldMapping[];
  syncStrategy?: {
    syncMode: 'full' | 'incremental';
    syncField?: string;
    filterCondition?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface TargetField {
  name: string;
  type: string;
  required: boolean;
  comment?: string;
}

export interface TargetTable {
  name: string;
  comment?: string;
  fields: TargetField[];
}
