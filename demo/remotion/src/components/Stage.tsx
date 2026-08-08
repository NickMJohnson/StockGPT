import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { COLORS } from '../theme';

// Opaque animated background. Rendered inside every scene so transitions stay clean.
export const Stage: React.FC<{ seed?: number }> = ({ seed = 0 }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin((frame + seed * 37) / 65);
  const drift2 = Math.cos((frame + seed * 37) / 80);

  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(1300px 900px at 18% 8%, #12253f 0%, rgba(18,37,63,0) 60%),
          radial-gradient(1100px 800px at 92% 96%, #0b2c47 0%, rgba(11,44,71,0) 55%),
          linear-gradient(155deg, ${COLORS.bg0} 0%, ${COLORS.bg1} 100%)
        `,
      }}
    >
      {/* faint grid, masked toward the center */}
      <AbsoluteFill
        style={{
          backgroundImage:
            'linear-gradient(rgba(148,163,184,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.045) 1px, transparent 1px)',
          backgroundSize: '66px 66px',
          WebkitMaskImage:
            'radial-gradient(ellipse 90% 80% at 50% 45%, black 35%, transparent 82%)',
          maskImage:
            'radial-gradient(ellipse 90% 80% at 50% 45%, black 35%, transparent 82%)',
        }}
      />

      {/* glow blobs */}
      <div
        style={{
          position: 'absolute',
          top: 40 + drift * 24,
          left: 1180 + drift2 * 30,
          width: 620,
          height: 620,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(14,165,233,0.20), rgba(14,165,233,0) 65%)',
          filter: 'blur(30px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -40 - drift * 22,
          left: -160,
          width: 560,
          height: 560,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(56,189,248,0.14), rgba(56,189,248,0) 65%)',
          filter: 'blur(46px)',
        }}
      />

      {/* top vignette for text legibility */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(4,8,18,0.35) 0%, rgba(4,8,18,0) 22%, rgba(4,8,18,0) 78%, rgba(4,8,18,0.35) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
