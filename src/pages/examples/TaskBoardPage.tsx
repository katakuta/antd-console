import React from 'react';
import { App, Card, Select, Space, Spin, Tag, Typography } from 'antd';
import { ArrowRight } from 'lucide-react';
import { DataTable } from '@/components/table-kit';
import type { DataTableColumn, RowAction } from '@/components/table-kit';
import { useI18n } from '@/i18n';
import { mockGetTasks, mockUpdateTask, type DemoTask } from '@/auth/mock-api';

const STATUS_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Todo', value: 'Todo' }, { label: 'In Progress', value: 'In Progress' }, { label: 'Done', value: 'Done' },
];
const PRIORITY_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'High', value: 'High' }, { label: 'Medium', value: 'Medium' }, { label: 'Low', value: 'Low' },
];

export default function TaskBoardPage() {
  const { t } = useI18n();
  const { message } = App.useApp();
  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState<DemoTask[]>([]);
  const [total, setTotal] = React.useState(0);
  const [statusFilter, setStatusFilter] = React.useState('');
  const [priorityFilter, setPriorityFilter] = React.useState('');
  const [pageNum, setPageNum] = React.useState(1);
  const pageSize = 10;

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page: pageNum, pageSize };
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      const res = await mockGetTasks(params as Parameters<typeof mockGetTasks>[0]);
      setRows(res.data); setTotal(res.total);
    } finally { setLoading(false); }
  }, [pageNum, statusFilter, priorityFilter]);

  React.useEffect(() => { fetchData(); }, [fetchData]);

  const handleRowAction = async (actionKey: string, task: DemoTask) => {
    if (actionKey === 'advance') {
      const next: Record<string, string> = { 'Todo': 'In Progress', 'In Progress': 'Done', 'Done': 'Todo' };
      try {
        await mockUpdateTask(task.id, { status: next[task.status] as DemoTask['status'] });
        message.success(t('common.operationSuccess'));
        fetchData();
      } catch { message.error(t('common.operationFailed')); }
    }
  };

  const columns: DataTableColumn<DemoTask>[] = [
    { key: 'id', title: '#', dataIndex: 'id', width: 50 },
    { key: 'title', title: 'Title', dataIndex: 'title', width: 280 },
    { key: 'assignee', title: 'Assignee', dataIndex: 'assignee', width: 160 },
    { key: 'priority', title: 'Priority', dataIndex: 'priority', width: 100, render: (_: unknown, record: DemoTask) => <Tag color={record.priority === 'High' ? 'red' : record.priority === 'Medium' ? 'blue' : undefined}>{record.priority}</Tag> },
    { key: 'status', title: 'Status', dataIndex: 'status', width: 120, render: (_: unknown, record: DemoTask) => <Tag color={record.status === 'Done' ? 'green' : record.status === 'In Progress' ? 'blue' : 'orange'}>{record.status}</Tag> },
    { key: 'dueDate', title: 'Due Date', dataIndex: 'dueDate', width: 110 },
  ];

  const rowActions: RowAction<DemoTask>[] = [
    { key: 'advance', label: 'Advance Status', icon: <ArrowRight size={14} /> },
  ];

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <div>
        <Typography.Title level={2} style={{ marginTop: 0, marginBottom: 4 }}>{t('nav.taskBoard')}</Typography.Title>
        <Typography.Text type="secondary">Task management with status filtering and progression.</Typography.Text>
      </div>
      <Card>
        <Space wrap style={{ marginBottom: 16 }}>
          <Select options={STATUS_OPTIONS} value={statusFilter || undefined} placeholder="Filter by status"
            style={{ width: 160 }} onChange={(v) => { setStatusFilter(v); setPageNum(1); }} />
          <Select options={PRIORITY_OPTIONS} value={priorityFilter || undefined} placeholder="Filter by priority"
            style={{ width: 160 }} onChange={(v) => { setPriorityFilter(v); setPageNum(1); }} />
        </Space>
        {loading ? <Spin style={{ display: 'block', margin: '60px auto' }} /> : (
          <DataTable columns={columns} rows={rows} rowActions={rowActions} rowKey="id"
            onRowAction={handleRowAction}
            pagination={{ pageNum, pageSize, total }}
            onPaginationChange={(p) => { setPageNum(p); }} />
        )}
      </Card>
    </Space>
  );
}
