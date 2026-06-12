import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const commandPaletteModalPath = new URL('./CommandPaletteModal.tsx', import.meta.url);

describe('CommandPaletteModal mask blur', () => {
  it('applies a darker and subtler blur mask to the command palette modal', () => {
    const source = readFileSync(commandPaletteModalPath, 'utf8');

    expect(source).toContain('mask: {');
    expect(source).toContain("background: 'rgba(15, 23, 42, 0.24)'");
    expect(source).toContain("backdropFilter: 'blur(8px)'");
    expect(source).toContain("WebkitBackdropFilter: 'blur(8px)'");
  });
});
