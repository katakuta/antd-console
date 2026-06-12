import React from 'react';
import { Card, Col, Empty, Input, Rate, Row, Segmented, Select, Space, Spin, Tag, Typography, theme } from 'antd';
import { AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { DataTable } from '@/components/table-kit';
import type { DataTableColumn } from '@/components/table-kit';
import { useI18n } from '@/i18n';
import { mockGetProducts, type DemoProduct } from '@/auth/mock-api';

const CATEGORY_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Electronics', value: 'Electronics' },
  { label: 'Furniture', value: 'Furniture' },
  { label: 'Audio', value: 'Audio' },
  { label: 'Storage', value: 'Storage' },
  { label: 'Accessories', value: 'Accessories' },
];

const CATEGORY_COLOR: Record<string, string> = {
  Electronics: '#4b8bbe',
  Furniture: '#7e6eb8',
  Audio: '#d4952a',
  Storage: '#3d9999',
  Accessories: '#c45b7a',
};

const STATUS_STYLE: Record<string, { color: string; bg: string }> = {
  'In Stock': { color: '#4d9c45', bg: '#4d9c4514' },
  'Low Stock': { color: '#d4952a', bg: '#d4952a14' },
  'Out of Stock': { color: '#c45b7a', bg: '#c45b7a14' },
};

export default function ProductCatalogPage() {
  const { t } = useI18n();
  const { token } = theme.useToken();
  const pad = (v: number, h?: number, b?: number) => `${v}px ${h ?? v}px ${b ?? 0}px ${h ?? v}px`;
  const [viewMode, setViewMode] = React.useState<'card' | 'table'>('card');
  const [loading, setLoading] = React.useState(true);
  const [rows, setRows] = React.useState<DemoProduct[]>([]);
  const [total, setTotal] = React.useState(0);
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [pageNum, setPageNum] = React.useState(1);
  const pageSize = 12;

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page: pageNum, pageSize };
      if (search) params.search = search;
      if (category) params.category = category;
      const res = await mockGetProducts(params as Parameters<typeof mockGetProducts>[0]);
      setRows(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [pageNum, search, category]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns: DataTableColumn<DemoProduct>[] = [
    { key: 'id', title: 'ID', dataIndex: 'id', width: 60 },
    { key: 'name', title: 'Name', dataIndex: 'name', width: 220 },
    { key: 'category', title: 'Category', dataIndex: 'category', width: 120, render: (_: unknown, r: DemoProduct) => <Tag color={CATEGORY_COLOR[r.category]}>{r.category}</Tag> },
    {
      key: 'price',
      title: 'Price',
      dataIndex: 'price',
      width: 100,
      render: (_: unknown, r: DemoProduct) => (
        <Typography.Text strong style={{ fontVariantNumeric: 'tabular-nums' }}>
          ${r.price.toFixed(2)}
        </Typography.Text>
      ),
    },
    {
      key: 'stock',
      title: 'Stock',
      dataIndex: 'stock',
      width: 80,
      render: (_: unknown, r: DemoProduct) => (
        <Typography.Text type="secondary" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {r.stock}
        </Typography.Text>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      width: 120,
      render: (_: unknown, r: DemoProduct) => (
        <Tag style={{ color: STATUS_STYLE[r.status]?.color, background: STATUS_STYLE[r.status]?.bg, border: 'none', fontWeight: 500, fontSize: 12 }}>{r.status}</Tag>
      ),
    },
    {
      key: 'rating',
      title: 'Rating',
      dataIndex: 'rating',
      width: 140,
      render: (_: unknown, r: DemoProduct) => (
        <Space size={4}>
          <Rate disabled value={r.rating} allowHalf style={{ fontSize: 13 }} />
          <Typography.Text type="secondary" style={{ fontSize: 12, fontVariantNumeric: 'tabular-nums' }}>
            {r.rating}
          </Typography.Text>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Typography.Title level={2} style={{ margin: '0 0 4px', fontWeight: 600, letterSpacing: '-0.02em' }}>
          {t('nav.productCatalog')}
        </Typography.Title>
        <Typography.Text type="secondary" style={{ fontSize: 14 }}>
          Product catalog with card and table views.
        </Typography.Text>
      </div>

      <Card style={{ borderRadius: token.borderRadiusLG, border: `1px solid ${token.colorBorderSecondary}` }} styles={{ body: { padding: pad(token.paddingMD, token.paddingContentHorizontal) } }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: token.marginMD, flexWrap: 'wrap', gap: token.marginSM }}>
          <Space wrap size={12}>
            <Input.Search
              placeholder="Search products..."
              allowClear
              style={{ width: 240 }}
              onSearch={(v) => {
                setSearch(v);
                setPageNum(1);
              }}
            />
            <Select
              options={CATEGORY_OPTIONS}
              value={category || undefined}
              placeholder="Category"
              style={{ width: 160 }}
              onChange={(v) => {
                setCategory(v);
                setPageNum(1);
              }}
              allowClear
            />
          </Space>
          <Segmented
            options={[
              { label: 'Card', value: 'card', icon: <AppstoreOutlined /> },
              { label: 'Table', value: 'table', icon: <UnorderedListOutlined /> },
            ]}
            value={viewMode}
            onChange={(v) => setViewMode(v as 'card' | 'table')}
          />
        </div>

        {loading ? (
          <Spin style={{ display: 'block', margin: '60px auto' }} />
        ) : rows.length === 0 ? (
          <Empty description={t('common.noData')} />
        ) : viewMode === 'table' ? (
          <DataTable
            columns={columns}
            rows={rows}
            rowKey="id"
            pagination={{ pageNum, pageSize, total }}
            onPaginationChange={(p) => {
              setPageNum(p);
            }}
          />
        ) : (
          <>
            <Row gutter={[12, 12]}>
              {rows.map((product) => {
                const st = STATUS_STYLE[product.status] || STATUS_STYLE['In Stock'];
                const catColor = CATEGORY_COLOR[product.category] || '#5f7d9c';
                return (
                  <Col xs={24} sm={12} lg={8} xl={6} key={product.id}>
                    {/* Card */}
                    <div
                      style={{
                        borderRadius: token.borderRadiusLG,
                        border: `1px solid ${token.colorBorderSecondary}`,
                        background: token.colorBgContainer,
                        padding: `${token.paddingMD}px 0`,
                        cursor: 'pointer',
                        transition: 'box-shadow 0.15s',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '';
                      }}
                    >
                      {/* Header row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: token.margin, padding: `0 ${token.padding}px` }}>
                        <Typography.Text strong style={{ fontSize: 15, lineHeight: 1.3, flex: 1, minWidth: 0, marginRight: token.marginXS }}>
                          <span style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</span>
                        </Typography.Text>
                        <Tag style={{ color: catColor, background: catColor + '14', border: 'none', fontWeight: 500, fontSize: 11, flexShrink: 0, margin: 0 }}>
                          {product.category}
                        </Tag>
                      </div>

                      {/* Price */}
                      <div style={{ marginBottom: token.marginSM, padding: `0 ${token.padding}px` }}>
                        <Typography.Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: token.marginXXS, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Price
                        </Typography.Text>
                        <Typography.Text
                          strong
                          style={{ fontSize: 24, letterSpacing: '-0.02em', color: 'var(--ant-color-text)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}
                        >
                          ${product.price.toFixed(2)}
                        </Typography.Text>
                      </div>

                      {/* Divider */}
                      <div style={{ height: 1, background: token.colorBorderSecondary, marginBottom: token.marginSM }} />

                      {/* Meta row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: token.marginXS, padding: `0 ${token.padding}px` }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: token.marginXS, padding: pad(token.paddingXXS, token.marginSM), borderRadius: token.borderRadiusSM, background: st.bg }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: st.color, flexShrink: 0 }} />
                          <Typography.Text style={{ fontSize: 12, fontWeight: 500, color: st.color }}>{product.status}</Typography.Text>
                        </span>
                        <Typography.Text type="secondary" style={{ fontSize: 12, fontVariantNumeric: 'tabular-nums' }}>
                          {product.stock} in stock
                        </Typography.Text>
                      </div>

                      {/* Rating */}
                      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 6, padding: '0 16px' }}>
                        <Rate disabled value={product.rating} allowHalf style={{ fontSize: 13 }} />
                        <Typography.Text style={{ fontSize: 12, fontWeight: 600, color: 'var(--ant-color-text)', fontVariantNumeric: 'tabular-nums' }}>
                          {product.rating}
                        </Typography.Text>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
            {total > pageSize && (
              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {t('common.total', { total })}
                </Typography.Text>
              </div>
            )}
          </>
        )}
      </Card>
    </Space>
  );
}
