import React, { useEffect, useState } from 'react';
import { Table, Tag, Space, Button, Input, Card, Row, Col, Statistic, Typography } from 'antd';
import { PlusOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { get } from '@/api/client';
import type { DataSource } from '@/types/api';
import { DATA_SOURCE_TYPES, DATABASE_TYPES, DATA_SOURCE_STATUS } from '@/config/constants';

const { Title } = Typography;

const DataSources: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchDataSources();
  }, []);

  const fetchDataSources = async () => {
    try {
      setLoading(true);
      const res = await get('/data-sources');
      if (res.success) {
        setDataSources(res.data.list);
      }
    } catch (error) {
      console.error('Failed to fetch data sources:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'green',
      inactive: 'default',
      error: 'red',
    };
    return colors[status] || 'default';
  };

  const columns = [
    {
      title: '数据源名称',
      dataIndex: 'name',
      key: 'name',
      filterSearch: true,
      onFilter: (value: any, record: any) =>
        record.name.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: keyof typeof DATA_SOURCE_TYPES) => DATA_SOURCE_TYPES[type] || type,
    },
    {
      title: '数据库类型',
      dataIndex: 'dbType',
      key: 'dbType',
      render: (dbType: keyof typeof DATABASE_TYPES) => DATABASE_TYPES[dbType] || dbType,
    },
    {
      title: '主机地址',
      dataIndex: 'host',
      key: 'host',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: keyof typeof DATA_SOURCE_STATUS) => (
        <Tag color={getStatusColor(status)}>{DATA_SOURCE_STATUS[status]}</Tag>
      ),
    },
    {
      title: '最后同步',
      dataIndex: 'lastSyncTime',
      key: 'lastSyncTime',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="small">
          <Button type="link" size="small">
            编辑
          </Button>
          <Button type="link" size="small">
            测试
          </Button>
          <Button type="link" size="small" danger>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const filteredDataSources = dataSources.filter((ds) =>
    ds.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>数据源管理</Title>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="数据源总数" value={dataSources.length} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃"
              value={dataSources.filter((ds) => ds.status === 'active').length}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="异常"
              value={dataSources.filter((ds) => ds.status === 'error').length}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="未激活" value={dataSources.filter((ds) => ds.status === 'inactive').length} />
          </Card>
        </Col>
      </Row>

      <Card
        title="数据源列表"
        extra={
          <Space>
            <Input
              placeholder="搜索数据源"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Button icon={<ReloadOutlined />} onClick={fetchDataSources}>
              刷新
            </Button>
            <Button type="primary" icon={<PlusOutlined />}>
              新建数据源
            </Button>
          </Space>
        }
      >
        <Table
          dataSource={filteredDataSources}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default DataSources;
