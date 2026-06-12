import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Result } from 'antd';
import { useI18n } from '@/i18n';

export default function NotFound() {
  const { t } = useI18n();
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title={t('notFound.title')}
      subTitle={t('notFound.subtitle')}
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          {t('notFound.backHome')}
        </Button>
      }
    />
  );
}
