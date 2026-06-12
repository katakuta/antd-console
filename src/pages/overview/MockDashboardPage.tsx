import React from 'react';
import { Card, Col, Row, Space, Spin, Statistic, Table, Typography, theme } from 'antd';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { useI18n } from '@/i18n';
import { mockGetDashboardStats } from '@/auth/mock-api';

const P = {
  sapphire: '#4b8bbe', emerald: '#4d9c45', amber: '#d4952a',
  violet: '#7e6eb8', rose: '#c45b7a', teal: '#3d9999', slate: '#5f7d9c',
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

export default function MockDashboardPage() {
  const { t } = useI18n();
  const { token } = theme.useToken();
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState<Awaited<ReturnType<typeof mockGetDashboardStats>> | null>(null);

  React.useEffect(() => { mockGetDashboardStats().then((d) => { setStats(d); setLoading(false); }); }, []);
  if (loading) return <Spin size="large" style={{ display: 'block', margin: '120px auto' }} />;

  // ── Spacing ──
  const pad = (v: number, h?: number, b?: number) => `${v}px ${h ?? v}px ${b ?? 0}px ${h ?? v}px`;
  const cardBd: React.CSSProperties = { borderRadius: token.borderRadiusLG, border: `1px solid ${token.colorBorderSecondary}`, height: '100%' };
  const body = { padding: pad(token.paddingMD, token.paddingContentHorizontal) };
  const bodyChart = { padding: pad(token.padding, token.paddingContentHorizontal, token.paddingXXS) };
  const bodyTable = { padding: pad(token.padding, token.paddingContentHorizontal, token.paddingXS) };

  const tick = { fontSize: 10, fill: token.colorTextSecondary };
  const axisLine = { stroke: token.colorBorderSecondary };
  const grid = { stroke: token.colorBorderSecondary, strokeDasharray: '3 3', strokeWidth: 0.5 };

  const statCards = [
    { title: t('dashboard.totalUsers'), value: stats?.totalUsers ?? 0, accent: P.sapphire, change: '+12.5%', up: true },
    { title: t('dashboard.activeUsers'), value: stats?.activeUsers ?? 0, accent: P.emerald, change: '+3.2%', up: true },
    { title: t('dashboard.revenue'), value: stats?.revenue ?? 0, prefix: '$', accent: P.violet, change: '+8.1%', up: true },
    { title: t('dashboard.orders'), value: stats?.orders ?? 0, accent: P.amber, change: '-1.4%', up: false },
  ];

  const userCols = [
    { title: 'Name', dataIndex: 'name', key: 'name' }, { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Role', dataIndex: 'role', key: 'role' }, { title: 'Status', dataIndex: 'status', key: 'status' },
  ];
  const pieColors = [P.sapphire, P.emerald, P.amber, P.violet, P.teal];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Typography.Title level={2} style={{ margin: `0 0 ${token.marginXXS}px`, fontWeight: 600, letterSpacing: '-0.02em' }}>{t('nav.mockDashboard')}</Typography.Title>
        <Typography.Text type="secondary" style={{ fontSize: 14 }}>Analytics overview with key metrics and visualizations.</Typography.Text>
      </div>

      <Row gutter={[token.margin, token.margin]}>
        {statCards.map((s) => (
          <Col xs={24} sm={12} lg={6} key={s.title}>
            <Card style={cardBd} styles={{ body }}>
              <Typography.Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>{s.title}</Typography.Text>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: token.marginSM, marginTop: token.marginXS }}>
                <Statistic value={s.value} prefix={s.prefix as string} valueStyle={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }} />
                <Typography.Text style={{ fontSize: 13, color: s.up ? P.emerald : P.rose, fontWeight: 500 }}>{s.change}</Typography.Text>
              </div>
              <div style={{ height: 3, borderRadius: 2, background: s.accent, marginTop: token.marginSM, opacity: 0.55 }} />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[token.margin, token.margin]}>
        <Col xs={24} lg={12}>
          <Card title={<Label>User Growth</Label>} style={cardBd} styles={{ body: bodyChart }}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={stats?.userGrowth ?? []} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
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
          <Card title={<Label>Revenue by Category</Label>} style={cardBd} styles={{ body: bodyChart }}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stats?.revenueByCategory ?? []} margin={{ top: 8, right: 16, bottom: 0, left: 0 }} barCategoryGap="28%" maxBarSize={44}>
                <CartesianGrid {...grid} />
                <XAxis dataKey="name" tick={tick} axisLine={axisLine} tickLine={false} />
                <YAxis tick={tick} axisLine={axisLine} tickLine={false} width={52} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: token.colorFillTertiary, radius: 6 }} />
                <Bar dataKey="value" name="Revenue" fill={P.emerald} radius={[5, 5, 0, 0]} style={{ outline: 'none' }} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[token.margin, token.margin]}>
        <Col xs={24} lg={8}>
          <Card title={<Label>Distribution</Label>} style={cardBd} styles={{ body: bodyChart }}>
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
          <Card title={<Label>Recent Users</Label>} style={cardBd} styles={{ body: bodyTable }}>
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
