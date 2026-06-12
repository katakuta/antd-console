import React from 'react';
import { App, Button, Card, Col, Descriptions, Divider, Form, Input, Modal, Row, Space, Spin, Tag, Typography, theme } from 'antd';
import { Shield, Key, Smartphone, Globe, Clock, Building2, Mail, MapPin, Phone, Layers, CheckCircle, History } from 'lucide-react';
import { useI18n } from '@/i18n';
import { mockGetProfile, type DemoProfile } from '@/auth/mock-api';
import { logoutToLogin } from '@/auth/logout';
import dayjs from 'dayjs';

// ── Helpers ──

const cardBd: React.CSSProperties = { borderRadius: 'var(--ant-border-radius-lg)', border: '1px solid var(--ant-color-border-secondary)' };

function iconBg(color: string): React.CSSProperties {
  return {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: color + '18',
    color,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };
}

function CardLabel({ icon, children, color }: { icon: React.ReactNode; children: string; color: string }) {
  return (
    <Space size="small">
      <span style={iconBg(color)}>{icon}</span>
      <Typography.Text style={{ fontSize: 14, fontWeight: 600 }}>{children}</Typography.Text>
    </Space>
  );
}

const descLabelStyle: React.CSSProperties = { fontWeight: 500, color: 'var(--ant-color-text-secondary)', fontSize: 12, lineHeight: '20px' };
const descContentStyle: React.CSSProperties = { fontWeight: 500, fontSize: 13, lineHeight: '20px' };
const descItemIcon: React.CSSProperties = { marginRight: 6, flexShrink: 0 };

function DescLabel({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      <Icon size={16} style={descItemIcon} />
      {children}
    </span>
  );
}

// ── Main ──

export default function ProfilePage() {
  const { t } = useI18n();
  const { token } = theme.useToken();
  const pad = (v: number, h?: number, b?: number) => `${v}px ${h ?? v}px ${b ?? 0}px ${h ?? v}px`;
  const { message: msgApi } = App.useApp();
  const [loading, setLoading] = React.useState(true);
  const [profile, setProfile] = React.useState<DemoProfile | null>(null);
  const [pwModalOpen, setPwModalOpen] = React.useState(false);

  React.useEffect(() => {
    mockGetProfile().then((p) => {
      setProfile(p);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 360 }}><Spin size="large" /></div>;

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: token.marginSM }}>
        <div>
          <Typography.Title level={2} style={{ margin: `0 0 ${token.marginXXS}px`, fontWeight: 600, letterSpacing: '-0.02em' }}>
            {profile?.firstName} {profile?.lastName}
          </Typography.Title>
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            {profile?.email}
          </Typography.Text>
        </div>
        <Button type="primary" onClick={() => setPwModalOpen(true)} icon={<Key size={15} />}>
          Change Password
        </Button>
      </div>

      {/* Account Information */}
      <Card
        title={
          <CardLabel icon={<Shield size={16} />} color="#4b8bbe">
            Account Information
          </CardLabel>
        }
        style={cardBd}
        styles={{ body: { padding: pad(token.paddingSM, token.paddingLG, token.paddingMD) } }}
      >
        <Descriptions column={{ xs: 1, sm: 2, lg: 3 }} size="small" colon={false} labelStyle={descLabelStyle} contentStyle={descContentStyle} style={{ lineHeight: '20px' }}>
          <Descriptions.Item label={<DescLabel icon={Mail}>Email</DescLabel>}>{profile?.email}</Descriptions.Item>
          <Descriptions.Item label={<DescLabel icon={Globe}>Language</DescLabel>}>{profile?.language}</Descriptions.Item>
          <Descriptions.Item label={<DescLabel icon={MapPin}>Country</DescLabel>}>
            {profile?.country}, {profile?.city}
          </Descriptions.Item>
          <Descriptions.Item label={<DescLabel icon={Building2}>Company</DescLabel>}>{profile?.company}</Descriptions.Item>
          <Descriptions.Item label={<DescLabel icon={Layers}>Department</DescLabel>}>{profile?.department}</Descriptions.Item>
          <Descriptions.Item label={<DescLabel icon={Phone}>Phone</DescLabel>}>{profile?.phone}</Descriptions.Item>
          <Descriptions.Item label={<DescLabel icon={Clock}>Timezone</DescLabel>}>{profile?.timezone}</Descriptions.Item>
          <Descriptions.Item label={<DescLabel icon={CheckCircle}>Status</DescLabel>}>
            <Tag color={profile?.activeStatus === 'ACTIVE' ? 'green' : 'default'}>{profile?.activeStatus}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label={<DescLabel icon={History}>Member Since</DescLabel>}>
            {profile?.createdAt ? dayjs(profile.createdAt).format('MMM D, YYYY') : '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Roles & Permissions */}
      <Row gutter={[token.margin, token.margin]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <CardLabel icon={<Layers size={16} />} color="#7e6eb8">
                Roles
              </CardLabel>
            }
            style={cardBd}
            styles={{ body: { padding: pad(token.paddingSM, token.paddingLG, token.paddingMD) } }}
          >
            <Space wrap size="small">
              {(profile?.roles ?? []).map((r) => (
                <Tag
                  key={r}
                  style={{
                    fontSize: 13,
                    padding: '3px 12px',
                    borderRadius: 6,
                    fontWeight: 500,
                    border: 'none',
                    background: r === 'Admin' ? '#7e6eb816' : '#4b8bbe16',
                    color: r === 'Admin' ? '#7e6eb8' : '#4b8bbe',
                  }}
                >
                  {r}
                </Tag>
              ))}
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={
              <CardLabel icon={<CheckCircle size={16} />} color="#4d9c45">
                Permissions
              </CardLabel>
            }
            style={cardBd}
            styles={{ body: { padding: pad(token.paddingSM, token.paddingLG, token.paddingMD) } }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: token.marginXS }}>
              {(profile?.permissions ?? []).map((p) => (
                <Tag key={p} style={{ fontSize: 11, borderRadius: 4, background: 'var(--ant-color-fill-secondary)', border: 'none', color: 'var(--ant-color-text-secondary)' }}>
                  {p}
                </Tag>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Security */}
      <Card
        title={
          <CardLabel icon={<Smartphone size={16} />} color="#d4952a">
            Security
          </CardLabel>
        }
        style={cardBd}
        styles={{ body: { padding: pad(token.paddingSM, token.paddingLG, token.paddingMD) } }}
      >
        <Space direction="vertical" size={0} style={{ width: '100%' }}>
          <RowItem
            title="Password"
            subtitle={`Last changed ${profile?.lastPasswordChange ? dayjs(profile.lastPasswordChange).format('MMM D, YYYY') : '-'}`}
            action={
              <Button size="small" onClick={() => setPwModalOpen(true)}>
                Change
              </Button>
            }
          />
          <Divider style={{ margin: `${token.marginXXS}px 0` }} />
          <RowItem
            title="Two-Factor Authentication"
            subtitle={profile?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
            action={<Tag color={profile?.twoFactorEnabled ? 'green' : 'default'}>{profile?.twoFactorEnabled ? 'Active' : 'Inactive'}</Tag>}
          />
          <Divider style={{ margin: `${token.marginSM}px 0` }} />
          <RowItem
            title="Active Sessions"
            subtitle={`${profile?.sessionCount} device${profile?.sessionCount !== 1 ? 's' : ''} signed in`}
            action={
              <Button
                size="small"
                danger
                onClick={() => {
                  msgApi.success('All other sessions signed out.');
                }}
              >
                Sign out others
              </Button>
            }
          />
        </Space>
      </Card>

      <ChangePasswordModal open={pwModalOpen} email={profile?.email ?? ''} onClose={() => setPwModalOpen(false)} />
    </Space>
  );
}

// ── Security row ──

function RowItem({ title, subtitle, action }: { title: string; subtitle: string; action: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
      <div>
        <Typography.Text style={{ fontSize: 14, fontWeight: 500 }}>{title}</Typography.Text>
        <Typography.Text type="secondary" style={{ display: 'block', fontSize: 12, marginTop: 2 }}>
          {subtitle}
        </Typography.Text>
      </div>
      <div style={{ flexShrink: 0, marginLeft: 16 }}>{action}</div>
    </div>
  );
}

// ── Modal ──

function ChangePasswordModal({ open, email, onClose }: { open: boolean; email: string; onClose: () => void }) {
  const { message: msgApi } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [countdown, setCountdown] = React.useState(0);

  React.useEffect(() => {
    if (!open) return;
    form.resetFields();
    form.setFieldsValue({ email, verificationCode: '', password: '', confirmPassword: '' });
    setCountdown(0);
  }, [open, email, form]);

  React.useEffect(() => {
    if (countdown <= 0) return;
    const id = window.setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => window.clearTimeout(id);
  }, [countdown]);

  const handleOk = async () => {
    try {
      await form.validateFields();
    } catch {
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    Modal.success({ title: 'Password Changed', content: 'Your password has been changed. Please sign in again.', onOk: () => logoutToLogin() });
    setTimeout(() => logoutToLogin(), 3000);
    onClose();
    setLoading(false);
  };

  return (
    <Modal title="Change Password" open={open} onCancel={onClose} onOk={handleOk} okText="Change Password" confirmLoading={loading} destroyOnClose>
      <Form form={form} layout="vertical" style={{ marginTop: 12 }}>
        <Form.Item name="email" label="Email">
          <Input disabled />
        </Form.Item>
        <Form.Item name="verificationCode" label="Verification Code" rules={[{ required: true }, { min: 4, max: 6 }]}>
          <Input
            maxLength={6}
            addonAfter={
              <Button type="link" disabled={countdown > 0} onClick={() => setCountdown(60)} style={{ padding: 0 }}>
                {countdown > 0 ? `${countdown}s` : 'Send'}
              </Button>
            }
          />
        </Form.Item>
        <Form.Item name="password" label="New Password" rules={[{ required: true }]}>
          <Input.Password autoComplete="new-password" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={['password']}
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator(_: unknown, value: string) {
                if (!value || getFieldValue('password') === value) return Promise.resolve();
                return Promise.reject(new Error('Passwords do not match.'));
              },
            }),
          ]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
