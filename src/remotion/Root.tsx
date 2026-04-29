import { Composition } from 'remotion'
import { IconHeroTutorial } from './IconHeroTutorial'

export const RemotionRoot = () => (
  <Composition
    id="IconHeroTutorial"
    component={IconHeroTutorial}
    durationInFrames={900}
    fps={30}
    width={1920}
    height={1080}
  />
)
