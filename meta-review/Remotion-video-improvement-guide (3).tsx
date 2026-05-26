// 8.8s to 9.0s = frames 264 to 270
const windup = interpolate(frame, [264, 270], [0, -10]);
const punch = spring({frame: frame - 270, fps, config: {damping: 8}});
transform: `translateX(${windup + punch * 15}px)`