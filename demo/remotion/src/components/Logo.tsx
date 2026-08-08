import React from 'react';
import { COLORS, FONT } from '../theme';

export const TrendingUp: React.FC<{ size?: number; color?: string; stroke?: number }> = ({
  size = 24,
  color = '#fff',
  stroke = 2.4,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

export const LogoMark: React.FC<{ size?: number; radius?: number }> = ({
  size = 56,
  radius = 16,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: radius,
      background: `linear-gradient(150deg, ${COLORS.accent2} 0%, ${COLORS.accent} 55%, ${COLORS.accentDeep} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0 12px 30px -8px ${COLORS.accent}88`,
    }}
  >
    <TrendingUp size={size * 0.5} color="#fff" stroke={2.6} />
  </div>
);

export const LogoLockup: React.FC<{ size?: number; color?: string }> = ({
  size = 34,
  color = COLORS.white,
}) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.42 }}>
    <LogoMark size={size * 1.35} radius={size * 0.4} />
    <span
      style={{
        fontFamily: FONT,
        fontSize: size,
        fontWeight: 700,
        color,
        letterSpacing: -0.5,
      }}
    >
      Stock<span style={{ color: COLORS.accent2 }}>GPT</span>
    </span>
  </div>
);
