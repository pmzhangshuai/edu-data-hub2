import { Typography, Card } from 'antd';

const { Title, Text } = Typography;

const Permissions: React.FC = () => (
  <div style={{ padding: 24 }}>
    <Title level={3}>权限管理</Title>
    <Card>
      <Text type="secondary">
        RBAC权限模型，按角色配置功能权限与数据权限。该模块正在开发中...
      </Text>
    </Card>
  </div>
);

const Workflow: React.FC = () => (
  <div style={{ padding: 24 }}>
    <Title level={3}>流程引擎</Title>
    <Card>
      <Text type="secondary">
        可视化流程设计器，拖拽配置业务流程。该模块正在开发中...
      </Text>
    </Card>
  </div>
);

const Logs: React.FC = () => (
  <div style={{ padding: 24 }}>
    <Title level={3}>日志审计</Title>
    <Card>
      <Text type="secondary">
        操作日志全记录，数据访问审计，异常访问模式识别。该模块正在开发中...
      </Text>
    </Card>
  </div>
);

const Organization: React.FC = () => (
  <div style={{ padding: 24 }}>
    <Title level={3}>组织架构</Title>
    <Card>
      <Text type="secondary">
        多租户架构，支持集团化办学模式，组织架构管理。该模块正在开发中...
      </Text>
    </Card>
  </div>
);

export { Permissions, Workflow, Logs, Organization };
