# motion-studio
Studio motion design Motionova — propulsé par [Remotion](https://www.remotion.dev).


<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.apng">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

Welcome to your Remotion project!

## Motionova916 — film portfolio 9:16

Composition principale : `Motionova916` (1080x1920, 14,1 s = voix off 13,09 s + 1 s sur le logo). Tout est dessiné en code (SVG + React), sans image générée.

- `src/iso/` : moteur isométrique (projection yaw/pitch, volumes, ombres, caméra par images clés)
- `src/islands/` : les îlots du monde (accroche, chaîne de production ; l'îlot offre est conservé pour une version longue)
- `src/overlay/` : mots-clés animés, titres d'étapes, sous-titres, outro (vagues, logo, CTA)
- `src/timeline.ts` : timings en secondes, mot par mot sur la voix off et sur la grille musicale (95 BPM)
- `src/audio.ts` : mixage image par image (ducking de la musique sous la voix, fondus)
- `src/camera.ts` : le plan de caméra unique du film
- Police Inter servie en local (`public/fonts`, licence OFL)
- Audio : `public/voixoff.mp3` (voix off), `public/musique.mp3` (musique) — fichiers sources jamais modifiés
- Logos attendus dans `public/` : `motionova-logo-complet-fond-blanc.png`, `motionova-icone-corail-fond-blanc.png`

```console
# Image fixe
npx remotion still Motionova916 out/stills/fin.png --frame=400

# Brouillon 540x960, 30 fps, puis mastering audio (-14 LUFS, true peak -1 dBTP)
npx remotion render Motionova916 out/brouillon-brut.mp4 --scale=0.5 --codec=h264
node scripts/master-audio.mjs out/brouillon-brut.mp4 out/brouillon.mp4

# Master 1080x1920, 60 fps
npx remotion render Motionova916 out/master-brut.mp4 --props='{"fps":60}' --codec=h264 --crf=18
node scripts/master-audio.mjs out/master-brut.mp4 out/master.mp4
```

## Commands

**Install Dependencies**

```console
npm i --loglevel=error
```

**Start Preview**

```console
npm run dev
```

**Render video**

```console
npx remotion render
```

**Upgrade Remotion**

```console
npx remotion upgrade
```

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
