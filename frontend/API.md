# Python backend API contract

The React app expects a Python server (Flask or FastAPI) with **CORS enabled**.

## Run locally

```bash
pip install flask flask-cors pandas numpy scikit-learn textblob openpyxl
python api.py
```

Default URL: **http://localhost:5000**

Frontend dev (`npm run dev`) proxies all `/api/*` requests to that URL when `VITE_API_BASE` is empty.

## Endpoints

| Method | Path | Used by |
|--------|------|---------|
| `GET` | `/api/health` | App shell — `{ "records": number, ... }` |
| `GET` | `/api/stats` | Dashboard |
| `GET` | `/api/recommend?origin=CAI&destination=DXB` | Recommend |
| `GET` | `/api/search?q=...` | Search |
| `GET` | `/api/predict?origin=JED&dest=DXB&destination=DXB&days=30` | Predict (`days` ≥ 1) |
| `POST` | `/api/predict` | Optional — JSON body (see README) |
| `GET` | `/api/explore` or `/api/insights` | Explorer |
| `GET` | `/api/keywords` | Keywords — `{ "keywords": ["price", ...] }` |
| `POST` | `/api/sentiment` | Sentiment — `{ "text": "..." }` |

### Predict (days)

- `days` must be an integer **≥ 1** (days before departure).
- Frontend sends: `origin`, `dest`, `destination`, and `days`.

### Recommend response

```json
{
  "flights": [
    {
      "id": "1",
      "airline": "Saudi",
      "flightNumber": "SV123",
      "origin": "JED",
      "destination": "DXB",
      "price": 299,
      "departureTime": "08:00",
      "arrivalTime": "10:15"
    }
  ]
}
```

### Sentiment response

```json
{
  "sentiment": "positive",
  "positiveScore": 72,
  "negativeScore": 12
}
```

## Environment

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE` | Full API origin. Empty = same-origin `/api` (use with Vite proxy). |
| `VITE_API_PROXY` | Proxy target in dev (default `http://localhost:5000`). |
