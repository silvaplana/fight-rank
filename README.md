# FightRank

App mobile pour gérer un groupe de combattants, enregistrer leurs combats et suivre leur historique.

- `frontend/` — Vite + React + Tailwind (mobile-first)
- `backend/` — FastAPI + SQLModel (SQLite) + JWT

## Dev local

**Backend**

```bash
cd backend
python3 -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend** (dans un autre terminal)

```bash
cd frontend
npm install
npm run dev
```

Ouvrir http://localhost:5173 (le dev server proxy `/api` et `/media` vers `localhost:8000`, voir `vite.config.js`).

## Docker / déploiement VPS

`docker-compose.yml` ne publie aucun port : il est fait pour tourner derrière
le Caddy "gateway" partagé du VPS (silvaplana.cloud), qui route
`/fight-rank/*` vers le conteneur frontend via le réseau Docker `web`. Voir
`DEPLOY.md` pour la procédure complète.

## Modèle de données

- **Organization** : `name`
- **Fighter** : `name`, `password` (hashé bcrypt), `weight_category`, `organization`
- **Fight** : `fighter` (celui qui enregistre), `opponent`, `result`, `description`, `video`, `date`
