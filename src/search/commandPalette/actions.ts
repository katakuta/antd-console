import type React from 'react';

export type CommandAction = {
  type: 'action';
  label: string;
  icon?: React.ReactNode;
  onSelect: () => void;
  keywords?: string[];
};

