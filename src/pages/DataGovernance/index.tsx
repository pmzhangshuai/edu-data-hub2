import { Typography, Card } from 'antd';

const { Title, Text } = Typography;

const Quality: React.FC = () => (
  <div style={{ padding: 24 }}>
    <Title level={3}>质量管控</Title>
    <Card>
      <Text type="secondary">
        数据质量管控模块，包括完整性校验、一致性交叉比对、异常值智能检测等功能。该模块正在开发中...
      </Text>
    </Card>
  </div>
);

const Metadata: React.FC = () => (
  <div style={{ padding: 24 }}>
    <Title level={3}>元数据管理</Title>
    <Card>
      <Text type="secondary">
        元数据与标准管理模块，包括指标词典、代码标准管理、数据血缘图谱等功能。该模块正在开发中...
      </Text>
    </Card>
  </div>
);

const Lifecycle: React.FC = () => (
  <div style={{ padding: 24 }}>
    <Title level={3}>生命周期管理</Title>
    <Card>
      <Text type="secondary">
        数据生命周期管理模块，包括历史版本归档、数据修正流程等功能。该模块正在开发中...
      </Text>
    </Card>
  </div>
);

const Cleaning: React.FC = () => (
  <div style={{ padding: 24 }}>
    <Title level={3}>清洗工作台</Title>
    <Card>
      <Text type="secondary">
        数据清洗工作台，可视化配置规则，处理异常数据。该模块正在开发中...
      </Text>
    </Card>
  </div>
);

export { Quality, Metadata, Lifecycle, Cleaning };
