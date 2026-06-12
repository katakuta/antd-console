import React from 'react';
import { Tooltip, Typography } from 'antd';
import styles from './EllipsisCell.module.css';

export default function EllipsisCell({
  title,
  children,
  style,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  // Typography.Text + ellipsis 在 Table 场景下更稳定（会撑满单元格宽度）
  return (
    <Tooltip title={title} placement="topLeft">
      <Typography.Text className={styles.cell} ellipsis style={style}>
        {children}
      </Typography.Text>
    </Tooltip>
  );
}
