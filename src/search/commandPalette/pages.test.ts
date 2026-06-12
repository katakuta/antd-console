import { describe, expect, it } from 'vitest';
import { getSearchPages } from './pages';

describe('command palette pages', () => {
  it('flattens nested menuData into leaf pages', () => {
    const pages = getSearchPages();
    const paths = pages.map((p) => p.path);
    expect(paths).toContain('/dev/platforms');
    expect(paths).toContain('/dev/design-tokens');
    expect(paths).toContain('/system/role');
    expect(paths).toContain('/system/language');
    expect(paths).toContain('/app/version');
    expect(paths).toContain('/app/data');
    expect(paths).toContain('/service/schedule');
    expect(paths).toContain('/service/debug');
    expect(paths).toContain('/service/debug/chart');
    expect(paths).toContain('/service/debug/ssh');
    expect(paths).toContain('/installer/company');
    expect(paths).toContain('/installer/mail');
    expect(paths).toContain('/equipment/device');
    expect(paths).toContain('/equipment/charger');
    expect(paths).toContain('/equipment/heatpump');
    expect(paths).toContain('/screen/map');
    expect(paths).toContain('/screen/installer-ranking');
    expect(paths).toContain('/screen/real-time-monitoring');
  });
});
