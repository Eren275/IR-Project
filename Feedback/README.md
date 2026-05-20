# ✈️ Trippers — Setup Guide
CS313x Spring 2026 | Team: Trippers

## File structure

```
your-project/
├── api.py                          ← Flask REST API  (this file)
├── App.jsx                         ← React frontend  (this file)
├── flights_dataset_clean.xlsx      ← Your scraped & cleaned dataset
└── flights_phase2_enriched.xlsx    ← (optional, preferred if it exists)
```

---

## 1 — Start the Flask API

### Install dependencies (once)
```bash
pip install flask flask-cors pandas numpy scikit-learn textblob openpyxl
python -m textblob.download_corpora   # downloads punkt tokenizer
```

### Run
```bash
# Place api.py next to your dataset file, then:
python api.py
```
API starts at **http://localhost:5000**

### Dataset auto-detection order
`api.py` looks for these files in order:
1. `flights_dataset_clean.xlsx`   ← preferred (output of preprocessing_final.ipynb)
2. `flights_phase2_enriched.xlsx` ← also accepted (enriched Phase II output)
3. `flights_dataset.xlsx`         ← raw scraped data (features will be re-extracted)

---

## 2 — Run the React frontend

### Option A — Drop into existing React project
```bash
npx create-react-app trippers
cd trippers
# replace src/App.js with App.jsx content
npm start
```

### Option B — Vite (faster)
```bash
npm create vite@latest trippers -- --template react
cd trippers
npm install
# replace src/App.jsx with the provided App.jsx
npm run dev
```

The React app runs at **http://localhost:3000** (CRA) or **http://localhost:5173** (Vite).
CORS is enabled on the API so both ports work.

---

## 3 — API endpoints reference

| Method | Endpoint            | Description                                      |
|--------|---------------------|--------------------------------------------------|
| GET    | /api/health         | Server status + record count                     |
| GET    | /api/stats          | Full dataset statistics & distributions          |
| GET    | /api/insights       | Structured key insights (routes, airlines, etc.) |
| GET    | /api/recommend      | Ranked flight recommendations                    |
| GET    | /api/search?q=...   | TF-IDF free-text IR search                       |
| POST   | /api/predict        | Random Forest price prediction                   |
| GET    | /api/flights        | Paginated, filterable flight table               |
| GET    | /api/keywords       | Top TF-IDF keywords                              |
| POST   | /api/sentiment      | Sentiment analysis on arbitrary text             |

### Example requests
```bash
# Recommend flights
curl "http://localhost:5000/api/recommend?origin=CAI&destination=HRG&budget=300&cabin=Economy"

# Free-text search
curl "http://localhost:5000/api/search?q=nonstop+economy+EgyptAir"

# Price prediction
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"duration_min":90,"num_stops":0,"cabin":"Economy","is_weekend":0,"sentiment_score":7.5,"departure_hour":9}'

# Sentiment analysis
curl -X POST http://localhost:5000/api/sentiment \
  -H "Content-Type: application/json" \
  -d '{"text":"Excellent service on EgyptAir, very comfortable!"}'
```
