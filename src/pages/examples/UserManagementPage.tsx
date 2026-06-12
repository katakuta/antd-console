import React from 'react';
import { App, Button, Card, Col, Drawer, Form, Input, Row, Select, Space, Tag, Typography } from 'antd';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { SearchBar, DataTable } from '@/components/table-kit';
import type { SearchField, DataTableColumn, RowAction } from '@/components/table-kit';
import { useI18n } from '@/i18n';
import { mockGetUsers, mockCreateUser, mockUpdateUser, mockDeleteUser, type DemoUser } from '@/auth/mock-api';

const ROLE_OPTIONS = [
  { label: 'Admin', value: 'Admin' }, { label: 'Editor', value: 'Editor' },
  { label: 'Viewer', value: 'Viewer' }, { label: 'Manager', value: 'Manager' }, { label: 'Developer', value: 'Developer' },
];
const STATUS_OPTIONS = [
  { label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }, { label: 'Pending', value: 'Pending' },
];
const CITY_OPTIONS = [
  { label: 'New York', value: 'New York' }, { label: 'London', value: 'London' }, { label: 'Tokyo', value: 'Tokyo' },
  { label: 'Berlin', value: 'Berlin' }, { label: 'Paris', value: 'Paris' }, { label: 'Sydney', value: 'Sydney' },
];

const SEARCH_FIELDS: SearchField[] = [
  { key: 'search', type: 'text', placeholder: 'Search name or email...', width: 'wide' },
  { key: 'role', type: 'select', placeholder: 'Role', options: ROLE_OPTIONS, clearable: true, width: 'medium' },
  { key: 'status', type: 'select', placeholder: 'Status', options: STATUS_OPTIONS, clearable: true, width: 'medium' },
];

export default function UserManagementPage() {
  const { t } = useI18n();
  const { message } = App.useApp();
  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState<DemoUser[]>([]);
  const [total, setTotal] = React.useState(0);
  const [filters, setFilters] = React.useState<Record<string, unknown>>({});
  const [pageNum, setPageNum] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<DemoUser | null>(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = React.useState(false);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try { const res = await mockGetUsers({ page: pageNum, pageSize, ...filters }); setRows(res.data); setTotal(res.total); }
    finally { setLoading(false); }
  }, [pageNum, pageSize, filters]);

  React.useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = (values: Record<string, unknown>) => { setFilters(values); setPageNum(1); };

  const openCreate = () => { setEditingUser(null); form.resetFields(); setDrawerOpen(true); };

  const handleRowAction = (actionKey: string, user: DemoUser) => {
    if (actionKey === 'edit') { setEditingUser(user); form.setFieldsValue(user); setDrawerOpen(true); }
    if (actionKey === 'delete') handleDelete(user);
  };

  const handleDelete = async (user: DemoUser) => {
    try { await mockDeleteUser(user.id); message.success(t('common.operationSuccess')); fetchData(); }
    catch { message.error(t('common.operationFailed')); }
  };

  const handleSave = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();
      if (editingUser) await mockUpdateUser(editingUser.id, values);
      else await mockCreateUser(values as DemoUser);
      message.success(t('common.operationSuccess'));
      setDrawerOpen(false); fetchData();
    } catch { /* validation */ } finally { setSubmitting(false); }
  };

  const columns: DataTableColumn<DemoUser>[] = [
    { key: 'id', title: 'ID', dataIndex: 'id', width: 60 },
    { key: 'name', title: 'Name', dataIndex: 'name', width: 180 },
    { key: 'email', title: 'Email', dataIndex: 'email', width: 220 },
    { key: 'role', title: 'Role', dataIndex: 'role', width: 110, render: (_: unknown, record: DemoUser) => <Tag color={record.role === 'Admin' ? 'red' : record.role === 'Manager' ? 'blue' : undefined}>{record.role}</Tag> },
    { key: 'city', title: 'City', dataIndex: 'city', width: 120 },
    { key: 'status', title: 'Status', dataIndex: 'status', width: 100, render: (_: unknown, record: DemoUser) => <Tag color={record.status === 'Active' ? 'green' : record.status === 'Pending' ? 'orange' : 'red'}>{record.status}</Tag> },
    { key: 'createdAt', title: 'Created', dataIndex: 'createdAt', width: 110 },
  ];

  const rowActions: RowAction<DemoUser>[] = [
    { key: 'edit', label: t('common.edit'), icon: <Edit size={14} /> },
    { key: 'delete', label: t('common.delete'), icon: <Trash2 size={14} />, danger: true, confirm: { title: t('common.confirmDelete') } },
  ];

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <div>
        <Typography.Title level={2} style={{ marginTop: 0, marginBottom: 4 }}>{t('nav.userManagement')}</Typography.Title>
        <Typography.Text type="secondary">Full CRUD example with search, create, edit, and delete operations.</Typography.Text>
      </div>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <SearchBar fields={SEARCH_FIELDS} onSubmit={handleSubmit} />
          <Button type="primary" icon={<Plus size={16} />} onClick={openCreate}>{t('common.create')}</Button>
        </div>
        <DataTable columns={columns} rows={rows} rowActions={rowActions} rowKey="id" loading={loading}
          onRowAction={handleRowAction}
          pagination={{ pageNum, pageSize, total }}
          onPaginationChange={(p, ps) => { setPageNum(p); setPageSize(ps); }} />
      </Card>
      <Drawer title={editingUser ? t('common.edit') : t('common.create')} open={drawerOpen} onClose={() => setDrawerOpen(false)} width={400}
        extra={<Button type="primary" loading={submitting} onClick={handleSave}>{t('common.save')}</Button>}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}><Input placeholder="Full name" /></Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}><Input placeholder="email@example.com" /></Form.Item>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="role" label="Role" rules={[{ required: true }]}><Select options={ROLE_OPTIONS} placeholder="Select role" /></Form.Item></Col>
            <Col span={12}><Form.Item name="city" label="City"><Select options={CITY_OPTIONS} placeholder="Select city" /></Form.Item></Col>
          </Row>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}><Select options={STATUS_OPTIONS} placeholder="Select status" /></Form.Item>
        </Form>
      </Drawer>
    </Space>
  );
}
