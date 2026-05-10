import { Typography, Card } from 'antd';

const { Title, Text } = Typography;

const Interfaces: React.FC = () => (
  <div style={{ padding: 24 }}>
    <Title level={3}>标准接口</Title>
    <Card>
      <Text type="secondary">
        标准接口服务，包括教育部数据上报接口、省级平台对接接口等。该模块正在开发中...
      </Text>
    </Card>
  </div>
);

const Push: React.FC = () => (
  <div style={{ padding: 24 }}>
    <Title level={3}>数据推送</Title>
    <Card>
      <Text type="secondary">
        数据开放服务，为第三方应用提供受控的数据查询接口。该模块正在开发中...
      </Text>
    </Card>
  </div>
);

const Subscription: React.FC = () => (
  <div style={{ padding: 24 }}>
    <Title level={3}>订阅管理</Title>
    <Card>
      <Text type="secondary">
        数据订阅推送，按订阅规则定期向指定系统推送数据变更。该模块正在开发中...
      </Text>
    </Card>
  </div>
);

export { Interfaces, Push, Subscription };
