import { Typography, Card } from 'antd';

const { Title, Text } = Typography;

const App: React.FC = () => (
  <div style={{ padding: 24 }}>
    <Title level={3}>移动应用</Title>
    <Card>
      <Text type="secondary">
        移动端应用，包括数据看板小程序、轻量填报H5、消息推送等功能。该模块正在开发中...
      </Text>
    </Card>
  </div>
);

const Assistant: React.FC = () => (
  <div style={{ padding: 24 }}>
    <Title level={3}>智能助手</Title>
    <Card>
      <Text type="secondary">
        AI智能助手，包括智能问答、填报助手、报告解读等功能。该模块正在开发中...
      </Text>
    </Card>
  </div>
);

export { App, Assistant };
