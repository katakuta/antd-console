import React from 'react';
import { Typography, theme } from 'antd';
import { Bell, UserPlus, FileText, AlertTriangle, CheckCircle, DollarSign, Users, Star, MessageCircle, Zap } from 'lucide-react';
import type { DemoNotification } from '@/auth/mock-api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export const ICON_MAP: Record<string, React.FC<{ size?: number }>> = {
  UserPlus,
  FileText,
  AlertTriangle,
  CheckCircle,
  Bell,
  DollarSign,
  Users,
  Star,
  MessageCircle,
  Zap,
};

export function getIconColorConfig(iconName: string, token: any) {
  switch (iconName) {
    case 'CheckCircle':
      return { color: token.colorSuccess, bg: token.colorSuccessBg };
    case 'AlertTriangle':
    case 'Bell':
    case 'Star':
    case 'Zap':
      return { color: token.colorWarning, bg: token.colorWarningBg };
    case 'DollarSign':
      return { color: token.colorError, bg: token.colorErrorBg };
    case 'UserPlus':
    case 'Users':
      return { color: '#0085b9', bg: '#0085b930' };
    case 'FileText':
    case 'MessageCircle':
    default:
      return { color: token.colorPrimary, bg: `${token.colorPrimaryBg}40` };
  }
}

export function NotificationItem({
  n,
  onClick,
  style,
  iconShape = 'circle',
}: {
  n: DemoNotification;
  onClick?: (n: DemoNotification) => void;
  style?: React.CSSProperties;
  iconShape?: 'circle' | 'square';
}) {
  const { token } = theme.useToken();
  const IconComp = ICON_MAP[n.icon] || Bell;
  const isUnread = !n.read;
  const colorConfig = getIconColorConfig(n.icon, token);

  const defaultBg = isUnread ? `${token.colorPrimaryBg}30` : 'transparent';
  const hoverBg = token.colorFillAlter;

  return (
    <div
      onClick={() => onClick?.(n)}
      style={{
        display: 'flex',
        gap: 12,
        padding: '12px 16px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background 0.2s',
        background: defaultBg,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (onClick) e.currentTarget.style.background = hoverBg;
      }}
      onMouseLeave={(e) => {
        if (onClick) e.currentTarget.style.background = defaultBg;
      }}
    >
      {/* Icon with circular/square background */}
      <div style={{
        width: 32,
        height: 32,
        borderRadius: iconShape === 'circle' ? '50%' : 8,
        background: colorConfig.bg,
        color: colorConfig.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        marginTop: 2,
      }}>
        <IconComp size={16} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Title and Unread Dot */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
          <Typography.Text strong ellipsis style={{ fontSize: 14, color: token.colorTextBase, margin: 0, lineHeight: 1.4 }}>
            {n.title}
          </Typography.Text>
          {isUnread && (
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: token.colorPrimary,
                flexShrink: 0,
                marginTop: 6,
                marginLeft: 12,
              }}
            />
          )}
        </div>

        {/* Description */}
        <Typography.Text ellipsis style={{ fontSize: 13, color: token.colorTextSecondary, display: 'block', marginBottom: 4, margin: 0, lineHeight: 1.4 }}>
          {n.description}
        </Typography.Text>

        {/* Time */}
        <Typography.Text style={{ fontSize: 12, display: 'block', color: token.colorTextQuaternary, lineHeight: 1.4 }}>{dayjs(n.timestamp).fromNow()}</Typography.Text>
      </div>
    </div>
  );
}
