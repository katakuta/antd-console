import React from 'react';
import { Lock, User } from 'lucide-react';
import { Alert, App, Button, Card, Checkbox, Form, Input, Modal, Typography, theme } from 'antd';
import { clearAuthStorage, parseRedirectParams } from '@/auth/core';
import { completeLogin, mockLogin, mockResetPassword, mockSendVerificationCode } from '@/auth/mock-api';
import { useI18n } from '@/i18n';

type LoginValues = { email: string; password: string };
type ForgotPasswordValues = { email: string; verificationCode: string; password: string; confirmPassword: string };

export default function LoginPage() {
  const { token } = theme.useToken();
  const { t } = useI18n();
  const { message } = App.useApp();
  const [activeTab, setActiveTab] = React.useState<'login' | 'forgot'>('login');
  const [isNarrow, setIsNarrow] = React.useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 1024px)').matches);

  React.useEffect(() => {
    const mql = window.matchMedia('(max-width: 1024px)');
    const handler = (e: MediaQueryListEvent) => setIsNarrow(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const cardMaxWidth = isNarrow ? 400 : 475;
  const cardPaddingInline = isNarrow ? token.paddingLG : token.paddingXL;
  const cardPaddingBlock = isNarrow ? token.paddingXL : token.paddingXL + 12;
  const welcomeTitle = activeTab === 'login' ? t('auth.welcome.loginTitle') : t('auth.welcome.forgotTitle');
  const welcomeText = activeTab === 'login' ? t('auth.welcome.loginText') : t('auth.welcome.forgotText');

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: token.paddingXL, background: token.colorBgLayout }}>
      <Card style={{ width: '100%', maxWidth: cardMaxWidth }} styles={{ body: { paddingInline: cardPaddingInline, paddingBlock: cardPaddingBlock } }}>
        <div style={{ textAlign: 'center', marginBottom: token.marginXL }}>
          <Typography.Text style={{ display: 'inline-block', fontSize: token.fontSizeSM, fontWeight: 600, letterSpacing: 1, marginBottom: token.marginMD }}>
            {t('auth.projectTitle')}
          </Typography.Text>
          <Typography.Title level={3} style={{ marginTop: token.marginSM, marginBottom: 6 }}>{welcomeTitle}</Typography.Title>
          <Typography.Text type="secondary" style={{ display: 'block' }}>{welcomeText}</Typography.Text>
        </div>
        {activeTab === 'login' ? (
          <LoginForm onForgot={() => setActiveTab('forgot')} t={t} messageApi={message} />
        ) : (
          <ForgotPasswordForm onBack={() => setActiveTab('login')} t={t} messageApi={message} />
        )}
      </Card>
    </div>
  );
}

function LoginForm(props: { onForgot: () => void; t: ReturnType<typeof useI18n>['t']; messageApi: ReturnType<typeof App.useApp>['message'] }) {
  const { onForgot, t } = props;
  const { token } = theme.useToken();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [remember, setRemember] = React.useState(true);

  const redirectInfo = React.useMemo(() => {
    if (typeof window === 'undefined') return { redirect: undefined, params: undefined };
    return parseRedirectParams(window.location.search);
  }, []);

  const handleSubmit = async (values: LoginValues) => {
    setLoading(true);
    setError('');
    try {
      const res = await mockLogin({ email: values.email, password: values.password });
      if (!res?.data?.token) throw new Error('Login failed: token missing');
      await completeLogin({ inputUserName: values.email, token: res.data.token, loginPayload: res.data, redirect: redirectInfo.redirect, params: redirectInfo.params });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t('auth.login.fallbackError');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error ? <Alert type="error" showIcon message={error} style={{ marginBottom: 18 }} /> : null}
      <Form layout="vertical" requiredMark={false} onFinish={handleSubmit}>
        <Form.Item label={t('auth.login.emailLabel')} name="email" rules={[{ required: true, message: t('auth.login.emailPlaceholder') }]}>
          <Input size="large" style={{ fontSize: token.fontSize }} prefix={<User size={16} />} autoComplete="username" placeholder={t('auth.login.emailPlaceholder')} />
        </Form.Item>
        <Form.Item label={t('auth.login.passwordLabel')} name="password" rules={[{ required: true, message: t('auth.login.passwordPlaceholder') }]}>
          <Input.Password size="large" style={{ fontSize: token.fontSize }} prefix={<Lock size={16} />} autoComplete="current-password" placeholder={t('auth.login.passwordPlaceholder')} />
        </Form.Item>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: token.marginLG }}>
          <Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)}>
            <span style={{ fontSize: token.fontSizeSM }}>{t('auth.login.remember')}</span>
          </Checkbox>
          <Button type="link" onClick={onForgot} style={{ paddingInline: 0, fontSize: token.fontSizeSM }}>{t('auth.login.forgot')}</Button>
        </div>
        <Button type="primary" htmlType="submit" block loading={loading} size="large" style={{ fontSize: token.fontSize }}>{t('auth.login.submit')}</Button>
        <div style={{ borderTop: `1px solid ${token.colorBorderSecondary}`, marginTop: token.marginXL, paddingTop: token.paddingLG, textAlign: 'center' }}>
          <Typography.Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
            {t('auth.login.footerHint')} <Button type="link" style={{ paddingInline: 4, fontSize: token.fontSizeSM }}>{t('auth.login.footerAction')}</Button>
          </Typography.Text>
        </div>
        <Typography.Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: token.marginSM, fontSize: token.fontSizeSM - 1, fontStyle: 'italic' }}>
          {t('auth.login.hint')}
        </Typography.Text>
      </Form>
    </>
  );
}

function ForgotPasswordForm(props: { onBack: () => void; t: ReturnType<typeof useI18n>['t']; messageApi: ReturnType<typeof App.useApp>['message'] }) {
  const { onBack, t, messageApi } = props;
  const { token } = theme.useToken();
  const [form] = Form.useForm<ForgotPasswordValues>();
  const [sending, setSending] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [secondsLeft, setSecondsLeft] = React.useState(0);

  React.useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = window.setTimeout(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearTimeout(id);
  }, [secondsLeft]);

  const handleSendCode = async () => {
    if (secondsLeft > 0) return;
    try {
      setSending(true);
      const values = await form.validateFields(['email'] as unknown as never);
      const email = (values as { email: string }).email;
      await mockSendVerificationCode({ email });
      messageApi.success(t('auth.forgot.sendSuccess'));
      setSecondsLeft(60);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'errorFields' in (err as Record<string, unknown>)) return;
      const msg = err instanceof Error ? err.message : 'Failed to send verification code.';
      messageApi.error(msg);
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = async (values: ForgotPasswordValues) => {
    setSubmitting(true);
    try {
      const res = await mockResetPassword({ email: values.email, verificationCode: values.verificationCode, password: values.password });
      if (!res.ok && res.reason === 'invalid_code') { messageApi.error(t('auth.forgot.invalidCode')); return; }
      Modal.success({ title: t('auth.forgot.resetSuccess'), content: t('auth.forgot.resetSuccess') });
      window.setTimeout(() => { clearAuthStorage(); window.location.reload(); }, 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Reset password failed.';
      messageApi.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const sendBtnText = secondsLeft > 0 ? t('auth.forgot.resendCode', { seconds: secondsLeft }) : t('auth.forgot.sendCode');

  return (
    <>
      <Input style={{ display: 'none' }} autoComplete="username" />
      <Input style={{ display: 'none' }} autoComplete="new-password" />
      <div style={{ textAlign: 'center', marginBottom: token.marginLG }}>
        <Typography.Text type="secondary" style={{ fontSize: token.fontSizeSM }}>{t('auth.forgot.sectionCaption')}</Typography.Text>
      </div>
      <Form form={form} layout="vertical" requiredMark={false} onFinish={handleSubmit}>
        <Form.Item label={t('auth.forgot.emailLabel')} name="email" rules={[{ required: true, message: t('auth.forgot.emailPlaceholder') }, { type: 'email', message: t('auth.forgot.emailPlaceholder') }]}>
          <Input size="large" style={{ fontSize: token.fontSize }} autoComplete="email" placeholder={t('auth.forgot.emailPlaceholder')} />
        </Form.Item>
        <Form.Item label={t('auth.forgot.codeLabel')} name="verificationCode" rules={[{ required: true, message: t('auth.forgot.codePlaceholder') }, { min: 4, max: 6, message: t('auth.forgot.codePlaceholder') }]}>
          <Input size="large" style={{ fontSize: token.fontSize }} autoComplete="one-time-code" placeholder={t('auth.forgot.codePlaceholder')}
            addonAfter={<Button type="link" onClick={handleSendCode} disabled={secondsLeft > 0} loading={sending} style={{ paddingInline: 0, fontSize: token.fontSize }}>{sendBtnText}</Button>} />
        </Form.Item>
        <Form.Item label={t('auth.forgot.passwordLabel')} name="password" rules={[{ required: true, message: t('auth.forgot.passwordLabel') }]}>
          <Input.Password size="large" style={{ fontSize: token.fontSize }} autoComplete="new-password" />
        </Form.Item>
        <Form.Item label={t('auth.forgot.confirmPasswordLabel')} name="confirmPassword" dependencies={['password']}
          rules={[{ required: true, message: t('auth.forgot.confirmPasswordLabel') }, ({ getFieldValue }) => ({
            validator(_: unknown, value: string) {
              if (!value || value === getFieldValue('password')) return Promise.resolve();
              return Promise.reject(new Error(t('auth.forgot.passwordMismatch')));
            },
          })]}>
          <Input.Password size="large" style={{ fontSize: token.fontSize }} autoComplete="new-password" />
        </Form.Item>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 24 }}>
          <Button type="primary" htmlType="submit" loading={submitting} size="large" style={{ fontSize: token.fontSize, flex: 1 }}>{t('auth.forgot.submit')}</Button>
        </div>
        <div style={{ borderTop: `1px solid ${token.colorBorderSecondary}`, marginTop: token.marginXL, paddingTop: token.paddingLG, textAlign: 'center' }}>
          <Typography.Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
            {t('auth.forgot.footerHint')} <Button type="link" onClick={onBack} style={{ paddingInline: 4, fontSize: token.fontSizeSM }}>{t('auth.forgot.footerAction')}</Button>
          </Typography.Text>
        </div>
        <Typography.Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: token.marginSM, fontSize: token.fontSizeSM - 1, fontStyle: 'italic' }}>
          {t('auth.forgot.hint')}
        </Typography.Text>
      </Form>
    </>
  );
}
