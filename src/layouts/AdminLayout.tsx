import { App, Avatar, Button, Dropdown, Flex, Layout, Menu, Typography } from 'antd';
import type { MenuProps } from 'antd';
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../api/errors';
import { useLogout } from '../features/auth/hooks/useLogout';
import { useAuthStore } from '../stores/authStore';
import { useLayoutStore } from '../stores/layoutStore';
import { spacing } from '../theme/theme';
import { findActiveKey, navigationSections } from './navigation';

const { Header, Sider, Content } = Layout;

function userInitials(email: string): string {
  return email.slice(0, 2).toUpperCase();
}

export function AdminLayout() {
  const collapsed = useLayoutStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useLayoutStore((state) => state.toggleSidebar);
  const setSidebarCollapsed = useLayoutStore((state) => state.setSidebarCollapsed);

  const navigate = useNavigate();
  const location = useLocation();
  const { notification } = App.useApp();

  const user = useAuthStore((state) => state.user);
  const { mutateAsync: logout, isPending: isLoggingOut } = useLogout();

  type MenuItem = NonNullable<MenuProps['items']>[number];

  const menuItems: MenuProps['items'] = navigationSections.flatMap<MenuItem>((section) => {
    const items: MenuItem[] = section.items.map((item) => ({
      key: item.key,
      icon: item.icon,
      label: item.label,
      onClick: () => navigate(item.to),
    }));

    if (!section.label) return items;

    return [{ key: section.key, type: 'group', label: section.label, children: items }];
  });

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      notification.warning({ message: 'Signed out locally', description: getErrorMessage(error) });
    } finally {
      navigate('/login', { replace: true });
    }
  };

  const userMenu: MenuProps['items'] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sign out',
      disabled: isLoggingOut,
      onClick: () => void handleLogout(),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={setSidebarCollapsed}
        trigger={null}
        breakpoint="lg"
        width={232}
        style={{ borderInlineEnd: '1px solid rgba(5, 5, 5, 0.06)' }}
      >
        <Flex align="center" justify={collapsed ? 'center' : 'flex-start'} style={{ height: 60, paddingInline: spacing.md }}>
          <Typography.Text strong style={{ fontSize: 16, whiteSpace: 'nowrap' }}>
            {collapsed ? 'E' : 'Ecosystem'}
          </Typography.Text>
        </Flex>

        <Menu
          mode="inline"
          selectedKeys={[findActiveKey(location.pathname) ?? '']}
          items={menuItems}
          style={{ borderInlineEnd: 'none', paddingInline: spacing.xs }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            paddingInline: spacing.md,
            borderBottom: '1px solid rgba(5, 5, 5, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Button
            type="text"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleSidebar}
          />

          <Dropdown menu={{ items: userMenu }} trigger={['click']} placement="bottomRight">
            <Flex align="center" gap={spacing.xs} style={{ cursor: 'pointer' }}>
              <Avatar size="small" icon={<UserOutlined />}>
                {user ? userInitials(user.email) : undefined}
              </Avatar>
              <Typography.Text>{user?.email ?? 'Account'}</Typography.Text>
            </Flex>
          </Dropdown>
        </Header>

        <Content style={{ padding: spacing.lg }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
