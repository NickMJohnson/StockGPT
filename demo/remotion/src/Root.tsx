import React from 'react';
import { Composition } from 'remotion';
import { DemoVideo } from './DemoVideo';
import { FPS, HEIGHT, TOTAL, WIDTH } from './constants';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="StockGPTDemo"
      component={DemoVideo}
      durationInFrames={TOTAL}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
