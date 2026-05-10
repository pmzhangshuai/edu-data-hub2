import React from 'react';
import { Layout, Menu, theme, Typography, Avatar, Dropdown, Space } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useAppStore, useUserStore } from '@/stores';
import { menuItems } from '@/config/menu';
import styles from './BasicLayout.module.css';

const { Header, Sider, Content, Footer } = Layout;
const { Title, Text } = Typography;

const BasicLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { collapsed, setCollapsed, showHeader, showFooter } = useAppStore();
  const { user, logout } = useUserStore();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [selectedKeys, setSelectedKeys] = React.useState<string[]>([location.pathname]);
  const [openKeys, setOpenKeys] = React.useState<string[]>([]);

  const handleMenuClick = (key: string) => {
    setSelectedKeys([key]);
    navigate(key);
  };

  const handleOpenChange = (keys: string[]) => {
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
      icon: <UserOutlined />,
      label: '个人信息',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        logout();
        navigate('/login');
      },
    },
  ];

  return (
    <Layout className={styles.layout}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={240}
        className={styles.sider}
      >
        <div className={styles.logo}>
          {!collapsed ? (
            <Title level={4} className={styles.logoText}>
              质量监测平台
            </Title>
          ) : (
            <Title level={5} className={styles.logoText}>
              QM
            </Title>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          onOpenChange={handleOpenChange}
          onClick={({ key }) => handleMenuClick(key)}
          items={menuItems as any}
          className={styles.menu}
        />
      </Sider>
      <Layout>
        {showHeader && (
          <Header className={styles.header} style={{ padding: '0 24px', background: colorBgContainer }}>
            <div className={styles.headerLeft}>
              {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: styles.trigger,
                onClick: () => setCollapsed(!collapsed),
              })}
            </div>
            <div className={styles.headerRight}>
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Space className={styles.userInfo}>
                  <Avatar size="small" icon={<UserOutlined />} />
                  <Text>{user?.name || '管理员'}</Text>
                </Space>
              </Dropdown>
            </div>
          </Header>
        )}
        <Content
          className={styles.content}
          style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
        {showFooter && (
          <Footer className={styles.footer}>
            高等教育质量监测数据采集系统 ©{new Date().getFullYear()}
          </Footer>
        )}
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
