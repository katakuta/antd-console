import React from 'react';
import { Card, Col, Row, Space, Typography, theme } from 'antd';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend,
} from 'recharts';
import { useI18n } from '@/i18n';

// ── Palette — balanced across theme presets ──
const P = {
  sapphire: '#4b8bbe',
  emerald:  '#4d9c45',
  amber:    '#d4952a',
  violet:   '#7e6eb8',
  rose:     '#c45b7a',
  teal:     '#3d9999',
  slate:    '#5f7d9c',
};
const SERIES = [P.sapphire, P.emerald, P.amber, P.violet, P.teal, P.rose, P.slate];

const lineData = [
  { month: 'Jan', sales: 420, visits: 260 }, { month: 'Feb', sales: 380, visits: 200 },
  { month: 'Mar', sales: 520, visits: 350 }, { month: 'Apr', sales: 340, visits: 310 },
  { month: 'May', sales: 610, visits: 440 }, { month: 'Jun', sales: 530, visits: 360 },
  { month: 'Jul', sales: 650, visits: 520 }, { month: 'Aug', sales: 580, visits: 450 },
];

const barData = [
  { name: 'Electronics', value: 4120 }, { name: 'Furniture', value: 3180 },
  { name: 'Audio', value: 2050 }, { name: 'Storage', value: 1630 }, { name: 'Other', value: 920 },
];

const pieData = [
  { name: 'Desktop', value: 420 }, { name: 'Mobile', value: 380 }, { name: 'Tablet', value: 210 }, { name: 'Other', value: 90 },
];

const areaData = [
  { month: 'Jan', revenue: 1100, cost: 520 }, { month: 'Feb', revenue: 1320, cost: 600 },
  { month: 'Mar', revenue: 1850, cost: 730 }, { month: 'Apr', revenue: 1680, cost: 780 },
  { month: 'May', revenue: 2120, cost: 860 }, { month: 'Jun', revenue: 2580, cost: 920 },
  { month: 'Jul', revenue: 2410, cost: 1050 }, { month: 'Aug', revenue: 2920, cost: 1180 },
];

// ── Shared chart config ──
const margin = { top: 8, right: 16, bottom: 0, left: 0 };
const tick = { fontSize: 11, fill: 'var(--ant-color-text-secondary)' };
const axisLine = { stroke: 'var(--ant-color-border-secondary)' };
const gridBase = { strokeDasharray: '3 3', strokeWidth: 0.5 } as const;

function TooltipView({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
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

const legendFn = (v: string) => <span style={{ color: 'var(--ant-color-text-secondary)' }}>{v}</span>;

export default function ChartsDemoPage() {
  const { t } = useI18n();
  const { token } = theme.useToken();
  const pad = (v: number, h?: number, b?: number) => `${v}px ${h ?? v}px ${b ?? v}px ${h ?? v}px`;
  const cardBd: React.CSSProperties = { borderRadius: token.borderRadiusLG, border: `1px solid ${token.colorBorderSecondary}`, height: '100%' };
  const chartBody = { padding: pad(token.paddingMD, token.paddingContentHorizontal, token.paddingXS) };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Typography.Title level={2} style={{ margin: `0 0 ${token.marginXXS}px`, fontWeight: 600, letterSpacing: '-0.02em' }}>{t('chartsDemo.title')}</Typography.Title>
        <Typography.Text type="secondary" style={{ fontSize: 14 }}>{t('chartsDemo.description')}</Typography.Text>
      </div>

      {/* Line + Bar */}
      <Row gutter={[token.margin, token.margin]}>
        <Col xs={24} lg={12}>
          <Card title={<Label>Line Chart — Monthly Trends</Label>} style={cardBd} styles={{ body: chartBody }}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData} margin={margin}>
                <CartesianGrid {...gridBase} stroke={token.colorBorderSecondary} />
                <XAxis dataKey="month" tick={tick} axisLine={axisLine} tickLine={false} />
                <YAxis tick={tick} axisLine={axisLine} tickLine={false} width={52} />
                <Tooltip content={<TooltipView />} cursor={{ stroke: P.sapphire + '44', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Legend iconType="rect" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 12 }} formatter={legendFn} />
                <Line type="monotone" dataKey="sales" name="Sales" stroke={P.sapphire} strokeWidth={2.2} dot={false}
                  activeDot={{ r: 5, fill: P.sapphire, stroke: '#fff', strokeWidth: 2 }} />
                <Line type="monotone" dataKey="visits" name="Visits" stroke={P.emerald} strokeWidth={2.2} dot={false}
                  activeDot={{ r: 5, fill: P.emerald, stroke: '#fff', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={<Label>Bar Chart — Category Comparison</Label>} style={cardBd} styles={{ body: chartBody }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} margin={margin} barCategoryGap="28%" maxBarSize={44}>
                <CartesianGrid {...gridBase} stroke={token.colorBorderSecondary} />
                <XAxis dataKey="name" tick={tick} axisLine={axisLine} tickLine={false} />
                <YAxis tick={tick} axisLine={axisLine} tickLine={false} width={52} />
                <Tooltip content={<TooltipView />} cursor={{ fill: 'var(--ant-color-fill-tertiary)', radius: 6 }} />
                <Bar dataKey="value" name="Revenue" fill={P.emerald} radius={[5, 5, 0, 0]} style={{ outline: 'none' }} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Pie + Area */}
      <Row gutter={[token.margin, token.margin]}>
        <Col xs={24} lg={12}>
          <Card title={<Label>Pie Chart — Traffic Sources</Label>} style={cardBd} styles={{ body: chartBody }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={56} outerRadius={100} paddingAngle={3}
                  dataKey="value" nameKey="name" stroke="none" style={{ outline: 'none' }}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: 'var(--ant-color-border-secondary)', strokeWidth: 1 }}>
                  {pieData.map((_, i) => <Cell key={i} fill={SERIES[i]} stroke="none" />)}
                </Pie>
                <Tooltip content={<TooltipView />} />
                <Legend iconType="rect" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} formatter={legendFn} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={<Label>Area Chart — Revenue vs Cost</Label>} style={cardBd} styles={{ body: chartBody }}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={areaData} margin={margin}>
                <CartesianGrid {...gridBase} stroke={token.colorBorderSecondary} />
                <XAxis dataKey="month" tick={tick} axisLine={axisLine} tickLine={false} />
                <YAxis tick={tick} axisLine={axisLine} tickLine={false} width={52} />
                <Tooltip content={<TooltipView />} cursor={{ stroke: P.sapphire + '44', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Legend iconType="rect" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 12 }} formatter={legendFn} />
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={P.sapphire} stopOpacity={0.22} />
                    <stop offset="100%" stopColor={P.sapphire} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={P.amber} stopOpacity={0.22} />
                    <stop offset="100%" stopColor={P.amber} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke={P.sapphire} strokeWidth={2.2}
                  fill="url(#revGrad)" activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }} />
                <Area type="monotone" dataKey="cost" name="Cost" stroke={P.amber} strokeWidth={2.2}
                  fill="url(#costGrad)" activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </Space>
  );
}

function Label({ children }: { children: string }) {
  return <Typography.Text style={{ fontSize: 14, fontWeight: 600 }}>{children}</Typography.Text>;
}
