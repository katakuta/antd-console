import React from 'react';
import { Card, Col, Row, Space, Spin, Statistic, Table, Typography } from 'antd';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { useI18n } from '@/i18n';
import { mockGetDashboardStats } from '@/auth/mock-api';

// ── Chart palette — balanced across theme presets ──
const P = {
  sapphire: '#4b8bbe',
  emerald:  '#4d9c45',
  amber:    '#d4952a',
  violet:   '#7e6eb8',
  rose:     '#c45b7a',
  teal:     '#3d9999',
  slate:    '#5f7d9c',
};

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--ant-color-bg-elevated)', border: '1px solid var(--ant-color-border-secondary)', borderRadius: 8, padding: '10px 14px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 13, lineHeight: 1.6 }}>
      {label && <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>}
      {payload.map((e, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: e.color, flexShrink: 0 }} />
          <span style={{ color: 'var(--ant-color-text-secondary)' }}>{e.name}:</span>
          <span style={{ fontWeight: 600 }}>{e.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

const margin = { top: 8, right: 16, bottom: 0, left: 0 };
const tick = { fontSize: 11, fill: 'var(--ant-color-text-secondary)' };
const axisLine = { stroke: 'var(--ant-color-border-secondary)' };
const grid = { stroke: 'var(--ant-color-border-secondary)', strokeDasharray: '3 3', strokeWidth: 0.5 };
const card: React.CSSProperties = { borderRadius: 12, border: '1px solid var(--ant-color-border-secondary)', height: '100%' };

export default function MockDashboardPage() {
  const { t } = useI18n();
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState<Awaited<ReturnType<typeof mockGetDashboardStats>> | null>(null);

  React.useEffect(() => { mockGetDashboardStats().then((d) => { setStats(d); setLoading(false); }); }, []);
  if (loading) return <Spin size="large" style={{ display: 'block', margin: '120px auto' }} />;

  const statCards = [
    { title: t('dashboard.totalUsers'),  value: stats?.totalUsers ?? 0,          accent: P.sapphire, change: '+12.5%', up: true },
    { title: t('dashboard.activeUsers'),  value: stats?.activeUsers ?? 0,         accent: P.emerald,  change: '+3.2%',  up: true },
    { title: t('dashboard.revenue'),      value: stats?.revenue ?? 0, prefix: '$', accent: P.violet,   change: '+8.1%',  up: true },
    { title: t('dashboard.orders'),       value: stats?.orders ?? 0,               accent: P.amber,    change: '-1.4%',  up: false },
  ];

  const userCols = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
  ];

  const pieColors = [P.sapphire, P.emerald, P.amber, P.violet, P.teal];

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <div>
        <Typography.Title level={2} style={{ margin: '0 0 4px', fontWeight: 600, letterSpacing: '-0.02em' }}>{t('nav.mockDashboard')}</Typography.Title>
        <Typography.Text type="secondary" style={{ fontSize: 14 }}>Analytics overview with key metrics and visualizations.</Typography.Text>
      </div>

      <Row gutter={[16, 16]}>
        {statCards.map((s) => (
          <Col xs={24} sm={12} lg={6} key={s.title}>
            <Card style={card} styles={{ body: { padding: '20px 22px' } }}>
              <Typography.Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>{s.title}</Typography.Text>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6 }}>
                <Statistic value={s.value} prefix={s.prefix as string} valueStyle={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }} />
                <Typography.Text style={{ fontSize: 13, color: s.up ? P.emerald : P.rose, fontWeight: 500 }}>{s.change}</Typography.Text>
              </div>
              <div style={{ height: 3, borderRadius: 2, background: s.accent, marginTop: 14, opacity: 0.55 }} />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title={<Label>User Growth</Label>} style={card} styles={{ body: { padding: '20px 16px 8px' } }}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={stats?.userGrowth ?? []} margin={margin}>
                <CartesianGrid {...grid} />
                <XAxis dataKey="month" tick={tick} axisLine={axisLine} tickLine={false} />
                <YAxis tick={tick} axisLine={axisLine} tickLine={false} width={52} />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: P.sapphire + '44', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Line type="monotone" dataKey="value" name="Users" stroke={P.sapphire} strokeWidth={2.2} dot={false}
                  activeDot={{ r: 5, fill: P.sapphire, stroke: '#fff', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={<Label>Revenue by Category</Label>} style={card} styles={{ body: { padding: '20px 16px 8px' } }}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stats?.revenueByCategory ?? []} margin={margin} barCategoryGap="28%" maxBarSize={44}>
                <CartesianGrid {...grid} />
                <XAxis dataKey="name" tick={tick} axisLine={axisLine} tickLine={false} />
                <YAxis tick={tick} axisLine={axisLine} tickLine={false} width={52} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--ant-color-fill-tertiary)', radius: 6 }} />
                <Bar dataKey="value" name="Revenue" fill={P.emerald} radius={[5, 5, 0, 0]} style={{ outline: 'none' }} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title={<Label>Distribution</Label>} style={card} styles={{ body: { padding: '20px 16px 8px' } }}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie data={stats?.revenueByCategory ?? []} cx="50%" cy="50%" innerRadius={52} outerRadius={96}
                  paddingAngle={3} dataKey="value" nameKey="name" stroke="none" style={{ outline: 'none' }}>
                  {(stats?.revenueByCategory ?? []).map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} stroke="none" />)}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={16}>
          <Card title={<Label>Recent Users</Label>} style={card} styles={{ body: { padding: '16px 20px 8px' } }}>
            <Table dataSource={stats?.recentUsers ?? []} columns={userCols} rowKey="id" pagination={false} size="small" />
          </Card>
        </Col>
      </Row>
    </Space>
  );
}

function Label({ children }: { children: string }) {
  return <Typography.Text style={{ fontSize: 14, fontWeight: 600 }}>{children}</Typography.Text>;
}
