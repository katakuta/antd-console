import React from 'react';
import { Modal, Input, Typography, theme } from 'antd';
import { Search } from 'lucide-react';
import type { CommandAction } from './commandPalette/actions';
import { getSearchPages } from './commandPalette/pages';
import type { SearchPage } from './commandPalette/types';
import { matchItems } from './commandPalette/match';
import { getCommandPaletteSectionVisibility } from './commandPalette/resultsState';
import { useI18n } from '@/i18n';

type CommandItem = SearchPage | CommandAction;

export function CommandPaletteModal({
  open,
  onClose,
  onNavigate,
  actions,
  helpItems,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  actions: CommandAction[];
  helpItems?: CommandAction[];
}) {
  const { token } = theme.useToken();
  const { t } = useI18n();
  const [query, setQuery] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(0);

  const pages = React.useMemo(() => getSearchPages(t), [t]);

  const filteredPages = React.useMemo(() => matchItems(pages, query), [pages, query]);
  const filteredActions = React.useMemo(() => matchItems(actions, query), [actions, query]);
  const filteredHelp = React.useMemo(() => matchItems(helpItems ?? [], query), [helpItems, query]);

  const flatItems: CommandItem[] = React.useMemo(() => [...filteredPages, ...filteredActions, ...filteredHelp], [filteredPages, filteredActions, filteredHelp]);
  const { showPages, showActions, showHelp, showEmptyState } = getCommandPaletteSectionVisibility({
    pageCount: filteredPages.length,
    actionCount: filteredActions.length,
    helpCount: filteredHelp.length,
    hasHelpItems: Boolean(helpItems?.length),
  });

  React.useEffect(() => {
    if (!open) return;
    setQuery('');
    setActiveIndex(0);
  }, [open]);

  React.useEffect(() => {
    // query 变化时默认选中首项
    setActiveIndex(0);
  }, [query]);

  const runItem = (item: CommandItem) => {
    if (item.type === 'page') {
      onNavigate(item.path);
      onClose();
      return;
    }
    item.onSelect();
    onClose();
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (flatItems.length === 0) return;
      setActiveIndex((i) => (i + 1) % flatItems.length);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (flatItems.length === 0) return;
      setActiveIndex((i) => (i - 1 + flatItems.length) % flatItems.length);
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const item = flatItems[activeIndex];
      if (!item) return;
      runItem(item);
    }
  };

  const groupTitleStyle: React.CSSProperties = {
    fontSize: 12,
    color: token.colorTextSecondary,
    marginTop: 12,
    marginBottom: 6,
  };

  const itemBaseStyle: React.CSSProperties = {
    height: 40,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '0 10px',
    borderRadius: 10,
    cursor: 'pointer',
    userSelect: 'none',
  };

  return (
    <Modal
      open={open}
      centered
      width={520}
      footer={null}
      closable={false}
      onCancel={onClose}
      styles={{
        body: { padding: 12 },
        mask: {
          background: 'rgba(15, 23, 42, 0.24)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        },
      }}
      destroyOnHidden
    >
      <Input
        autoFocus
        value={query}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={t('common.commandSearchPlaceholder')}
        prefix={<Search size={16} />}
        size="large"
      />

      <div style={{ maxHeight: 460, overflow: 'auto', paddingTop: 8 }}>
        {showEmptyState ? <Typography.Text type="secondary">{t('common.noResults')}</Typography.Text> : null}

        {showPages ? (
          <>
            <Typography.Text style={groupTitleStyle}>{t('common.pages')}</Typography.Text>
            {filteredPages.map((item, idx) => {
              const active = idx === activeIndex;
              return (
                <div
                  key={item.path}
                  role="button"
                  tabIndex={-1}
                  style={{
                    ...itemBaseStyle,
                    background: active ? token.colorPrimaryBg : 'transparent',
                    color: active ? token.colorPrimary : token.colorText,
                  }}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => runItem(item)}
                >
                  <span style={{ width: 18, display: 'inline-flex', justifyContent: 'center' }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                </div>
              );
            })}
          </>
        ) : null}

        {showActions ? (
          <>
            <Typography.Text style={groupTitleStyle}>{t('common.actions')}</Typography.Text>
            {filteredActions.map((item, localIdx) => {
              const idx = filteredPages.length + localIdx;
              const active = idx === activeIndex;
              return (
                <div
                  key={item.label}
                  role="button"
                  tabIndex={-1}
                  style={{
                    ...itemBaseStyle,
                    background: active ? token.colorPrimaryBg : 'transparent',
                    color: active ? token.colorPrimary : token.colorText,
                  }}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => runItem(item)}
                >
                  <span style={{ width: 18, display: 'inline-flex', justifyContent: 'center' }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                </div>
              );
            })}
          </>
        ) : null}

        {showHelp ? (
          <>
            <Typography.Text style={groupTitleStyle}>{t('common.help')}</Typography.Text>
            {filteredHelp.map((item, localIdx) => {
              const idx = filteredPages.length + filteredActions.length + localIdx;
              const active = idx === activeIndex;
              return (
                <div
                  key={item.label}
                  role="button"
                  tabIndex={-1}
                  style={{
                    ...itemBaseStyle,
                    background: active ? token.colorPrimaryBg : 'transparent',
                    color: active ? token.colorPrimary : token.colorText,
                  }}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => runItem(item)}
                >
                  <span style={{ width: 18, display: 'inline-flex', justifyContent: 'center' }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                </div>
              );
            })}
          </>
        ) : null}
      </div>
    </Modal>
  );
}
