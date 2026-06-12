import type { Key, ReactNode } from 'react';
import type { SelectProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';

// ── SearchBar ──

export type SearchFieldType = 'text' | 'select' | 'date' | 'datetime' | 'checkbox';
export type SearchFieldOptionValue = string | number | boolean | null;

export interface SearchField {
  key: string;
  type: SearchFieldType;
  placeholder?: string;
  required?: boolean;
  options?: ReadonlyArray<{
    label: ReactNode;
    value: SearchFieldOptionValue;
    disabled?: boolean;
    key?: Key;
  }>;
  clearable?: boolean;
  /** 是否开启 Select 搜索（仅 type='select' 有效） */
  searchable?: boolean;
  /** select 是否多选（仅 type='select' 有效） */
  multiple?: boolean;
  /** 多选标签聚合策略；默认 multiple 场景为 'responsive'，传 false 可禁用默认聚合 */
  maxTagCount?: SelectProps['maxTagCount'] | false;
  maxTagTextLength?: number;
  maxTagPlaceholder?: SelectProps['maxTagPlaceholder'];
  defaultValue?: unknown;
  /** 控件占用宽度: narrow (160) | medium (200) | wide (280) */
  width?: 'narrow' | 'medium' | 'wide';
}

export type Filters = Record<string, unknown>;

// ── DataTable ──

export interface DataTableColumn<T = Record<string, unknown>> {
  key: string;
  title: string;
  dataIndex?: keyof T & string;
  width?: number | string;
  minWidth?: number | string;
  align?: 'left' | 'center' | 'right';
  /** 内置渲染类型，custom 时使用 render */
  renderType?: 'text' | 'date' | 'datetime';
  /** 是否超长省略 + tooltip（默认 true） */
  ellipsis?: boolean;
  /** 固定在左/右侧 */
  fixed?: 'left' | 'right';
  /** 自定义渲染（优先级最高） */
  render?: (value: unknown, record: T, index: number) => ReactNode;
}

export interface RowAction<T = Record<string, unknown>> {
  key: string;
  label: string;
  icon: ReactNode;
  danger?: boolean;
  confirm?: { title: string; content?: string };
  visible?: (row: T) => boolean;
  disabled?: (row: T) => boolean;
}

export interface DataTablePagination {
  pageNum: number;
  pageSize: number;
  total: number;
  pageSizeOptions?: number[];
}

// Re-export antd ColumnType for convenience
export type AntdColumnsType<T> = ColumnsType<T>;
