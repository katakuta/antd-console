import React from 'react';
import { Badge, Card, Col, Descriptions, Progress, Row, Space, Statistic, Tag, Timeline, Typography } from 'antd';
import { ArrowUp, ArrowDown, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useI18n } from '@/i18n';

export default function DataDisplayPage() {
  const { t } = useI18n();

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <div>
        <Typography.Title level={2} style={{ marginTop: 0, marginBottom: 4 }}>{t('dataDisplay.title')}</Typography.Title>
        <Typography.Text type="secondary">{t('dataDisplay.description')}</Typography.Text>
      </div>

      {/* Statistics */}
      <Card title="Statistics">
        <Row gutter={[24, 24]}>
          {[
            { title: 'Total Revenue', value: 126560, prefix: '$', suffix: '', precision: 2, icon: <ArrowUp size={16} color="#52c41a" />, trend: '+12.5%', trendColor: '#52c41a' },
            { title: 'Active Users', value: 8846, suffix: '', icon: <ArrowUp size={16} color="#52c41a" />, trend: '+3.2%', trendColor: '#52c41a' },
            { title: 'Bounce Rate', value: 32.1, suffix: '%', precision: 1, icon: <ArrowDown size={16} color="#52c41a" />, trend: '-2.1%', trendColor: '#52c41a' },
            { title: 'Avg. Response', value: 256, suffix: 'ms', icon: <ArrowDown size={16} color="#fa8c16" />, trend: '+8ms', trendColor: '#fa8c16' },
          ].map((item, idx) => (
            <Col xs={24} sm={12} lg={6} key={idx}>
              <Card size="small">
                <Statistic title={item.title} value={item.value} precision={item.precision} prefix={item.prefix} suffix={item.suffix}
                  valueStyle={{ fontSize: 26, fontWeight: 700 }} />
                <Typography.Text style={{ color: item.trendColor, fontSize: 13 }}>
                  {item.icon} {item.trend}
                </Typography.Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Cards + Progress */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Progress Indicators">
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <div>
                <Typography.Text>System Uptime</Typography.Text>
                <Progress percent={99.9} status="active" strokeColor="#52c41a" />
              </div>
              <div>
                <Typography.Text>Storage Usage</Typography.Text>
                <Progress percent={68} status="active" strokeColor="#1677ff" />
              </div>
              <div>
                <Typography.Text>CPU Load</Typography.Text>
                <Progress percent={45} status="active" strokeColor="#fa8c16" />
              </div>
              <div>
                <Typography.Text>Error Rate</Typography.Text>
                <Progress percent={2} status="exception" />
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Tags & Badges">
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <div>
                <Typography.Text style={{ display: 'block', marginBottom: 8 }}>Status Tags</Typography.Text>
                <Space wrap>
                  <Tag color="green">Success</Tag>
                  <Tag color="blue">Processing</Tag>
                  <Tag color="orange">Warning</Tag>
                  <Tag color="red">Error</Tag>
                  <Tag color="purple">Archived</Tag>
                  <Tag>Default</Tag>
                </Space>
              </div>
              <div>
                <Typography.Text style={{ display: 'block', marginBottom: 8 }}>Badges</Typography.Text>
                <Space wrap size={16}>
                  <Badge status="success" text="Online" />
                  <Badge status="processing" text="Running" />
                  <Badge status="warning" text="Warning" />
                  <Badge status="error" text="Offline" />
                  <Badge count={5}><Typography.Text style={{ padding: '0 8px' }}>Notifications</Typography.Text></Badge>
                </Space>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Descriptions + Timeline */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Description List">
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Product">Console Frame</Descriptions.Item>
              <Descriptions.Item label="Version">1.0.0</Descriptions.Item>
              <Descriptions.Item label="Framework">React 19 + antd 6</Descriptions.Item>
              <Descriptions.Item label="License">MIT</Descriptions.Item>
              <Descriptions.Item label="Author">Console Frame Team</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Timeline">
            <Timeline items={[
              { color: 'green', dot: <CheckCircle size={14} />, children: 'Project initialized with Vite + React' },
              { color: 'blue', dot: <Clock size={14} />, children: 'Added antd design system and theme engine' },
              { color: 'blue', dot: <Clock size={14} />, children: 'Built layout, auth, i18n infrastructure' },
              { color: 'orange', dot: <AlertCircle size={14} />, children: 'Created demo pages and documentation' },
              { color: 'gray', children: 'Ready for business code integration' },
            ]} />
          </Card>
        </Col>
      </Row>
    </Space>
  );
}
