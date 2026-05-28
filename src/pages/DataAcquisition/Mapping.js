import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect, useRef } from 'react';
import { Layout, Tree, Input, Card, Tag, Checkbox, Tabs, Form, Select, Button, Drawer, message, Typography, Space, Empty, Collapse, Badge, Radio, Alert } from 'antd';
import { DatabaseOutlined, ApiOutlined, SearchOutlined, SaveOutlined, DeleteOutlined, SettingOutlined, EyeOutlined, RightOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { mockDataSources } from '@/mocks/data';
import { mockAcademicTables, mockTargetTables } from '@/mocks/data/mapping';
import { DATA_SOURCE_TYPE_MAP, DATABASE_TYPE_MAP } from '@/types/api';
const { Sider, Content } = Layout;
const { Option } = Select;
const { Title, Text } = Typography;
const { Panel } = Collapse;
// 转换规则选项
const TRANSFORM_RULE_OPTIONS = [
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
};
const STATUS_TAG_TEXTS = {
    unmapped: '未配置',
    mapping: '配置中',
    mapped: '已配置'
};
const Mapping = () => {
    const [form] = Form.useForm();
    // 数据源和表数据
    const [dataSources] = useState(mockDataSources);
    const [selectedDataSourceId, setSelectedDataSourceId] = useState(null);
    const [sourceTables, setSourceTables] = useState([]);
    const [expandedTables, setExpandedTables] = useState([]);
    const [selectedTables, setSelectedTables] = useState([]);
    // 搜索过滤
    const [dataSourceSearchText, setDataSourceSearchText] = useState('');
    // 映射配置
    const [setMappingConfig] = useState(null);
    const [activeTab, setActiveTab] = useState('basic');
    const [ruleConfigVisible, setRuleConfigVisible] = useState(false);
    const [selectedMappingForEdit, setSelectedMappingForEdit] = useState(null);
    // 当前选中的表
    const [selectedSourceTable, setSelectedSourceTable] = useState(null);
    const [selectedTargetTable, setSelectedTargetTable] = useState(null);
    // 字段映射状态
    const [selectedSourceFields, setSelectedSourceFields] = useState([]);
    const [selectedTargetFields, setSelectedTargetFields] = useState([]);
    const [fieldMappings, setFieldMappings] = useState([]);
    // 自动保存相关
    const autoSaveTimerRef = useRef(null);
    // 构建数据源树结构
    const buildDataSourceTree = () => {
        // 按类型分组
        const grouped = {};
        dataSources.forEach(ds => {
            if (!grouped[ds.type]) {
                grouped[ds.type] = [];
            }
            grouped[ds.type].push(ds);
        });
        // 过滤搜索
        const filteredGroups = Object.entries(grouped).filter(([_, dsList]) => dsList.some(ds => ds.name.toLowerCase().includes(dataSourceSearchText.toLowerCase())));
        return filteredGroups.map(([type, dsList]) => ({
            key: `type-${type}`,
            title: (_jsxs(Space, { children: [_jsx(DatabaseOutlined, {}), _jsx("span", { children: DATA_SOURCE_TYPE_MAP[type] }), _jsx(Badge, { count: dsList.length, style: { marginLeft: 'auto' } })] })),
            children: dsList
                .filter(ds => ds.name.toLowerCase().includes(dataSourceSearchText.toLowerCase()))
                .map(ds => ({
                key: ds.id,
                title: (_jsxs(Space, { children: [_jsx(ApiOutlined, { style: { color: selectedDataSourceId === ds.id ? '#1890ff' : '' } }), _jsx("span", { style: { fontWeight: selectedDataSourceId === ds.id ? 600 : 'normal' }, children: ds.name })] })),
                isLeaf: true
            }))
        }));
    };
    // 选择数据源
    const handleSelectDataSource = (selectedKeys) => {
        if (selectedKeys.length > 0) {
            const id = selectedKeys[0].toString();
            if (!id.startsWith('type-')) {
                setSelectedDataSourceId(id);
                // 模拟加载该数据源下的表（这里只对教务系统返回Mock数据）
                const ds = dataSources.find(d => d.id === id);
                if (ds && ds.type === 'academic' && ds.dbType === 'mysql') {
                    setSourceTables(mockAcademicTables);
                }
                else {
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
    const toggleTableExpand = (tableName) => {
        setExpandedTables(prev => prev.includes(tableName)
            ? prev.filter(name => name !== tableName)
            : [...prev, tableName]);
    };
    // 选择表
    const handleSelectTable = (e, tableName) => {
        setSelectedTables(prev => e.target.checked
            ? [...prev, tableName]
            : prev.filter(name => name !== tableName));
    };
    // 选择具体表进行映射配置
    const handleConfigureTable = (table) => {
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
            sourceDataSourceId: selectedDataSourceId,
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
            const newMapping = {
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
    const handleDeleteFieldMapping = (mappingId) => {
        setFieldMappings(prev => prev.filter(m => m.id !== mappingId));
        triggerAutoSave();
    };
    // 编辑转换规则
    const handleEditRuleConfig = (mapping) => {
        setSelectedMappingForEdit(mapping);
        setRuleConfigVisible(true);
    };
    // 保存转换规则
    const handleSaveRuleConfig = (ruleType, config) => {
        if (selectedMappingForEdit) {
            setFieldMappings(prev => prev.map(m => m.id === selectedMappingForEdit.id
                ? { ...m, transformRule: ruleType, ruleConfig: config }
                : m));
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
    return (_jsxs(Layout, { style: { height: 'calc(100vh - 112px)' }, children: [_jsx(Sider, { width: 250, theme: "light", style: { borderRight: '1px solid #f0f0f0' }, children: _jsxs("div", { style: { padding: 16 }, children: [_jsxs(Title, { level: 5, style: { margin: 0, marginBottom: 12 }, children: [_jsx(DatabaseOutlined, { style: { marginRight: 8 } }), "\u6570\u636E\u6E90"] }), _jsx(Input, { placeholder: "\u641C\u7D22\u6570\u636E\u6E90", prefix: _jsx(SearchOutlined, {}), value: dataSourceSearchText, onChange: (e) => setDataSourceSearchText(e.target.value), style: { marginBottom: 12 } }), _jsx("div", { style: { maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }, children: _jsx(Tree, { treeData: buildDataSourceTree(), defaultExpandAll: true, onSelect: handleSelectDataSource, selectedKeys: selectedDataSourceId ? [selectedDataSourceId] : [] }) })] }) }), _jsx(Sider, { width: 400, theme: "light", style: { borderRight: '1px solid #f0f0f0' }, children: _jsx("div", { style: { padding: 16, height: '100%', display: 'flex', flexDirection: 'column' }, children: selectedDataSourceId ? (_jsxs(_Fragment, { children: [_jsxs("div", { style: { marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #f0f0f0' }, children: [_jsx(Title, { level: 5, style: { margin: 0, marginBottom: 4 }, children: "\u6E90\u6570\u636E\u8868" }), _jsxs(Text, { type: "secondary", style: { fontSize: 12 }, children: [dataSources.find(ds => ds.id === selectedDataSourceId)?.name, ' · ', DATABASE_TYPE_MAP[dataSources.find(ds => ds.id === selectedDataSourceId)?.dbType]] })] }), _jsx("div", { style: { flex: 1, overflow: 'auto' }, children: sourceTables.length > 0 ? (_jsx(Space, { direction: "vertical", style: { width: '100%' }, size: "middle", children: sourceTables.map(table => (_jsxs(Card, { size: "small", style: { cursor: 'pointer' }, hoverable: true, onClick: () => handleConfigureTable(table), title: _jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: [_jsxs(Space, { children: [_jsx(Checkbox, { checked: selectedTables.includes(table.name), onClick: (e) => e.stopPropagation(), onChange: (e) => handleSelectTable(e, table.name) }), _jsx("span", { style: { fontWeight: 500 }, children: table.name })] }), _jsx(Tag, { color: STATUS_TAG_COLORS[table.mappingStatus], children: STATUS_TAG_TEXTS[table.mappingStatus] })] }), children: [_jsx("div", { style: { marginBottom: 8 }, children: _jsx(Text, { type: "secondary", style: { fontSize: 12 }, children: table.comment }) }), _jsxs("div", { style: { display: 'flex', gap: 16, marginBottom: 8 }, children: [_jsxs(Text, { type: "secondary", style: { fontSize: 12 }, children: [table.fieldCount, " \u5B57\u6BB5"] }), _jsxs(Text, { type: "secondary", style: { fontSize: 12 }, children: [table.rowCount.toLocaleString(), " \u884C"] })] }), _jsx(Collapse, { bordered: false, size: "small", activeKey: expandedTables.includes(table.name) ? [table.name] : [], onChange: (keys) => {
                                                    if (keys.length > 0) {
                                                        toggleTableExpand(table.name);
                                                    }
                                                    else {
                                                        setExpandedTables(prev => prev.filter(name => name !== table.name));
                                                    }
                                                }, children: _jsx(Panel, { header: "\u67E5\u770B\u5B57\u6BB5", children: _jsx("div", { style: { maxHeight: 200, overflow: 'auto' }, children: table.fields.map(field => (_jsxs("div", { style: {
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                padding: '4px 0',
                                                                borderBottom: '1px solid #fafafa'
                                                            }, children: [_jsxs(Space, { style: { flex: 1 }, children: [field.isPrimaryKey && _jsx(Tag, { color: "orange", children: "PK" }), _jsx(Text, { style: { fontSize: 13, fontFamily: 'monospace' }, children: field.name }), _jsx(Text, { type: "secondary", style: { fontSize: 12 }, children: field.type })] }), field.comment && (_jsx(Text, { type: "secondary", style: { fontSize: 12, marginLeft: 'auto' }, children: field.comment }))] }, field.name))) }) }, table.name) })] }, table.name))) })) : (_jsx(Empty, { description: "\u6682\u65E0\u8868\u6570\u636E", image: Empty.PRESENTED_IMAGE_SIMPLE })) })] })) : (_jsx("div", { style: {
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }, children: _jsx(Empty, { description: "\u8BF7\u5148\u9009\u62E9\u4E00\u4E2A\u6570\u636E\u6E90", image: Empty.PRESENTED_IMAGE_SIMPLE }) })) }) }), _jsx(Content, { style: { padding: 16, background: '#f5f5f5' }, children: selectedSourceTable ? (_jsx(Card, { title: _jsxs(Space, { children: [_jsx("span", { children: "\u6620\u5C04\u914D\u7F6E" }), _jsx(Tag, { color: "blue", children: selectedSourceTable.name })] }), extra: _jsxs(Space, { children: [_jsx(Button, { icon: _jsx(EyeOutlined, {}), children: "\u9884\u89C8" }), _jsx(Button, { type: "primary", icon: _jsx(SaveOutlined, {}), onClick: handleSaveMappingConfig, children: "\u4FDD\u5B58\u914D\u7F6E" })] }), style: { height: '100%', display: 'flex', flexDirection: 'column' }, children: _jsx(Tabs, { activeKey: activeTab, onChange: setActiveTab, style: { flex: 1 }, items: [
                            {
                                key: 'basic',
                                label: '基本信息',
                                children: (_jsx("div", { style: { padding: '8px 0' }, children: _jsxs(Form, { form: form, layout: "vertical", size: "large", children: [_jsx(Form.Item, { name: "name", label: "\u6620\u5C04\u540D\u79F0", rules: [{ required: true, message: '请输入映射名称' }], children: _jsx(Input, { placeholder: "\u8BF7\u8F93\u5165\u6620\u5C04\u540D\u79F0" }) }), _jsx(Form.Item, { name: "targetTableName", label: "\u76EE\u6807\u8868\u540D", rules: [{ required: true, message: '请选择或输入目标表名' }], children: _jsx(Select, { placeholder: "\u8BF7\u9009\u62E9\u76EE\u6807\u8868", showSearch: true, allowClear: true, options: mockTargetTables.map(t => ({
                                                        value: t.name,
                                                        label: `${t.name}${t.comment ? ` - ${t.comment}` : ''}`
                                                    })), onChange: (value) => {
                                                        setSelectedTargetTable(mockTargetTables.find(t => t.name === value) || null);
                                                    } }) }), _jsx(Form.Item, { name: "description", label: "\u6620\u5C04\u63CF\u8FF0", children: _jsx(Input.TextArea, { placeholder: "\u8BF7\u8F93\u5165\u6620\u5C04\u914D\u7F6E\u8BF4\u660E", rows: 4 }) })] }) }))
                            },
                            {
                                key: 'fields',
                                label: '字段映射',
                                children: (_jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 120px 1fr', gap: 16, height: 'calc(100vh - 280px)' }, children: [_jsx(Card, { title: "\u6E90\u5B57\u6BB5", size: "small", extra: `${selectedSourceFields.length} 已选`, style: { overflow: 'auto' }, children: _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 4 }, children: selectedSourceTable.fields.map(field => (_jsxs("div", { onClick: () => {
                                                        setSelectedSourceFields(selectedSourceFields.includes(field.name)
                                                            ? []
                                                            : [field.name]);
                                                    }, style: {
                                                        padding: '8px 12px',
                                                        borderRadius: 4,
                                                        cursor: 'pointer',
                                                        backgroundColor: selectedSourceFields.includes(field.name)
                                                            ? '#e6f7ff'
                                                            : '#fff',
                                                        border: selectedSourceFields.includes(field.name)
                                                            ? '1px solid #91d5ff'
                                                            : '1px solid #f0f0f0'
                                                    }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8 }, children: [field.isPrimaryKey && _jsx(Tag, { color: "orange", children: "PK" }), _jsx(Text, { style: { fontFamily: 'monospace', fontSize: 13 }, children: field.name })] }), _jsxs("div", { children: [_jsx(Text, { type: "secondary", style: { fontSize: 12 }, children: field.type }), field.comment && (_jsx(Text, { type: "secondary", style: { fontSize: 12, marginLeft: 8 }, children: field.comment }))] })] }, field.name))) }) }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }, children: _jsx(Button, { type: "primary", icon: _jsx(ArrowRightOutlined, {}), onClick: handleAddFieldMapping, disabled: selectedSourceFields.length === 0 || selectedTargetFields.length === 0, children: "\u6620\u5C04" }) }), _jsx(Card, { title: "\u76EE\u6807\u5B57\u6BB5", size: "small", extra: selectedTargetTable
                                                ? `${selectedTargetFields.length} 已选`
                                                : '', style: { overflow: 'auto' }, children: selectedTargetTable ? (_jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 4 }, children: selectedTargetTable.fields.map(field => (_jsxs("div", { onClick: () => {
                                                        setSelectedTargetFields(selectedTargetFields.includes(field.name)
                                                            ? []
                                                            : [field.name]);
                                                    }, style: {
                                                        padding: '8px 12px',
                                                        borderRadius: 4,
                                                        cursor: 'pointer',
                                                        backgroundColor: selectedTargetFields.includes(field.name)
                                                            ? '#f6ffed'
                                                            : '#fff',
                                                        border: selectedTargetFields.includes(field.name)
                                                            ? '1px solid #b7eb8f'
                                                            : '1px solid #f0f0f0'
                                                    }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8 }, children: [field.required && _jsx(Tag, { color: "red", children: "\u5FC5\u586B" }), _jsx(Text, { style: { fontFamily: 'monospace', fontSize: 13 }, children: field.name })] }), _jsxs("div", { children: [_jsx(Text, { type: "secondary", style: { fontSize: 12 }, children: field.type }), field.comment && (_jsx(Text, { type: "secondary", style: { fontSize: 12, marginLeft: 8 }, children: field.comment }))] })] }, field.name))) })) : (_jsx(Empty, { description: "\u8BF7\u5148\u9009\u62E9\u76EE\u6807\u8868", image: Empty.PRESENTED_IMAGE_SIMPLE })) })] }))
                            },
                            {
                                key: 'mappings',
                                label: `映射关系 (${fieldMappings.length})`,
                                children: (_jsx("div", { style: { height: 'calc(100vh - 280px)', overflow: 'auto' }, children: fieldMappings.length > 0 ? (_jsx(Space, { direction: "vertical", style: { width: '100%' }, size: "middle", children: fieldMappings.map(mapping => (_jsx(Card, { size: "small", title: _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 16 }, children: [_jsx(Text, { style: { fontFamily: 'monospace' }, children: mapping.sourceField }), _jsx(RightOutlined, {}), _jsx(Text, { style: { fontFamily: 'monospace' }, children: mapping.targetField }), _jsx(Tag, { color: "blue", children: TRANSFORM_RULE_OPTIONS.find(r => r.value === mapping.transformRule)?.label })] }), extra: _jsxs(Space, { children: [_jsx(Button, { type: "link", size: "small", icon: _jsx(SettingOutlined, {}), onClick: () => handleEditRuleConfig(mapping), children: "\u914D\u7F6E\u89C4\u5219" }), _jsx(Button, { type: "text", danger: true, size: "small", icon: _jsx(DeleteOutlined, {}), onClick: () => handleDeleteFieldMapping(mapping.id) })] }), children: mapping.ruleConfig && (_jsxs("div", { style: { fontSize: 12, color: '#666' }, children: ["\u89C4\u5219\u914D\u7F6E\uFF1A", JSON.stringify(mapping.ruleConfig)] })) }, mapping.id))) })) : (_jsx(Empty, { description: "\u6682\u65E0\u5B57\u6BB5\u6620\u5C04", image: Empty.PRESENTED_IMAGE_SIMPLE, children: _jsx(Text, { type: "secondary", children: "\u4ECE\u300C\u5B57\u6BB5\u6620\u5C04\u300D\u6807\u7B7E\u9875\u4E2D\u62D6\u62FD\u6216\u9009\u62E9\u5B57\u6BB5\u8FDB\u884C\u6620\u5C04" }) })) }))
                            },
                            {
                                key: 'strategy',
                                label: '同步策略',
                                children: (_jsx("div", { style: { padding: '8px 0' }, children: _jsxs(Form, { form: form, layout: "vertical", size: "large", children: [_jsx(Form.Item, { label: "\u540C\u6B65\u6A21\u5F0F", children: _jsxs(Radio.Group, { defaultValue: "full", children: [_jsx(Radio, { value: "full", children: "\u5168\u91CF\u540C\u6B65" }), _jsx(Radio, { value: "incremental", children: "\u589E\u91CF\u540C\u6B65" })] }) }), _jsx(Form.Item, { name: "syncField", label: "\u589E\u91CF\u540C\u6B65\u5B57\u6BB5", tooltip: "\u9009\u62E9\u7528\u4E8E\u589E\u91CF\u540C\u6B65\u7684\u65F6\u95F4\u6233\u6216\u6807\u8BC6\u5B57\u6BB5", children: _jsx(Select, { placeholder: "\u8BF7\u9009\u62E9\u5B57\u6BB5", children: selectedSourceTable.fields.map(field => (_jsx(Option, { value: field.name, children: field.name }, field.name))) }) }), _jsx(Form.Item, { name: "filterCondition", label: "\u8FC7\u6EE4\u6761\u4EF6", children: _jsx(Input.TextArea, { placeholder: "\u8F93\u5165 WHERE \u6761\u4EF6\uFF0C\u4F8B\u5982\uFF1Astatus = 1", rows: 4 }) })] }) }))
                            }
                        ] }) })) : (_jsx(Card, { style: { height: '100%' }, children: _jsx("div", { style: {
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }, children: _jsx(Empty, { description: "\u8BF7\u9009\u62E9\u4E00\u4E2A\u6570\u636E\u8868\u5F00\u59CB\u914D\u7F6E\u6620\u5C04", image: Empty.PRESENTED_IMAGE_SIMPLE, children: _jsx(Text, { type: "secondary", children: "\u70B9\u51FB\u5DE6\u4FA7\u6570\u636E\u8868\u5361\u7247\u7684\u7A7A\u767D\u533A\u57DF\u9009\u62E9\u8981\u914D\u7F6E\u7684\u8868" }) }) }) })) }), _jsx(Drawer, { title: "\u914D\u7F6E\u8F6C\u6362\u89C4\u5219", width: 480, open: ruleConfigVisible, onClose: () => setRuleConfigVisible(false), extra: _jsxs(Space, { children: [_jsx(Button, { onClick: () => setRuleConfigVisible(false), children: "\u53D6\u6D88" }), _jsx(Button, { type: "primary", onClick: () => handleSaveRuleConfig('direct', {}), children: "\u4FDD\u5B58" })] }), children: selectedMappingForEdit && (_jsxs("div", { style: { padding: '8px 0' }, children: [_jsxs("div", { style: { marginBottom: 24 }, children: [_jsx(Text, { children: "\u6E90\u5B57\u6BB5\uFF1A" }), _jsx(Text, { code: true, style: { marginLeft: 8 }, children: selectedMappingForEdit.sourceField })] }), _jsxs("div", { style: { marginBottom: 24 }, children: [_jsx(Text, { children: "\u76EE\u6807\u5B57\u6BB5\uFF1A" }), _jsx(Text, { code: true, style: { marginLeft: 8 }, children: selectedMappingForEdit.targetField })] }), _jsxs(Form, { layout: "vertical", children: [_jsx(Form.Item, { label: "\u8F6C\u6362\u89C4\u5219", children: _jsx(Select, { defaultValue: selectedMappingForEdit.transformRule, style: { width: '100%' }, children: TRANSFORM_RULE_OPTIONS.map(option => (_jsx(Option, { value: option.value, children: option.label }, option.value))) }) }), _jsx(Alert, { message: "\u89C4\u5219\u914D\u7F6E\u8BF4\u660E", type: "info", showIcon: true, description: "\u9009\u62E9\u4E0D\u540C\u7684\u8F6C\u6362\u89C4\u5219\u4F1A\u663E\u793A\u5BF9\u5E94\u7684\u914D\u7F6E\u9879\uFF0C\u6B64\u529F\u80FD\u6B63\u5728\u5F00\u53D1\u4E2D\u3002", style: { marginTop: 16 } })] })] })) })] }));
};
export default Mapping;
