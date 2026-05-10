import { Typography, Card } from 'antd';

const { Title, Text } = Typography;

const Templates: React.FC = () => (
  <div style={{ padding: 24 }}>
    <Title level={3}>模板管理</Title>
    <Card>
      <Text type="secondary">
        报告模板管理，包括国家报告模板、认证评估模板、校本报告模板等。该模块正在开发中...
      </Text>
    </Card>
  </div>
);

const Generate: React.FC = () => (
  <div style={{ padding: 24 }}>
    <Title level={3}>报告生成</Title>
    <Card>
      <Text type="secondary">
        智能内容填充，数据自动嵌入、文本智能生成、佐证材料关联等功能。该模块正在开发中...
      </Text>
    </Card>
  </div>
);

const Collaboration: React.FC = () => (
  <div style={{ padding: 24 }}>
    <Title level={3}>协作发布</Title>
    <Card>
      <Text type="secondary">
        多人协作编辑、多级审核流程、多格式导出等功能。该模块正在开发中...
      </Text>
    </Card>
  </div>
);

export { Templates, Generate, Collaboration };
