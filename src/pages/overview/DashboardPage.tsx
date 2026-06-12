import React from 'react';
import { Avatar, Button, Card, Col, List, Progress, Row, Space, Spin, Statistic, Table, Tag, Timeline, Typography, theme } from 'antd';
import {
  ArrowRight, Users, UserCheck, DollarSign, ShoppingCart,
  TrendingUp, TrendingDown, FileText, Palette, FormInput, UserPlus,
  Bell, CheckCircle, Clock, AlertTriangle, Zap, Calendar, Star,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { mockGetDashboardStats, mockGetActivities, type DemoUser, type DemoActivity } from '@/auth/mock-api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
dayjs.extend(relativeTime);

const A = { sapphire: '#4b8bbe', emerald: '#4d9c45', amber: '#d4952a', violet: '#7e6eb8', rose: '#c45b7a', teal: '#3d9999' };

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--ant-color-bg-elevated)', border: '1px solid var(--ant-color-border-secondary)', borderRadius: 8, padding: '8px 12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 13 }}>
      <div style={{ fontWeight: 600, marginBottom: 2, color: 'var(--ant-color-text)' }}>{label}</div>
      <div style={{ color: A.sapphire, fontWeight: 600 }}>{payload[0].value.toLocaleString()} users</div>
    </div>
  );
}

export default function DashboardPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState<Awaited<ReturnType<typeof mockGetDashboardStats>> | null>(null);
  const [activities, setActivities] = React.useState<DemoActivity[]>([]);

  React.useEffect(() => {
    Promise.all([mockGetDashboardStats(), mockGetActivities({ page: 1, pageSize: 12 })]).then(([s, a]) => {
      setStats(s); setActivities(a.data); setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 360 }}><Spin size="large" /></div>;

  // ── Spacing helpers ──
  const pad = (v: number, h?: number, b?: number) => `${v}px ${h ?? v}px ${b ?? 0}px ${h ?? v}px`;
  const cardBody = { padding: pad(token.paddingMD, token.paddingContentHorizontal) };
  const cardBodyChart = { padding: pad(token.padding, token.paddingContentHorizontal, token.paddingXXS) };
  const cardBodySm = { padding: pad(token.paddingSM, token.paddingContentHorizontal, token.padding) };
  const cardBodyXs = { padding: pad(token.paddingSM, token.paddingContentHorizontal, token.paddingXS) };
  const cardBd: React.CSSProperties = { borderRadius: token.borderRadiusLG, border: `1px solid ${token.colorBorderSecondary}`, height: '100%' };

  const tick = { fontSize: 10, fill: token.colorTextSecondary };
  const axis = { stroke: token.colorBorderSecondary };
  const grid = { stroke: token.colorBorderSecondary, strokeDasharray: '3 3', strokeWidth: 0.5 };

  const statCards = [
    { title: t('dashboard.totalUsers'), value: stats?.totalUsers ?? 0, icon: <Users size={20} />, accent: A.sapphire, bg: A.sapphire + '14', change: '+12.5%', up: true, extra: '+143 this week' },
    { title: t('dashboard.activeUsers'), value: stats?.activeUsers ?? 0, icon: <UserCheck size={20} />, accent: A.emerald, bg: A.emerald + '14', change: '+3.2%', up: true, extra: '43.7% of total' },
    { title: t('dashboard.revenue'), value: stats?.revenue ?? 0, icon: <DollarSign size={20} />, accent: A.violet, bg: A.violet + '14', change: '+8.1%', up: true, extra: '$48.3k avg', prefix: '$' },
    { title: t('dashboard.orders'), value: stats?.orders ?? 0, icon: <ShoppingCart size={20} />, accent: A.amber, bg: A.amber + '14', change: '-1.4%', up: false, extra: '32 pending' },
  ];

  const userCols = [
    { title: 'Name', dataIndex: 'name', key: 'name', width: 180, render: (_: unknown, r: DemoUser) => <Space><Avatar size={24} style={{ background: A.sapphire, fontSize: 12 }}>{r.name.charAt(0)}</Avatar><span>{r.name}</span></Space> },
    { title: 'Email', dataIndex: 'email', key: 'email', width: 220 },
    { title: 'Role', dataIndex: 'role', key: 'role', width: 100, render: (v: string) => <Tag color={v === 'Admin' ? 'red' : v === 'Manager' ? 'blue' : 'default'}>{v}</Tag> },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 90, render: (v: string) => <Tag color={v === 'Active' ? 'green' : v === 'Pending' ? 'orange' : 'red'}>{v}</Tag> },
  ];

  const unreadNotifs = [
    { icon: <Bell size={14} />, color: '#4b8bbe', text: 'New user registration requires approval', time: '5m ago' },
    { icon: <AlertTriangle size={14} />, color: '#d4952a', text: 'Storage usage exceeded 80% threshold', time: '32m ago' },
    { icon: <CheckCircle size={14} />, color: '#4d9c45', text: 'Scheduled backup completed successfully', time: '1h ago' },
    { icon: <Zap size={14} />, color: '#7e6eb8', text: 'System update available: v2.3.1', time: '3h ago' },
  ];

  const sysMetrics = [
    { label: 'CPU', value: 34, color: A.emerald }, { label: 'Memory', value: 62, color: A.amber },
    { label: 'Disk', value: 78, color: A.rose }, { label: 'Network', value: 22, color: A.sapphire },
  ];

  const quickActions = [
    { icon: <UserPlus size={18} />, label: 'Add User', desc: 'Create a new account', path: '/examples/users', color: A.sapphire, bg: A.sapphire + '12' },
    { icon: <FileText size={18} />, label: 'Table Demo', desc: 'Explore data tables', path: '/components/table-demo', color: A.emerald, bg: A.emerald + '12' },
    { icon: <Palette size={18} />, label: 'Theme Editor', desc: 'Customize appearance', color: A.violet, bg: A.violet + '12' },
    { icon: <FormInput size={18} />, label: 'Form Demo', desc: 'Form patterns', path: '/components/form-demo', color: A.amber, bg: A.amber + '12' },
    { icon: <Star size={18} />, label: 'Mock Dashboard', desc: 'Analytics view', path: '/overview/mock-dashboard', color: A.teal, bg: A.teal + '12' },
    { icon: <Zap size={18} />, label: 'Charts Demo', desc: 'Visualization examples', path: '/components/charts-demo', color: A.rose, bg: A.rose + '12' },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: token.marginSM }}>
        <div>
          <Typography.Title level={2} style={{ margin: `0 0 ${token.marginXXS}px`, fontWeight: 600, letterSpacing: '-0.02em' }}>{t('dashboard.welcome')}</Typography.Title>
          <Typography.Text type="secondary" style={{ fontSize: 14 }}>{t('dashboard.description')}</Typography.Text>
        </div>
        <Tag icon={<Calendar size={12} />} color="default" style={{ borderRadius: token.borderRadiusSM, padding: pad(token.paddingXXS, token.paddingSM) }}>
          {dayjs().format('MMM D, YYYY')}
        </Tag>
      </div>

      {/* Stat cards */}
      <Row gutter={[token.margin, token.margin]}>
        {statCards.map((s) => (
          <Col xs={24} sm={12} lg={6} key={s.title}>
            <Card style={cardBd} styles={{ body: cardBody }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Typography.Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500 }}>{s.title}</Typography.Text>
                  <Statistic value={s.value} prefix={s.prefix as string} valueStyle={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1, marginTop: token.marginXXS }} />
                </div>
                <div style={{ width: 40, height: 40, borderRadius: token.borderRadiusSM, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.accent, flexShrink: 0 }}>{s.icon}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: token.marginXS, marginTop: token.marginSM }}>
                {s.up ? <TrendingUp size={14} color={A.emerald} /> : <TrendingDown size={14} color={A.rose} />}
                <Typography.Text strong style={{ fontSize: 13, color: s.up ? A.emerald : A.rose }}>{s.change}</Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>{s.extra}</Typography.Text>
              </div>
              <div style={{ height: 3, borderRadius: 2, background: s.accent, marginTop: token.marginSM, opacity: 0.4 }} />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Weekly trend + System */}
      <Row gutter={[token.margin, token.margin]}>
        <Col xs={24} lg={16}>
          <Card title={<Label>Weekly Overview</Label>} style={cardBd} styles={{ body: cardBodyChart }}>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={stats?.userGrowth?.slice(-7) ?? []} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid {...grid} />
                <XAxis dataKey="month" tick={tick} axisLine={axis} tickLine={false} />
                <YAxis tick={tick} axisLine={axis} tickLine={false} width={48} />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: A.sapphire + '44', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Line type="monotone" dataKey="value" stroke={A.sapphire} strokeWidth={2.2} dot={{ r: 3, fill: A.sapphire, stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 5, fill: A.sapphire, stroke: '#fff', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title={<Label>System Health</Label>} style={cardBd} styles={{ body: cardBodySm }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {sysMetrics.map((m) => (
                <div key={m.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: token.marginXXS }}>
                    <Typography.Text style={{ fontSize: 13 }}>{m.label}</Typography.Text>
                    <Typography.Text strong style={{ fontSize: 13, color: m.color }}>{m.value}%</Typography.Text>
                  </div>
                  <Progress percent={m.value} showInfo={false} strokeColor={m.color} trailColor={token.colorFillSecondary} size="small" strokeLinecap="round" style={{ margin: 0 }} />
                </div>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Quick actions + Notifications */}
      <Row gutter={[token.margin, token.margin]}>
        <Col xs={24} lg={14}>
          <Card title={<Label>{t('dashboard.quickActions')}</Label>} style={cardBd} styles={{ body: cardBodyXs }}>
            <Row gutter={[token.marginSM, token.marginSM]}>
              {quickActions.map((a, i) => (
                <Col xs={12} sm={8} key={i}>
                  <button type="button" onClick={() => a.path ? navigate(a.path) : null}
                    style={{ width: '100%', textAlign: 'left', background: token.colorBgContainer, border: `1px solid ${token.colorBorderSecondary}`,
                      borderRadius: token.borderRadiusSM, padding: pad(token.paddingSM + 2, token.padding), cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: token.marginSM, transition: 'box-shadow 0.15s' }}
                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = token.boxShadowSecondary}
                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                    <span style={{ width: 36, height: 36, borderRadius: token.borderRadiusXS, background: a.bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: a.color, flexShrink: 0 }}>{a.icon}</span>
                    <div>
                      <Typography.Text strong style={{ fontSize: 13, display: 'block' }}>{a.label}</Typography.Text>
                      <Typography.Text type="secondary" style={{ fontSize: 11 }}>{a.desc}</Typography.Text>
                    </div>
                  </button>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title={<Space size="small"><Bell size={14} /><Label>Notifications</Label></Space>} style={cardBd} styles={{ body: cardBodyXs }}>
            <List dataSource={unreadNotifs} split={false}
              renderItem={(n) => (
                <List.Item style={{ padding: `${token.paddingSM}px 0`, borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
                  <div style={{ display: 'flex', gap: token.marginSM, width: '100%' }}>
                    <span style={{ color: n.color, marginTop: 2, flexShrink: 0 }}>{n.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Typography.Text style={{ fontSize: 13 }}>{n.text}</Typography.Text>
                      <Typography.Text type="secondary" style={{ fontSize: 11, display: 'block' }}>{n.time}</Typography.Text>
                    </div>
                  </div>
                </List.Item>
              )} />
          </Card>
        </Col>
      </Row>

      {/* Recent users + Activity */}
      <Row gutter={[token.margin, token.margin]}>
        <Col xs={24} lg={14}>
          <Card title={<Label>{t('dashboard.recentActivity')}</Label>}
            extra={<Button type="link" onClick={() => navigate('/examples/users')} style={{ fontWeight: 500 }}>{t('dashboard.viewAll')} <ArrowRight size={14} /></Button>}
            style={cardBd} styles={{ body: cardBodyXs }}>
            <Table dataSource={stats?.recentUsers ?? []} columns={userCols} rowKey="id" pagination={false} size="small" />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title={<Space size="small"><Clock size={14} /><Label>Recent Activity</Label></Space>} style={cardBd} styles={{ body: cardBodyXs }}>
            <Timeline items={activities.slice(0, 6).map((a) => ({
              color: a.action.includes('created') || a.action.includes('invited') ? 'green' : a.action.includes('deleted') ? 'red' : 'blue',
              children: (
                <div>
                  <Typography.Text strong style={{ fontSize: 13 }}>{a.user}</Typography.Text>
                  <Typography.Text style={{ fontSize: 13 }}> {a.action} </Typography.Text>
                  <Typography.Text italic style={{ fontSize: 13 }}>{a.target}</Typography.Text>
                  <Typography.Text type="secondary" style={{ fontSize: 11, display: 'block' }}>{dayjs(a.timestamp).fromNow()}</Typography.Text>
                </div>
              ),
            }))} />
          </Card>
        </Col>
      </Row>

      <div style={{ height: token.paddingXS }} />
    </Space>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <Typography.Text style={{ fontSize: 14, fontWeight: 600 }}>{children}</Typography.Text>;
}
