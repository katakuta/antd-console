import React from 'react';
import { Avatar, theme } from 'antd';
import type { getUserInfo } from '@/auth/core';

type User = ReturnType<typeof getUserInfo>;

function getInitial(user: User): string {
  if (user?.firstName) {
    return user.firstName.charAt(0).toUpperCase();
  }
  if (user?.userName) {
    return user.userName.charAt(0).toUpperCase();
  }
  if (user?.email) {
    return user.email.charAt(0).toUpperCase();
  }
  return '?';
}

type UserAvatarProps = {
  user: User;
  size?: number;
  style?: React.CSSProperties;
};

export default function UserAvatar({ user, size = 36, style }: UserAvatarProps) {
  const { token } = theme.useToken();
  const initial = getInitial(user);
  const seed = user?.firstName || user?.userName || user?.email || '?';

  // 使用 antd 自动派生的二级 BG 色作为背景，对应 text 色作为文字颜色
  const pair = React.useMemo(() => {
    const colors = [
      { bg: token.colorPrimaryBg, text: token.colorPrimaryText },
      { bg: token.colorInfoBg, text: token.colorInfoText },
      { bg: token.colorSuccessBg, text: token.colorSuccessText },
      { bg: token.colorWarningBg, text: token.colorWarningText },
      { bg: token.colorPrimaryBgHover, text: token.colorPrimaryTextHover },
      { bg: token.colorInfoBgHover, text: token.colorInfoTextHover },
      { bg: token.colorSuccessBgHover, text: token.colorSuccessTextHover },
      { bg: token.colorWarningBgHover, text: token.colorWarningTextHover },
    ];
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }, [token, seed]);

  if (user?.photo) {
    return (
      <Avatar
        size={size}
        src={user.photo}
        style={{ flexShrink: 0, ...style }}
      />
    );
  }

  return (
    <Avatar
      size={size}
      style={{
        flexShrink: 0,
        backgroundColor: pair.bg,
        color: pair.text,
        fontWeight: 600,
        fontSize: size * 0.4,
        ...style,
      }}
    >
      {initial}
    </Avatar>
  );
}
