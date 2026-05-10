import React, { useEffect, useState } from 'react';
import { Table, Tag, Space, Button, Card, Typography } from 'antd';
import { PlusOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { get } from '@/api/client';
import type { SyncTask } from '@/types/api';
import { SYNC_MODES, SYNC_STATUS } from '@/config/constants';

const { Title } = Typography;

const Tasks: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<SyncTask[]>([]);

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
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: keyof typeof SYNC_STATUS) => {
    const colors: Record<string, string> = {
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
      render: (mode: keyof typeof SYNC_MODES) => SYNC_MODES[mode],
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: keyof typeof SYNC_STATUS) => (
        <Tag color={getStatusColor(status)}>{SYNC_STATUS[status]}</Tag>
      ),
    },
    { title: '最近运行', dataIndex: 'lastRunTime', key: 'lastRunTime' },
    {
      title: '执行记录',
      dataIndex: 'lastRunRecords',
      key: 'lastRunRecords',
      render: (records?: number) => records ? `${records} 条` : '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: SyncTask) => (
        <Space size="small">
          {record.status === 'running' ? (
            <Button type="link" size="small" icon={<PauseCircleOutlined />}>
              暂停
            </Button>
          ) : (
            <Button type="link" size="small" icon={<PlayCircleOutlined />}>
              执行
            </Button>
          )}
          <Button type="link" size="small">
            编辑
          </Button>
          <Button type="link" size="small" danger>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>同步任务</Title>
      <Card
        title="任务列表"
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            新建任务
          </Button>
        }
      >
        <Table
          dataSource={tasks}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default Tasks;
