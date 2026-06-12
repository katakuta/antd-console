import React from 'react';
import { Typography, Button, Badge, Segmented, Space, theme } from 'antd';
import { CheckCheck } from 'lucide-react';
import { useI18n } from '@/i18n';
import { mockGetNotifications, mockMarkAllRead, mockMarkOneRead, type DemoNotification } from '@/auth/mock-api';
import { NotificationItem } from '@/components/NotificationItem';

export default function NotificationsPage() {
  const { t } = useI18n();
  const { token } = theme.useToken();
  const [notifs, setNotifs] = React.useState<DemoNotification[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [filter, setFilter] = React.useState<'All' | 'Unread' | 'Read'>('All');

  const fetchNotifs = React.useCallback(async () => {
    setLoading(true);
    const data = await mockGetNotifications();
    setNotifs(data);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    fetchNotifs();
  }, [fetchNotifs]);

  const handleMarkAllRead = async () => {
    await mockMarkAllRead();
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleItemClick = async (n: DemoNotification) => {
    if (!n.read) {
      await mockMarkOneRead(n.id);
      setNotifs((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
    }
  };

  const unreadCount = notifs.filter((n) => !n.read).length;

  const filteredNotifs = React.useMemo(() => {
    if (filter === 'Unread') return notifs.filter((n) => !n.read);
    if (filter === 'Read') return notifs.filter((n) => n.read);
    return notifs;
  }, [notifs, filter]);

  return (
    <div style={{ padding: '24px 40px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <Typography.Title level={2} style={{ margin: 0, marginBottom: 8 }}>
            {t('notification.title') || 'Notifications'}
          </Typography.Title>
          <Typography.Text type="secondary" style={{ fontSize: 15 }}>
            Stay up to date with your latest alerts and messages.
          </Typography.Text>
        </div>
        <Button type="text" icon={<CheckCheck size={16} />} onClick={handleMarkAllRead} disabled={unreadCount === 0} style={{ fontWeight: 500 }}>
          {t('notification.markAllRead') || 'Mark all as read'}
        </Button>
      </div>

      {/* Tabs and Count */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Space size={12}>
          <Typography.Text strong style={{ fontSize: 16 }}>
            All Notifications
          </Typography.Text>
          {unreadCount > 0 && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2px 8px',
                borderRadius: 12,
                background: token.colorPrimary,
                color: '#fff',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {unreadCount} unread
            </span>
          )}
        </Space>

        <Segmented options={['All', 'Unread', 'Read']} value={filter} onChange={(value) => setFilter(value as 'All' | 'Unread' | 'Read')} />
      </div>

      {/* List */}
      <div
        style={{
          background: token.colorBgContainer,
          borderRadius: token.borderRadiusLG,
          border: `1px solid ${token.colorBorderSecondary}`,
          overflow: 'hidden',
        }}
      >
        {filteredNotifs.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <Typography.Text type="secondary">{t('notification.empty') || 'No notifications'}</Typography.Text>
          </div>
        ) : (
          filteredNotifs.map((n, idx) => (
            <NotificationItem
              key={n.id}
              n={n}
              onClick={handleItemClick}
              iconShape="square"
              style={{
                padding: '16px 24px',
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
