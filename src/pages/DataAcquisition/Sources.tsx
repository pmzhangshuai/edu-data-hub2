import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Input,
  Select,
  Table,
  Tag,
  Space,
  Popconfirm,
  message,
  Modal,
  Tooltip,
  Empty,
  Pagination
} from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
  DeleteOutlined,
  EditOutlined,
  DatabaseOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import type {
  DataSource,
  DataSourceType,
  DatabaseType,
  DataSourceStatus
} from '@/types/api';
import { DATA_SOURCE_TYPE_MAP, DATABASE_TYPE_MAP } from '@/types/api';
import { mockDataSources } from '@/mocks/data';
import styles from './Sources.module.css';

const { Search } = Input;
const { Option } = Select;

const Sources: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSources, setDataSources] = useState<DataSource[]>(mockDataSources);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
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
  const [testingId, setTestingId] = useState<string | null>(null);

  // 获取数据
  const fetchDataSources = async (
    page = 1,
    pageSize = 10,
    params = searchParams
  ) => {
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
    } catch (error) {
      message.error('获取数据源列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataSources();
  }, []);

  // 搜索处理
  const handleSearch = (values: typeof searchParams) => {
    setSearchParams(values);
    fetchDataSources(1, pagination.pageSize, values);
  };

  // 刷新
  const handleRefresh = () => {
    fetchDataSources(pagination.current, pagination.pageSize);
  };

  // 分页变化
  const handlePageChange = (page: number, pageSize: number) => {
    fetchDataSources(page, pageSize);
  };

  // 测试连接
  const handleTestConnection = async (id: string) => {
    try {
      setTestingId(id);
      // 模拟测试连接延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      const latencyMs = Math.floor(Math.random() * 100 + 10);
      message.success(
        `连接成功！延迟 ${latencyMs}ms`
      );
    } catch (error) {
      message.error('连接测试失败');
    } finally {
      setTestingId(null);
    }
  };

  // 删除
  const handleDelete = async (id: string) => {
    try {
      // 从 Mock 数据中删除
      const index = mockDataSources.findIndex(ds => ds.id === id);
      if (index !== -1) {
        mockDataSources.splice(index, 1);
      }
      message.success('删除成功');
      fetchDataSources(pagination.current, pagination.pageSize);
    } catch (error) {
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
    } catch (error) {
      message.error('批量删除失败');
    }
  };

  // 编辑
  const handleEdit = (record: DataSource) => {
    Modal.info({
      title: '编辑数据源',
      content: (
        <div>
          <p>数据源ID: {record.id}</p>
          <p>数据源名称: {record.name}</p>
          <p>主机: {record.host}:{record.port}</p>
          <p style={{ color: '#6b7280' }}>
            编辑功能将在后续版本中提供
          </p>
        </div>
      )
    });
  };

  // 新建
  const handleCreate = () => {
    Modal.info({
      title: '新增数据源',
      content: (
        <div>
          <p>新增数据源功能将在后续版本中提供</p>
          <p>支持MySQL/Oracle/SQLServer/PostgreSQL</p>
        </div>
      )
    });
  };

  // 表格列配置
  const columns = [
    {
      title: '数据源名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text: string) => (
        <Space>
          <DatabaseOutlined style={{ color: '#3b82f6' }} />
          <span>{text}</span>
        </Space>
      )
    },
    {
      title: '数据源类型',
      dataIndex: 'type',
      key: 'type',
      width: 140,
      render: (type: DataSourceType) => (
        <Tag color="blue">
          {DATA_SOURCE_TYPE_MAP[type]}
        </Tag>
      )
    },
    {
      title: '数据库类型',
      dataIndex: 'dbType',
      key: 'dbType',
      width: 140,
      render: (dbType: DatabaseType) => (
        <Tag color="cyan">
          {DATABASE_TYPE_MAP[dbType]}
        </Tag>
      )
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
      render: (status: DataSourceStatus) => {
        const isEnabled = Number(status) === 1;
        return isEnabled ? (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            启用
          </Tag>
        ) : (
          <Tag color="default" icon={<CloseCircleOutlined />}>
            禁用
          </Tag>
        );
      }
    },
    {
      title: '最近同步时间',
      dataIndex: 'lastSyncTime',
      key: 'lastSyncTime',
      width: 180,
      render: (text: string) => (
        <span style={{ color: '#6b7280', fontSize: '13px' }}>
          {text || '从未同步'}
        </span>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      fixed: 'right' as const,
      render: (_: any, record: DataSource) => (
        <Space>
          <Tooltip title="测试连接">
            <Button
              type="link"
              size="small"
              icon={<ThunderboltOutlined />}
              loading={testingId === record.id}
              onClick={() => handleTestConnection(record.id)}
            >
              测试
            </Button>
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            >
              编辑
            </Button>
          </Tooltip>
          <Popconfirm
            title="确定要删除这个数据源吗?"
            description="此操作不可恢复，请谨慎操作"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys
  };

  // 空状态内容
  const emptyState = (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description="暂无数据源"
    >
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleCreate}
      >
        新增数据源
      </Button>
    </Empty>
  );

  return (
    <div className={styles.container}>
      <Card>
        {/* 页面标题 */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>数据源管理</h2>
            <p className={styles.subtitle}>配置与维护各业务系统的数据库连接</p>
          </div>
        </div>

        {/* 搜索和操作区 */}
        <div className={styles.toolbar}>
          <Space wrap>
            <Search
              placeholder="请输入数据源名称"
              allowClear
              style={{ width: 240 }}
              onSearch={(value) =>
                handleSearch({ ...searchParams, name: value })
              }
            />
            <Select
              placeholder="选择数据源类型"
              style={{ width: 160 }}
              allowClear
              onChange={(value) =>
                handleSearch({ ...searchParams, type: value })
              }
            >
              <Option value="academic">教务系统</Option>
              <Option value="personnel">人事系统</Option>
              <Option value="research">科研系统</Option>
              <Option value="student">学工系统</Option>
              <Option value="employment">就业系统</Option>
              <Option value="financial">财务系统</Option>
              <Option value="asset">资产系统</Option>
              <Option value="other">其他</Option>
            </Select>
            <Select
              placeholder="选择状态"
              style={{ width: 140 }}
              allowClear
              onChange={(value) =>
                handleSearch({ ...searchParams, status: value })
              }
            >
              <Option value="1">启用</Option>
              <Option value="0">禁用</Option>
            </Select>
          </Space>
          <Space>
            {selectedRowKeys.length > 0 && (
              <Popconfirm
                title={`确定要删除选中的 ${selectedRowKeys.length} 个数据源吗?`}
                description="此操作不可恢复，请谨慎操作"
                onConfirm={handleBatchDelete}
                okText="确定"
                cancelText="取消"
                okButtonProps={{ danger: true }}
              >
                <Button
                  danger
                  icon={<DeleteOutlined />}
                >
                  批量删除 ({selectedRowKeys.length})
                </Button>
              </Popconfirm>
            )}
            <Tooltip title="刷新">
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={loading}
              />
            </Tooltip>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              新增数据源
            </Button>
          </Space>
        </div>

        {/* 表格 */}
        <div className={styles.tableContainer}>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={dataSources}
            loading={loading}
            scroll={{ x: 1300 }}
            rowSelection={rowSelection}
            pagination={false}
            locale={{
              emptyText: emptyState
            }}
          />
        </div>

        {/* 分页 */}
        {dataSources.length > 0 && (
          <div className={styles.pagination}>
            <div style={{ color: '#6b7280', fontSize: '13px' }}>
              共 {pagination.total} 条记录
            </div>
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              pageSizeOptions={['10', '20', '50']}
              showSizeChanger
              showQuickJumper
              showTotal={(total) => `共 ${total} 条`}
              onChange={handlePageChange}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default Sources;
