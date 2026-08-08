import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { Stage } from '../components/Stage';
import { BrowserFrame } from '../components/BrowserFrame';
import { LogoLockup } from '../components/Logo';
import { COLORS, FONT } from '../theme';
import { SCENE, SCENES, Scene } from '../constants';

export const ContentScene: React.FC<{ scene: Scene; index: number }> = ({
  scene,
  index,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ken Burns on the app window
  const kb = interpolate(frame, [0, SCENE], [1.008, 1.055], {
    extrapolateRight: 'clamp',
  });
  const kbY = interpolate(frame, [0, SCENE], [0, -18], {
    extrapolateRight: 'clamp',
  });

  // staggered caption entrance
  const enter = (delay: number) =>
    spring({ frame: frame - delay, fps, config: { damping: 200 }, durationInFrames: 30 });
  const rise = (delay: number, dist = 26) =>
    interpolate(enter(delay), [0, 1], [dist, 0]);

  // frame entrance (from the right, settle)
  const fEnter = enter(4);
  const frameX = interpolate(fEnter, [0, 1], [70, 0]);
  const frameOpacity = interpolate(fEnter, [0, 1], [0, 1]);

  const stepNum = String(index + 1).padStart(2, '0');
  const total = String(SCENES.length).padStart(2, '0');

  return (
    <AbsoluteFill>
      <Stage seed={index + 1} />

      {/* persistent brand mark */}
      <div style={{ position: 'absolute', top: 54, left: 96, opacity: 0.92 }}>
        <LogoLockup size={26} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 60,
          right: 96,
          fontFamily: FONT,
          fontSize: 17,
          fontWeight: 600,
          letterSpacing: 3,
          color: COLORS.mutedDim,
        }}
      >
        {stepNum} / {total}
      </div>

      {/* left caption column */}
      <div
        style={{
          position: 'absolute',
          left: 96,
          top: 0,
          bottom: 0,
          width: 620,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          fontFamily: FONT,
        }}
      >
        {/* ghost index */}
        <div
          style={{
            fontSize: 128,
            fontWeight: 800,
            lineHeight: 0.9,
            color: COLORS.accent,
            opacity: 0.14 * enter(0),
            marginBottom: 8,
            transform: `translateY(${rise(0, 20)}px)`,
            letterSpacing: -4,
          }}
        >
          {stepNum}
        </div>

        {/* kicker chip */}
        <div
          style={{
            display: 'inline-flex',
            alignSelf: 'flex-start',
            alignItems: 'center',
            gap: 10,
            padding: '9px 18px',
            borderRadius: 999,
            background: 'rgba(14,165,233,0.12)',
            border: '1px solid rgba(56,189,248,0.35)',
            color: COLORS.accent2,
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: 2.5,
            textTransform: 'uppercase',
            opacity: enter(4),
            transform: `translateY(${rise(4)}px)`,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: COLORS.accent2,
              boxShadow: `0 0 12px ${COLORS.accent2}`,
            }}
          />
          {scene.label}
        </div>

        {/* title */}
        <div
          style={{
            fontSize: 62,
            fontWeight: 700,
            lineHeight: 1.04,
            color: COLORS.white,
            marginTop: 22,
            letterSpacing: -1.2,
            opacity: enter(10),
            transform: `translateY(${rise(10)}px)`,
          }}
        >
          {scene.title}
        </div>

        {/* body */}
        <div
          style={{
            fontSize: 25,
            lineHeight: 1.5,
            color: COLORS.muted,
            marginTop: 22,
            maxWidth: 540,
            opacity: enter(16),
            transform: `translateY(${rise(16)}px)`,
          }}
        >
          {scene.body}
        </div>
      </div>

      {/* right app window */}
      <div
        style={{
          position: 'absolute',
          left: 748,
          right: 60,
          top: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            opacity: frameOpacity,
            transform: `translateX(${frameX}px)`,
          }}
        >
          <BrowserFrame src={scene.img} width={1052} scale={kb} translateY={kbY} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
