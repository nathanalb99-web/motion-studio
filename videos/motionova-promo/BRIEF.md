---
workflow: product-launch-video
flow: automation
storyboard: no
message: "Motionova rend votre produit évident : une vidéo motion design premium, sans réunion ni devis."
destination: landing page / YouTube / LinkedIn
aspect: "16:9"
language: fr
audience: "Fondateurs de SaaS et startups, débordés, qui détestent perdre du temps en réunions et en devis"
length: 30
angle: "Hook 91 % → douleurs (visiteurs qui repartent, leads perdus, démos à répéter) → « Chez Motionova, on règle ça » → vidéo claire : ils comprennent, cliquent, s'inscrivent → brief 10 min, on gère tout → Zéro call / prix fixe / délai → CTA"
style_preset: brand-native (motionova.fr design system)
---

# Brief

## Intent
Vidéo promo motion design de 30 s pour Motionova (motionova.fr), très haut niveau, hyper dynamique, moderne et premium.
Hook imposé : « 91 % des entreprises utilisent la vidéo comme outil marketing ».

## Source
Site motionova.fr (lu depuis le code source du projet Lovable "Pixel Perfect Replication" : le domaine n'est pas joignable depuis le conteneur).
- Promesse : « On rend votre produit simple à comprendre grâce à une vidéo Motion Design »
- Process : brief guidé 10 min → script validé → animation → livraison, « sans une seule réunion »
- Offres : prix fixes (990 € HT / 1 290 € HT / 2 090 € HT), « Pas de devis, pas de surprise », livraison 5 à 10 jours ouvrés
- Réassurance : Script inclus · Délai garanti · 100 % en ligne, sans appel
- CTA : « Commander ma vidéo »

## Assets
- Musique : fournie par l'utilisateur (`assets/audio/music.mp3`, prettyjohn1 beat), section 3.4 s → 33.4 s (drop sur le « 91 »).
- Voix off : timbre ElevenLabs « Bass – Warm, Deep Storytelling » (identifié par comparaison spectrale avec l'échantillon fourni), modèle eleven_v4, nouveau script → `assets/audio/voiceover.mp3` (normalisée −16 LUFS).
- Typo : Inter (300–900), fichiers locaux `assets/fonts/`.
- Couleurs : primaire #FF5C7A, dégradé #FF5C7A → #FF7EA2, encre #0F172B, fond #F9FBFF, teinte #FFF4F4, muted #5E6A7B.
- Logo : fichiers officiels fournis (`assets/brand/source-*`). Icône redessinée en vectoriel (`assets/brand/motionova-icon.svg`, IoU 0.98 vs PNG) pour l'animer ; wordmark détouré en PNG transparent (couleur + blanc).
- Bouton CTA : réplique du bouton du site (#FF5C7A plein, texte blanc).
- Offres : cartes Essentiel / Signature (« La plus choisie ») / Premium reprises des captures du site (scène 6).

## Customizations
- Pas de sous-titres karaoké : la typo cinétique porte les mots-clés.
- Transitions : coupes sur le beat + balayages roses (wipes) au niveau racine.

## Révision v3 (demande client)
- « Zéro réunion » remplacé par « Zéro call » (voix et écran).
- Ajout des douleurs clients, en particulier la perte de leads, et de « Chez Motionova, on règle ça ».
- Script choisi par le client parmi deux finalistes (atelier : 4 rédacteurs, 3 juges, synthèse).
- Timing centralisé dans `videos/motionova-timing.json` ; `videos/tools/retime.py` réapplique les repères mot à mot aux deux formats.
