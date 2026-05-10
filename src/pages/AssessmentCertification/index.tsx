import { Typography, Card } from 'antd';

const { Title, Text } = Typography;

const Audit: React.FC = () => (
  <div style={{ padding: 24 }}>
    <Title level={3}>审核评估</Title>
    <Card>
      <Text type="secondary">
        审核评估支持，包括评估指标对标、问题清单生成、评估材料包等功能。该模块正在开发中...
      </Text>
    </Card>
  </div>
);

const Professional: React.FC = () => (
  <div style={{ padding: 24 }}>
    <Title level={3}>专业认证</Title>
    <Card>
      <Text type="secondary">
        专业认证支持，包括认证标准库、毕业要求达成度计算、持续改进闭环等功能。该模块正在开发中...
      </Text>
    </Card>
  </div>
);

const Standards: React.FC = () => (
  <div style={{ padding: 24 }}>
    <Title level={3}>认证标准库</Title>
    <Card>
      <Text type="secondary">
        认证标准库，包括工程教育认证、医学认证、师范认证等各类专业认证标准。该模块正在开发中...
      </Text>
    </Card>
  </div>
);

export { Audit, Professional, Standards };
