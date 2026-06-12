import type React from 'react';

export type SearchPage = {
  type: 'page';
  label: string;
  path: string;
  icon?: React.ReactNode;
  keywords?: string[];
};

