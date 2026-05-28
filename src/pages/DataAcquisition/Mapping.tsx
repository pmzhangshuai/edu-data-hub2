import React, { useState, useEffect, useRef } from 'react';
import {
  Layout,
  Tree,
  Input,
  Card,
  Tag,
  Checkbox,
  Tabs,
  Form,
  Select,
  Button,
  Drawer,
  message,
  Typography,
  Space,
  Empty,
  Collapse,
  Badge,
  Radio,
  Alert
} from 'antd';
import {
  DatabaseOutlined,
  CloudServerOutlined,
  SearchOutlined,
  SaveOutlined,
  DeleteOutlined,
  SettingOutlined,
  EyeOutlined,
  RightOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

import { mockDataSources } from '@/mocks/data';
import { mockAcademicTables, mockTargetTables } from '@/mocks/data/mapping';
import type { DataSource } from '@/types/api';
import type { 
  SourceTable, 
  TargetTable, 
  FieldMapping, 
  MappingConfig,
  TransformRuleType 
} from '@/types/mapping';
import { DATA_SOURCE_TYPE_MAP, DATABASE_TYPE_MAP } from '@/types/api';

const { Sider, Content } = Layout;
const { Option } = Select;
const { Title, Text } = Typography;
const { Panel } = Collapse;

// 转换规则选项
const TRANSFORM_RULE_OPTIONS: { value: TransformRuleType; label: string }[] = [
  { value: 'direct', label: '直接映射' },
  { value: 'code-convert', label: '编码转换' },
  { value: 'date-format', label: '日期格式化' },
  { value: 'unit-convert', label: '数值单位转换' },
  { value: 'string-substring', label: '字符串截取' },
  { value: 'custom-sql', label: '自定义SQL' },
  { value: 'constant', label: '常量值' }
];

// 状态标签映射
const STATUS_TAG_COLORS = {
  unmapped: 'default',
  mapping: 'processing',
  mapped: 'success'
} as const;

const STATUS_TAG_TEXTS = {
  unmapped: '未配置',
  mapping: '配置中',
  mapped: '已配置'
} as const;

const Mapping: React.FC = () => {
  const [form] = Form.useForm();
  
  // 数据源和表数据
  const [dataSources] = useState(mockDataSources);
  const [selectedDataSourceId, setSelectedDataSourceId] = useState<string | null>(null);
  const [sourceTables, setSourceTables] = useState<SourceTable[]>([]);
  const [expandedTables, setExpandedTables] = useState<string[]>([]);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  
  // 搜索过滤
  const [dataSourceSearchText, setDataSourceSearchText] = useState('');
  
  // 映射配置
  const [, setMappingConfig] = useState<MappingConfig | null>(null);
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [ruleConfigVisible, setRuleConfigVisible] = useState(false);
  const [selectedMappingForEdit, setSelectedMappingForEdit] = useState<FieldMapping | null>(null);
  
  // 当前选中的表
  const [selectedSourceTable, setSelectedSourceTable] = useState<SourceTable | null>(null);
  const [selectedTargetTable, setSelectedTargetTable] = useState<TargetTable | null>(null);
  
  // 字段映射状态
  const [selectedSourceFields, setSelectedSourceFields] = useState<string[]>([]);
  const [selectedTargetFields, setSelectedTargetFields] = useState<string[]>([]);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  
  // 自动保存相关
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // 构建数据源树结构
  const buildDataSourceTree = (): DataNode[] => {
    // 按类型分组
    const grouped: Record<string, DataSource[]> = {};
    dataSources.forEach(ds => {
      if (!grouped[ds.type]) {
        grouped[ds.type] = [];
      }
      grouped[ds.type].push(ds);
    });
    
    // 过滤搜索
    const filteredGroups = Object.entries(grouped).filter(([_, dsList]) => 
      dsList.some(ds => 
        ds.name.toLowerCase().includes(dataSourceSearchText.toLowerCase())
      )
    );
    
    return filteredGroups.map(([type, dsList]) => ({
      key: `type-${type}`,
      title: (
        <Space>
          <DatabaseOutlined />
          <span>{DATA_SOURCE_TYPE_MAP[type as keyof typeof DATA_SOURCE_TYPE_MAP]}</span>
          <Badge count={dsList.length} style={{ marginLeft: 'auto' }} />
        </Space>
      ),
      children: dsList
        .filter(ds => ds.name.toLowerCase().includes(dataSourceSearchText.toLowerCase()))
        .map(ds => ({
          key: ds.id,
          title: (
            <Space>
              <CloudServerOutlined style={{ color: selectedDataSourceId === ds.id ? '#1890ff' : '' }} />
              <span style={{ fontWeight: selectedDataSourceId === ds.id ? 600 : 'normal' }}>
                {ds.name}
              </span>
            </Space>
          ),
          isLeaf: true
        }))
    }));
  };
  
  // 选择数据源
  const handleSelectDataSource = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length > 0) {
      const id = selectedKeys[0].toString();
      if (!id.startsWith('type-')) {
        setSelectedDataSourceId(id);
        
        // 模拟加载该数据源下的表（这里只对教务系统返回Mock数据）
        const ds = dataSources.find(d => d.id === id);
        if (ds && ds.type === 'academic' && ds.dbType === 'mysql') {
          setSourceTables(mockAcademicTables);
        } else {
          // 其他数据源暂时返回空
          setSourceTables([]);
        }
        
        setSelectedTables([]);
        setSelectedSourceTable(null);
        setFieldMappings([]);
      }
    }
  };
  
  // 切换表展开/折叠
  const toggleTableExpand = (tableName: string) => {
    setExpandedTables(prev => 
      prev.includes(tableName)
        ? prev.filter(name => name !== tableName)
        : [...prev, tableName]
    );
  };
  
  // 选择表
  const handleSelectTable = (e: CheckboxChangeEvent, tableName: string) => {
    setSelectedTables(prev => 
      e.target.checked
        ? [...prev, tableName]
        : prev.filter(name => name !== tableName)
    );
  };
  
  // 选择具体表进行映射配置
  const handleConfigureTable = (table: SourceTable) => {
    setSelectedSourceTable(table);
    setFieldMappings([]);
    setSelectedSourceFields([]);
    setSelectedTargetFields([]);
    
    // 默认选择第一个目标表
    setSelectedTargetTable(mockTargetTables[0]);
    
    // 重置表单
    form.setFieldsValue({
      name: `${table.name}_映射`,
      description: '',
      targetTableName: mockTargetTables[0].name
    });
    
    setMappingConfig({
      name: `${table.name}_映射`,
      sourceDataSourceId: selectedDataSourceId!,
      sourceTableName: table.name,
      targetTableName: mockTargetTables[0].name,
      fieldMappings: []
    });
    
    setActiveTab('basic');
  };
  
  // 添加字段映射
  const handleAddFieldMapping = () => {
    if (selectedSourceFields.length > 0 && selectedTargetFields.length > 0) {
      const sourceField = selectedSourceFields[0];
      const targetField = selectedTargetFields[0];
      
      const newMapping: FieldMapping = {
        id: `mapping-${Date.now()}`,
        sourceField,
        targetField,
        transformRule: 'direct'
      };
      
      setFieldMappings(prev => [...prev, newMapping]);
      setSelectedSourceFields([]);
      setSelectedTargetFields([]);
      
      // 触发自动保存
      triggerAutoSave();
    }
  };
  
  // 删除字段映射
  const handleDeleteFieldMapping = (mappingId: string) => {
    setFieldMappings(prev => prev.filter(m => m.id !== mappingId));
    triggerAutoSave();
  };
  
  // 编辑转换规则
  const handleEditRuleConfig = (mapping: FieldMapping) => {
    setSelectedMappingForEdit(mapping);
    setRuleConfigVisible(true);
  };
  
  // 保存转换规则
  const handleSaveRuleConfig = (ruleType: TransformRuleType, config: any) => {
    if (selectedMappingForEdit) {
      setFieldMappings(prev => 
        prev.map(m => 
          m.id === selectedMappingForEdit.id
            ? { ...m, transformRule: ruleType, ruleConfig: config }
            : m
        )
      );
    }
    setRuleConfigVisible(false);
    setSelectedMappingForEdit(null);
    triggerAutoSave();
  };
  
  // 自动保存
  const triggerAutoSave = () => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    
    autoSaveTimerRef.current = setTimeout(() => {
      message.info('已自动保存草稿');
    }, 1000);
  };
  
  // 保存映射配置
  const handleSaveMappingConfig = () => {
    message.success('映射配置保存成功');
  };
  
  // 清理定时器
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);
  
  return (
    <Layout style={{ height: 'calc(100vh - 112px)' }}>
      {/* 左侧：数据源导航树 */}
      <Sider width={250} theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
        <div style={{ padding: 16 }}>
          <Title level={5} style={{ margin: 0, marginBottom: 12 }}>
            <DatabaseOutlined style={{ marginRight: 8 }} />
            数据源
          </Title>
          
          <Input
            placeholder="搜索数据源"
            prefix={<SearchOutlined />}
            value={dataSourceSearchText}
            onChange={(e) => setDataSourceSearchText(e.target.value)}
            style={{ marginBottom: 12 }}
          />
          
          <div style={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
            <Tree
              treeData={buildDataSourceTree()}
              defaultExpandAll
              onSelect={handleSelectDataSource}
              selectedKeys={selectedDataSourceId ? [selectedDataSourceId] : []}
            />
          </div>
        </div>
      </Sider>
      
      {/* 中间：源数据表 */}
      <Sider width={400} theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
        <div style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {selectedDataSourceId ? (
            <>
              <div style={{ marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #f0f0f0' }}>
                <Title level={5} style={{ margin: 0, marginBottom: 4 }}>
                  源数据表
                </Title>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {dataSources.find(ds => ds.id === selectedDataSourceId)?.name}
                  {' · '}
                  {DATABASE_TYPE_MAP[dataSources.find(ds => ds.id === selectedDataSourceId)?.dbType as keyof typeof DATABASE_TYPE_MAP]}
                </Text>
              </div>
              
              <div style={{ flex: 1, overflow: 'auto' }}>
                {sourceTables.length > 0 ? (
                  <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    {sourceTables.map(table => (
                      <Card 
                        key={table.name}
                        size="small"
                        style={{ cursor: 'pointer' }}
                        hoverable
                        onClick={() => handleConfigureTable(table)}
                        title={
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Space>
                              <Checkbox 
                                checked={selectedTables.includes(table.name)}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => handleSelectTable(e, table.name)}
                              />
                              <span style={{ fontWeight: 500 }}>{table.name}</span>
                            </Space>
                            <Tag color={STATUS_TAG_COLORS[table.mappingStatus]}>
                              {STATUS_TAG_TEXTS[table.mappingStatus]}
                            </Tag>
                          </div>
                        }
                      >
                        <div style={{ marginBottom: 8 }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {table.comment}
                          </Text>
                        </div>
                        
                        <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {table.fieldCount} 字段
                          </Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {table.rowCount.toLocaleString()} 行
                          </Text>
                        </div>
                        
                        <Collapse
                          bordered={false}
                          size="small"
                          activeKey={expandedTables.includes(table.name) ? [table.name] : []}
                          onChange={(keys) => {
                            if (keys.length > 0) {
                              toggleTableExpand(table.name);
                            } else {
                              setExpandedTables(prev => prev.filter(name => name !== table.name));
                            }
                          }}
                        >
                          <Panel header="查看字段" key={table.name}>
                            <div style={{ maxHeight: 200, overflow: 'auto' }}>
                              {table.fields.map(field => (
                                <div 
                                  key={field.name}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '4px 0',
                                    borderBottom: '1px solid #fafafa'
                                  }}
                                >
                                  <Space style={{ flex: 1 }}>
                                    {field.isPrimaryKey && <Tag color="orange">PK</Tag>}
                                    <Text style={{ fontSize: 13, fontFamily: 'monospace' }}>
                                      {field.name}
                                    </Text>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                      {field.type}
                                    </Text>
                                  </Space>
                                  {field.comment && (
                                    <Text type="secondary" style={{ fontSize: 12, marginLeft: 'auto' }}>
                                      {field.comment}
                                    </Text>
                                  )}
                                </div>
                              ))}
                            </div>
                          </Panel>
                        </Collapse>
                      </Card>
                    ))}
                  </Space>
                ) : (
                  <Empty
                    description="暂无表数据"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )}
              </div>
            </>
          ) : (
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}>
              <Empty
                description="请先选择一个数据源"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          )}
        </div>
      </Sider>
      
      {/* 右侧：映射配置工作台 */}
      <Content style={{ padding: 16, background: '#f5f5f5' }}>
        {selectedSourceTable ? (
          <Card 
            title={
              <Space>
                <span>映射配置</span>
                <Tag color="blue">{selectedSourceTable.name}</Tag>
              </Space>
            }
            extra={
              <Space>
                <Button icon={<EyeOutlined />}>预览</Button>
                <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveMappingConfig}>
                  保存配置
                </Button>
              </Space>
            }
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab}
              style={{ flex: 1 }}
              items={[
                {
                  key: 'basic',
                  label: '基本信息',
                  children: (
                    <div style={{ padding: '8px 0' }}>
                      <Form form={form} layout="vertical" size="large">
                        <Form.Item
                          name="name"
                          label="映射名称"
                          rules={[{ required: true, message: '请输入映射名称' }]}
                        >
                          <Input placeholder="请输入映射名称" />
                        </Form.Item>
                        
                        <Form.Item
                          name="targetTableName"
                          label="目标表名"
                          rules={[{ required: true, message: '请选择或输入目标表名' }]}
                        >
                          <Select 
                            placeholder="请选择目标表" 
                            showSearch 
                            allowClear
                            options={mockTargetTables.map(t => ({
                              value: t.name,
                              label: `${t.name}${t.comment ? ` - ${t.comment}` : ''}`
                            }))}
                            onChange={(value) => {
                              setSelectedTargetTable(mockTargetTables.find(t => t.name === value) || null);
                            }}
                          />
                        </Form.Item>
                        
                        <Form.Item name="description" label="映射描述">
                          <Input.TextArea 
                            placeholder="请输入映射配置说明"
                            rows={4}
                          />
                        </Form.Item>
                      </Form>
                    </div>
                  )
                },
                {
                  key: 'fields',
                  label: '字段映射',
                  children: (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 1fr', gap: 16, height: 'calc(100vh - 280px)' }}>
                      {/* 源字段 */}
                      <Card 
                        title="源字段" 
                        size="small" 
                        extra={`${selectedSourceFields.length} 已选`}
                        style={{ overflow: 'auto' }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {selectedSourceTable.fields.map(field => (
                            <div
                              key={field.name}
                              onClick={() => {
                                setSelectedSourceFields(
                                  selectedSourceFields.includes(field.name)
                                    ? []
                                    : [field.name]
                                );
                              }}
                              style={{
                                padding: '8px 12px',
                                borderRadius: 4,
                                cursor: 'pointer',
                                backgroundColor: selectedSourceFields.includes(field.name)
                                  ? '#e6f7ff'
                                  : '#fff',
                                border: selectedSourceFields.includes(field.name)
                                  ? '1px solid #91d5ff'
                                  : '1px solid #f0f0f0'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                {field.isPrimaryKey && <Tag color="orange">PK</Tag>}
                                <Text style={{ fontFamily: 'monospace', fontSize: 13 }}>
                                  {field.name}
                                </Text>
                              </div>
                              <div>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  {field.type}
                                </Text>
                                {field.comment && (
                                  <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
                                    {field.comment}
                                  </Text>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                      
                      {/* 中间操作区 */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                        <Button 
                          type="primary" 
                          icon={<ArrowRightOutlined />}
                          onClick={handleAddFieldMapping}
                          disabled={selectedSourceFields.length === 0 || selectedTargetFields.length === 0}
                        >
                          映射
                        </Button>
                      </div>
                      
                      {/* 目标字段 */}
                      <Card 
                        title="目标字段" 
                        size="small"
                        extra={
                          selectedTargetTable 
                            ? `${selectedTargetFields.length} 已选`
                            : ''
                        }
                        style={{ overflow: 'auto' }}
                      >
                        {selectedTargetTable ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {selectedTargetTable.fields.map(field => (
                              <div
                                key={field.name}
                                onClick={() => {
                                  setSelectedTargetFields(
                                    selectedTargetFields.includes(field.name)
                                      ? []
                                      : [field.name]
                                  );
                                }}
                                style={{
                                  padding: '8px 12px',
                                  borderRadius: 4,
                                  cursor: 'pointer',
                                  backgroundColor: selectedTargetFields.includes(field.name)
                                    ? '#f6ffed'
                                    : '#fff',
                                  border: selectedTargetFields.includes(field.name)
                                    ? '1px solid #b7eb8f'
                                    : '1px solid #f0f0f0'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  {field.required && <Tag color="red">必填</Tag>}
                                  <Text style={{ fontFamily: 'monospace', fontSize: 13 }}>
                                    {field.name}
                                  </Text>
                                </div>
                                <div>
                                  <Text type="secondary" style={{ fontSize: 12 }}>
                                    {field.type}
                                  </Text>
                                  {field.comment && (
                                    <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
                                      {field.comment}
                                    </Text>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <Empty description="请先选择目标表" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        )}
                      </Card>
                    </div>
                  )
                },
                {
                  key: 'mappings',
                  label: `映射关系 (${fieldMappings.length})`,
                  children: (
                    <div style={{ height: 'calc(100vh - 280px)', overflow: 'auto' }}>
                      {fieldMappings.length > 0 ? (
                        <Space direction="vertical" style={{ width: '100%' }} size="middle">
                          {fieldMappings.map(mapping => (
                            <Card 
                              key={mapping.id} 
                              size="small"
                              title={
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                  <Text style={{ fontFamily: 'monospace' }}>
                                    {mapping.sourceField}
                                  </Text>
                                  <RightOutlined />
                                  <Text style={{ fontFamily: 'monospace' }}>
                                    {mapping.targetField}
                                  </Text>
                                  <Tag color="blue">
                                    {TRANSFORM_RULE_OPTIONS.find(r => r.value === mapping.transformRule)?.label}
                                  </Tag>
                                </div>
                              }
                              extra={
                                <Space>
                                  <Button 
                                    type="link" 
                                    size="small"
                                    icon={<SettingOutlined />}
                                    onClick={() => handleEditRuleConfig(mapping)}
                                  >
                                    配置规则
                                  </Button>
                                  <Button 
                                    type="text" 
                                    danger
                                    size="small"
                                    icon={<DeleteOutlined />}
                                    onClick={() => handleDeleteFieldMapping(mapping.id)}
                                  />
                                </Space>
                              }
                            >
                              {mapping.ruleConfig && (
                                <div style={{ fontSize: 12, color: '#666' }}>
                                  规则配置：{JSON.stringify(mapping.ruleConfig)}
                                </div>
                              )}
                            </Card>
                          ))}
                        </Space>
                      ) : (
                        <Empty 
                          description="暂无字段映射" 
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                        >
                          <Text type="secondary">
                            从「字段映射」标签页中拖拽或选择字段进行映射
                          </Text>
                        </Empty>
                      )}
                    </div>
                  )
                },
                {
                  key: 'strategy',
                  label: '同步策略',
                  children: (
                    <div style={{ padding: '8px 0' }}>
                      <Form form={form} layout="vertical" size="large">
                        <Form.Item label="同步模式">
                          <Radio.Group defaultValue="full">
                            <Radio value="full">全量同步</Radio>
                            <Radio value="incremental">增量同步</Radio>
                          </Radio.Group>
                        </Form.Item>
                        
                        <Form.Item
                          name="syncField"
                          label="增量同步字段"
                          tooltip="选择用于增量同步的时间戳或标识字段"
                        >
                          <Select placeholder="请选择字段">
                            {selectedSourceTable.fields.map(field => (
                              <Option key={field.name} value={field.name}>
                                {field.name}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                        
                        <Form.Item name="filterCondition" label="过滤条件">
                          <Input.TextArea 
                            placeholder="输入 WHERE 条件，例如：status = 1"
                            rows={4}
                          />
                        </Form.Item>
                      </Form>
                    </div>
                  )
                }
              ]}
            />
          </Card>
        ) : (
          <Card style={{ height: '100%' }}>
            <div style={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}>
              <Empty
                description="请选择一个数据表开始配置映射"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Text type="secondary">
                  点击左侧数据表卡片的空白区域选择要配置的表
                </Text>
              </Empty>
            </div>
          </Card>
        )}
      </Content>
      
      {/* 转换规则配置 Drawer */}
      <Drawer
        title="配置转换规则"
        width={480}
        open={ruleConfigVisible}
        onClose={() => setRuleConfigVisible(false)}
        extra={
          <Space>
            <Button onClick={() => setRuleConfigVisible(false)}>取消</Button>
            <Button type="primary" onClick={() => handleSaveRuleConfig('direct', {})}>
              保存
            </Button>
          </Space>
        }
      >
        {selectedMappingForEdit && (
          <div style={{ padding: '8px 0' }}>
            <div style={{ marginBottom: 24 }}>
              <Text>源字段：</Text>
              <Text code style={{ marginLeft: 8 }}>{selectedMappingForEdit.sourceField}</Text>
            </div>
            
            <div style={{ marginBottom: 24 }}>
              <Text>目标字段：</Text>
              <Text code style={{ marginLeft: 8 }}>{selectedMappingForEdit.targetField}</Text>
            </div>
            
            <Form layout="vertical">
              <Form.Item label="转换规则">
                <Select 
                  defaultValue={selectedMappingForEdit.transformRule}
                  style={{ width: '100%' }}
                >
                  {TRANSFORM_RULE_OPTIONS.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Alert
                message="规则配置说明"
                type="info"
                showIcon
                description="选择不同的转换规则会显示对应的配置项，此功能正在开发中。"
                style={{ marginTop: 16 }}
              />
            </Form>
          </div>
        )}
      </Drawer>
    </Layout>
  );
};

export default Mapping;
