import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Typography, Card, List } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
const { Title, Paragraph } = Typography;
const SemiAuto = () => {
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
    return (_jsxs("div", { style: { padding: 24 }, children: [_jsx(Title, { level: 3, children: "\u534A\u81EA\u52A8\u5316\u91C7\u96C6" }), _jsx(Card, { title: "\u529F\u80FD\u6A21\u5757", style: { marginBottom: 24 }, children: _jsx(List, { itemLayout: "horizontal", dataSource: features, renderItem: (item) => (_jsx(List.Item, { children: _jsx(List.Item.Meta, { avatar: _jsx(InboxOutlined, { style: { fontSize: 24, color: '#1890ff' } }), title: item.title, description: item.description }) })) }) }), _jsx(Card, { children: _jsx(Paragraph, { type: "secondary", children: "\u534A\u81EA\u52A8\u5316\u91C7\u96C6\u6A21\u5757\u6B63\u5728\u5F00\u53D1\u4E2D\u3002\u8BE5\u6A21\u5757\u5C06\u63D0\u4F9B\u667A\u80FD\u8868\u5355\u3001Excel\u5BFC\u5165\u3001OCR\u8BC6\u522B\u7B49\u529F\u80FD\uFF0C\u5E2E\u52A9\u7528\u6237\u9AD8\u6548\u91C7\u96C6\u65E0\u6CD5\u81EA\u52A8\u5BF9\u63A5\u7684\u6570\u636E\u3002" }) })] }));
};
export default SemiAuto;
