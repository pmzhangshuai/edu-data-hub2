import React from 'react';
import { Typography, Card, Descriptions } from 'antd';

const { Title, Paragraph } = Typography;

const Mapping: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>映射配置</Title>
      <Card>
        <Descriptions title="功能说明" column={1}>
          <Descriptions.Item label="功能描述">
            通过可视化界面配置业务系统表字段与标准字段的映射关系，支持拖拽操作。
          </Descriptions.Item>
          <Descriptions.Item label="支持映射类型">
            直接映射、编码转换、日期格式化、字符串处理、数值计算、常量填充、关联查询
          </Descriptions.Item>
          <Descriptions.Item label="内置规则模板">
            性别编码转换、日期格式统一、身份证号码脱敏、手机号脱敏
          </Descriptions.Item>
        </Descriptions>
        <Paragraph type="secondary" style={{ marginTop: 16 }}>
          该模块正在开发中，敬请期待...
        </Paragraph>
      </Card>
    </div>
  );
};

export default Mapping;
