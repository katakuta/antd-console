import React from 'react';
import { Badge, Button, Card, Col, Divider, Form, Input, Progress, Row, Select, Space, Statistic, Table, Tag, Timeline, Typography, theme } from 'antd';
import { useThemeSettings } from '@/theme/ThemeSettingsProvider';
import { CONSOLE_FRAME_FONT_FAMILY } from '@/theme/themeConfig';
import { useI18n } from '@/i18n';

const colorItems = [
  ['Primary', 'colorPrimary'], ['Success', 'colorSuccess'],
  ['Error', 'colorError'], ['Info', 'colorInfo'],
] as const;

const tableRows = [
  { key: '1', token: 'colorPrimary', usage: 'Brand actions, links, selected menu', status: 'Active' },
  { key: '2', token: 'borderRadius', usage: 'Cards, buttons, inputs, menus', status: 'Stable' },
  { key: '3', token: 'fontSize', usage: 'Dense operational pages', status: 'Stable' },
];

const TOKEN_TABLE_COLUMNS = [
  { title: 'Token', dataIndex: 'token', render: (text: string) => <Typography.Text code>{text}</Typography.Text> },
  { title: 'Usage', dataIndex: 'usage' },
  { title: 'Status', dataIndex: 'status', render: (text: string) => <Tag color="blue">{text}</Tag> },
];

export default function DesignTokenPage() {
  const { token } = theme.useToken();
  const { settings } = useThemeSettings();
  const { t } = useI18n();

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <div>
        <Typography.Title level={2} style={{ marginTop: 0, marginBottom: 4 }}>Design Tokens</Typography.Title>
        <Typography.Text type="secondary">Ant Design theme tokens and component surface preview.</Typography.Text>
      </div>
      <Row gutter={[16, 16]}>
        {colorItems.map(([label, key]) => (
          <Col xs={24} sm={12} lg={6} key={key}>
            <Card>
              <Space direction="vertical" size={10} style={{ width: '100%' }}>
                <Typography.Text type="secondary">{label}</Typography.Text>
                <div style={{ height: 54, borderRadius: token.borderRadius, background: String(token[key]), boxShadow: token.boxShadowSecondary }} />
                <Typography.Text copyable code>{String(token[key])}</Typography.Text>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title="Typography">
            <Typography.Title level={3} style={{ marginTop: 0 }}>Commercial template rhythm</Typography.Title>
            <Typography.Paragraph type="secondary">{CONSOLE_FRAME_FONT_FAMILY}</Typography.Paragraph>
            <Statistic title="Tabular number" value={24918} className="metric-number" suffix={<Badge status="success" text="online" />} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Shape">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Typography.Text>Radius: {settings.borderRadius}px</Typography.Text>
              <Progress percent={72} status="active" />
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Actions">
            <Space wrap><Button type="primary">Primary</Button><Button>Default</Button><Button danger>Danger</Button><Button type="dashed">Dashed</Button></Space>
            <Divider />
            <Space wrap><Tag color="processing">processing</Tag><Tag color="success">success</Tag><Tag color="error">error</Tag></Space>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={14}>
          <Card title="Token Table"><Table pagination={false} dataSource={tableRows} columns={TOKEN_TABLE_COLUMNS} /></Card>
        </Col>
        <Col xs={24} xl={10}>
          <Card title="Form Surface">
            <Form layout="vertical">
              <Form.Item label="Component Name"><Input placeholder="Example Component" /></Form.Item>
              <Form.Item label="Density"><Select value={settings.density} options={[{ label: 'Default', value: 'default' }, { label: 'Compact', value: 'compact' }]} /></Form.Item>
              <Button type="primary">Preview Submit</Button>
            </Form>
          </Card>
        </Col>
      </Row>
      <Card title="Workspace Timeline">
        <Timeline items={[
          { color: 'green', children: 'Theme Editor tokens imported as defaults.' },
          { color: 'blue', children: 'Layout settings are persisted locally.' },
          { color: 'gray', children: 'Business pages can now be built on this shell.' },
        ]} />
      </Card>
    </Space>
  );
}
