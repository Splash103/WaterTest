import { Howl } from 'howler';

export const sounds = {
  correct: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'],
    volume: 0.5
  }),
  wrong: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3'],
    volume: 0.3
  }),
  water: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2685/2685-preview.mp3'],
    volume: 0.2,
    loop: true
  })
};