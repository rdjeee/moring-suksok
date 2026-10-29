# KNOWN-ISSUES.md
# Bug Tracker & Known Issues

> **Owner**: Agent B (Dev) | **Started**: 2026-10-29
> **Purpose**: Track bugs yang ditemukan, severity, dan status fix

---

## 🐛 Bug Priority Levels

| Level | Definition | SLA |
|---|---|---|
| 🔴 Critical | Sistem tidak jalan, blocking development | Fix within 24h |
| 🟠 High | Feature utama broken, ada workaround sulit | Fix within 3 days |
| 🟡 Medium | Feature broken, ada workaround mudah | Fix within 1 week |
| 🟢 Low | Cosmetic issue, minor inconvenience | Fix when possible |

---

## 📋 Open Issues

| ID | Priority | Title | Component | Date Found | Status | Assigned |
|---|---|---|---|---|---|---|
| ISSUE-001 | 🟡 Medium | Makefile recipe lines use spaces, not TABs | build/Makefile | 2026-10-29 | Open | Agent A (SHARED file) |
| ISSUE-002 | 🟢 Low | passlib + bcrypt 4.x version warning (cosmetic) | backend/auth | 2026-10-29 | Open | Agent B |
| ISSUE-003 | 🟢 Low | SQL echo very verbose (DEBUG=true) | backend/config | 2026-10-29 | Open | Agent B |

---

## 📝 Issue Details

### [ISSUE-001] — Makefile recipe lines use spaces, not TABs

**Priority**: 🟡 Medium
**Component**: build/Makefile (SHARED — owned by Agent A)
**Date Found**: 2026-10-29
**Found By**: Agent B

**Description**: `make migrate` (and all other make commands) fail with `Makefile:35: *** missing separator (did you mean TAB instead of 8 spaces?)`. GNU Make requires TAB characters at the start of recipe lines, but the Makefile uses 8 spaces throughout.

**Steps to Reproduce**:
1. `cd /home/z/my-project`
2. `make migrate`
3. Error: `Makefile:35: *** missing separator`

**Expected Behavior**: `make migrate` runs `cd backend && venv/bin/python -m alembic upgrade head`

**Actual Behavior**: Make fails to parse the Makefile.

**Workaround**: Run alembic commands directly:
```bash
cd backend && source venv/bin/activate
alembic upgrade head      # instead of: make migrate
python seed.py            # instead of: make seed
```

**Fix**: Replace all 8-space recipe indents with TAB characters in Makefile. This is a SHARED file — needs [SHARED-EDIT-REQUEST] via DECISIONS-DEV.md (request submitted).

**Status**: Open — waiting for Agent A to fix (or approve Agent B to fix)

---

### [ISSUE-002] — passlib + bcrypt 4.x version warning (cosmetic)

**Priority**: 🟢 Low
**Component**: backend/auth (passlib 1.7.4 + bcrypt 4.2.1)
**Date Found**: 2026-10-29
**Found By**: Agent B

**Description**: When `hash_password()` is called, passlib emits a trapped warning:
```
(trapped) error reading bcrypt version
AttributeError: module 'bcrypt' has no attribute '__about__'
```

This is a known compatibility issue: passlib 1.7.4 tries to read `bcrypt.__about__.__version__`, which was removed in bcrypt 4.x. The warning is **trapped** (caught internally by passlib) and password hashing works correctly — bcrypt hash is generated successfully (e.g., `$2b$12$...`).

**Steps to Reproduce**:
1. `cd backend && source venv/bin/activate`
2. `python -c "from app.core.security import hash_password; print(hash_password('test'))"`
3. Warning appears in stderr, but hash is generated correctly.

**Expected Behavior**: No warning.

**Actual Behavior**: Trapped warning printed, but functionality works.

**Fix options** (when time permits):
1. Upgrade passlib to a version that supports bcrypt 4.x (check if 1.7.5+ available)
2. Pin bcrypt to 3.2.2 in requirements.txt (downside: older, less secure)
3. Suppress the warning with `warnings.filterwarnings` in security.py
4. Switch from passlib to direct bcrypt usage (passlib is somewhat unmaintained)

**Status**: Open — cosmetic only, no functional impact. Will address in later cleanup phase.

---

### [ISSUE-003] — SQL echo very verbose (DEBUG=true)

**Priority**: 🟢 Low
**Component**: backend/app/core/database.py
**Date Found**: 2026-10-29
**Found By**: Agent B

**Description**: `engine = create_engine(..., echo=settings.DEBUG)` logs every SQL statement when `DEBUG=true` (which is the current sandbox .env value). This makes output very noisy during seed.py and API calls.

**Workaround**: Set `DEBUG=false` in backend/.env to silence SQL echo.

**Fix**: Consider using `echo=False` by default and enable via a separate `SQL_ECHO` env var, OR only echo when `LOG_LEVEL=DEBUG`. Minor improvement — not blocking.

**Status**: Open — cosmetic only

---

## ✅ Resolved Issues

| ID | Priority | Title | Component | Date Found | Date Resolved | Solution |
|---|---|---|---|---|---|---|
| - | - | - | - | - | - | - |

---

## 📈 Bug Statistics

| Metric | Value |
|---|---|
| Total bugs found | 3 |
| Open bugs | 3 |
| Critical open | 0 |
| Resolved bugs | 0 |
| Average resolution time | - |

---

**Last Updated**: 2026-10-29 22:58 (Asia/Jakarta) — Agent B: 3 issues logged (0 critical, 0 high)
