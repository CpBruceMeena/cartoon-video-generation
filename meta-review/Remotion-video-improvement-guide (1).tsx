import {spring, useCurrentFrame, useVideoConfig} from 'remotion';

const frame = useCurrentFrame();
const {fps} = useVideoConfig();

// Doraemon bounce entrance at 1.0s = frame 30
const scale = spring({
  frame: frame - 30,
  fps,
  config: {damping: 12, stiffness: 200, mass: 0.5} // creates overshoot
});

<Doraemon style={{transform: `scale(${scale})`}} />