import React from 'react';
import { Button, Divider, Drawer, Form, InputNumber, Radio, Slider, Space, Tooltip, Typography } from 'antd';
import { Check, RotateCcw } from 'lucide-react';
import { useThemeSettings } from '@/theme/ThemeSettingsProvider';
import { THEME_PRESETS } from '@/theme/themeConfig';
import { LOCALE_LABELS, SUPPORTED_LOCALES, useI18n } from '@/i18n';
import type { Locale } from '@/i18n';
import type { ConsoleFrameSettings } from '@/theme/types';

type SettingsDrawerProps = { open: boolean; onClose: () => void };

const LOCALE_OPTIONS: { label: string; value: Locale }[] = SUPPORTED_LOCALES.map((locale) => ({
  label: LOCALE_LABELS[locale].nativeLabel,
  value: locale,
}));

export default function SettingsDrawer({ open, onClose }: SettingsDrawerProps) {
  const { settings, setSettings, resetSettings } = useThemeSettings();
  const { locale, setLocale, t } = useI18n();

  const patchSettings = React.useCallback(
    (patch: Partial<ConsoleFrameSettings>) => setSettings((prev) => ({ ...prev, ...patch })),
    [setSettings],
  );

  return (
    <Drawer title={t('settings.title')} width={380} open={open} onClose={onClose}
      extra={<Button icon={<RotateCcw size={16} />} onClick={resetSettings}>{t('settings.reset')}</Button>}>
      <Space direction="vertical" size={18} style={{ width: '100%' }}>
        {/* Layout */}
        <section>
          <Typography.Text strong>{t('settings.layout')}</Typography.Text>
          <Form layout="vertical" style={{ marginTop: 12 }}>
            <Form.Item label={t('settings.navigation')}>
              <Radio.Group block optionType="button" value={settings.layout}
                options={[{ label: t('settings.side'), value: 'side' }, { label: t('settings.top'), value: 'top' }]}
                onChange={(event) => patchSettings({ layout: event.target.value })} />
            </Form.Item>
            <Form.Item label={t('settings.container')}>
              <Radio.Group block optionType="button" value={settings.container}
                options={[{ label: t('settings.fluid'), value: 'fluid' }, { label: t('settings.boxed'), value: 'boxed' }]}
                onChange={(event) => patchSettings({ container: event.target.value })} />
            </Form.Item>
            <Form.Item label={t('settings.sidebarTheme')}>
              <Radio.Group block optionType="button" value={settings.navTheme} disabled={settings.layout === 'top'}
                options={[{ label: t('settings.light'), value: 'light' }, { label: t('settings.dark'), value: 'realDark' }]}
                onChange={(event) => patchSettings({ navTheme: event.target.value })} />
            </Form.Item>
          </Form>
        </section>
        <Divider style={{ margin: 0 }} />
        {/* Theme */}
        <section>
          <Typography.Text strong>{t('settings.theme')}</Typography.Text>
          <Form layout="vertical" style={{ marginTop: 12 }}>
            <Form.Item label={t('settings.mode')}>
              <Radio.Group block optionType="button" value={settings.mode}
                options={[{ label: t('settings.light'), value: 'light' }, { label: t('settings.dark'), value: 'dark' }, { label: t('settings.system'), value: 'system' }]}
                onChange={(event) => patchSettings({ mode: event.target.value, navTheme: event.target.value === 'dark' ? 'realDark' : settings.navTheme })} />
            </Form.Item>
            <Form.Item label={t('settings.density')}>
              <Radio.Group block optionType="button" value={settings.density}
                options={[{ label: t('settings.default'), value: 'default' }, { label: t('settings.compact'), value: 'compact' }, { label: t('settings.spacious'), value: 'spacious' }]}
                onChange={(event) => patchSettings({ density: event.target.value })} />
            </Form.Item>
            <Form.Item label={t('settings.themePreset')}>
              <Space wrap size={8} style={{ marginBottom: 8 }}>
                {THEME_PRESETS.map((preset) => (
                  <Tooltip key={preset.id} title={preset.label}>
                    <button type="button" aria-label={t('settings.setThemePreset', { name: preset.label })}
                      onClick={() => patchSettings({ themePreset: preset.id, colorPrimary: preset.swatch })}
                      style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: preset.swatch,
                        border: settings.themePreset === preset.id ? '2px solid var(--ant-color-primary)' : '2px solid var(--ant-color-border-secondary)',
                        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0,
                        outline: settings.themePreset === preset.id ? '2px solid var(--ant-color-primary-bg)' : 'none', outlineOffset: 2 }}>
                      {settings.themePreset === preset.id && <Check size={14} color="#fff" strokeWidth={3} />}
                    </button>
                  </Tooltip>
                ))}
              </Space>
            </Form.Item>
            <Form.Item label={`Radius: ${settings.borderRadius}px`}>
              <Slider min={2} max={18} value={settings.borderRadius} onChange={(borderRadius: number) => patchSettings({ borderRadius })} />
            </Form.Item>
            <Form.Item label={t('settings.fontSize')}>
              <InputNumber min={12} max={16} value={settings.fontSize} addonAfter="px"
                onChange={(fontSize: number | null) => { if (typeof fontSize === 'number') patchSettings({ fontSize }); }} />
            </Form.Item>
          </Form>
        </section>
        <Divider style={{ margin: 0 }} />
        {/* Language */}
        <section>
          <Typography.Text strong>{t('settings.language')}</Typography.Text>
          <Form layout="vertical" style={{ marginTop: 12 }}>
            <Form.Item>
              <Radio.Group block optionType="button" value={locale} options={LOCALE_OPTIONS}
                onChange={(event) => setLocale(event.target.value as Locale)} />
            </Form.Item>
          </Form>
        </section>
      </Space>
    </Drawer>
  );
}
