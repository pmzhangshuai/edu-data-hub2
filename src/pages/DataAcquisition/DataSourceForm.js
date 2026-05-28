import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { Drawer, Steps, Form, Input, Select, Button, Card, Radio, Typography, Space, Divider, InputNumber, message, Alert, Tag } from 'antd';
import { ThunderboltOutlined, EyeInvisibleOutlined, EyeTwoTone, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { DATA_SOURCE_TYPE_MAP, DATABASE_TYPE_MAP } from '@/types/api';
import { mockDataSources } from '@/mocks/data';
const { Option } = Select;
const { Text, Paragraph } = Typography;
const { TextArea } = Input;
const DATABASE_PORT_MAP = {
    mysql: 3306,
    oracle: 1521,
    sqlserver: 1433,
    postgresql: 5432
};
const DATABASE_ICONS = {
    mysql: '🐬',
    oracle: '🟠',
    sqlserver: '🔷',
    postgresql: '🐘'
};
const DataSourceForm = ({ visible, onCancel, onSuccess, editData }) => {
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [testing, setTesting] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('idle');
    const [keyValuePairs, setKeyValuePairs] = useState([]);
    const isEdit = !!editData;
    useEffect(() => {
        if (visible) {
            if (editData) {
                form.setFieldsValue({
                    name: editData.name,
                    type: editData.type,
                    description: '',
                    dbType: editData.dbType,
                    host: editData.host,
                    port: editData.port,
                    databaseName: editData.databaseName,
                    username: editData.username,
                    password: ''
                });
            }
            else {
                form.resetFields();
                form.setFieldsValue({
                    dbType: 'mysql',
                    port: DATABASE_PORT_MAP.mysql
                });
                setKeyValuePairs([]);
            }
            setCurrentStep(0);
            setConnectionStatus('idle');
        }
    }, [visible, editData, form]);
    const handleDbTypeChange = (value) => {
        form.setFieldValue('port', DATABASE_PORT_MAP[value]);
    };
    const handleTestConnection = async () => {
        try {
            setTesting(true);
            setConnectionStatus('idle');
            await form.validateFields();
            const delay = Math.floor(Math.random() * 1500) + 500;
            await new Promise(resolve => setTimeout(resolve, delay));
            const success = Math.random() > 0.2;
            if (success) {
                const latency = Math.floor(Math.random() * 150) + 50;
                setConnectionStatus('success');
                message.success(`连接成功！延迟 ${latency}ms`);
            }
            else {
                setConnectionStatus('error');
                message.error('连接失败：连接超时，请检查网络或配置');
            }
        }
        catch (error) {
            message.error('请先完善必填信息');
        }
        finally {
            setTesting(false);
        }
    };
    const handleNext = async () => {
        try {
            await form.validateFields(currentStep === 0
                ? ['name', 'type']
                : ['dbType', 'host', 'port', 'databaseName', 'username', 'password']);
            setCurrentStep(currentStep + 1);
        }
        catch (error) {
            console.error('Validation failed:', error);
        }
    };
    const handlePrev = () => {
        setCurrentStep(currentStep - 1);
    };
    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            const newDataSource = {
                id: editData ? editData.id : `ds-${Date.now()}`,
                name: values.name,
                type: values.type,
                dbType: values.dbType,
                host: values.host,
                port: values.port,
                databaseName: values.databaseName,
                username: values.username,
                status: 1,
                createTime: editData ? editData.createTime : new Date().toISOString()
            };
            await new Promise(resolve => setTimeout(resolve, 800));
            if (editData) {
                const index = mockDataSources.findIndex(ds => ds.id === editData.id);
                if (index !== -1) {
                    mockDataSources[index] = {
                        ...mockDataSources[index],
                        ...newDataSource
                    };
                }
                message.success('数据源更新成功');
            }
            else {
                mockDataSources.unshift(newDataSource);
                message.success('数据源创建成功');
            }
            onSuccess();
        }
        catch (error) {
            console.error('Save failed:', error);
        }
    };
    const addKeyValuePair = () => {
        setKeyValuePairs([...keyValuePairs, { key: '', value: '' }]);
    };
    const updateKeyValuePair = (index, field, value) => {
        const newPairs = [...keyValuePairs];
        newPairs[index][field] = value;
        setKeyValuePairs(newPairs);
    };
    const removeKeyValuePair = (index) => {
        setKeyValuePairs(keyValuePairs.filter((_, i) => i !== index));
    };
    const renderStep1 = () => (_jsxs(Form, { form: form, layout: "vertical", children: [_jsx(Form.Item, { name: "name", label: "\u6570\u636E\u6E90\u540D\u79F0", rules: [
                    { required: true, message: '请输入数据源名称' },
                    { max: 50, message: '最多输入50个字符' }
                ], children: _jsx(Input, { placeholder: "\u8BF7\u8F93\u5165\u6570\u636E\u6E90\u540D\u79F0\uFF0C\u5982\uFF1A\u6559\u52A1\u7CFB\u7EDF\u4E3B\u6570\u636E\u5E93" }) }), _jsx(Form.Item, { name: "type", label: "\u6570\u636E\u6E90\u7C7B\u578B", rules: [{ required: true, message: '请选择数据源类型' }], children: _jsxs(Select, { placeholder: "\u8BF7\u9009\u62E9\u6570\u636E\u6E90\u7C7B\u578B", children: [_jsx(Option, { value: "academic", children: "\u6559\u52A1\u7CFB\u7EDF" }), _jsx(Option, { value: "personnel", children: "\u4EBA\u4E8B\u7CFB\u7EDF" }), _jsx(Option, { value: "research", children: "\u79D1\u7814\u7CFB\u7EDF" }), _jsx(Option, { value: "student", children: "\u5B66\u5DE5\u7CFB\u7EDF" }), _jsx(Option, { value: "employment", children: "\u5C31\u4E1A\u7CFB\u7EDF" }), _jsx(Option, { value: "financial", children: "\u8D22\u52A1\u7CFB\u7EDF" }), _jsx(Option, { value: "asset", children: "\u8D44\u4EA7\u7CFB\u7EDF" }), _jsx(Option, { value: "other", children: "\u5176\u4ED6" })] }) }), _jsx(Form.Item, { name: "description", label: "\u6570\u636E\u6E90\u63CF\u8FF0", rules: [{ max: 200, message: '最多输入200个字符' }], children: _jsx(TextArea, { rows: 4, placeholder: "\u8BF7\u8F93\u5165\u6570\u636E\u6E90\u7684\u63CF\u8FF0\u4FE1\u606F\uFF0C\u5982\uFF1A\u7528\u4E8E\u540C\u6B65\u5B66\u751F\u6210\u7EE9\u6570\u636E" }) })] }));
    const renderStep2 = () => (_jsxs(Form, { form: form, layout: "vertical", children: [_jsx(Form.Item, { name: "dbType", label: "\u6570\u636E\u5E93\u7C7B\u578B", rules: [{ required: true, message: '请选择数据库类型' }], children: _jsx(Radio.Group, { onChange: (e) => handleDbTypeChange(e.target.value), children: _jsx("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }, children: ['mysql', 'oracle', 'sqlserver', 'postgresql'].map((db) => (_jsxs(Radio.Button, { value: db, style: { textAlign: 'center', padding: '16px' }, children: [_jsx("div", { style: { fontSize: '24px', marginBottom: '8px' }, children: DATABASE_ICONS[db] }), _jsx("div", { children: DATABASE_TYPE_MAP[db] })] }, db))) }) }) }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }, children: [_jsx(Form.Item, { name: "host", label: "\u4E3B\u673A\u5730\u5740", rules: [
                            { required: true, message: '请输入主机地址' },
                            {
                                pattern: /^[a-zA-Z0-9.-]+$/,
                                message: '请输入有效的IP地址或域名'
                            }
                        ], children: _jsx(Input, { placeholder: "\u5982\uFF1A192.168.1.100 \u6216 db.example.com" }) }), _jsx(Form.Item, { name: "port", label: "\u7AEF\u53E3", rules: [
                            { required: true, message: '请输入端口号' },
                            {
                                type: 'number',
                                min: 1,
                                max: 65535,
                                message: '端口号范围为1-65535'
                            }
                        ], children: _jsx(InputNumber, { style: { width: '100%' }, placeholder: "\u8BF7\u8F93\u5165\u7AEF\u53E3\u53F7" }) })] }), _jsx(Form.Item, { name: "databaseName", label: "\u6570\u636E\u5E93\u540D", rules: [{ required: true, message: '请输入数据库名' }], children: _jsx(Input, { placeholder: "\u8BF7\u8F93\u5165\u6570\u636E\u5E93\u540D\u79F0" }) }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }, children: [_jsx(Form.Item, { name: "username", label: "\u7528\u6237\u540D", rules: [{ required: true, message: '请输入用户名' }], children: _jsx(Input, { placeholder: "\u8BF7\u8F93\u5165\u6570\u636E\u5E93\u7528\u6237\u540D" }) }), _jsx(Form.Item, { name: "password", label: "\u5BC6\u7801", rules: [
                            {
                                required: !isEdit,
                                message: isEdit ? '如无需修改，请留空' : '请输入密码'
                            }
                        ], children: _jsx(Input.Password, { placeholder: isEdit ? "如需修改，请输入新密码" : "请输入密码", iconRender: (visible) => visible ? _jsx(EyeTwoTone, {}) : _jsx(EyeInvisibleOutlined, {}) }) })] }), _jsx(Divider, {}), _jsxs("details", { style: { fontSize: '14px' }, children: [_jsx("summary", { style: { cursor: 'pointer', fontWeight: 500, color: '#666', marginBottom: '8px' }, children: "\u8FDE\u63A5\u53C2\u6570\uFF08\u9AD8\u7EA7\uFF09" }), _jsxs("div", { style: { marginTop: '12px', background: '#f5f5f5', padding: '16px', borderRadius: '8px' }, children: [keyValuePairs.map((pair, index) => (_jsxs("div", { style: { display: 'flex', gap: '8px', marginBottom: '8px' }, children: [_jsx(Input, { placeholder: "\u53C2\u6570\u540D", value: pair.key, onChange: (e) => updateKeyValuePair(index, 'key', e.target.value), style: { width: '30%' } }), _jsx(Input, { placeholder: "\u53C2\u6570\u503C", value: pair.value, onChange: (e) => updateKeyValuePair(index, 'value', e.target.value), style: { flex: 1 } }), _jsx(Button, { type: "text", danger: true, onClick: () => removeKeyValuePair(index), children: "\u5220\u9664" })] }, index))), _jsx(Button, { type: "dashed", onClick: addKeyValuePair, block: true, children: "+ \u6DFB\u52A0\u53C2\u6570" })] })] })] }));
    const renderStep3 = () => {
        const values = form.getFieldsValue();
        return (_jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '24px' }, children: [_jsx(Card, { title: "\u57FA\u7840\u4FE1\u606F", size: "small", children: _jsxs(Space, { direction: "vertical", style: { width: '100%' }, children: [_jsxs("div", { children: [_jsx(Text, { type: "secondary", style: { fontSize: '12px' }, children: "\u6570\u636E\u6E90\u540D\u79F0" }), _jsx(Paragraph, { ellipsis: { rows: 2 }, style: { margin: '4px 0 0 0' }, children: values.name })] }), _jsxs("div", { children: [_jsx(Text, { type: "secondary", style: { fontSize: '12px' }, children: "\u6570\u636E\u6E90\u7C7B\u578B" }), _jsx("div", { style: { marginTop: '4px' }, children: _jsx(Tag, { color: "blue", children: DATA_SOURCE_TYPE_MAP[values.type] }) })] }), values.description && (_jsxs("div", { children: [_jsx(Text, { type: "secondary", style: { fontSize: '12px' }, children: "\u63CF\u8FF0" }), _jsx(Paragraph, { ellipsis: { rows: 3 }, style: { margin: '4px 0 0 0' }, children: values.description })] }))] }) }), _jsx(Card, { title: "\u8FDE\u63A5\u914D\u7F6E", size: "small", children: _jsxs(Space, { direction: "vertical", style: { width: '100%' }, children: [_jsxs("div", { children: [_jsx(Text, { type: "secondary", style: { fontSize: '12px' }, children: "\u6570\u636E\u5E93\u7C7B\u578B" }), _jsxs("div", { style: { marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }, children: [_jsx("span", { children: DATABASE_ICONS[values.dbType] }), _jsx("span", { children: DATABASE_TYPE_MAP[values.dbType] })] })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }, children: [_jsxs("div", { children: [_jsx(Text, { type: "secondary", style: { fontSize: '12px' }, children: "\u4E3B\u673A\u5730\u5740" }), _jsx(Paragraph, { ellipsis: true, style: { margin: '4px 0 0 0' }, children: values.host })] }), _jsxs("div", { children: [_jsx(Text, { type: "secondary", style: { fontSize: '12px' }, children: "\u7AEF\u53E3" }), _jsx(Paragraph, { style: { margin: '4px 0 0 0' }, children: values.port })] })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }, children: [_jsxs("div", { children: [_jsx(Text, { type: "secondary", style: { fontSize: '12px' }, children: "\u6570\u636E\u5E93\u540D" }), _jsx(Paragraph, { ellipsis: true, style: { margin: '4px 0 0 0' }, children: values.databaseName })] }), _jsxs("div", { children: [_jsx(Text, { type: "secondary", style: { fontSize: '12px' }, children: "\u7528\u6237\u540D" }), _jsx(Paragraph, { ellipsis: true, style: { margin: '4px 0 0 0' }, children: values.username })] })] })] }) }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '12px' }, children: [_jsx(Button, { type: connectionStatus === 'success' ? 'primary' : 'default', icon: connectionStatus === 'success' ? _jsx(CheckCircleOutlined, {}) : connectionStatus === 'error' ? _jsx(CloseCircleOutlined, {}) : _jsx(ThunderboltOutlined, {}), onClick: handleTestConnection, loading: testing, block: true, children: testing ? '测试连接中...' : '测试连接' }), connectionStatus === 'success' && (_jsx(Alert, { message: "\u8FDE\u63A5\u6D4B\u8BD5\u6210\u529F", type: "success", showIcon: true })), connectionStatus === 'error' && (_jsx(Alert, { message: "\u8FDE\u63A5\u6D4B\u8BD5\u5931\u8D25", type: "error", description: "\u8BF7\u68C0\u67E5\u8FDE\u63A5\u914D\u7F6E\u662F\u5426\u6B63\u786E", showIcon: true }))] })] }));
    };
    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return renderStep1();
            case 1:
                return renderStep2();
            case 2:
                return renderStep3();
            default:
                return null;
        }
    };
    return (_jsxs(Drawer, { title: isEdit ? '编辑数据源' : '新增数据源', width: 600, open: visible, onClose: onCancel, footerStyle: { padding: '16px 24px' }, footer: _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between' }, children: [_jsx("div", { children: currentStep > 0 && (_jsx(Button, { onClick: handlePrev, children: "\u4E0A\u4E00\u6B65" })) }), _jsxs(Space, { children: [_jsx(Button, { onClick: onCancel, children: "\u53D6\u6D88" }), currentStep < 2 && (_jsx(Button, { type: "primary", onClick: handleNext, children: "\u4E0B\u4E00\u6B65" })), currentStep === 2 && (_jsx(Button, { type: "primary", onClick: handleSave, children: "\u4FDD\u5B58" }))] })] }), children: [_jsx(Steps, { current: currentStep, items: [
                    { title: '基础信息' },
                    { title: '连接配置' },
                    { title: '确认信息' }
                ], style: { marginBottom: '32px' } }), renderStepContent()] }));
};
export default DataSourceForm;
