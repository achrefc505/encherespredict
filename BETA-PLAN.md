# 🚀 BETA-PLAN — EnchèresPredict

> Document de suivi pour finaliser et lancer la **beta gratuite (30 jours)**.
> Cocher les tâches au fur et à mesure. Mettre à jour la date de dernière révision.

**Dernière révision** : 2026-05
**Objectif beta** : valider l'usage réel + récolter du feedback de 5-10 marchands de biens
**Durée cible de prépa** : 6 semaines
**Périmètre géographique** : Paris / Île-de-France uniquement

---

## 🎯 Pourquoi cette beta (à garder en tête)

La beta ne sert PAS à avoir un produit parfait. Elle sert à :
1. **Valider l'usage** — les gens reviennent-ils ? à quelle fréquence ?
2. **Récolter du feedback** — qu'est-ce qui manque ? qu'est-ce qui fait "wow" ?
3. **Identifier qui paierait** — et combien

➡️ **Règle d'or** : toute tâche qui ne sert pas ces 3 buts = reportée en post-beta.

---

## 🏗️ Architecture cible beta

**Insight clé** : seuls 3 composants sont EN LIGNE. Le scraper, le ML et le résumé IA
tournent EN LOCAL (cron quotidien) et écrivent les résultats pré-calculés dans Azure SQL.

```
   CHEZ TOI (cron quotidien, invisible des users)
   ┌─────────────────────────────────────────────────┐
   │ scraper → ML predict → résumé IA CCV → write DB   │
   └────────────────────────┬──────────────────────────┘
                            │ (write Azure SQL)
   ═══════════════════════  ▼  ═══════════════  EN LIGNE (Azure)
          ┌────────────────────────────────┐
          │   Azure SQL Database (Basic)    │
          └──────────────┬─────────────────┘
                         │
          ┌──────────────▼────────┐   ┌──────────────────────┐
          │ .NET API (App Service) │◀──│ Angular (Static Web) │
          └────────────────────────┘   └──────────────────────┘
                                          ← beta-users ici
```

| Service Azure | Rôle | Coût/mois |
|---------------|------|-----------|
| Static Web Apps | Frontend Angular | Gratuit |
| App Service (B1) | API .NET | ~13€ |
| Azure SQL (Basic) | Base données | ~5€ |
| **Total** | | **~18€** |

---

## 📦 Périmètre — MoSCoW

### ✅ MUST — sans ça, pas de beta
- Authentification (login/register)
- App accessible en ligne (URL publique + HTTPS)
- Liste des vraies enchères Paris à venir
- Détail bien + estimation IA + décote
- Calculateur de rentabilité
- **Résumé IA du cahier des charges** (killer feature)
- Mécanisme de feedback
- Mentions légales + RGPD + CGU
- Expiration accès beta à 30 jours

### 🟡 SHOULD — si le temps le permet
- Alertes email nouvelles enchères
- Onboarding guidé (tooltips)

### 🔵 COULD — post-beta
- Multi-régions
- Workflow n8n email avocats (manuel au début)
- Tier Pro + paiement Stripe

### ❌ WON'T — pas maintenant
- App mobile, carte interactive, réseau artisans, embeddings NLP

---

## 🗓️ BACKLOG DÉTAILLÉ (par semaine)

### 📅 SEMAINE 1 — Authentification (ASP.NET Identity)

**Backend (.NET)**
- [ ] Ajouter packages `Microsoft.AspNetCore.Identity.EntityFrameworkCore` + `Microsoft.AspNetCore.Authentication.JwtBearer`
- [ ] Créer entité `ApplicationUser : IdentityUser` (+ champ `BetaExpiresAt`)
- [ ] Étendre `AppDbContext` → `IdentityDbContext<ApplicationUser>`
- [ ] Migration EF `AddIdentity` + update database
- [ ] Endpoint `POST /api/auth/register` (email, password, nom)
- [ ] Endpoint `POST /api/auth/login` → renvoie JWT
- [ ] Endpoint `GET /api/auth/me` (profil courant)
- [ ] Config JWT (clé secrète en variable d'env, expiration 7j)
- [ ] Middleware d'autorisation sur les routes `/api/auctions/*`
- [ ] Vérif `BetaExpiresAt` → 403 si beta expirée

**Frontend (Angular)**
- [ ] Page `/login` (formulaire email/password)
- [ ] Page `/register`
- [ ] `AuthService` (login, register, logout, token storage)
- [ ] `authInterceptor` (ajoute `Authorization: Bearer` à chaque requête)
- [ ] `authGuard` (redirige vers /login si non connecté)
- [ ] Affichage nom user + bouton déconnexion dans la topbar
- [ ] Gestion expiration token (refresh ou re-login)

**Definition of Done S1** : je peux créer un compte, me connecter, et accéder au dashboard ; un non-connecté est redirigé vers /login.

---

### 📅 SEMAINE 2 — Résumé IA du Cahier des Conditions de Vente

**Service de résumé (Python — dans ep-licitor-scraper ou ep-ml-api)**
- [ ] Module `ccv_summary.py` : prend un PDF → texte (PyPDF2 / pdfplumber)
- [ ] Prompt LLM structuré → JSON : `{ occupant, charges_copro, procedures, servitudes, etat_bien, frais_prealables, points_vigilance[], points_forts[] }`
- [ ] Appel API LLM (Claude/OpenAI) avec prompt caching pour réduire coûts
- [ ] Gestion erreurs (PDF illisible, doc manquant)
- [ ] Stockage du résumé JSON dans la table `Documents` ou nouvelle table `DocumentSummaries`

**Backend (.NET)**
- [ ] Migration : table `DocumentSummaries` (AuctionId, SummaryJson, GeneratedAt)
- [ ] Endpoint `GET /api/auctions/{id}/summary`

**Frontend (Angular)**
- [ ] Onglet "Analyse IA des documents" dans property-detail
- [ ] Affichage fiche : occupant (badge rouge si occupé), charges, procédures, vigilance
- [ ] État "résumé en cours / non disponible"

**Definition of Done S2** : un bien avec CCV affiche une fiche risques lisible générée par IA.

---

### 📅 SEMAINE 3 — Déploiement Azure

- [ ] Créer Resource Group `rg-encherespredict`
- [ ] Créer Azure SQL Database (Basic) + règle firewall (ton IP + Azure services)
- [ ] Migrer schéma : `dotnet ef database update` pointant sur Azure SQL
- [ ] Importer les données existantes (BACPAC ou script)
- [ ] Créer App Service (B1, .NET 8) pour l'API
- [ ] Variables d'env App Service (ConnectionString, JWT secret, CORS)
- [ ] Créer Static Web App pour Angular
- [ ] Adapter `environment.prod.ts` → URL API Azure
- [ ] GitHub Actions : déploiement auto API + frontend sur push main
- [ ] Domaine custom + HTTPS (ou domaine .azurewebsites.net pour démarrer)
- [ ] Test : créer un compte depuis l'URL publique

**Definition of Done S3** : l'app est accessible sur une URL publique HTTPS, un compte peut être créé.

---

### 📅 SEMAINE 4 — Pipeline data fiabilisé

- [ ] Script local `daily_pipeline` : scrape Paris → ML predict → CCV summary → write Azure SQL
- [ ] Tâche planifiée Windows (ou cron) quotidienne
- [ ] Re-train ML sur vraies données (`DATA_SOURCE=sql`)
- [ ] Corriger les prédictions aberrantes (vérifier 10 cas réels manuellement)
- [ ] Vérifier que les nouvelles enchères apparaissent bien en ligne
- [ ] Logs + alerte si le pipeline échoue (email à toi-même)
- [ ] Nettoyer les mocks restants (EP_SKIP_SEED=true en prod)

**Definition of Done S4** : chaque matin, les nouvelles enchères Paris sont en ligne avec estimation + résumé.

---

### 📅 SEMAINE 5 — Feedback + Légal + Polish

**Feedback**
- [ ] Widget feedback (bouton flottant "Donner mon avis" → formulaire simple)
- [ ] Stockage feedback en base + notification email
- [ ] Lien vers un court questionnaire (Google Forms/Tally) en fin de parcours

**Légal (OBLIGATOIRE)**
- [ ] Page Mentions légales
- [ ] Page Politique de confidentialité (RGPD)
- [ ] CGU beta (préciser : service expérimental, données indicatives, pas de garantie)
- [ ] Bandeau cookies si analytics
- [ ] Mention "estimations indicatives, ne constituent pas un conseil en investissement"

**Polish**
- [ ] Email de bienvenue (Brevo) à l'inscription
- [ ] Tests bout-en-bout (parcours complet inscription → analyse bien)
- [ ] Corriger les bugs bloquants
- [ ] Vérifier responsive (au moins desktop propre)
- [ ] Page d'accueil beta claire (c'est quoi, comment ça marche)

**Definition of Done S5** : parcours complet sans bug bloquant + conformité légale minimale.

---

### 📅 SEMAINE 6 — Recrutement & Lancement beta

- [ ] Finaliser la liste de 10-15 prospects (marchands de biens — voir doc prospection)
- [ ] Message d'invitation beta personnalisé (LinkedIn/email)
- [ ] Contacter Erkan (Esprit Investisseur) + Yoni (MDB Academy)
- [ ] Poster dans les 3 groupes Facebook ciblés
- [ ] Onboarding individuel des premiers testeurs (appel 15 min chacun si possible)
- [ ] Mettre en place le suivi : qui s'est connecté, combien de fois, quelles pages
- [ ] Planifier un point feedback à J+15 et J+30

**Definition of Done S6** : 5-10 beta-testeurs actifs utilisent l'app sur données réelles.

---

## ✅ Definition of Done GLOBALE (beta prête)

- [ ] Un inconnu crée un compte sur une vraie URL HTTPS
- [ ] Il voit les vraies enchères Paris à venir
- [ ] Il peut analyser un bien (estimation + décote + ROI)
- [ ] Il lit le résumé IA du cahier des charges
- [ ] Il peut donner son feedback en 1 clic
- [ ] Mentions légales + RGPD + CGU présentes
- [ ] L'accès beta expire automatiquement à 30 jours
- [ ] L'app tient 1 semaine sans planter

---

## 📊 Métriques de succès de la beta (à mesurer)

| Métrique | Objectif minimal | Signal fort |
|----------|------------------|-------------|
| Beta-testeurs recrutés | 5 | 15+ |
| Taux de connexion semaine 2 | 40% | 70%+ |
| Nb d'analyses de biens / user | 3 | 10+ |
| Feedback "j'utiliserais payant" | 2/10 | 5/10 |
| Feature la plus citée | (à découvrir) | résumé CCV |

➡️ **Décision post-beta** : si ≥ 3/10 disent "je paierais 79€/mois" → on lance le payant. Sinon → on pivote selon le feedback.

---

## ⚠️ Risques & mitigations

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Licitor bloque le scraping | Critique | Diversifier (BODACC officiel, partenariats avocats) |
| Prédictions ML peu fiables | Élevé | Afficher des fourchettes, pas un chiffre exact ; re-train sur vraies données |
| Coût LLM (résumé CCV) explose | Moyen | Pré-calcul + cache, pas de génération à la volée |
| Personne ne s'inscrit | Critique | Partenariat influenceur (Erkan/Yoni) en priorité |
| Scope creep (on ajoute des features) | Élevé | Respecter le MoSCoW, tout le reste en post-beta |

---

## 🔑 Décisions actées

- **Hébergement** : Azure (Static Web Apps + App Service + Azure SQL)
- **Auth** : ASP.NET Identity + JWT
- **Résumé IA CCV** : INCLUS dans la beta (killer feature)
- **Géo** : Paris / IDF uniquement
- **Beta** : gratuite, 30 jours, accès expirant automatiquement

---

## 📁 Repos du projet

| Repo | Rôle |
|------|------|
| `encherespredict` | Frontend Angular |
| `encherespredict-backend` | API .NET 8 (DDD+CQRS) |
| `ep-licitor-scraper` | Scraper + ETL + (résumé CCV) |
| `ep-ml-api` | API ML Random Forest |
| `ep-workflow` | n8n + NextCloud + Brevo (post-beta) |
