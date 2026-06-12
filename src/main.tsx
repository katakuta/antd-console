import React from 'react';
import ReactDOM from 'react-dom/client';
import { App as AntdApp } from 'antd';
import { RouterProvider } from 'react-router-dom';
import { I18nProvider } from '@/i18n';
import { ThemeSettingsProvider } from '@/theme/ThemeSettingsProvider';
import { messagesByLocale } from '@/i18n/messages';
import { router } from '@/router';
import './styles/fonts.css';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider messagesByLocale={messagesByLocale}>
      <ThemeSettingsProvider>
        <AntdApp>
          <RouterProvider router={router} />
        </AntdApp>
      </ThemeSettingsProvider>
    </I18nProvider>
  </React.StrictMode>,
);
