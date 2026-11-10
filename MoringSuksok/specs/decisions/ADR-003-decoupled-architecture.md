# ADR-003: Decoupled Architecture
# Frontend-Backend Terpisah (vs Monolith Next.js)

> **Status**: Accepted | **Date**: 2026-10-29 | **Decision Maker**: Mahasiswa (with Agent A consultation)

---

## Context

Setelah memilih tech stack (ADR-001), perlu memutuskan arsitektur: apakah frontend dan backend digabung (monolith, Next.js API Routes) atau dipisah (decoupled, Next.js frontend + Python FastAPI backend)?

Keputusan ini berdampak pada:
- Code organization
- Deployment strategy
- Development workflow
- Scaling strategy
- Future maintenance

## Options Considered

### Option A: Monolith (Next.js + API Routes)

**Architecture**:
- 1 codebase Next.js (frontend + API routes)
- Database access via Prisma (server-side)
- Deploy sebagai 1 unit ke Vercel

**Pros**:
- ✅ 1 codebase, simpler git workflow
- ✅ Sharing TypeScript types antara frontend & backend
- ✅ 1 deployment target (Vercel)
- ✅ Faster initial setup
- ✅ Vercel auto-deploy dari GitHub

**Cons**:
- ❌ Tidak showcase Python skill
- ❌ API Routes = serverless functions (cold start issue, max 10s execution di hobby plan)
- ❌ Vendor lock-in ke Vercel (atau platform serverless compatible)
- ❌ Sulit untuk long-running tasks (cron, background jobs)
- ❌ Konflik dengan ADR-001 (kalau pakai Python FastAPI, harus decoupled)

### Option B: Decoupled — Next.js Frontend + Python FastAPI Backend (CHOSEN)

**Architecture**:
- Frontend: Next.js PWA, deploy ke Vercel
- Backend: Python FastAPI, deploy ke Railway/Render
- Database: MySQL (local Laragon / production Railway MySQL)
- Communication: REST API via HTTPS + JSON
- Auth: JWT (Bearer token di header)

**Pros**:
- ✅ Separation of concerns jelas
- ✅ Bisa showcase Python skill (sesuai ADR-001)
- ✅ Backend bisa scale independent dari frontend
- ✅ Long-running tasks supported (FastAPI + uvicorn ASGI)
- ✅ Auto-Swagger docs dari FastAPI (bonus demo)
- ✅ Future-proof: bisa ganti frontend ke React Native tanpa ubah backend
- ✅ Deploy target fleksibel (Vercel, Railway, atau self-hosted)

**Cons**:
- ⚠️ 2 codebase untuk maintain
- ⚠️ CORS configuration required
- ⚠️ Tidak sharing types otomatis (perlu sync manual atau code generation)
- ⚠️ 2 deployment targets
- ⚠️ Development setup lebih kompleks (2 servers dijalankan paralel)

### Option C: Microservices (Over-engineered)

**Architecture**:
- Frontend: Next.js
- Backend: Multiple microservices (Auth Service, Product Service, Order Service, Payment Service, dll)
- API Gateway untuk routing

**Pros**:
- ✅ Highly scalable
- ✅ Each service independent deploy
- ✅ Best for enterprise-scale

**Cons**:
- ❌ Over-engineering untuk TA (skala <100 customer)
- ❌ Setup & maintenance sangat kompleks
- ❌ Latency antar service
- ❌ Tidak feasible untuk 8 minggu development

## Decision

Pilih **Option B: Decoupled Architecture (Next.js + Python FastAPI)**.

## Rationale

1. **Consistency dengan ADR-001**: Pemilihan tech stack sudah menentukan arsitektur. Kalau pakai Python FastAPI, secara default sudah decoupled dari Next.js frontend.

2. **Showcase skill yang relevan untuk karir**: Banyak perusahaan modern (Tokopedia, Gojek, Traveloka) pakai arsitektur decoupled. Mengikuti best practice industri menunjukkan kesiapan untuk kerja nyata.

3. **Separation of Concerns**: Frontend fokus ke presentation & UX, backend fokus ke business logic & data. Code lebih maintainable, easier to test, easier to onboard new developer.

4. **Independent scaling**: Saat traffic frontend naik (e.g. flash sale), bisa scale Vercel saja tanpa affect backend. Begitu juga sebaliknya.

5. **Future-proof**: Setelah TA, owner bisa:
   - Ganti frontend ke React Native (mobile native) tanpa ubah backend
   - Tambah admin dashboard terpisah (e.g. desktop app)
   - Integrate dengan sistem lain (accounting software, marketplace API)

6. **Long-running tasks support**: FastAPI dengan uvicorn ASGI mendukung background tasks, cron jobs, WebSocket — yang tidak feasible di Next.js serverless API routes (10s timeout).

7. **Demo value untuk sidang**: Arsitektur decoupled lebih impresif untuk dosen penguji. Menunjukkan pemahaman:
   - REST API design
   - JWT authentication
   - CORS handling
   - Service communication patterns
   - Trade-off analysis

## Consequences

### Positive
- Showcase multi-language skill (Python + TypeScript)
- Separation of concerns jelas
- Independent scaling frontend & backend
- Auto-Swagger docs untuk demo
- Future-proof architecture
- Best practice industri

### Negative
- 2 codebase untuk maintain (frontend + backend)
- CORS configuration di awal
- Tidak sharing types otomatis (perlu manual sync atau OpenAPI generator)
- 2 deployment targets (Vercel + Railway)
- Development setup lebih kompleks (2 servers)

### Neutral
- Developer perlu familiar dengan git submodules atau monorepo tools (e.g. turborepo, nx)
- API versioning strategy perlu dipikirkan dari awal (gunakan `/api/v1/`)

## Mitigation

| Risk | Mitigation |
|---|---|
| CORS error | Setup `fastapi-cors` middleware sejak Minggu 1; allow origin `localhost:3000` (dev), `*.vercel.app` (staging), `moringsuksok.id` (prod) |
| Type sync manual | Buat shared types di `frontend/src/types/api.ts` (manual sync dari Pydantic schemas); atau gunakan OpenAPI generator (future improvement) |
| 2 deployment | Setup GitHub Actions untuk auto-deploy frontend ke Vercel dan backend ke Railway (CI/CD) |
| 2 servers di dev | Buat `dev.sh` script yang menjalankan `npm run dev` (frontend) + `uvicorn` (backend) paralel; atau pakai `concurrently` package |
| Auth approach | Gunakan JWT (stateless) bukan session-based — kompatibel dengan cross-domain |
| API versioning | Prefix semua endpoint dengan `/api/v1/`; breaking changes → bump ke `/api/v2/` |

## Implementation Notes

### Repository Structure

```
my-app/
├── frontend/         # Next.js PWA (TypeScript)
│   ├── src/
│   ├── package.json
│   └── next.config.js
├── backend/          # Python FastAPI
│   ├── app/
│   ├── requirements.txt
│   └── alembic/
├── specs/            # Agent A — planning files
├── docs/             # Shared documentation
└── README.md
```

### Communication Pattern

```
Frontend (Next.js) ──── HTTPS / REST API ────► Backend (FastAPI)
   │                                                  │
   ├─ Browser (Customer)                             ├─ SQLAlchemy ORM
   ├─ PWA (Android installable)                      ├─ MySQL Database
   ├─ Service Worker (push notif, offline cache)     ├─ Cloudinary (image storage)
   └─ Axios HTTP client + JWT interceptor             └─ Firebase Admin (push notif server)
```

### JWT Authentication Flow

1. Customer submit login form di frontend
2. Frontend POST /api/v1/auth/login dengan credentials
3. Backend verify, return JWT token
4. Frontend simpan token di localStorage (atau httpOnly cookie)
5. Setiap request berikutnya, frontend attach `Authorization: Bearer <token>` via Axios interceptor
6. Backend middleware validate JWT, allow/deny access

### CORS Configuration (FastAPI)

```python
# backend/app/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",                    # dev
        "https://moring-suksok-staging.vercel.app",  # staging
        "https://moringsuksok.vercel.app",           # production
        "https://moringsuksok.id",                  # custom domain (future)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Deployment Strategy

| Component | Platform | URL | Cost |
|---|---|---|---|
| Frontend | Vercel | `moringsuksok.vercel.app` | Free (Hobby plan) |
| Backend | Railway | `api.moringsuksok.railway.app` | Free (with sleep) atau $5/mo |
| Database | Railway MySQL | internal Railway network | Free 5GB |
| Image storage | Cloudinary | `res.cloudinary.com/moring` | Free 25 credits/month |
| Push notif | Firebase FCM | - | Free unlimited |

## Trade-off Summary

| Aspect | Monolith | Decoupled (CHOSEN) |
|---|---|---|
| Code complexity | Low (1 codebase) | Medium (2 codebase) |
| Deployment complexity | Low (1 platform) | Medium (2 platforms) |
| Type safety | Auto (Prisma → TS) | Manual sync OR codegen |
| Scaling | Monolithic (scale all) | Independent per layer |
| Showcase value | Standard | Higher (multi-lang, arch) |
| Future flexibility | Limited | High |
| Long-running tasks | Limited (serverless) | Supported |
| Vendor lock-in | Vercel | None |

## References

- FastAPI CORS documentation: https://fastapi.tiangolo.com/tutorial/cors/
- Next.js API Routes vs separate backend: https://nextjs.org/docs/api-routes/introduction
- JWT vs Session auth: https://datatracker.ietf.org/doc/html/rfc7519
- Decoupled architecture best practices: https://martinfowler.com/articles/microservices.html

---

**End of ADR-003**
