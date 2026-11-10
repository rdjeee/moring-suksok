# Tests Folder Structure

Backend tests menggunakan pytest dengan struktur:

```
backend/tests/
├── __init__.py
├── conftest.py                  ← Shared fixtures (test client, db session, mock data)
├── unit/                        ← Unit tests (services, utils, validators)
│   ├── __init__.py
│   ├── test_qris_service.py     ← Test QRIS generation (CRC16, payload inject)
│   ├── test_security.py         ← Test JWT, password hashing
│   ├── test_wa_service.py       ← Test WhatsApp deep link URL generation
│   └── test_validators.py       ← Test Pydantic schemas (input validation)
├── integration/                 ← Integration tests (endpoint + database)
│   ├── __init__.py
│   ├── test_auth.py             ← Test register, login, logout endpoints
│   ├── test_products.py         ← Test CRUD produk + variants
│   ├── test_cart.py             ← Test cart operations
│   ├── test_orders.py           ← Test checkout flow
│   ├── test_payments.py         ← Test QRIS gen + upload bukti + verifikasi
│   └── test_reports.py          ← Test laporan transaksi + export
├── e2e/                         ← End-to-End tests (full flow)
│   ├── __init__.py
│   └── test_checkout_flow.py    ← Customer register → cart → checkout → bayar → verify
└── fixtures/                    ← Test data fixtures (JSON, images, dll)
    └── sample_proof.jpg         ← Sample bukti pembayaran untuk upload test
```

## Run Tests

```bash
# Run all tests
make test-backend

# Atau langsung
cd backend && pytest

# Run only unit tests
cd backend && pytest tests/unit/ -v

# Run only integration tests
cd backend && pytest tests/integration/ -v

# Run specific test file
cd backend && pytest tests/integration/test_auth.py -v

# Run dengan coverage report
cd backend && pytest --cov=app --cov-report=term-missing
```

## Test Coverage Target

Sesuai `specs/03-features.json`:
- Critical modules (auth, payments, orders): ≥80%
- Other modules: ≥60%

## Test Database

Integration tests menggunakan database terpisah (`moring_suksok_test`) yang auto-create & teardown per test session. Lihat `conftest.py` untuk setup.

## Mocking External Services

- Cloudinary: mock upload, return fake URL
- FCM: mock send_push_notification, return success
- WhatsApp: tidak perlu mock (deep link URL saja, no API call)
