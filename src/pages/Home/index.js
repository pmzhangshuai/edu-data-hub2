import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Table, Tag, Space, Progress } from 'antd';
import { DatabaseOutlined, CheckCircleOutlined, SyncOutlined, WarningOutlined, FileTextOutlined, BarChartOutlined, } from '@ant-design/icons';
import { get } from '@/api/client';
import styles from './index.module.css';
const { Title, Text, Paragraph } = Typography;
const Home = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({});
    const [recentTasks, setRecentTasks] = useState([]);
    useEffect(() => {
        fetchDashboardData();
    }, []);
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const res = await get('/dashboard/stats');
            if (res.success) {
                setStats(res.data);
            }
            const taskRes = await get('/sync-tasks');
            if (taskRes.success) {
                setRecentTasks(taskRes.data.list.slice(0, 5));
            }
        }
        catch (error) {
            console.error('Failed to fetch dashboard data:', error);
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
    const getStatusText = (status) => {
        const texts = {
            success: '成功',
            running: '运行中',
            failed: '失败',
            paused: '已暂停',
        };
        return texts[status] || status;
    };
    const taskColumns = [
        { title: '任务名称', dataIndex: 'name', key: 'name' },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (_jsx(Tag, { color: getStatusColor(status), children: getStatusText(status) })),
        },
        {
            title: '同步模式',
            dataIndex: 'syncMode',
            key: 'syncMode',
            render: (mode) => (mode === 'incremental' ? '增量' : '全量'),
        },
        {
            title: '最近运行',
            dataIndex: 'lastRunTime',
            key: 'lastRunTime',
        },
    ];
    const features = [
        {
            title: '数据采集层',
            description: '多源异构数据的统一入口',
            details: '自动化对接、半自动化采集、人工补录',
            icon: _jsx(DatabaseOutlined, {}),
            color: '#1890ff',
        },
        {
            title: '数据治理层',
            description: '确保数据"进得来、对得准、管得住"',
            details: '质量管控、元数据管理、生命周期管理',
            icon: _jsx(CheckCircleOutlined, {}),
            color: '#52c41a',
        },
        {
            title: '指标体系层',
            description: '灵活可配置的"测量标尺"',
            details: '指标库管理、多维视图、监测维度',
            icon: _jsx(BarChartOutlined, {}),
            color: '#faad14',
        },
        {
            title: '监测分析层',
            description: '从"看数据"到"读数据"',
            details: '可视化仪表盘、多维分析、智能预警',
            icon: _jsx(SyncOutlined, {}),
            color: '#f5222d',
        },
        {
            title: '报告生成层',
            description: '一键输出"专业级"质量报告',
            details: '模板化报告引擎、智能内容填充、协作发布',
            icon: _jsx(FileTextOutlined, {}),
            color: '#722ed1',
        },
        {
            title: '评估认证层',
            description: '支撑"以评促建、以评促改"',
            details: '审核评估支持、专业认证支持、认证标准库',
            icon: _jsx(WarningOutlined, {}),
            color: '#13c2c2',
        },
    ];
    return (_jsxs("div", { className: styles.container, children: [_jsxs("div", { className: styles.header, children: [_jsx(Title, { level: 2, children: "\u6B22\u8FCE\u4F7F\u7528\u9AD8\u7B49\u6559\u80B2\u8D28\u91CF\u76D1\u6D4B\u6570\u636E\u91C7\u96C6\u7CFB\u7EDF" }), _jsx(Paragraph, { type: "secondary", className: styles.subtitle, children: "\u9AD8\u7B49\u6559\u80B2\u8D28\u91CF\u76D1\u6D4B\u9700\u8981\u91C7\u96C6\u8986\u76D6\u5B66\u751F\u3001\u6559\u5E08\u3001\u6559\u5B66\u3001\u79D1\u7814\u3001\u8D44\u4EA7\u7B49\u591A\u7EF4\u5EA6\u7684\u6570\u636E\u3002\u672C\u7CFB\u7EDF\u5B9E\u73B0\u6821\u5185\u4E3B\u6D41\u4E1A\u52A1\u7CFB\u7EDF\u4E0E\u8D28\u91CF\u76D1\u6D4B\u5E73\u53F0\u7684\u6570\u636E\u8D2F\u901A\u3002" })] }), _jsxs(Row, { gutter: [16, 16], className: styles.statsRow, children: [_jsx(Col, { xs: 24, sm: 12, lg: 6, children: _jsx(Card, { hoverable: true, children: _jsx(Statistic, { title: "\u6570\u636E\u6E90\u603B\u6570", value: stats.totalDataSources || 0, prefix: _jsx(DatabaseOutlined, { style: { color: '#1890ff' } }), loading: loading }) }) }), _jsx(Col, { xs: 24, sm: 12, lg: 6, children: _jsx(Card, { hoverable: true, children: _jsx(Statistic, { title: "\u6D3B\u8DC3\u6570\u636E\u6E90", value: stats.activeDataSources || 0, valueStyle: { color: '#52c41a' }, prefix: _jsx(CheckCircleOutlined, {}), loading: loading }) }) }), _jsx(Col, { xs: 24, sm: 12, lg: 6, children: _jsx(Card, { hoverable: true, children: _jsx(Statistic, { title: "\u8FD0\u884C\u4E2D\u4EFB\u52A1", value: stats.runningTasks || 0, valueStyle: { color: '#1890ff' }, prefix: _jsx(SyncOutlined, { spin: true }), loading: loading }) }) }), _jsx(Col, { xs: 24, sm: 12, lg: 6, children: _jsx(Card, { hoverable: true, children: _jsx(Statistic, { title: "\u4ECA\u65E5\u540C\u6B65\u8BB0\u5F55", value: stats.todaySyncRecords || 0, suffix: "\u6761", loading: loading }) }) })] }), _jsxs(Row, { gutter: [16, 16], children: [_jsx(Col, { xs: 24, lg: 16, children: _jsx(Card, { title: "\u6700\u8FD1\u540C\u6B65\u4EFB\u52A1", extra: _jsx("a", { href: "/data-acquisition/tasks", children: "\u67E5\u770B\u66F4\u591A" }), className: styles.tasksCard, children: _jsx(Table, { dataSource: recentTasks, columns: taskColumns, rowKey: "id", pagination: false, loading: loading, size: "small" }) }) }), _jsx(Col, { xs: 24, lg: 8, children: _jsx(Card, { title: "\u6570\u636E\u8D28\u91CF", className: styles.qualityCard, children: _jsxs(Space, { direction: "vertical", style: { width: '100%' }, size: "large", children: [_jsxs("div", { children: [_jsx(Text, { children: "\u6570\u636E\u51C6\u786E\u7387" }), _jsx(Progress, { percent: 99.5, status: "active", strokeColor: "#52c41a" })] }), _jsxs("div", { children: [_jsx(Text, { children: "\u540C\u6B65\u6210\u529F\u7387" }), _jsx(Progress, { percent: stats.successTasks ? Math.round((stats.successTasks / (stats.totalTasks || 1)) * 100) : 0, status: "active", strokeColor: "#1890ff" })] }), _jsxs("div", { children: [_jsx(Text, { children: "\u5F02\u5E38\u6570\u636E\u7387" }), _jsx(Progress, { percent: 0.01, status: "active", strokeColor: "#faad14" })] })] }) }) })] }), _jsxs("div", { className: styles.featuresSection, children: [_jsx(Title, { level: 3, className: styles.sectionTitle, children: "\u4E5D\u5927\u529F\u80FD\u6A21\u5757" }), _jsx(Row, { gutter: [16, 16], children: features.map((feature, index) => (_jsx(Col, { xs: 24, sm: 12, lg: 8, children: _jsxs(Card, { hoverable: true, className: styles.featureCard, children: [_jsx("div", { className: styles.featureIcon, style: { background: feature.color }, children: feature.icon }), _jsxs("div", { className: styles.featureContent, children: [_jsx(Title, { level: 5, children: feature.title }), _jsx(Text, { type: "secondary", children: feature.description }), _jsx(Paragraph, { type: "secondary", className: styles.featureDetails, children: feature.details })] })] }) }, index))) })] })] }));
};
export default Home;
