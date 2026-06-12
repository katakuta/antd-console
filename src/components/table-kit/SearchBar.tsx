import React from 'react';
import { Button, Form, Input, Select, Tag, Tooltip, theme } from 'antd';
import type { SelectProps } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { ChevronDown, ChevronUp, RotateCcw, Search, X } from 'lucide-react';
import type { Filters, SearchField, SearchFieldOptionValue } from './types';

const WIDTH_MAP: Record<string, string> = {
  narrow: '140px',
  medium: '180px',
  wide: '260px',
};

const DEBOUNCE_MS = 300;

interface MaxTagPlaceholderParams {
  omittedValues: { label: React.ReactNode; value: SearchFieldOptionValue }[];
  token: ReturnType<typeof theme.useToken>['token'];
  form: FormInstance;
  fieldKey: string;
  onSubmit: () => void;
}

const renderDefaultMaxTagPlaceholder = ({ omittedValues, token, form, fieldKey, onSubmit }: MaxTagPlaceholderParams) => {
  const handleClose = (removedValue: SearchFieldOptionValue) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const formAny = form as any;
    const currentValues: SearchFieldOptionValue[] = formAny.getFieldValue(fieldKey) || [];
    formAny.setFieldsValue({ [fieldKey]: currentValues.filter((v) => v !== removedValue) });
    onSubmit();
  };

  return (
    <Tooltip
      color={token.colorBgElevated}
      title={
        <div
          style={{
            display: 'flex',
            maxWidth: 1000,
            flexWrap: 'wrap',
            gap: 6,
            color: token.colorText,
          }}
        >
          {omittedValues.map((item) => (
            <Tag key={String(item.value)} closable closeIcon={<X size={12} />} style={{ marginInlineEnd: 0 }} onClose={handleClose(item.value)}>
              {item.label}
            </Tag>
          ))}
        </div>
      }
    >
      <Tag style={{ marginInlineEnd: 0, cursor: 'help' }}>{`+${omittedValues.length}`}</Tag>
    </Tooltip>
  );
};

const filterSearchOption = (input: string, option?: { label?: React.ReactNode; value?: SearchFieldOptionValue }) => {
  const normalizedInput = input.trim().toLowerCase();
  if (!normalizedInput) return true;

  const optionLabel = String(option?.label ?? '');
  const optionValue = String(option?.value ?? '');

  return optionLabel.toLowerCase().includes(normalizedInput) || optionValue.toLowerCase().includes(normalizedInput);
};

interface SearchBarProps {
  fields: readonly SearchField[];
  onSubmit: (filters: Filters) => void;
  onReset?: (filters: Filters) => void;
  defaultCollapsedCount?: number;
  /** 是否支持折叠展开（默认 true）。false 时所有字段始终可见，无 More Filters 切换 */
  collapsible?: boolean;
  initialValues?: Filters;
}

export default function SearchBar({ fields, onSubmit, onReset, defaultCollapsedCount = 3, collapsible = true, initialValues = {} }: SearchBarProps) {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const [expanded, setExpanded] = React.useState(false);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const canCollapse = collapsible && fields.length > defaultCollapsedCount;

  React.useEffect(() => {
    if ((form as any).setFieldsValue) (form as any).setFieldsValue(initialValues);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const visibleFields = canCollapse && !expanded ? fields.slice(0, defaultCollapsedCount) : fields;

  const cleanValues = (allValues: Record<string, unknown>): Filters => {
    const cleaned: Filters = {};
    for (const key of Object.keys(allValues)) {
      let v = allValues[key];
      if (v === '' || v === undefined || v === null) continue;
      if (typeof v === 'string') {
        v = v.trim();
        if (v === '') continue;
      }
      cleaned[key] = v;
    }
    return cleaned;
  };

  const doSubmit = (values?: Record<string, unknown>) => {
    const formAny = form as any;
    const v = values ?? (formAny.getFieldsValue ? formAny.getFieldsValue() : {});
    onSubmit(cleanValues(v));
  };

  // select / checkbox：直接触发；text：防抖
  const handleValuesChange = (changed: Record<string, unknown>, all: Record<string, unknown>) => {
    const changedKey = Object.keys(changed)[0];
    // 跳过空变更（Form 初始化时 antd 可能触发 changed={} 的 onValuesChange）
    if (!changedKey) return;
    const field = fields.find((f) => f.key === changedKey);

    if (field?.type === 'text') {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => doSubmit(all), DEBOUNCE_MS);
    } else {
      doSubmit(all);
    }
  };

  React.useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleReset = () => {
    const defaults: Filters = {};
    for (const f of fields) {
      defaults[f.key] = f.defaultValue ?? undefined;
    }
    const formAny = form as any;
    if (formAny.resetFields) formAny.resetFields();
    if (formAny.setFieldsValue) formAny.setFieldsValue(defaults);
    if (onReset) onReset(defaults);
    else onSubmit({});
  };

  const renderField = (field: SearchField) => {
    const ph = field.placeholder || field.key;
    const common = { style: { width: WIDTH_MAP[field.width || 'medium'] || '180px' } };
    const selectMaxTagCount = field.multiple ? (field.maxTagCount === false ? undefined : (field.maxTagCount ?? 'responsive')) : undefined;
    const selectMaxTagPlaceholder =
      field.multiple && field.maxTagCount !== false
        ? (field.maxTagPlaceholder ??
          ((omittedValues: { label: React.ReactNode; value: SearchFieldOptionValue }[]) =>
            renderDefaultMaxTagPlaceholder({ omittedValues, token, form, fieldKey: field.key, onSubmit: () => doSubmit() })))
        : field.maxTagPlaceholder;

    if (field.type === 'select' || field.type === 'checkbox') {
      return (
        <Form.Item name={field.key} noStyle>
          <Select
            mode={field.multiple ? 'multiple' : undefined}
            allowClear={field.clearable !== false}
            showSearch={field.type === 'select' && field.searchable}
            filterOption={field.type === 'select' && field.searchable ? filterSearchOption : undefined}
            placeholder={ph}
            options={field.options as SelectProps['options']}
            maxTagCount={selectMaxTagCount}
            maxTagTextLength={field.maxTagTextLength}
            maxTagPlaceholder={selectMaxTagPlaceholder as SelectProps['maxTagPlaceholder']}
            {...common}
          />
        </Form.Item>
      );
    }

    return (
      <Form.Item name={field.key} noStyle>
        <Input allowClear placeholder={ph} {...common} onPressEnter={() => doSubmit()} />
      </Form.Item>
    );
  };

  return (
    <Form form={form} layout="inline" initialValues={initialValues} onValuesChange={handleValuesChange}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        {visibleFields.map((field) => (
          <Form.Item key={field.key} style={{ marginBottom: 0, marginInlineEnd: 0 }}>
            {renderField(field)}
          </Form.Item>
        ))}

        {canCollapse && (
          <Button type="text" size="small" icon={expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />} onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Collapse' : 'More Filters'}
          </Button>
        )}

        <Button type="primary" icon={<Search size={14} />} onClick={() => doSubmit()}>
          Search
        </Button>
        <Button icon={<RotateCcw size={14} />} onClick={handleReset}>
          Reset
        </Button>
      </div>
    </Form>
  );
}
