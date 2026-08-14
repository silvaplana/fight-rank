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

## Docker (local ou VPS)

```bash
cp .env.example .env   # renseigner SECRET_KEY et ALLOWED_ORIGINS
docker compose up -d --build
```

Le frontend (nginx) écoute sur le port hôte `8080`, sert l'app sous `/fight-rank/` et proxy `/fight-rank/api/` + `/fight-rank/media/` vers le backend. Voir `DEPLOY.md` pour brancher ça derrière le reverse proxy du VPS.

## Modèle de données

- **Organization** : `name`
- **Fighter** : `name`, `password` (hashé bcrypt), `weight_category`, `organization`
- **Fight** : `fighter` (celui qui enregistre), `opponent`, `result`, `description`, `video`, `date`
