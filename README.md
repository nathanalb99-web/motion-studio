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

Composition principale : `Motionova916` (1080x1920, 18 s). Tout est dessiné en code (SVG + React), sans image générée.

- `src/iso/` : moteur isométrique (projection yaw/pitch, volumes, ombres, caméra par images clés)
- `src/islands/` : les 3 îlots du monde (accroche, chaîne de production, offre)
- `src/overlay/` : typographie animée, titres d'étapes, outro (vagues, logo, CTA)
- `src/timeline.ts` : tous les timings, en secondes (calés sur le script de voix off)
- `src/camera.ts` : le plan de caméra unique du film
- Police Inter servie en local (`public/fonts`, licence OFL)
- Logos attendus dans `public/` : `motionova-logo-complet-fond-blanc.png`, `motionova-icone-corail-fond-blanc.png`

```console
# Image fixe
npx remotion still Motionova916 out/stills/fin.png --frame=531

# Brouillon 540x960, 30 fps
npx remotion render Motionova916 out/brouillon.mp4 --scale=0.5 --codec=h264

# Master 1080x1920, 60 fps
npx remotion render Motionova916 out/master.mp4 --props='{"fps":60}' --codec=h264 --crf=18
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
