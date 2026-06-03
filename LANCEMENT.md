# Enchères Predict — Application Angular 21

## Démarrage rapide

```bash
# 1. Lancer le backend .NET dans ../encherespredict-backend/EncheresPredict.Api
dotnet run

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm start
```

L'application sera disponible sur **http://localhost:4200**
Les appels `/api` sont proxifiés vers **https://localhost:65302**.

## Fonctionnalités

- **Landing Page** — Hero marketing, features, pricing
- **Onboarding** — Wizard 4 étapes (profil, régions, budget, types de biens)
- **Dashboard** — KPIs, graphique mise à prix vs IA, opportunités, alertes
- **Liste des enchères** — Vue tableau + cartes, filtres, tri par ROI/confiance/date
- **Fiche détail** — 4 onglets : Informations, Prédiction IA, Rentabilité, Documents

## Technologies

- **Angular 21** — Zoneless (provideExperimentalZonelessChangeDetection)
- **Signals** — Gestion d'état réactive
- **Standalone components** — Architecture modulaire
- **TypeScript** — Typage strict
- **SCSS** — CSS Variables Enterprise Light Theme

## Navigation

Toutes les données sont mockées. La sidebar permet de naviguer entre les écrans.
Le panneau **Tweaks** (⚙ en haut à droite) permet de basculer thème clair/sombre.
