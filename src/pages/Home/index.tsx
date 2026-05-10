import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Table, Tag, Space, Progress } from 'antd';
import {
  DatabaseOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  WarningOutlined,
  FileTextOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { get } from '@/api/client';
import type { SyncTask } from '@/types/api';
import styles from './index.module.css';

const { Title, Text, Paragraph } = Typography;

const Home: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});
  const [recentTasks, setRecentTasks] = useState<SyncTask[]>([]);

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
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      success: 'green',
      running: 'blue',
      failed: 'red',
      paused: 'default',
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
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
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: '同步模式',
      dataIndex: 'syncMode',
      key: 'syncMode',
      render: (mode: string) => (mode === 'incremental' ? '增量' : '全量'),
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
      icon: <DatabaseOutlined />,
      color: '#1890ff',
    },
    {
      title: '数据治理层',
      description: '确保数据"进得来、对得准、管得住"',
      details: '质量管控、元数据管理、生命周期管理',
      icon: <CheckCircleOutlined />,
      color: '#52c41a',
    },
    {
      title: '指标体系层',
      description: '灵活可配置的"测量标尺"',
      details: '指标库管理、多维视图、监测维度',
      icon: <BarChartOutlined />,
      color: '#faad14',
    },
    {
      title: '监测分析层',
      description: '从"看数据"到"读数据"',
      details: '可视化仪表盘、多维分析、智能预警',
      icon: <SyncOutlined />,
      color: '#f5222d',
    },
    {
      title: '报告生成层',
      description: '一键输出"专业级"质量报告',
      details: '模板化报告引擎、智能内容填充、协作发布',
      icon: <FileTextOutlined />,
      color: '#722ed1',
    },
    {
      title: '评估认证层',
      description: '支撑"以评促建、以评促改"',
      details: '审核评估支持、专业认证支持、认证标准库',
      icon: <WarningOutlined />,
      color: '#13c2c2',
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={2}>欢迎使用高等教育质量监测数据采集系统</Title>
        <Paragraph type="secondary" className={styles.subtitle}>
          高等教育质量监测需要采集覆盖学生、教师、教学、科研、资产等多维度的数据。本系统实现校内主流业务系统与质量监测平台的数据贯通。
        </Paragraph>
      </div>

      <Row gutter={[16, 16]} className={styles.statsRow}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="数据源总数"
              value={stats.totalDataSources || 0}
              prefix={<DatabaseOutlined style={{ color: '#1890ff' }} />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="活跃数据源"
              value={stats.activeDataSources || 0}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="运行中任务"
              value={stats.runningTasks || 0}
              valueStyle={{ color: '#1890ff' }}
              prefix={<SyncOutlined spin />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="今日同步记录"
              value={stats.todaySyncRecords || 0}
              suffix="条"
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            title="最近同步任务"
            extra={<a href="/data-acquisition/tasks">查看更多</a>}
            className={styles.tasksCard}
          >
            <Table
              dataSource={recentTasks}
              columns={taskColumns}
              rowKey="id"
              pagination={false}
              loading={loading}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="数据质量" className={styles.qualityCard}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <Text>数据准确率</Text>
                <Progress
                  percent={99.5}
                  status="active"
                  strokeColor="#52c41a"
                />
              </div>
              <div>
                <Text>同步成功率</Text>
                <Progress
                  percent={stats.successTasks ? Math.round((stats.successTasks / (stats.totalTasks || 1)) * 100) : 0}
                  status="active"
                  strokeColor="#1890ff"
                />
              </div>
              <div>
                <Text>异常数据率</Text>
                <Progress
                  percent={0.01}
                  status="active"
                  strokeColor="#faad14"
                />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <div className={styles.featuresSection}>
        <Title level={3} className={styles.sectionTitle}>
          九大功能模块
        </Title>
        <Row gutter={[16, 16]}>
          {features.map((feature, index) => (
            <Col xs={24} sm={12} lg={8} key={index}>
              <Card hoverable className={styles.featureCard}>
                <div className={styles.featureIcon} style={{ background: feature.color }}>
                  {feature.icon}
                </div>
                <div className={styles.featureContent}>
                  <Title level={5}>{feature.title}</Title>
                  <Text type="secondary">{feature.description}</Text>
                  <Paragraph type="secondary" className={styles.featureDetails}>
                    {feature.details}
                  </Paragraph>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Home;
