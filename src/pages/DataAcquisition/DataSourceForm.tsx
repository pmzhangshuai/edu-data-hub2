import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Steps,
  Form,
  Input,
  Select,
  Button,
  Card,
  Radio,
  Typography,
  Space,
  Divider,
  InputNumber,
  message,
  Alert,
  Tag
} from 'antd';
import {
  ThunderboltOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import type { DataSource, DatabaseType } from '@/types/api';
import { DATA_SOURCE_TYPE_MAP, DATABASE_TYPE_MAP } from '@/types/api';
import { mockDataSources } from '@/mocks/data';

const { Option } = Select;
const { Text, Paragraph } = Typography;
const { TextArea } = Input;

const DATABASE_PORT_MAP: Record<DatabaseType, number> = {
  mysql: 3306,
  oracle: 1521,
  sqlserver: 1433,
  postgresql: 5432
};

const DATABASE_ICONS: Record<DatabaseType, string> = {
  mysql: '🐬',
  oracle: '🟠',
  sqlserver: '🔷',
  postgresql: '🐘'
};

interface DataSourceFormProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  editData?: DataSource;
}

const DataSourceForm: React.FC<DataSourceFormProps> = ({
  visible,
  onCancel,
  onSuccess,
  editData
}) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [testing, setTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [keyValuePairs, setKeyValuePairs] = useState<{ key: string; value: string }[]>([]);

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
      } else {
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

  const handleDbTypeChange = (value: DatabaseType) => {
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
      } else {
        setConnectionStatus('error');
        message.error('连接失败：连接超时，请检查网络或配置');
      }
    } catch (error) {
      message.error('请先完善必填信息');
    } finally {
      setTesting(false);
    }
  };

  const handleNext = async () => {
    try {
      await form.validateFields(currentStep === 0 
        ? ['name', 'type']
        : ['dbType', 'host', 'port', 'databaseName', 'username', 'password']
      );
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      const newDataSource: DataSource = {
        id: editData ? editData.id : `ds-${Date.now()}`,
        name: values.name,
        type: values.type,
        dbType: values.dbType,
        host: values.host,
        port: values.port,
        databaseName: values.databaseName,
        username: values.username,
        status: 1 as const,
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
      } else {
        mockDataSources.unshift(newDataSource);
        message.success('数据源创建成功');
      }

      onSuccess();
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const addKeyValuePair = () => {
    setKeyValuePairs([...keyValuePairs, { key: '', value: '' }]);
  };

  const updateKeyValuePair = (index: number, field: 'key' | 'value', value: string) => {
    const newPairs = [...keyValuePairs];
    newPairs[index][field] = value;
    setKeyValuePairs(newPairs);
  };

  const removeKeyValuePair = (index: number) => {
    setKeyValuePairs(keyValuePairs.filter((_, i) => i !== index));
  };

  const renderStep1 = () => (
    <Form form={form} layout="vertical">
      <Form.Item
        name="name"
        label="数据源名称"
        rules={[
          { required: true, message: '请输入数据源名称' },
          { max: 50, message: '最多输入50个字符' }
        ]}
      >
        <Input placeholder="请输入数据源名称，如：教务系统主数据库" />
      </Form.Item>

      <Form.Item
        name="type"
        label="数据源类型"
        rules={[{ required: true, message: '请选择数据源类型' }]}
      >
        <Select placeholder="请选择数据源类型">
          <Option value="academic">教务系统</Option>
          <Option value="personnel">人事系统</Option>
          <Option value="research">科研系统</Option>
          <Option value="student">学工系统</Option>
          <Option value="employment">就业系统</Option>
          <Option value="financial">财务系统</Option>
          <Option value="asset">资产系统</Option>
          <Option value="other">其他</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="description"
        label="数据源描述"
        rules={[{ max: 200, message: '最多输入200个字符' }]}
      >
        <TextArea
          rows={4}
          placeholder="请输入数据源的描述信息，如：用于同步学生成绩数据"
        />
      </Form.Item>
    </Form>
  );

  const renderStep2 = () => (
    <Form form={form} layout="vertical">
      <Form.Item
        name="dbType"
        label="数据库类型"
        rules={[{ required: true, message: '请选择数据库类型' }]}
      >
        <Radio.Group
          onChange={(e) => handleDbTypeChange(e.target.value)}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {(['mysql', 'oracle', 'sqlserver', 'postgresql'] as DatabaseType[]).map((db) => (
              <Radio.Button value={db} key={db} style={{ textAlign: 'center', padding: '16px' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{DATABASE_ICONS[db]}</div>
                <div>{DATABASE_TYPE_MAP[db]}</div>
              </Radio.Button>
            ))}
          </div>
        </Radio.Group>
      </Form.Item>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Form.Item
          name="host"
          label="主机地址"
          rules={[
            { required: true, message: '请输入主机地址' },
            {
              pattern: /^[a-zA-Z0-9.-]+$/,
              message: '请输入有效的IP地址或域名'
            }
          ]}
        >
          <Input placeholder="如：192.168.1.100 或 db.example.com" />
        </Form.Item>

        <Form.Item
          name="port"
          label="端口"
          rules={[
            { required: true, message: '请输入端口号' },
            {
              type: 'number',
              min: 1,
              max: 65535,
              message: '端口号范围为1-65535'
            }
          ]}
        >
          <InputNumber style={{ width: '100%' }} placeholder="请输入端口号" />
        </Form.Item>
      </div>

      <Form.Item
        name="databaseName"
        label="数据库名"
        rules={[{ required: true, message: '请输入数据库名' }]}
      >
        <Input placeholder="请输入数据库名称" />
      </Form.Item>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Form.Item
          name="username"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input placeholder="请输入数据库用户名" />
        </Form.Item>

        <Form.Item
          name="password"
          label="密码"
          rules={[
            {
              required: !isEdit,
              message: isEdit ? '如无需修改，请留空' : '请输入密码'
            }
          ]}
        >
          <Input.Password
            placeholder={isEdit ? "如需修改，请输入新密码" : "请输入密码"}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>
      </div>

      <Divider />
      
      <details style={{ fontSize: '14px' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 500, color: '#666', marginBottom: '8px' }}>
          连接参数（高级）
        </summary>
        <div style={{ marginTop: '12px', background: '#f5f5f5', padding: '16px', borderRadius: '8px' }}>
          {keyValuePairs.map((pair, index) => (
            <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <Input
                placeholder="参数名"
                value={pair.key}
                onChange={(e) => updateKeyValuePair(index, 'key', e.target.value)}
                style={{ width: '30%' }}
              />
              <Input
                placeholder="参数值"
                value={pair.value}
                onChange={(e) => updateKeyValuePair(index, 'value', e.target.value)}
                style={{ flex: 1 }}
              />
              <Button
                type="text"
                danger
                onClick={() => removeKeyValuePair(index)}
              >
                删除
              </Button>
            </div>
          ))}
          <Button type="dashed" onClick={addKeyValuePair} block>
            + 添加参数
          </Button>
        </div>
      </details>
    </Form>
  );

  const renderStep3 = () => {
    const values = form.getFieldsValue();
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Card title="基础信息" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>数据源名称</Text>
              <Paragraph ellipsis={{ rows: 2 }} style={{ margin: '4px 0 0 0' }}>
                {values.name}
              </Paragraph>
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>数据源类型</Text>
              <div style={{ marginTop: '4px' }}>
                <Tag color="blue">{DATA_SOURCE_TYPE_MAP[values.type as keyof typeof DATA_SOURCE_TYPE_MAP]}</Tag>
              </div>
            </div>
            {values.description && (
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>描述</Text>
                <Paragraph ellipsis={{ rows: 3 }} style={{ margin: '4px 0 0 0' }}>
                  {values.description}
                </Paragraph>
              </div>
            )}
          </Space>
        </Card>

        <Card title="连接配置" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>数据库类型</Text>
              <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{DATABASE_ICONS[values.dbType as keyof typeof DATABASE_ICONS]}</span>
                <span>{DATABASE_TYPE_MAP[values.dbType as keyof typeof DATABASE_TYPE_MAP]}</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>主机地址</Text>
                <Paragraph ellipsis style={{ margin: '4px 0 0 0' }}>{values.host}</Paragraph>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>端口</Text>
                <Paragraph style={{ margin: '4px 0 0 0' }}>{values.port}</Paragraph>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>数据库名</Text>
                <Paragraph ellipsis style={{ margin: '4px 0 0 0' }}>{values.databaseName}</Paragraph>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>用户名</Text>
                <Paragraph ellipsis style={{ margin: '4px 0 0 0' }}>{values.username}</Paragraph>
              </div>
            </div>
          </Space>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Button
            type={connectionStatus === 'success' ? 'primary' : 'default'}
            icon={connectionStatus === 'success' ? <CheckCircleOutlined /> : connectionStatus === 'error' ? <CloseCircleOutlined /> : <ThunderboltOutlined />}
            onClick={handleTestConnection}
            loading={testing}
            block
          >
            {testing ? '测试连接中...' : '测试连接'}
          </Button>
          
          {connectionStatus === 'success' && (
            <Alert
              message="连接测试成功"
              type="success"
              showIcon
            />
          )}
          {connectionStatus === 'error' && (
            <Alert
              message="连接测试失败"
              type="error"
              description="请检查连接配置是否正确"
              showIcon
            />
          )}
        </div>
      </div>
    );
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

  return (
    <Drawer
      title={isEdit ? '编辑数据源' : '新增数据源'}
      width={600}
      open={visible}
      onClose={onCancel}
      footerStyle={{ padding: '16px 24px' }}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            {currentStep > 0 && (
              <Button onClick={handlePrev}>上一步</Button>
            )}
          </div>
          <Space>
            <Button onClick={onCancel}>取消</Button>
            {currentStep < 2 && (
              <Button type="primary" onClick={handleNext}>
                下一步
              </Button>
            )}
            {currentStep === 2 && (
              <Button type="primary" onClick={handleSave}>
                保存
              </Button>
            )}
          </Space>
        </div>
      }
    >
      <Steps current={currentStep} items={[
        { title: '基础信息' },
        { title: '连接配置' },
        { title: '确认信息' }
      ]} style={{ marginBottom: '32px' }} />
      
      {renderStepContent()}
    </Drawer>
  );
};

export default DataSourceForm;
