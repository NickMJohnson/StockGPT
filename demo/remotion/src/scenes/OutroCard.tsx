import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { Stage } from '../components/Stage';
import { LogoMark } from '../components/Logo';
import { COLORS, FONT, MONO } from '../theme';

const Pill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      padding: '10px 20px',
      borderRadius: 999,
      background: 'rgba(148,163,184,0.10)',
      border: '1px solid rgba(148,163,184,0.22)',
      color: COLORS.white,
      fontSize: 20,
      fontWeight: 500,
      fontFamily: FONT,
    }}
  >
    {children}
  </div>
);

export const OutroCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = (delay: number, dur = 34) =>
    spring({ frame: frame - delay, fps, config: { damping: 200 }, durationInFrames: dur });
  const rise = (delay: number, dist = 26) => interpolate(enter(delay), [0, 1], [dist, 0]);

  const stack = ['FastAPI', 'React', 'SEC EDGAR', 'Claude'];

  return (
    <AbsoluteFill>
      <Stage seed={9} />
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONT,
          flexDirection: 'column',
        }}
      >
        <div style={{ opacity: enter(0), transform: `scale(${interpolate(enter(0), [0, 1], [0.85, 1])})`, marginBottom: 30 }}>
          <LogoMark size={92} radius={24} />
        </div>

        <div
          style={{
            fontSize: 74,
            fontWeight: 800,
            color: COLORS.white,
            letterSpacing: -1.8,
            opacity: enter(4),
            transform: `translateY(${rise(4)}px)`,
          }}
        >
          Stock<span style={{ color: COLORS.accent2 }}>GPT</span>
        </div>

        <div
          style={{
            fontSize: 27,
            color: COLORS.muted,
            marginTop: 16,
            opacity: enter(10),
            transform: `translateY(${rise(10)}px)`,
          }}
        >
          From ticker to insight — powered by real filings.
        </div>

        {/* tech stack */}
        <div
          style={{
            display: 'flex',
            gap: 14,
            marginTop: 40,
            opacity: enter(16),
            transform: `translateY(${rise(16)}px)`,
          }}
        >
          {stack.map((s) => (
            <Pill key={s}>{s}</Pill>
          ))}
        </div>

        {/* links */}
        <div
          style={{
            display: 'flex',
            gap: 40,
            marginTop: 52,
            fontFamily: MONO,
            fontSize: 22,
            opacity: enter(24),
            transform: `translateY(${rise(24)}px)`,
          }}
        >
          <span style={{ color: COLORS.accent2 }}>stock-gpt-five.vercel.app</span>
          <span style={{ color: COLORS.mutedDim }}>github.com/NickMJohnson/StockGPT</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
