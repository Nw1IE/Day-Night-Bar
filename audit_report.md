# 🔎 Mock / Hard‑coded Data Audit Report

## ✅ Already Fixed
- **API base URLs** moved to Vite env vars (`VITE_API_URL`, `VITE_IMAGES_URL`).
- **CORS origins** now read from `CORS_ALLOWED_ORIGINS` env var (fallback only for local dev).
- **Admin password** no longer hard‑coded; pulled from `ADMIN_PASSWORD` env var with a safe fallback that is overridden by real env.
- **`.env` files excluded** via `.gitignore`.
- **README** updated with clear `.env.example` sections.

## ⏳ Remaining Issues (need edit)
| File | Line(s) | Issue | Recommended fix |
|------|---------|-------|-----------------|
| `client/vite.config.js` | 8‑16 | Proxy targets are hard‑coded to `http://localhost:5101`. | Use environment variables: `VITE_API_PROXY` / `VITE_IMG_PROXY` (fallback to `/api` & `/imgs`). |
| `client/js/api/api.js` | 20 | Fallback admin client key `SuperSecretAppKey123!`. | Remove fallback – throw error if `VITE_ADMIN_CLIENT_KEY` missing. |
| `client/.env.example` | – | Contains real placeholder key `SuperSecretAppKey123!`. | Replace with `REPLACE_WITH_SECURE_KEY` placeholder. |
| `server/Program.cs` | 190‑197 | Fallback admin password `AdminSecretDefault!`. | Throw error if `ADMIN_PASSWORD` missing; do not provide default. |
| `server/.env.example` | – | Same placeholder key/value. | Use clear placeholders (`REPLACE_WITH_…`). |

## 📋 Next Steps
1. **Edit `vite.config.js`** – replace hard‑coded URLs with env vars.
2. **Edit `client/js/api/api.js`** – remove fallback admin key.
3. **Update `.env.example` files** – replace real secrets with `REPLACE_WITH_…` placeholders.
4. **Update `Program.cs`** – abort start‑up if `ADMIN_PASSWORD` not set.
5. **Run a quick runtime test** (`npm run dev` + `dotnet run`) to confirm no hard‑coded values remain.
6. **Commit changes** and push.

---
*All recommendations keep existing functionality for local development while guaranteeing that production environments never contain hard‑coded secrets or URLs.*