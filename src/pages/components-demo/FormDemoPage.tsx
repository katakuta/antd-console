import React from 'react';
import { Button, Card, DatePicker, Form, Input, InputNumber, message, Select, Space, Steps, Switch, Tabs, Typography } from 'antd';
import { MinusCircle, Plus } from 'lucide-react';
import { useI18n } from '@/i18n';

export default function FormDemoPage() {
  const { t } = useI18n();
  const [currentStep, setCurrentStep] = React.useState(0);
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [dynamicForm] = Form.useForm();

  const stepItems = [{ title: 'Personal Info' }, { title: 'Account Setup' }, { title: 'Confirmation' }];

  const handleStepFinish = () => {
    if (currentStep < 2) setCurrentStep((s) => s + 1);
    else message.success(t('formDemo.submitSuccess'));
  };

  const tabItems = [
    {
      key: 'basic',
      label: t('formDemo.basicForm'),
      children: (
        <Card>
          <Form form={form1} layout="vertical" onFinish={() => message.success(t('formDemo.submitSuccess'))} style={{ maxWidth: 600 }}>
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input placeholder="Enter name" />
            </Form.Item>
            <Form.Item name="type" label="Type" rules={[{ required: true }]}>
              <Select
                placeholder="Select type"
                options={[
                  { label: 'Option A', value: 'a' },
                  { label: 'Option B', value: 'b' },
                  { label: 'Option C', value: 'c' },
                ]}
              />
            </Form.Item>
            <Form.Item name="date" label="Date" rules={[{ required: true }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="amount" label="Amount">
              <InputNumber min={0} max={999999} style={{ width: '100%' }} placeholder="Enter amount" />
            </Form.Item>
            <Form.Item name="enabled" label="Enabled" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea rows={3} placeholder="Enter description" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {t('common.submit')}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      key: 'step',
      label: t('formDemo.stepForm'),
      children: (
        <Card>
          <Steps current={currentStep} items={stepItems} style={{ marginBottom: 24 }} />
          <Form form={form2} layout="vertical" onFinish={handleStepFinish} style={{ maxWidth: 600 }}>
            {currentStep === 0 && (
              <>
                <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
                  <Input placeholder="First name" />
                </Form.Item>
                <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
                  <Input placeholder="Last name" />
                </Form.Item>
                <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                  <Input placeholder="email@example.com" />
                </Form.Item>
              </>
            )}
            {currentStep === 1 && (
              <>
                <Form.Item name="username" label="Username" rules={[{ required: true }]}>
                  <Input placeholder="Choose a username" />
                </Form.Item>
                <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
                  <Input.Password placeholder="At least 6 characters" />
                </Form.Item>
                <Form.Item name="role" label="Role">
                  <Select
                    placeholder="Select role"
                    options={[
                      { label: 'Admin', value: 'admin' },
                      { label: 'User', value: 'user' },
                    ]}
                  />
                </Form.Item>
              </>
            )}
            {currentStep === 2 && <Typography.Paragraph>Please review your information before submitting. Click "Submit" to complete.</Typography.Paragraph>}
            <Space>
              {currentStep > 0 && <Button onClick={() => setCurrentStep((s) => s - 1)}>Previous</Button>}
              <Button type="primary" htmlType="submit">
                {currentStep === 2 ? t('common.submit') : 'Next'}
              </Button>
            </Space>
          </Form>
        </Card>
      ),
    },
    {
      key: 'dynamic',
      label: t('formDemo.dynamicForm'),
      children: (
        <Card>
          <Form form={dynamicForm} layout="vertical" onFinish={() => message.success(t('formDemo.submitSuccess'))} style={{ maxWidth: 600 }}>
            <Form.List name="items" initialValue={[{ key: '', value: '' }]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <Space key={field.key} align="baseline" style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                      <Form.Item {...field} name={[field.name, 'key']} rules={[{ required: true, message: 'Key required' }]}>
                        <Input placeholder="Key" style={{ width: 200 }} />
                      </Form.Item>
                      <Form.Item {...field} name={[field.name, 'value']} rules={[{ required: true, message: 'Value required' }]}>
                        <Input placeholder="Value" style={{ width: 260 }} />
                      </Form.Item>
                      {fields.length > 1 && <Button type="text" danger icon={<MinusCircle size={14} />} onClick={() => remove(field.name)} />}
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => add({ key: '', value: '' })} block icon={<Plus size={16} />}>
                    Add Field
                  </Button>
                </>
              )}
            </Form.List>
            <Form.Item style={{ marginTop: 16 }}>
              <Button type="primary" htmlType="submit">
                {t('common.submit')}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <div>
        <Typography.Title level={2} style={{ marginTop: 0, marginBottom: 4 }}>
          {t('formDemo.title')}
        </Typography.Title>
        <Typography.Text type="secondary">{t('formDemo.description')}</Typography.Text>
      </div>
      <Tabs items={tabItems} />
    </Space>
  );
}
