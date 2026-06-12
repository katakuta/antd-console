import React from 'react';
import { Card, Space, Spin, Timeline, Typography } from 'antd';
import { Activity, User } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useI18n } from '@/i18n';
import { mockGetActivities, type DemoActivity } from '@/auth/mock-api';

dayjs.extend(relativeTime);

export default function ActivityLogPage() {
  const { t } = useI18n();
  const [loading, setLoading] = React.useState(true);
  const [activities, setActivities] = React.useState<DemoActivity[]>([]);

  React.useEffect(() => {
    mockGetActivities({ page: 1, pageSize: 30 }).then((res) => {
      setActivities(res.data);
      setLoading(false);
    });
  }, []);

  const getActionColor = (action: string): string => {
    if (action.includes('created') || action.includes('invited')) return 'green';
    if (action.includes('deleted') || action.includes('archived')) return 'red';
    if (action.includes('updated') || action.includes('changed')) return 'blue';
    return 'gray';
  };

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <div>
        <Typography.Title level={2} style={{ marginTop: 0, marginBottom: 4 }}>{t('nav.activityLog')}</Typography.Title>
        <Typography.Text type="secondary">Recent system activity feed.</Typography.Text>
      </div>
      <Card>
        {loading ? <Spin style={{ display: 'block', margin: '60px auto' }} /> :
          activities.length === 0 ? (
            <Typography.Text type="secondary">{t('common.noData')}</Typography.Text>
          ) : (
            <Timeline
              items={activities.map((a) => ({
                color: getActionColor(a.action),
                dot: a.action.includes('logged') ? <User size={14} /> : <Activity size={14} />,
                children: (
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <span>
                      <Typography.Text strong>{a.user}</Typography.Text>
                      {' '}{a.action}{' '}
                      <Typography.Text italic>{a.target}</Typography.Text>
                    </span>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                      {dayjs(a.timestamp).fromNow()}
                    </Typography.Text>
                  </div>
                ),
              }))}
            />
          )}
      </Card>
    </Space>
  );
}
