# cursortap

A keyboard toy for Cursor. Mash keys for drums, melody, bass, and chords with sleek Canvas animations.

## Play

| Keys | Voice |
|------|--------|
| `Q W E R T Y U I O P` | Drum kit |
| `A S D F G H J K L` | Melody (C major pentatonic) |
| `Z X C V B N M` | Bass |
| `1 2 3 4 5 6 7 8 9 0` | Chords |
| Click / tap | Random hit |

Melodic voices share one pentatonic scale so mashed keys still sound consonant. Chrome fades after the first hit; idle for 5s returns home.

## Develop

```bash
npm install
npm run dev
```

```bash
npm run build    # output in dist/
npm run preview  # preview production build
```

## Deploy

This repo is set up for Vercel (`vercel.json`: Vite build → `dist`). Import the GitHub repo in the Vercel dashboard when you are ready.

## Structure

```
src/
  main.ts           # boot
  scale.ts          # pentatonic helpers
  keys/             # keymap + input
  audio/            # Web Audio engine, drums, pitched voices
  animations/       # registry, palette, Cursor + geometric effects
  visuals/          # render loop
```

### Animations

Cursor-heavy Canvas 2D motion (logo mark, caret, ⌘K, agent orb, chat, diffs, and more), plus a few geometric punches for mash impact.

Add a new file under `src/animations/`, `register()` it, import it from `animations/index.ts`, and assign it in `keys/keyMap.ts`.
