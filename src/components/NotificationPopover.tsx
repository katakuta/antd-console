import React from 'react';
import { Badge, Button, Popover, Space, Typography, theme } from 'antd';
import { Bell } from 'lucide-react';
import { useI18n } from '@/i18n';
import { mockGetNotifications, mockMarkAllRead, mockMarkOneRead, type DemoNotification } from '@/auth/mock-api';
import { useNavigate } from 'react-router-dom';
import { NotificationItem } from './NotificationItem';

export default function NotificationPopover() {
  const { t } = useI18n();
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [notifs, setNotifs] = React.useState<DemoNotification[]>([]);
  const [loading, setLoading] = React.useState(false);

  const fetchNotifs = React.useCallback(async () => {
    setLoading(true);
    const data = await mockGetNotifications();
    setNotifs(data);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    fetchNotifs();
  }, [fetchNotifs]);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const handleItemClick = async (n: DemoNotification) => {
    if (!n.read) {
      await mockMarkOneRead(n.id);
      setNotifs((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
    }
  };

  const handleViewAll = () => {
    setOpen(false);
    navigate('/system/notifications');
  };

  const content = (
    <div style={{ width: 360, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
        <Typography.Text strong style={{ fontSize: 15 }}>
          {t('notification.title') || 'Notifications'}
        </Typography.Text>
      </div>

      {/* List */}
      <div style={{ maxHeight: 380, overflowY: 'auto' }}>
        {notifs.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <Typography.Text type="secondary">{t('notification.empty') || 'No notifications'}</Typography.Text>
          </div>
        ) : (
          notifs.slice(0, 5).map((n) => <NotificationItem key={n.id} n={n} onClick={handleItemClick} />)
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '10px 0', borderTop: `1px solid ${token.colorBorderSecondary}`, textAlign: 'center' }}>
        <a onClick={handleViewAll} style={{ fontSize: 12 }}>
          {t('notification.viewAll') || 'View all notifications'}
        </a>
      </div>
    </div>
  );

  return (
    <Popover content={content} trigger="click" open={open} onOpenChange={setOpen} placement="bottomRight" arrow={false} styles={{ container: { padding: 0 } }}>
      <Badge dot={unreadCount > 0} size="small" offset={[-2, 4]}>
        <Button type="text" shape="circle" className="main-console-header-icon" icon={<Bell size={18} />} aria-label={t('notification.title') || 'Notifications'} />
      </Badge>
    </Popover>
  );
}
