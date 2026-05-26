import {Audio, Sequence, staticFile} from 'remotion';

<Sequence from={0}>
  <Audio src={staticFile("whoosh.wav")} volume={0.3}/>
</Sequence>
<Sequence from={30}>
  <Audio src={staticFile("pop.wav")} volume={0.5}/>
</Sequence>
<Sequence from={150}>
  <Audio src={staticFile("gasp.wav")} volume={0.4}/>
</Sequence>
<Sequence from={270}>
  <Audio src={staticFile("ding.wav")} volume={0.6}/>
</Sequence>

{/* Main voiceover */}
<Audio src={staticFile("voice.wav")} />