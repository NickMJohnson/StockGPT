import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { Stage } from '../components/Stage';
import { LogoMark, TrendingUp } from '../components/Logo';
import { COLORS, FONT } from '../theme';

export const IntroCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = (delay: number, dur = 34) =>
    spring({ frame: frame - delay, fps, config: { damping: 200 }, durationInFrames: dur });
  const rise = (delay: number, dist = 28) => interpolate(enter(delay), [0, 1], [dist, 0]);

  const markScale = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.8, stiffness: 120 },
  });

  return (
    <AbsoluteFill>
      <Stage seed={0} />
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONT,
          flexDirection: 'column',
        }}
      >
        {/* chip */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 20px',
            borderRadius: 999,
            background: 'rgba(14,165,233,0.12)',
            border: '1px solid rgba(56,189,248,0.35)',
            color: COLORS.accent2,
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: 4,
            textTransform: 'uppercase',
            marginBottom: 44,
            opacity: enter(2),
            transform: `translateY(${rise(2)}px)`,
          }}
        >
          Product Demo
        </div>

        {/* logo mark */}
        <div style={{ transform: `scale(${markScale})`, marginBottom: 34 }}>
          <LogoMark size={118} radius={30} />
        </div>

        {/* wordmark */}
        <div
          style={{
            fontSize: 104,
            fontWeight: 800,
            color: COLORS.white,
            letterSpacing: -2.5,
            opacity: enter(8),
            transform: `translateY(${rise(8)}px)`,
          }}
        >
          Stock<span style={{ color: COLORS.accent2 }}>GPT</span>
        </div>

        {/* tagline */}
        <div
          style={{
            fontSize: 30,
            color: COLORS.muted,
            marginTop: 20,
            fontWeight: 400,
            opacity: enter(16),
            transform: `translateY(${rise(16)}px)`,
          }}
        >
          AI-powered analysis of real SEC filings
        </div>

        {/* underline accent */}
        <div
          style={{
            marginTop: 40,
            height: 4,
            width: interpolate(enter(20), [0, 1], [0, 260]),
            borderRadius: 999,
            background: `linear-gradient(90deg, ${COLORS.accent2}, ${COLORS.accentDeep})`,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
