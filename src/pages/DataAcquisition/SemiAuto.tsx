import React from 'react';
import { Typography, Card, List } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const SemiAuto: React.FC = () => {
  const features = [
    {
      title: '智能表单引擎',
      description: '拖拽式表单设计器，支持多种字段类型，内置逻辑跳转与公式计算',
    },
    {
      title: 'Excel批量导入',
      description: '模板下载→线下填写→在线上传→自动校验→错误回显→修正重传',
    },
    {
      title: 'OCR智能识别',
      description: '上传PDF/图片格式的文档，自动提取关键字段',
    },
    {
      title: '问卷调研工具',
      description: '内置标准问卷库，支持二维码/链接分发',
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>半自动化采集</Title>
      <Card title="功能模块" style={{ marginBottom: 24 }}>
        <List
          itemLayout="horizontal"
          dataSource={features}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<InboxOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Card>
      <Card>
        <Paragraph type="secondary">
          半自动化采集模块正在开发中。该模块将提供智能表单、Excel导入、OCR识别等功能，帮助用户高效采集无法自动对接的数据。
        </Paragraph>
      </Card>
    </div>
  );
};

export default SemiAuto;
