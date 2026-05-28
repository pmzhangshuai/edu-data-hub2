import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Table, Tag, Space, Popconfirm, message, Tooltip, Empty, Pagination } from 'antd';
import { PlusOutlined, ReloadOutlined, DeleteOutlined, EditOutlined, DatabaseOutlined, CheckCircleOutlined, CloseCircleOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { DATA_SOURCE_TYPE_MAP, DATABASE_TYPE_MAP } from '@/types/api';
import { mockDataSources } from '@/mocks/data';
import DataSourceForm from './DataSourceForm';
import styles from './Sources.module.css';
const { Search } = Input;
const { Option } = Select;
const Sources = () => {
    const [loading, setLoading] = useState(false);
    const [dataSources, setDataSources] = useState(mockDataSources);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchParams, setSearchParams] = useState({
        name: '',
        type: '',
        status: ''
    });
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: mockDataSources.length
    });
    const [testingId, setTestingId] = useState(null);
    const [formVisible, setFormVisible] = useState(false);
    const [editData, setEditData] = useState();
    // 获取数据
    const fetchDataSources = async (page = 1, pageSize = 10, params = searchParams) => {
        try {
            setLoading(true);
            // 先使用 Mock 数据
            let filteredData = [...mockDataSources];
            if (params.name) {
                filteredData = filteredData.filter(item => item.name.includes(params.name));
            }
            if (params.type) {
                filteredData = filteredData.filter(item => item.type === params.type);
            }
            if (params.status) {
                filteredData = filteredData.filter(item => String(item.status) === params.status);
            }
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedData = filteredData.slice(startIndex, endIndex);
            setDataSources(paginatedData);
            setPagination({
                current: page,
                pageSize,
                total: filteredData.length
            });
        }
        catch (error) {
            message.error('获取数据源列表失败');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchDataSources();
    }, []);
    // 搜索处理
    const handleSearch = (values) => {
        setSearchParams(values);
        fetchDataSources(1, pagination.pageSize, values);
    };
    // 刷新
    const handleRefresh = () => {
        fetchDataSources(pagination.current, pagination.pageSize);
    };
    // 分页变化
    const handlePageChange = (page, pageSize) => {
        fetchDataSources(page, pageSize);
    };
    // 测试连接
    const handleTestConnection = async (id) => {
        try {
            setTestingId(id);
            // 模拟测试连接延迟
            await new Promise(resolve => setTimeout(resolve, 1000));
            const latencyMs = Math.floor(Math.random() * 100 + 10);
            message.success(`连接成功！延迟 ${latencyMs}ms`);
        }
        catch (error) {
            message.error('连接测试失败');
        }
        finally {
            setTestingId(null);
        }
    };
    // 删除
    const handleDelete = async (id) => {
        try {
            // 从 Mock 数据中删除
            const index = mockDataSources.findIndex(ds => ds.id === id);
            if (index !== -1) {
                mockDataSources.splice(index, 1);
            }
            message.success('删除成功');
            fetchDataSources(pagination.current, pagination.pageSize);
        }
        catch (error) {
            message.error('删除失败');
        }
    };
    // 批量删除
    const handleBatchDelete = async () => {
        try {
            // 从 Mock 数据中批量删除
            selectedRowKeys.forEach(id => {
                const index = mockDataSources.findIndex(ds => ds.id === id);
                if (index !== -1) {
                    mockDataSources.splice(index, 1);
                }
            });
            message.success('批量删除成功');
            setSelectedRowKeys([]);
            fetchDataSources(pagination.current, pagination.pageSize);
        }
        catch (error) {
            message.error('批量删除失败');
        }
    };
    // 编辑
    const handleEdit = (record) => {
        setEditData(record);
        setFormVisible(true);
    };
    // 新建
    const handleCreate = () => {
        setEditData(undefined);
        setFormVisible(true);
    };
    // 表单成功回调
    const handleFormSuccess = () => {
        setFormVisible(false);
        setEditData(undefined);
        fetchDataSources(pagination.current, pagination.pageSize);
    };
    // 表格列配置
    const columns = [
        {
            title: '数据源名称',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (text) => (_jsxs(Space, { children: [_jsx(DatabaseOutlined, { style: { color: '#3b82f6' } }), _jsx("span", { children: text })] }))
        },
        {
            title: '数据源类型',
            dataIndex: 'type',
            key: 'type',
            width: 140,
            render: (type) => (_jsx(Tag, { color: "blue", children: DATA_SOURCE_TYPE_MAP[type] }))
        },
        {
            title: '数据库类型',
            dataIndex: 'dbType',
            key: 'dbType',
            width: 140,
            render: (dbType) => (_jsx(Tag, { color: "cyan", children: DATABASE_TYPE_MAP[dbType] }))
        },
        {
            title: '主机地址',
            dataIndex: 'host',
            key: 'host',
            width: 160
        },
        {
            title: '端口',
            dataIndex: 'port',
            key: 'port',
            width: 80
        },
        {
            title: '数据库名',
            dataIndex: 'databaseName',
            key: 'databaseName',
            width: 140
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => {
                const isEnabled = Number(status) === 1;
                return isEnabled ? (_jsx(Tag, { color: "success", icon: _jsx(CheckCircleOutlined, {}), children: "\u542F\u7528" })) : (_jsx(Tag, { color: "default", icon: _jsx(CloseCircleOutlined, {}), children: "\u7981\u7528" }));
            }
        },
        {
            title: '最近同步时间',
            dataIndex: 'lastSyncTime',
            key: 'lastSyncTime',
            width: 180,
            render: (text) => (_jsx("span", { style: { color: '#6b7280', fontSize: '13px' }, children: text || '从未同步' }))
        },
        {
            title: '操作',
            key: 'action',
            width: 220,
            fixed: 'right',
            render: (_, record) => (_jsxs(Space, { children: [_jsx(Tooltip, { title: "\u6D4B\u8BD5\u8FDE\u63A5", children: _jsx(Button, { type: "link", size: "small", icon: _jsx(ThunderboltOutlined, {}), loading: testingId === record.id, onClick: () => handleTestConnection(record.id), children: "\u6D4B\u8BD5" }) }), _jsx(Tooltip, { title: "\u7F16\u8F91", children: _jsx(Button, { type: "link", size: "small", icon: _jsx(EditOutlined, {}), onClick: () => handleEdit(record), children: "\u7F16\u8F91" }) }), _jsx(Popconfirm, { title: "\u786E\u5B9A\u8981\u5220\u9664\u8FD9\u4E2A\u6570\u636E\u6E90\u5417?", description: "\u6B64\u64CD\u4F5C\u4E0D\u53EF\u6062\u590D\uFF0C\u8BF7\u8C28\u614E\u64CD\u4F5C", onConfirm: () => handleDelete(record.id), okText: "\u786E\u5B9A", cancelText: "\u53D6\u6D88", okButtonProps: { danger: true }, children: _jsx(Button, { type: "link", size: "small", danger: true, icon: _jsx(DeleteOutlined, {}), children: "\u5220\u9664" }) })] }))
        }
    ];
    const rowSelection = {
        selectedRowKeys,
        onChange: setSelectedRowKeys
    };
    // 空状态内容
    const emptyState = (_jsx(Empty, { image: Empty.PRESENTED_IMAGE_SIMPLE, description: "\u6682\u65E0\u6570\u636E\u6E90", children: _jsx(Button, { type: "primary", icon: _jsx(PlusOutlined, {}), onClick: handleCreate, children: "\u65B0\u589E\u6570\u636E\u6E90" }) }));
    return (_jsxs("div", { className: styles.container, children: [_jsxs(Card, { children: [_jsx("div", { className: styles.header, children: _jsxs("div", { children: [_jsx("h2", { className: styles.title, children: "\u6570\u636E\u6E90\u7BA1\u7406" }), _jsx("p", { className: styles.subtitle, children: "\u914D\u7F6E\u4E0E\u7EF4\u62A4\u5404\u4E1A\u52A1\u7CFB\u7EDF\u7684\u6570\u636E\u5E93\u8FDE\u63A5" })] }) }), _jsxs("div", { className: styles.toolbar, children: [_jsxs(Space, { wrap: true, children: [_jsx(Search, { placeholder: "\u8BF7\u8F93\u5165\u6570\u636E\u6E90\u540D\u79F0", allowClear: true, style: { width: 240 }, onSearch: (value) => handleSearch({ ...searchParams, name: value }) }), _jsxs(Select, { placeholder: "\u9009\u62E9\u6570\u636E\u6E90\u7C7B\u578B", style: { width: 160 }, allowClear: true, onChange: (value) => handleSearch({ ...searchParams, type: value }), children: [_jsx(Option, { value: "academic", children: "\u6559\u52A1\u7CFB\u7EDF" }), _jsx(Option, { value: "personnel", children: "\u4EBA\u4E8B\u7CFB\u7EDF" }), _jsx(Option, { value: "research", children: "\u79D1\u7814\u7CFB\u7EDF" }), _jsx(Option, { value: "student", children: "\u5B66\u5DE5\u7CFB\u7EDF" }), _jsx(Option, { value: "employment", children: "\u5C31\u4E1A\u7CFB\u7EDF" }), _jsx(Option, { value: "financial", children: "\u8D22\u52A1\u7CFB\u7EDF" }), _jsx(Option, { value: "asset", children: "\u8D44\u4EA7\u7CFB\u7EDF" }), _jsx(Option, { value: "other", children: "\u5176\u4ED6" })] }), _jsxs(Select, { placeholder: "\u9009\u62E9\u72B6\u6001", style: { width: 140 }, allowClear: true, onChange: (value) => handleSearch({ ...searchParams, status: value }), children: [_jsx(Option, { value: "1", children: "\u542F\u7528" }), _jsx(Option, { value: "0", children: "\u7981\u7528" })] })] }), _jsxs(Space, { children: [selectedRowKeys.length > 0 && (_jsx(Popconfirm, { title: `确定要删除选中的 ${selectedRowKeys.length} 个数据源吗?`, description: "\u6B64\u64CD\u4F5C\u4E0D\u53EF\u6062\u590D\uFF0C\u8BF7\u8C28\u614E\u64CD\u4F5C", onConfirm: handleBatchDelete, okText: "\u786E\u5B9A", cancelText: "\u53D6\u6D88", okButtonProps: { danger: true }, children: _jsxs(Button, { danger: true, icon: _jsx(DeleteOutlined, {}), children: ["\u6279\u91CF\u5220\u9664 (", selectedRowKeys.length, ")"] }) })), _jsx(Tooltip, { title: "\u5237\u65B0", children: _jsx(Button, { icon: _jsx(ReloadOutlined, {}), onClick: handleRefresh, loading: loading }) }), _jsx(Button, { type: "primary", icon: _jsx(PlusOutlined, {}), onClick: handleCreate, children: "\u65B0\u589E\u6570\u636E\u6E90" })] })] }), _jsx("div", { className: styles.tableContainer, children: _jsx(Table, { rowKey: "id", columns: columns, dataSource: dataSources, loading: loading, scroll: { x: 1300 }, rowSelection: rowSelection, pagination: false, locale: {
                                emptyText: emptyState
                            } }) }), dataSources.length > 0 && (_jsxs("div", { className: styles.pagination, children: [_jsxs("div", { style: { color: '#6b7280', fontSize: '13px' }, children: ["\u5171 ", pagination.total, " \u6761\u8BB0\u5F55"] }), _jsx(Pagination, { current: pagination.current, pageSize: pagination.pageSize, total: pagination.total, pageSizeOptions: ['10', '20', '50'], showSizeChanger: true, showQuickJumper: true, showTotal: (total) => `共 ${total} 条`, onChange: handlePageChange })] }))] }), _jsx(DataSourceForm, { visible: formVisible, onCancel: () => {
                    setFormVisible(false);
                    setEditData(undefined);
                }, onSuccess: handleFormSuccess, editData: editData })] }));
};
export default Sources;
