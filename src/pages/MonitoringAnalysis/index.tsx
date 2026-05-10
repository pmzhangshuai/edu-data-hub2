import { Typography, Card } from 'antd';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => (
  <div style={{ padding: 24 }}>
    <Title level={3}>领导驾驶舱</Title>
    <Card>
      <Text type="secondary">
        校级领导驾驶舱，一屏展示核心KPI，支持钻取至学院/专业。该模块正在开发中...
      </Text>
    </Card>
  </div>
);

const Analysis: React.FC = () => (
  <div style={{ padding: 24 }}>
    <Title level={3}>多维分析</Title>
    <Card>
      <Text type="secondary">
        多维度分析工具，支持时间、空间、群体、对标等多种分析维度。该模块正在开发中...
      </Text>
    </Card>
  </div>
);

const Warning: React.FC = () => (
  <div style={{ padding: 24 }}>
    <Title level={3}>智能预警</Title>
    <Card>
      <Text type="secondary">
        智能预警与诊断，包括规则引擎预警、异常模式识别、根因分析辅助等功能。该模块正在开发中...
      </Text>
    </Card>
  </div>
);

export { Dashboard, Analysis, Warning };
