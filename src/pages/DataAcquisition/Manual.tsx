import React from 'react';
import { Typography, Card, Descriptions } from 'antd';

const { Title, Paragraph } = Typography;

const Manual: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>人工补录</Title>
      <Card>
        <Descriptions title="功能说明" column={1}>
          <Descriptions.Item label="个人数据看板">
            教师/学生查看系统已采集的本人数据，发现缺失或错误时在线补录/申诉
          </Descriptions.Item>
          <Descriptions.Item label="部门数据补录">
            教务处、学工部等业务部门对无法自动采集的过程性数据进行录入
          </Descriptions.Item>
        </Descriptions>
        <Paragraph type="secondary" style={{ marginTop: 16 }}>
          人工补录入口模块正在开发中...
        </Paragraph>
      </Card>
    </div>
  );
};

export default Manual;
