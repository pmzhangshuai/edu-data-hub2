import { Typography, Card } from 'antd';

const { Title, Text } = Typography;

const Library: React.FC = () => (
  <div style={{ padding: 24 }}>
    <Title level={3}>指标库管理</Title>
    <Card>
      <Text type="secondary">
        指标库管理模块，包括国家指标模板库、校本指标扩展、指标公式编辑器等功能。该模块正在开发中...
      </Text>
    </Card>
  </div>
);

const Views: React.FC = () => (
  <div style={{ padding: 24 }}>
    <Title level={3}>多维视图</Title>
    <Card>
      <Text type="secondary">
        多维度指标视图，包括监测维度管理、责任部门绑定、阈值与预警规则等功能。该模块正在开发中...
      </Text>
    </Card>
  </div>
);

const Dimensions: React.FC = () => (
  <div style={{ padding: 24 }}>
    <Title level={3}>监测维度</Title>
    <Card>
      <Text type="secondary">
        监测维度管理，按"输入-过程-输出-反馈"质量循环组织指标。该模块正在开发中...
      </Text>
    </Card>
  </div>
);

export { Library, Views, Dimensions };
