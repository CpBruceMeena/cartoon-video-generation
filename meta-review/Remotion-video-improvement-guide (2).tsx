const squash = interpolate(
  frame, 
  [0, 3, 8], // frames
  [1, 0.95, 1], // scaleY
  {easing: Easing.elastic(1)}
);
const stretchX = 1 / squash; // maintain volume

transform: `scaleY(${squash}) scaleX(${stretchX})`