import React from 'react';
import { App, Button, Card, Col, Form, Input, Modal, Row, Select, Space, Tag, Typography } from 'antd';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { SearchBar, DataTable } from '@/components/table-kit';
import type { SearchField, DataTableColumn, RowAction } from '@/components/table-kit';
import { useI18n } from '@/i18n';
import { mockGetRecords, mockCreateRecord, mockUpdateRecord, mockDeleteRecord, type DemoRecord } from '@/auth/mock-api';

const STATUS_OPTIONS = [
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
  { label: 'Pending', value: 'Pending' },
];
const CATEGORY_OPTIONS = [
  { label: 'Electronics', value: 'Electronics' },
  { label: 'Furniture', value: 'Furniture' },
  { label: 'Audio', value: 'Audio' },
  { label: 'Storage', value: 'Storage' },
];
const PRIORITY_OPTIONS = [
  { label: 'High', value: 'High' },
  { label: 'Medium', value: 'Medium' },
  { label: 'Low', value: 'Low' },
];

const SEARCH_FIELDS: SearchField[] = [
  { key: 'search', type: 'text', placeholder: 'Search by name...', width: 'wide' },
  { key: 'status', type: 'select', placeholder: 'Status', options: STATUS_OPTIONS, clearable: true, width: 'medium' },
  { key: 'category', type: 'select', placeholder: 'Category', options: CATEGORY_OPTIONS, clearable: true, width: 'medium' },
];

export default function TableDemoPage() {
  const { t } = useI18n();
  const { message } = App.useApp();
  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState<DemoRecord[]>([]);
  const [total, setTotal] = React.useState(0);
  const [filters, setFilters] = React.useState<Record<string, unknown>>({});
  const [pageNum, setPageNum] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingRecord, setEditingRecord] = React.useState<DemoRecord | null>(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = React.useState(false);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await mockGetRecords({ page: pageNum, pageSize, ...filters });
      setRows(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [pageNum, pageSize, filters]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = (values: Record<string, unknown>) => {
    setFilters(values);
    setPageNum(1);
  };

  const openCreate = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleRowAction = (actionKey: string, record: DemoRecord) => {
    if (actionKey === 'edit') {
      setEditingRecord(record);
      form.setFieldsValue(record);
      setModalOpen(true);
    }
    if (actionKey === 'delete') handleDelete(record);
  };

  const handleDelete = async (record: DemoRecord) => {
    try {
      await mockDeleteRecord(record.id);
      message.success(t('common.operationSuccess'));
      fetchData();
    } catch {
      message.error(t('common.operationFailed'));
    }
  };

  const handleModalOk = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();
      if (editingRecord) await mockUpdateRecord(editingRecord.id, values);
      else await mockCreateRecord(values as DemoRecord);
      message.success(t('common.operationSuccess'));
      setModalOpen(false);
      fetchData();
    } catch {
      /* validation */
    } finally {
      setSubmitting(false);
    }
  };

  const columns: DataTableColumn<DemoRecord>[] = [
    { key: 'id', title: 'ID', dataIndex: 'id', width: 70 },
    { key: 'name', title: 'Name', dataIndex: 'name', width: 260 },
    { key: 'category', title: 'Category', dataIndex: 'category', width: 120, render: (_: unknown, record: DemoRecord) => <Tag>{record.category}</Tag> },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      width: 100,
      render: (_: unknown, record: DemoRecord) => <Tag color={record.status === 'Active' ? 'green' : record.status === 'Pending' ? 'orange' : 'red'}>{record.status}</Tag>,
    },
    {
      key: 'priority',
      title: 'Priority',
      dataIndex: 'priority',
      width: 100,
      render: (_: unknown, record: DemoRecord) => <Tag color={record.priority === 'High' ? 'red' : record.priority === 'Medium' ? 'blue' : undefined}>{record.priority}</Tag>,
    },
    { key: 'createdAt', title: 'Created', dataIndex: 'createdAt', width: 120 },
    { key: 'updatedAt', title: 'Updated', dataIndex: 'updatedAt', width: 120 },
  ];

  const rowActions: RowAction<DemoRecord>[] = [
    { key: 'edit', label: t('common.edit'), icon: <Edit size={14} /> },
    { key: 'delete', label: t('common.delete'), icon: <Trash2 size={14} />, danger: true, confirm: { title: t('common.confirmDelete') } },
  ];

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <div>
        <Typography.Title level={2} style={{ marginTop: 0, marginBottom: 4 }}>
          {t('tableDemo.title')}
        </Typography.Title>
        <Typography.Text type="secondary">{t('tableDemo.description')}</Typography.Text>
      </div>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <SearchBar fields={SEARCH_FIELDS} onSubmit={handleSubmit} />
          <Button type="primary" icon={<Plus size={14} />} onClick={openCreate}>
            {t('tableDemo.createRecord')}
          </Button>
        </div>
        <DataTable
          columns={columns}
          rows={rows}
          rowActions={rowActions}
          rowKey="id"
          loading={loading}
          onRowAction={handleRowAction}
          pagination={{ pageNum, pageSize, total }}
          onPaginationChange={(p, ps) => {
            setPageNum(p);
            setPageSize(ps);
          }}
        />
      </Card>
      <Modal
        title={editingRecord ? t('tableDemo.editRecord') : t('tableDemo.createRecord')}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleModalOk}
        confirmLoading={submitting}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Name is required' }]}>
            <Input placeholder="Record name" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                <Select options={CATEGORY_OPTIONS} placeholder="Select category" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                <Select options={STATUS_OPTIONS} placeholder="Select status" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="priority" label="Priority" rules={[{ required: true }]}>
            <Select options={PRIORITY_OPTIONS} placeholder="Select priority" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Enter description" />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}
