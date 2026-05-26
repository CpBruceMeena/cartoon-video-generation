export const Room: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Back layer - gradient */}
      <div style={{
        background: 'linear-gradient(180deg, #FFF5E1 0%, #FFE8C5 100%)',
        width: '100%', height: '100%'
      }} />
      
      {/* Mid layer - wall + window */}
      <div style={{
        position: 'absolute', top: '50%', width: '100%', height: 2,
        background: '#D4C4A8'
      }} />
      <div style={{
        position: 'absolute', left: '45%', top: '15%', width: 200, height: 150,
        background: 'linear-gradient(135deg, #87CEEB 0%, #B0E0E6 100%)',
        border: '8px solid #8B7355',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.15), 4px 4px 0px rgba(0,0,0,0.1)'
      }} />
      
      {/* Front layer - floor with perspective */}
      <div style={{
        position: 'absolute', bottom: 0, width: '100%', height: '50%',
        background: '#E8D5B5',
        transform: 'perspective(500px) rotateX(10deg)',
        transformOrigin: 'bottom',
        boxShadow: 'inset 0 10px 30px rgba(0,0,0,0.1)'
      }} />
      
      {/* Lighting overlay */}
      <div style={{
        position: 'absolute', top: 0, width: '100%', height: '100%',
        background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.3) 0%, transparent 60%)',
        pointerEvents: 'none'
      }} />
    </AbsoluteFill>
  );
};