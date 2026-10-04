# MediSetu – Hospital & Clinic Management (Frontend)

React 19 · Vite · Tailwind CSS · React Router · Axios · Framer Motion · Lucide

Patient, Doctor and Admin dashboards for appointments, records, prescriptions and billing.

## Run

```bash
npm install
cp .env.example .env     # optional – every variable has a safe default
npm run dev              # http://localhost:5173
npm run build && npm run preview
```

## Architecture

```
Backend API → services/*.js → services/adapters/*.js → pages/components
```

* `services/api.js` – the ONE Axios client (JWT header, silent refresh on 401, `VITE_API_BASE_URL`)
* `services/adapters/` – normalise backend payloads for the UI (doctor, doctor/admin dashboard, ML)
* Auth keys in localStorage: `medisetu_access_token`, `medisetu_refresh_token`, `medisetu_role`

## Roles

| Role    | Home                | Guard |
|---------|---------------------|-------|
| PATIENT | `/dashboard`        | `components/ProtectedRoute.jsx` |
| DOCTOR  | `/dashboard/doctor` | same |
| ADMIN   | `/dashboard/admin`  | same |

## Temporary / demo data (all clearly marked in code)

| What | Where | Switch |
|------|-------|--------|
| Doctor/Admin dashboard demo fallback | `src/data/mockDashboards.js` | `VITE_ENABLE_DEMO_FALLBACK=false` disables it |
| Report upload (not sent to server) | `src/services/reportService.js` | `VITE_REPORT_UPLOAD_ENABLED=true` once backend contract exists |
| ML prediction placeholder | `src/data/mockMl.js`, `src/services/mlService.js`, `src/services/adapters/mlAdapter.js` | `VITE_ML_ENABLED=true` + set `ML_PREDICT_PATH` |
| Online payment | `BillsScreen` – UI only, says "pending" | needs a payment endpoint |
| `src/data/mockData.js` | **unused** Figma reference data (no imports) | safe to delete |

Search the code for `TEMPORARY` to find every one.

## Deploying

`public/_redirects` (Netlify/Cloudflare) and `vercel.json` rewrite all paths to `index.html`
so refreshing `/records` or opening a deep link works.
