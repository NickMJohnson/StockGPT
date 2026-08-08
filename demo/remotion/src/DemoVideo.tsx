import React from 'react';
import { AbsoluteFill } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { IntroCard } from './scenes/IntroCard';
import { OutroCard } from './scenes/OutroCard';
import { ContentScene } from './scenes/ContentScene';
import { INTRO, OUTRO, SCENE, SCENES, TRANSITION } from './constants';
import { COLORS } from './theme';

const timing = linearTiming({ durationInFrames: TRANSITION });

export const DemoVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={INTRO}>
          <IntroCard />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fade()} timing={timing} />

        {SCENES.flatMap((scene, i) => [
          <TransitionSeries.Sequence key={`scene-${i}`} durationInFrames={SCENE}>
            <ContentScene scene={scene} index={i} />
          </TransitionSeries.Sequence>,
          <TransitionSeries.Transition
            key={`trans-${i}`}
            presentation={
              i % 2 === 0 ? slide({ direction: 'from-right' }) : fade()
            }
            timing={timing}
          />,
        ])}

        <TransitionSeries.Sequence durationInFrames={OUTRO}>
          <OutroCard />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
