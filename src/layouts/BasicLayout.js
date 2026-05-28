import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Layout, Menu, theme, Typography, Avatar, Dropdown, Space } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, LogoutOutlined, SettingOutlined, } from '@ant-design/icons';
import { useAppStore, useUserStore } from '@/stores';
import { menuItems } from '@/config/menu';
import styles from './BasicLayout.module.css';
const { Header, Sider, Content, Footer } = Layout;
const { Title, Text } = Typography;
const BasicLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { collapsed, setCollapsed, showHeader, showFooter } = useAppStore();
    const { user, logout } = useUserStore();
    const { token: { colorBgContainer, borderRadiusLG }, } = theme.useToken();
    const [selectedKeys, setSelectedKeys] = React.useState([location.pathname]);
    const [openKeys, setOpenKeys] = React.useState([]);
    const handleMenuClick = (key) => {
        setSelectedKeys([key]);
        navigate(key);
    };
    const handleOpenChange = (keys) => {
        setOpenKeys(keys);
    };
    const getOpenKeys = () => {
        const pathSnippets = location.pathname.split('/').filter((i) => i);
        return pathSnippets.map((_, index) => `/${pathSnippets.slice(0, index + 1).join('/')}`);
    };
    React.useEffect(() => {
        const openKeys = getOpenKeys();
        setOpenKeys(openKeys);
        setSelectedKeys([location.pathname]);
    }, [location.pathname]);
    const userMenuItems = [
        {
            key: 'profile',
            icon: _jsx(UserOutlined, {}),
            label: '个人信息',
        },
        {
            key: 'settings',
            icon: _jsx(SettingOutlined, {}),
            label: '系统设置',
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: _jsx(LogoutOutlined, {}),
            label: '退出登录',
            onClick: () => {
                logout();
                navigate('/login');
            },
        },
    ];
    return (_jsxs(Layout, { className: styles.layout, children: [_jsxs(Sider, { trigger: null, collapsible: true, collapsed: collapsed, width: 240, className: styles.sider, children: [_jsx("div", { className: styles.logo, children: !collapsed ? (_jsx(Title, { level: 4, className: styles.logoText, children: "\u8D28\u91CF\u76D1\u6D4B\u5E73\u53F0" })) : (_jsx(Title, { level: 5, className: styles.logoText, children: "QM" })) }), _jsx(Menu, { theme: "dark", mode: "inline", selectedKeys: selectedKeys, openKeys: openKeys, onOpenChange: handleOpenChange, onClick: ({ key }) => handleMenuClick(key), items: menuItems, className: styles.menu })] }), _jsxs(Layout, { children: [showHeader && (_jsxs(Header, { className: styles.header, style: { padding: '0 24px', background: colorBgContainer }, children: [_jsx("div", { className: styles.headerLeft, children: React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                    className: styles.trigger,
                                    onClick: () => setCollapsed(!collapsed),
                                }) }), _jsx("div", { className: styles.headerRight, children: _jsx(Dropdown, { menu: { items: userMenuItems }, placement: "bottomRight", children: _jsxs(Space, { className: styles.userInfo, children: [_jsx(Avatar, { size: "small", icon: _jsx(UserOutlined, {}) }), _jsx(Text, { children: user?.name || '管理员' })] }) }) })] })), _jsx(Content, { className: styles.content, style: {
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }, children: _jsx(Outlet, {}) }), showFooter && (_jsxs(Footer, { className: styles.footer, children: ["\u9AD8\u7B49\u6559\u80B2\u8D28\u91CF\u76D1\u6D4B\u6570\u636E\u91C7\u96C6\u7CFB\u7EDF \u00A9", new Date().getFullYear()] }))] })] }));
};
export default BasicLayout;
