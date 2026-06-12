import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const searchBarPath = path.resolve(__dirname, './SearchBar.tsx');
const typesPath = path.resolve(__dirname, './types.ts');

describe('SearchBar multiple maxTag behavior', () => {
  it('extends SearchField with native maxTag props', () => {
    const source = readFileSync(typesPath, 'utf8');

    expect(source).toContain('maxTagCount?:');
    expect(source).toContain('maxTagTextLength?:');
    expect(source).toContain('maxTagPlaceholder?:');
  });

  it('defaults multiple Select maxTagCount to responsive', () => {
    const source = readFileSync(searchBarPath, 'utf8');

    expect(source).toContain("field.maxTagCount ?? 'responsive'");
  });

  it('falls back to default +N placeholder and allows disabling it', () => {
    const source = readFileSync(searchBarPath, 'utf8');

    expect(source).toContain('omittedValues');
    expect(source).toContain('Tooltip');
    expect(source).toContain('Tag');
    expect(source).toContain('field.maxTagCount !== false');
  });

  it('styles aggregated tooltip with theme tokens', () => {
    const source = readFileSync(searchBarPath, 'utf8');

    expect(source).toContain('theme.useToken()');
    expect(source).toContain('token.colorBgElevated');
    expect(source).toContain('token.colorText');
  });

  it('supports close tag in default maxTagPlaceholder tooltip', () => {
    const source = readFileSync(searchBarPath, 'utf8');

    expect(source).toContain('closable');
    expect(source).toContain('handleClose');
    expect(source).toContain('getFieldValue');
    expect(source).toContain('setFieldsValue');
    expect(source).toContain('closeIcon');
    expect(source).toContain('fieldKey: field.key');
    expect(source).toContain('MaxTagPlaceholderParams');
  });

  it('extends SearchField with optional searchable select support', () => {
    const source = readFileSync(typesPath, 'utf8');

    expect(source).toContain('searchable?: boolean');
  });

  it('enables showSearch only for searchable select fields', () => {
    const source = readFileSync(searchBarPath, 'utf8');

    expect(source).toContain("showSearch={field.type === 'select' && field.searchable}");
    expect(source).toContain("filterOption={field.type === 'select' && field.searchable ? filterSearchOption : undefined}");
  });

  it('matches select search text against both option label and value', () => {
    const source = readFileSync(searchBarPath, 'utf8');

    expect(source).toContain("const optionLabel = String(option?.label ?? '')");
    expect(source).toContain("const optionValue = String(option?.value ?? '')");
    expect(source).toContain('optionLabel.toLowerCase().includes(normalizedInput)');
    expect(source).toContain('optionValue.toLowerCase().includes(normalizedInput)');
  });

  it('allows readonly fields and readonly select options in SearchBar types', () => {
    const typesSource = readFileSync(typesPath, 'utf8');
    const searchBarSource = readFileSync(searchBarPath, 'utf8');

    expect(typesSource).toContain('ReadonlyArray<{');
    expect(searchBarSource).toContain('fields: readonly SearchField[]');
  });
});
