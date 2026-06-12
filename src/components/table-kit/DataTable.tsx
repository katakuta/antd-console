import React from 'react';
import { App, Button, Dropdown, Table, Tooltip } from 'antd';
import type { TableProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { MoreHorizontal } from 'lucide-react';
import type { DataTableColumn, DataTablePagination, RowAction } from './types';
import dayjs from 'dayjs';

// DataTable 自己接管的 antd Table prop，不再对外暴露
type HandledTableKeys =
  | 'columns'
  | 'dataSource'
  | 'loading'
  | 'rowKey'
  | 'rowSelection'
  | 'pagination'
  | 'scroll'
  | 'locale'
  | 'className';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface DataTableProps<T = any> extends Omit<TableProps<T>, HandledTableKeys> {
  rows: T[];
  rowKey: string | ((record: T) => string | number);
  columns: DataTableColumn<T>[];
  loading?: boolean;
  /** 行操作（统一渲染为 icon 列，>4 时折叠） */
  rowActions?: RowAction<T>[];
  /** 行操作事件 */
  onRowAction?: (actionKey: string, row: T) => void;
  /** 行选择 */
  selectable?: boolean;
  selectedRowKeys?: React.Key[];
  onSelectionChange?: (keys: React.Key[], rows: T[]) => void;
  /** 分页 */
  pagination?: DataTablePagination;
  onPaginationChange?: (pageNum: number, pageSize: number) => void;
  /** 横向滚动宽度 */
  scrollX?: number;
  /**
   * 纵向最大滚动高度：
   * - 传入时：表格内部滚动（会出现 table body 滚动条）
   * - 不传：随页面滚动（避免双滚动条）
   */
  scrollY?: number;
  /** 空态文案 */
  emptyText?: string;
}

const ACTION_BTN_SIZE = 28;
const ACTION_ICON_SIZE = 15;
const MAX_VISIBLE_ACTIONS = 4;

function toAntdColumn<T>(col: DataTableColumn<T>): ColumnsType<T>[number] {
  const base: ColumnsType<T>[number] = {
    key: col.key,
    title: col.title,
    dataIndex: col.dataIndex,
    width: col.width,
    align: col.align,
    fixed: col.fixed,
  };

  // 仅显式配置 ellipsis: true 时启用截断 + antd Tooltip
  const ellipsisOn = col.ellipsis === true;
  const ellipsisConfig = ellipsisOn ? ({ showTitle: false } as const) : false;

  // 自定义渲染：直接透传，不额外包装
  if (col.render) {
    return {
      ...base,
      ellipsis: ellipsisConfig,
      render: (v: unknown, r: T, i: number) => col.render!(v, r, i),
    };
  }

  // 内置渲染 & 纯文本渲染：自动包装 Tooltip
  const renderText = (v: unknown): string => {
    if (v == null) return '-';
    if (col.renderType === 'date') return dayjs(v as string).format('YYYY-MM-DD');
    if (col.renderType === 'datetime') return dayjs(v as string).format('YYYY-MM-DD HH:mm:ss');
    return String(v);
  };

  return {
    ...base,
    ellipsis: ellipsisConfig,
    render: (v: unknown) => {
      const text = renderText(v);
      if (!ellipsisOn) return text;
      return (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      );
    },
  };
}

export default function DataTable<T>({
  rows,
  rowKey,
  columns,
  loading,
  rowActions,
  onRowAction,
  selectable,
  selectedRowKeys,
  onSelectionChange,
  pagination,
  onPaginationChange,
  scrollX,
  scrollY,
  emptyText,
  ...restTableProps
}: DataTableProps<T>) {
  const { modal } = App.useApp();
  const antdColumns: ColumnsType<T> = columns.map(toAntdColumn);

  // Action 列
  if (rowActions?.length && onRowAction) {
    const actionCol: ColumnsType<T>[number] = {
      key: '__actions__',
      title: 'Action',
      width: rowActions.length <= 3 ? 60 * rowActions.length + 12 : 180,
      fixed: 'right',
      render: (_: unknown, record: T) => {
        const visibleActions = rowActions.filter((a) => !a.visible || a.visible(record));

        if (visibleActions.length === 0) return null;

        // 渲染单个 action 按钮
        const renderBtn = (action: RowAction<T>) => {
          const disabled = action.disabled?.(record);
          const handleClick = () => {
            if (action.confirm) {
              modal.confirm({
                title: action.confirm.title,
                content: action.confirm.content,
                okType: action.danger ? 'danger' : 'primary',
                onOk: () => onRowAction(action.key, record),
              });
            } else {
              onRowAction(action.key, record);
            }
          };

          return (
            <Tooltip key={action.key} title={action.label}>
              <Button
                type="text"
                size="small"
                danger={action.danger}
                disabled={disabled}
                icon={<span style={{ display: 'inline-flex' }}>{action.icon}</span>}
                style={{
                  width: ACTION_BTN_SIZE,
                  height: ACTION_BTN_SIZE,
                  padding: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={handleClick}
                aria-label={action.label}
              />
            </Tooltip>
          );
        };

        // ≤4 个直接展示
        if (visibleActions.length <= MAX_VISIBLE_ACTIONS) {
          return (
            <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {visibleActions.map(renderBtn)}
            </div>
          );
        }

        // >4 个：前 3 个 + "···" 折叠
        const showItems = visibleActions.slice(0, 3);
        const foldItems = visibleActions.slice(3);

        return (
          <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {showItems.map(renderBtn)}
            <Dropdown
              trigger={['click']}
              menu={{
                items: foldItems.map((a) => ({
                  key: a.key,
                  label: a.label,
                  danger: a.danger,
                  icon: a.icon,
                  onClick: () => {
                    if (a.confirm) {
                      modal.confirm({
                        title: a.confirm.title,
                        content: a.confirm.content,
                        okType: a.danger ? 'danger' : 'primary',
                        onOk: () => onRowAction(a.key, record),
                      });
                    } else {
                      onRowAction(a.key, record);
                    }
                  },
                })),
              }}
            >
              <Button
                type="text"
                size="small"
                icon={<MoreHorizontal size={ACTION_ICON_SIZE} />}
                style={{
                  width: ACTION_BTN_SIZE,
                  height: ACTION_BTN_SIZE,
                  padding: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
            </Dropdown>
          </div>
        );
      },
    };
    antdColumns.push(actionCol);
  }

  const scroll =
    scrollX || typeof scrollY === 'number'
      ? {
          ...(scrollX ? { x: scrollX } : {}),
          ...(typeof scrollY === 'number' ? { y: scrollY } : {}),
        }
      : undefined;

  return (
    <Table<T>
      className="main-console-data-table"
      rowKey={rowKey}
      columns={antdColumns}
      dataSource={rows}
      {...restTableProps}
      loading={loading}
      scroll={scroll}
      locale={{ emptyText: emptyText || 'No Data' }}
      rowSelection={
        selectable
          ? {
              selectedRowKeys,
              onChange: (keys: React.Key[], _rows: T[]) => onSelectionChange?.(keys, _rows),
            }
          : undefined
      }
      pagination={
        pagination
          ? {
              current: pagination.pageNum,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              pageSizeOptions: pagination.pageSizeOptions || [10, 20, 50, 100],
              showTotal: (t: number) => `Total ${t}`,
              onChange: (p: number, ps: number) => {
                onPaginationChange?.(p, ps);
              },
            }
          : false
      }
      // size="small"
    />
  );
}
