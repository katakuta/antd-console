import React from 'react';
import type { MenuProps } from 'antd';
import { Breadcrumb, Button, ConfigProvider, Drawer, Dropdown, Layout, Menu, Tooltip, Typography, theme, Divider } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { getToken, getUserInfo, saveLastPagePath } from '@/auth/core';
import { collectLeafItems, getMenuLabel, toMenuItems } from '@/config/routes';
import { getFilteredMenuData } from '@/config/menuFilter';
import { LOCALE_LABELS, SUPPORTED_LOCALES, useI18n } from '@/i18n';
import { logoutToLogin } from '@/auth/logout';
import SettingsDrawer from './SettingsDrawer';
import { DESKTOP_SIDER_CONTENT_SWAP_DELAY_MS, resolveDesktopSiderContentMode } from './siderPresentation';
import { useThemeSettings } from '@/theme/ThemeSettingsProvider';
import { buildNavigationCssVars, buildNavigationTheme, resolveNavigationMode, type NavigationCssVars } from '@/theme/themeConfig';
import { CommandPaletteModal } from '@/search/CommandPaletteModal';
import type { CommandAction } from '@/search/commandPalette/actions';
import UserAvatar from '@/components/UserAvatar';
import NotificationPopover from '@/components/NotificationPopover';
import {
  ChevronDown, ChevronLeft, ChevronRight, ChevronUp,
  BookOpen, LogOut, MenuIcon, Palette, Search,
  TrendingUp, User, X, CircleGauge, Languages,
  PanelsTopLeft, PanelTop,
} from 'lucide-react';

const { Header, Sider, Content } = Layout;
const MOBILE_BREAKPOINT = 1024;

function useMediaQuery(query: string): boolean {
  const [match, setMatch] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  React.useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatch(e.matches);
    mql.addEventListener('change', handler);
    setMatch(mql.matches);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return match;
}

/** Sider content — shared between desktop Sider and mobile Drawer */
function SiderContent({
  settings, setSettings, contentMode, navigationCssVars,
  navigationMode, selectedKey, openKeys, userName, user,
  onNavigate, hideCollapse, onClose, t, menuItems, leafItems,
}: {
  settings: ReturnType<typeof useThemeSettings>['settings'];
  setSettings: ReturnType<typeof useThemeSettings>['setSettings'];
  contentMode: 'collapsed' | 'expanded';
  navigationCssVars: NavigationCssVars;
  navigationMode: 'light' | 'dark';
  selectedKey: string;
  openKeys: string[];
  userName: string;
  user: ReturnType<typeof getUserInfo>;
  onNavigate: (path: string) => void;
  hideCollapse?: boolean;
  onClose?: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  menuItems: ReturnType<typeof getFilteredMenuData>;
  leafItems: ReturnType<typeof collectLeafItems>;
}) {
  const isCollapsedContent = contentMode === 'collapsed';
  const sideMenuItems = React.useMemo(() => toMenuItems(menuItems, t), [t, menuItems]);

  return (
    <div className="main-console-sider-inner" style={navigationCssVars as React.CSSProperties}>
      {/* Brand 56px */}
      <div className="main-console-sider-brand-row">
        <div className="main-console-sider-brand" role="button" tabIndex={0} onClick={() => onNavigate('/overview/dashboard')} onKeyDown={(e) => { if (e.key === 'Enter') onNavigate('/overview/dashboard'); }}>
          <span className="main-console-sider-logo" aria-hidden><TrendingUp size={14} strokeWidth={2.5} /></span>
          {!isCollapsedContent ? <Typography.Text strong className="main-console-sider-title">{t('app.title')}</Typography.Text> : null}
        </div>
        {onClose && <Button type="text" size="small" className="main-console-sider-close" icon={<X size={18} />} aria-label={t('common.closeNavigation')} onClick={onClose} />}
      </div>
      {/* Menu area */}
      <div className="main-console-menu-wrap">
        {!isCollapsedContent ? (
          <Menu mode="inline" theme={navigationMode} className="main-console-menu"
            selectedKeys={[selectedKey]} defaultOpenKeys={openKeys} items={sideMenuItems}
            onClick={(info: Parameters<NonNullable<MenuProps['onClick']>>[0]) => {
              const key = String(info.key);
              if (key.startsWith('/')) onNavigate(key);
            }}
            style={{ borderInlineEnd: 0 }}
          />
        ) : (
          <div className="main-console-icon-rail">
            {leafItems.map((item) => {
              const active = selectedKey === item.key;
              const label = getMenuLabel(item, t);
              return (
                <Tooltip key={item.key} title={label} placement="right">
                  <button type="button" className={`main-console-icon-rail-btn${active ? ' main-console-icon-rail-btn--active' : ''}`}
                    onClick={() => onNavigate(item.key)} aria-label={label}>{item.icon}</button>
                </Tooltip>
              );
            })}
          </div>
        )}
      </div>

      {/* Collapse trigger */}
      {!hideCollapse && (
        <Button type="text" shape="circle" size="small" className="main-console-sider-collapse"
          icon={settings.collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          aria-label={settings.collapsed ? t('common.expandSidebar') : t('common.collapseSidebar')}
          onClick={() => setSettings((prev) => ({ ...prev, collapsed: !prev.collapsed }))}
        />
      )}

      {/* Footer 77px */}
      <div className="main-console-sider-footer">
        {isCollapsedContent ? (
          <Tooltip title={userName} placement="right"><UserAvatar user={user} size={36} /></Tooltip>
        ) : (
          <>
            <UserAvatar user={user} size={36} />
            <div className="main-console-sider-account-text">
              <Typography.Text className="main-console-sider-account-name">{userName}</Typography.Text>
              <Typography.Text className="main-console-sider-account-sub">{user?.email || 'admin@console.frame'}</Typography.Text>
            </div>
            <Button type="text" size="small" className="main-console-sider-logout" aria-label={t('app.logout')} icon={<LogOut size={16} />} onClick={logoutToLogin} />
          </>
        )}
      </div>
    </div>
  );
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { locale, setLocale, t } = useI18n();
  const { settings, setSettings, resolvedMode } = useThemeSettings();
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);
  const [commandOpen, setCommandOpen] = React.useState(false);
  const { token: antdToken } = theme.useToken();
  const mainScrollRef = React.useRef<HTMLDivElement | null>(null);
  const [showBackTop, setShowBackTop] = React.useState(false);
  const user = getUserInfo();
  const displayName = user?.firstName ? [user.firstName, user.lastName].filter(Boolean).join(' ') : user?.userName || user?.email || 'Admin';
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

  const filteredMenuData = getFilteredMenuData();
  const filteredLeafItems = React.useMemo(() => collectLeafItems(filteredMenuData), [filteredMenuData]);

  const selectedKey = React.useMemo(() => {
    const pathname = location.pathname;
    if (pathname === '/') return '/overview/dashboard';
    return pathname;
  }, [location.pathname]);

  const openKeys = React.useMemo(() => {
    return filteredMenuData.filter((g) => g.children?.length).map((g) => g.key);
  }, [filteredMenuData]);

  const isSideLayout = settings.layout === 'side';
  const isTopLayout = settings.layout === 'top';
  const nextLayout = isSideLayout ? 'top' : 'side';
  const layoutToggleAriaLabel = isSideLayout ? 'Switch to top navigation' : 'Switch to side navigation';

  const handleLayoutToggle = React.useCallback(() => {
    setSettings((prev) => ({ ...prev, layout: nextLayout }));
  }, [nextLayout, setSettings]);

  const activeGroupKey = React.useMemo(() => {
    for (const group of filteredMenuData) {
      if (group.children?.some((child) => (child.path || child.key) === selectedKey)) return group.key;
    }
    return null;
  }, [selectedKey, filteredMenuData]);

  const navigationMode = React.useMemo(() => resolveNavigationMode(settings, resolvedMode, 'side'), [settings, resolvedMode]);
  const navigationTheme = React.useMemo(() => buildNavigationTheme(settings, resolvedMode, 'side'), [settings, resolvedMode]);
  const navigationTokens = React.useMemo(() => theme.getDesignToken(navigationTheme), [navigationTheme]);
  const navigationCssVars = React.useMemo(() => buildNavigationCssVars(navigationTokens), [navigationTokens]);

  const showDesktopSider = isSideLayout && !isMobile;
  const showDesktopTopNav = isTopLayout && !isMobile;
  const showHamburger = isMobile;
  const [desktopExpandTransitionPending, setDesktopExpandTransitionPending] = React.useState(false);
  const previousDesktopCollapsedRef = React.useRef(settings.collapsed);

  React.useEffect(() => {
    const wasCollapsed = previousDesktopCollapsedRef.current;
    previousDesktopCollapsedRef.current = settings.collapsed;
    if (!showDesktopSider || settings.collapsed) { setDesktopExpandTransitionPending(false); return; }
    if (!wasCollapsed) return;
    setDesktopExpandTransitionPending(true);
    const timeoutId = window.setTimeout(() => { setDesktopExpandTransitionPending(false); }, DESKTOP_SIDER_CONTENT_SWAP_DELAY_MS);
    return () => window.clearTimeout(timeoutId);
  }, [settings.collapsed, showDesktopSider]);

  const desktopSiderContentMode = React.useMemo(
    () => resolveDesktopSiderContentMode({ collapsed: settings.collapsed, expandTransitionPending: showDesktopSider && desktopExpandTransitionPending }),
    [desktopExpandTransitionPending, settings.collapsed, showDesktopSider],
  );

  const topNavGroups = React.useMemo(() => {
    return filteredMenuData.map((group) => {
      if (!group.children?.length) return { key: group.key, label: getMenuLabel(group, t), path: group.path, children: undefined };
      return {
        key: group.key, label: getMenuLabel(group, t), path: undefined,
        children: group.children.map((c) => ({ key: c.path || c.key, icon: c.icon, label: getMenuLabel(c, t) })),
      };
    });
  }, [t, filteredMenuData]);

  const topNavChevronSize = (antdToken.fontSizeSM ?? 12) + 2;
  const topNavChevronGap = antdToken.marginXXS ?? 4;

  const mobileDrawerContent = (
    <SiderContent settings={{ ...settings, collapsed: false }} setSettings={setSettings} contentMode="expanded"
      navigationCssVars={navigationCssVars} navigationMode={navigationMode}
      selectedKey={selectedKey} openKeys={openKeys} userName={displayName} user={user}
      onNavigate={(path) => { navigate(path); setMobileDrawerOpen(false); }}
      hideCollapse onClose={() => setMobileDrawerOpen(false)} t={t} menuItems={filteredMenuData} leafItems={filteredLeafItems} />
  );

  const headerBrand = (
    <div className="main-console-header-brand" onClick={() => navigate('/overview/dashboard')} role="button">
      <span className="main-console-header-logo" aria-hidden><TrendingUp size={14} strokeWidth={2.5} /></span>
      <Typography.Text strong className="main-console-header-title">{t('app.title')}</Typography.Text>
    </div>
  );

  const commandActions = React.useMemo<CommandAction[]>(() => [
    { type: 'action', label: t('common.toggleTheme'), icon: <Palette size={18} />, keywords: ['theme', 'dark', 'light', 'appearance'],
      onSelect: () => setSettings((prev) => ({ ...prev, mode: prev.mode === 'dark' ? 'light' : 'dark' })) },
    { type: 'action', label: t('app.logout'), icon: <LogOut size={18} />, keywords: ['sign out', 'exit'], onSelect: logoutToLogin },
  ], [setSettings, t]);

  const commandHelp = React.useMemo<CommandAction[]>(() => [
    { type: 'action', label: t('common.documentation'), icon: <BookOpen size={18} />, keywords: ['docs', 'help', 'manual'],
      onSelect: () => window.open('https://github.com', '_blank') },
  ], [t]);

  const languageMenuItems = React.useMemo<MenuProps['items']>(() =>
    SUPPORTED_LOCALES.map((itemLocale) => ({
      key: itemLocale,
      label: <span style={{ fontWeight: itemLocale === locale ? 600 : undefined }}>{LOCALE_LABELS[itemLocale].nativeLabel}</span>,
      onClick: () => setLocale(itemLocale),
    })), [locale, setLocale]);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setCommandOpen(true); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  React.useEffect(() => { saveLastPagePath(location.pathname); }, [location.pathname]);

  const handleMainScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    const el = e.currentTarget;
    setShowBackTop(el.scrollTop > el.clientHeight / 2);
  };

  const breadcrumbItems = React.useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    const labelMap: Record<string, string> = {
      overview: t('nav.overview'), components: t('nav.components'), examples: t('nav.examples'),
      dashboard: t('nav.dashboard'), 'mock-dashboard': t('nav.mockDashboard'), 'design-tokens': t('nav.designTokens'),
      'table-demo': t('nav.tableDemo'), 'form-demo': t('nav.formDemo'), 'charts-demo': t('nav.chartsDemo'),
      'data-display': t('nav.dataDisplay'), users: t('nav.userManagement'), products: t('nav.productCatalog'),
      tasks: t('nav.taskBoard'), 'activity-log': t('nav.activityLog'),
      system: t('nav.system'), notifications: t('nav.notifications'), profile: t('nav.profile'),
    };
    let acc = '';
    return segments.map((seg: string, idx: number) => {
      acc += `/${seg}`;
      const isLeaf = idx === segments.length - 1;
      return { title: labelMap[seg] || seg, href: isLeaf ? acc : undefined };
    });
  }, [location.pathname, t]);

  return (
    <>
      <Layout className="main-console-shell" data-layout={settings.layout}>
        {/* Desktop Sider */}
        {showDesktopSider ? (
          <ConfigProvider theme={navigationTheme}>
            <Sider className="main-console-sider" width={260} collapsedWidth={68} collapsed={settings.collapsed} trigger={null}>
              <SiderContent settings={settings} setSettings={setSettings} contentMode={desktopSiderContentMode}
                navigationCssVars={navigationCssVars} navigationMode={navigationMode}
                selectedKey={selectedKey} openKeys={openKeys} userName={displayName} user={user}
                onNavigate={navigate} t={t} menuItems={filteredMenuData} leafItems={filteredLeafItems} />
            </Sider>
          </ConfigProvider>
        ) : null}

        <div className="main-console-main" ref={mainScrollRef} onScroll={handleMainScroll}>
          <Layout className="main-console-main-inner">
            {/* Header 56px */}
            <Header className="main-console-header" style={{ boxShadow: isMobile ? antdToken.boxShadow : 'none' }}>
              <div className="main-console-header-left">
                {showHamburger ? (
                  <Button type="text" className="main-console-header-icon" icon={<MenuIcon size={20} />}
                    aria-label={t('common.openNavigation')} onClick={() => setMobileDrawerOpen(true)} />
                ) : null}
                {isSideLayout && !isMobile ? null : headerBrand}

                {showDesktopTopNav ? (
                  <>
                    <span className="main-console-header-divider" aria-hidden />
                    <button type="button" className="main-console-search-trigger" onClick={() => setCommandOpen(true)} aria-label={t('common.openGlobalSearch')}>
                      <span className="main-console-search-trigger-icon" aria-hidden><Search size={16} /></span>
                      <span className="main-console-search-trigger-text">{t('common.search')}</span>
                      <span className="main-console-search-trigger-kbd" aria-hidden>⌘K</span>
                    </button>
                  </>
                ) : null}

                {isSideLayout && !isMobile ? (
                  <div className="main-console-header-left-pad">
                    <button type="button" className="main-console-search-trigger" onClick={() => setCommandOpen(true)} aria-label={t('common.openGlobalSearch')}>
                      <span className="main-console-search-trigger-icon" aria-hidden><Search size={16} /></span>
                      <span className="main-console-search-trigger-text">{t('common.search')}</span>
                      <span className="main-console-search-trigger-kbd" aria-hidden>⌘K</span>
                    </button>
                  </div>
                ) : null}
              </div>
              <div className="main-console-header-right">
                <NotificationPopover />
                <Dropdown trigger={['click']} placement="bottomRight" menu={{ selectedKeys: [locale], items: languageMenuItems }}>
                  <Button type="text" shape="circle" className="main-console-header-icon" icon={<Languages size={18} />} aria-label={t('settings.language')} />
                </Dropdown>
                <Divider type="vertical" />
                <Button type="text" shape="circle" className="main-console-header-icon"
                  icon={isSideLayout ? <PanelTop size={18} /> : <PanelsTopLeft size={18} />}
                  aria-label={layoutToggleAriaLabel} onClick={handleLayoutToggle} />
                <Button type="text" shape="circle" className="main-console-header-icon"
                  icon={<Palette size={18} />} aria-label={t('common.themeSettings')} onClick={() => setSettingsOpen(true)} />
                <Dropdown trigger={['click']} placement="bottomRight"
                  menu={{ items: [
                    { key: 'profile', icon: <User size={16} />, label: t('app.profile'), onClick: () => navigate('/system/profile') },
                    { type: 'divider' },
                    { key: 'logout', icon: <LogOut size={16} />, label: t('app.logout'), danger: true, onClick: logoutToLogin },
                  ]}}>
                  <Button type="text" shape="circle" className="main-console-header-icon" aria-label={t('common.account')} icon={<UserAvatar user={user} size={28} />} />
                </Dropdown>
              </div>
            </Header>

            {/* Desktop TopNav 44px */}
            {showDesktopTopNav ? (
              <div className="main-console-topnav">
                <div className="main-console-topnav-inner">
                  {topNavGroups.map((group) => {
                    const isActive = group.key === activeGroupKey;
                    const itemClass = `main-console-topnav-item${isActive ? ' main-console-topnav-item--active' : ''}`;
                    return group.children ? (
                      <Dropdown key={group.key} trigger={['click']} placement="bottomLeft"
                        menu={{ className: 'main-console-topnav-menu',
                          items: group.children.map((child) => {
                            const active = child.key === selectedKey;
                            return { key: child.key,
                              icon: <span style={{ display: 'inline-flex', color: active ? antdToken.colorPrimary : undefined }}>{child.icon}</span>,
                              label: <span style={{ color: active ? antdToken.colorPrimary : undefined, fontWeight: active ? 600 : undefined }}>{child.label}</span>,
                              onClick: () => navigate(child.key),
                            };
                          }),
                        }}>
                        <Button type="text" className={itemClass}>{group.label}<ChevronDown size={topNavChevronSize} style={{ marginLeft: topNavChevronGap }} /></Button>
                      </Dropdown>
                    ) : (
                      <Button key={group.key} type="text" className={itemClass} onClick={() => group.path && navigate(group.path)}>{group.label}</Button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <Content className="main-console-content">
              <main className="main-console-page">
                <Breadcrumb className="main-console-breadcrumb"
                  items={breadcrumbItems.map((item: { title: string; href?: string }) => ({
                    title: item.href ? <a onClick={() => navigate(item.href!)}>{item.title}</a> : item.title,
                  }))}
                />
                {children}
              </main>
            </Content>
          </Layout>
          {showBackTop ? (
            <Button type="default" shape="circle" className="main-console-backtop"
              icon={<ChevronUp size={18} />} aria-label={t('common.backToTop')}
              onClick={() => mainScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })} />
          ) : null}
        </div>
      </Layout>

      {/* Mobile Drawer */}
      <ConfigProvider theme={navigationTheme}>
        <Drawer open={mobileDrawerOpen} onClose={() => setMobileDrawerOpen(false)} placement="left" width={280} closable={false}
          styles={{ body: { padding: 0, ...navigationCssVars, background: 'var(--app-nav-bg-container)', color: 'var(--app-nav-text)' },
            content: { ...navigationCssVars, background: 'var(--app-nav-bg-container)', color: 'var(--app-nav-text)' } }}>
          {mobileDrawerContent}
        </Drawer>
      </ConfigProvider>

      <CommandPaletteModal open={commandOpen} onClose={() => setCommandOpen(false)} onNavigate={(path) => navigate(path)} actions={commandActions} helpItems={commandHelp} />
      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
