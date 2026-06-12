import React from 'react';
import { App, Button, Card, Col, Descriptions, Divider, Form, Input, Modal, Row, Space, Spin, Tag, Typography } from 'antd';
import { Shield, Key, Smartphone, Globe, Clock, Building2, Mail, MapPin, Phone, Layers, CheckCircle, History } from 'lucide-react';
import { useI18n } from '@/i18n';
import { mockGetProfile, type DemoProfile } from '@/auth/mock-api';
import { logoutToLogin } from '@/auth/logout';
import dayjs from 'dayjs';

// ── Helpers ──

const cardStyle: React.CSSProperties = { borderRadius: 12, border: '1px solid var(--ant-color-border-secondary)' };

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
    <Space size={10}>
      <span style={iconBg(color)}>{icon}</span>
      <Typography.Text style={{ fontSize: 14, fontWeight: 600 }}>{children}</Typography.Text>
    </Space>
  );
}

const descLabelStyle: React.CSSProperties = { fontWeight: 500, color: 'var(--ant-color-text-secondary)', fontSize: 12, lineHeight: '20px' };
const descContentStyle: React.CSSProperties = { fontWeight: 500, fontSize: 13, lineHeight: '20px' };
const descItemIcon: React.CSSProperties = { marginRight: 6, verticalAlign: 'middle', flexShrink: 0 };

// ── Main ──

export default function ProfilePage() {
  const { t } = useI18n();
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

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '120px auto' }} />;

  const icon16 = { size: 16, style: descItemIcon };

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <Typography.Title level={2} style={{ margin: '0 0 2px', fontWeight: 600, letterSpacing: '-0.02em' }}>
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
        style={cardStyle}
        styles={{ body: { padding: '12px 24px 18px' } }}
      >
        <Descriptions column={{ xs: 1, sm: 2, lg: 3 }} size="small" colon={false} labelStyle={descLabelStyle} contentStyle={descContentStyle} style={{ lineHeight: '20px' }}>
          <Descriptions.Item
            label={
              <>
                <Mail {...icon16} />
                Email
              </>
            }
          >
            {profile?.email}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <>
                <Globe {...icon16} />
                Language
              </>
            }
          >
            {profile?.language}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <>
                <MapPin {...icon16} />
                Country
              </>
            }
          >
            {profile?.country}, {profile?.city}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <>
                <Building2 {...icon16} />
                Company
              </>
            }
          >
            {profile?.company}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <>
                <Layers {...icon16} />
                Department
              </>
            }
          >
            {profile?.department}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <>
                <Phone {...icon16} />
                Phone
              </>
            }
          >
            {profile?.phone}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <>
                <Clock {...icon16} />
                Timezone
              </>
            }
          >
            {profile?.timezone}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <>
                <CheckCircle {...icon16} />
                Status
              </>
            }
          >
            <Tag color={profile?.activeStatus === 'ACTIVE' ? 'green' : 'default'}>{profile?.activeStatus}</Tag>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <>
                <History {...icon16} />
                Member Since
              </>
            }
          >
            {profile?.createdAt ? dayjs(profile.createdAt).format('MMM D, YYYY') : '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Roles & Permissions */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <CardLabel icon={<Layers size={16} />} color="#7e6eb8">
                Roles
              </CardLabel>
            }
            style={cardStyle}
            styles={{ body: { padding: '12px 24px 18px' } }}
          >
            <Space wrap size={8}>
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
            style={cardStyle}
            styles={{ body: { padding: '12px 24px 18px' } }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
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
        style={cardStyle}
        styles={{ body: { padding: '10px 24px 18px' } }}
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
          <Divider style={{ margin: '2px 0' }} />
          <RowItem
            title="Two-Factor Authentication"
            subtitle={profile?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
            action={<Tag color={profile?.twoFactorEnabled ? 'green' : 'default'}>{profile?.twoFactorEnabled ? 'Active' : 'Inactive'}</Tag>}
          />
          <Divider style={{ margin: '10px 0' }} />
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
        <Typography.Text type="secondary" style={{ display: 'block', fontSize: 12, marginTop: 1 }}>
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
