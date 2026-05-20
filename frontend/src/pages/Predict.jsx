import { useState } from "react";
import { FormField, ErrorBox, Spinner, SentimentBadge } from "../components/Ui";
import { api, parseDaysAhead } from "../utils";

export default function Predict() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [daysInput, setDaysInput] = useState("30");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldError, setFieldError] = useState(null);

  const handlePredict = async (e) => {
    e.preventDefault();
    setFieldError(null);
    setError(null);

    if (!origin.trim() || !destination.trim()) {
      setFieldError("Enter both origin and destination airport codes.");
      return;
    }

    const days = parseDaysAhead(daysInput);
    if (!days.valid) {
      setFieldError(days.message);
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await api.predictByRoute(origin.trim(), destination.trim(), days.days);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stack">
      <form className="form-panel form-panel--violet" onSubmit={handlePredict}>
        <div className="form-grid">
          <FormField
            label="From"
            value={origin}
            onChange={(e) => setOrigin(e.target.value.toUpperCase())}
            placeholder="JED"
          />
          <FormField
            label="To"
            value={destination}
            onChange={(e) => setDestination(e.target.value.toUpperCase())}
            placeholder="DXB"
          />
          <div className="form-field">
            <label className="form-label" htmlFor="days-ahead">
              Days until departure
            </label>
            <input
              id="days-ahead"
              className="form-input"
              type="number"
              min={1}
              step={1}
              value={daysInput}
              onChange={(e) => setDaysInput(e.target.value)}
              placeholder="30"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Predicting…" : "Predict price"}
          </button>
        </div>
        {fieldError && (
          <p className="form-hint form-hint--warn" style={{ marginTop: 16 }} role="alert">
            {fieldError}
          </p>
        )}
      </form>

      {loading && <Spinner label="Analyzing prices…" />}
      {error && <ErrorBox message={error} />}

      {result && (
        <div className="predict-hero" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 8 }}>
            Estimated price
          </p>
          <p className="predict-price">
            ${result.predictedPrice ?? result.price ?? "—"}
          </p>
          {(result.lowerBound != null || result.upperBound != null) && (
            <p className="predict-range" style={{ marginBottom: 16 }}>
              Range: ${result.lowerBound ?? "—"} – ${result.upperBound ?? "—"}
            </p>
          )}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            {result.price_tier && (
              <span className="badge" style={{
                background: result.price_tier === "Low" ? "var(--success-soft)" : (result.price_tier === "Medium" ? "var(--warning-soft)" : "var(--error-soft)"),
                color: result.price_tier === "Low" ? "var(--success)" : (result.price_tier === "Medium" ? "var(--warning)" : "var(--error)"),
                border: "1px solid rgba(0,0,0,0.05)",
                fontSize: "0.78rem",
                padding: "3px 10px"
              }}>
                📊 {result.price_tier} Tier
              </span>
            )}
            <SentimentBadge sentiment={result.sentiment} />
          </div>
        </div>
      )}
    </div>
  );
}
