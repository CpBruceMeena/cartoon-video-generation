export const Camera: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  
  // Slow pan left over 10s
  const panX = interpolate(frame, [0, 300], [0, -20]);
  
  // Impact shake on punchline at 9.0s = frame 270
  const shake = frame > 268 && frame < 275 ? Math.sin(frame * 50) * 3 : 0;
  
  // Subtle push-in on "chocolates" 
  const pushIn = interpolate(frame, [270, 300], [1, 1.03]);
  
  return (
    <div style={{
      transform: `translate(${panX + shake}px, 0) scale(${pushIn})`
    }}>
      {children}
    </div>
  );
};