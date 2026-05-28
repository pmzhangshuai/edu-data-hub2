import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { Table, Tag, Space, Button, Card, Typography } from 'antd';
import { PlusOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { get } from '@/api/client';
import { SYNC_MODES, SYNC_STATUS } from '@/config/constants';
const { Title } = Typography;
const Tasks = () => {
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState([]);
    useEffect(() => {
        fetchTasks();
    }, []);
    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await get('/sync-tasks');
            if (res.success) {
                setTasks(res.data.list);
            }
        }
        catch (error) {
            console.error('Failed to fetch tasks:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const getStatusColor = (status) => {
        const colors = {
            success: 'green',
            running: 'blue',
            failed: 'red',
            paused: 'default',
        };
        return colors[status] || 'default';
    };
    const columns = [
        { title: '任务名称', dataIndex: 'name', key: 'name' },
        { title: '源表', dataIndex: 'sourceTable', key: 'sourceTable' },
        { title: '目标表', dataIndex: 'targetTable', key: 'targetTable' },
        {
            title: '同步模式',
            dataIndex: 'syncMode',
            key: 'syncMode',
            render: (mode) => SYNC_MODES[mode],
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (_jsx(Tag, { color: getStatusColor(status), children: SYNC_STATUS[status] })),
        },
        { title: '最近运行', dataIndex: 'lastRunTime', key: 'lastRunTime' },
        {
            title: '执行记录',
            dataIndex: 'lastRunRecords',
            key: 'lastRunRecords',
            render: (records) => records ? `${records} 条` : '-',
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (_jsxs(Space, { size: "small", children: [record.status === 'running' ? (_jsx(Button, { type: "link", size: "small", icon: _jsx(PauseCircleOutlined, {}), children: "\u6682\u505C" })) : (_jsx(Button, { type: "link", size: "small", icon: _jsx(PlayCircleOutlined, {}), children: "\u6267\u884C" })), _jsx(Button, { type: "link", size: "small", children: "\u7F16\u8F91" }), _jsx(Button, { type: "link", size: "small", danger: true, children: "\u5220\u9664" })] })),
        },
    ];
    return (_jsxs("div", { style: { padding: 24 }, children: [_jsx(Title, { level: 3, children: "\u540C\u6B65\u4EFB\u52A1" }), _jsx(Card, { title: "\u4EFB\u52A1\u5217\u8868", extra: _jsx(Button, { type: "primary", icon: _jsx(PlusOutlined, {}), children: "\u65B0\u5EFA\u4EFB\u52A1" }), children: _jsx(Table, { dataSource: tasks, columns: columns, rowKey: "id", loading: loading, pagination: { pageSize: 10 } }) })] }));
};
export default Tasks;
