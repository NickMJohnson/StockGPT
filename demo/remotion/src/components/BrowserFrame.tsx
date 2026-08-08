import React from 'react';
import { Img, staticFile } from 'remotion';
import { COLORS, FONT } from '../theme';

const Dot: React.FC<{ c: string }> = ({ c }) => (
  <div style={{ width: 13, height: 13, borderRadius: '50%', background: c }} />
);

const Lock: React.FC = () => (
  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth={2.2}>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

export const BrowserFrame: React.FC<{
  src: string;
  width: number;
  scale?: number;
  translateY?: number;
}> = ({ src, width, scale = 1, translateY = 0 }) => {
  const barH = 50;
  return (
    <div
      style={{
        width,
        borderRadius: 20,
        overflow: 'hidden',
        background: '#ffffff',
        boxShadow:
          '0 50px 130px -25px rgba(2,8,23,0.85), 0 12px 40px -12px rgba(14,165,233,0.25), 0 0 0 1px rgba(255,255,255,0.08)',
      }}
    >
      {/* window chrome */}
      <div
        style={{
          height: barH,
          background: '#F1F5F9',
          display: 'flex',
          alignItems: 'center',
          padding: '0 18px',
          gap: 10,
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        <div style={{ display: 'flex', gap: 9 }}>
          <Dot c="#FF5F57" />
          <Dot c="#FEBC2E" />
          <Dot c="#28C840" />
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              background: '#fff',
              border: '1px solid #E2E8F0',
              borderRadius: 9,
              height: 30,
              minWidth: 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              color: '#64748B',
              fontSize: 15,
              fontFamily: FONT,
              padding: '0 18px',
            }}
          >
            <Lock />
            stock-gpt-five.vercel.app
          </div>
        </div>
        <div style={{ width: 56 }} />
      </div>

      {/* screenshot with subtle ken-burns */}
      <div style={{ overflow: 'hidden' }}>
        <Img
          src={staticFile(src)}
          style={{
            width: '100%',
            display: 'block',
            transform: `scale(${scale}) translateY(${translateY}px)`,
            transformOrigin: 'center top',
          }}
        />
      </div>
    </div>
  );
};
