import {spring, useCurrentFrame, useVideoConfig} from 'remotion';

const SUBS = [
  {from: 0,   text: "Hmmmmm...", speaker: "Shinchan", color: "#E60012"},
  {from: 30,  text: "Boring days are peaceful days, Shinchan.", speaker: "Doraemon", color: "#0089D0"},
  {from: 120, text: "Peaceful means no snacks.", speaker: "Shinchan", color: "#E60012"},
  {from: 210, text: "That is not how peace works.", speaker: "Doraemon", color: "#0089D0"},
  {from: 270, text: "Then teach peace with chocolates.", speaker: "Shinchan", color: "#E60012"},
];

export const AnimatedSubtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const current = SUBS.findLast(s => frame >= s.from);
  if (!current) return null;
  
  const enter = spring({
    frame: frame - current.from,
    fps,
    config: {damping: 15, stiffness: 300}
  });

  return (
    <div style={{
      position: 'absolute', bottom: 80, width: '100%',
      display: 'flex', justifyContent: 'center'
    }}>
      <div style={{
        background: 'rgba(0,0,0,0.85)',
        borderLeft: `8px solid ${current.color}`,
        borderRadius: 16,
        padding: '12px 24px',
        transform: `scale(${enter})`,
        fontFamily: 'Varela Round, sans-serif',
        fontSize: 42,
        color: 'white',
        WebkitTextStroke: '2px black',
      }}>
        <span style={{color: current.color, fontWeight: 800, marginRight: 8}}>
          {current.speaker}
        </span>
        {current.text}
      </div>
    </div>
  );
};