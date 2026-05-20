import { useState } from "react";
import { useFetch, apiUrl } from "../utils";
import { FormField, ScoreBar, SentimentBadge, ErrorBox, PageSkeleton } from "../components/Ui";

export default function Explorer() {
  const [airline, setAirline] = useState("");
  const url = airline ? apiUrl(`/api/explore?airline=${encodeURIComponent(airline)}`) : apiUrl("/api/explore");
  const { data, loading, error } = useFetch(url, [airline]);

  return (
    <div className="stack">
      <div className="form-panel form-panel--sky" style={{ padding: "20px 24px" }}>
        <FormField
          label="Filter by airline"
          value={airline}
          onChange={(e) => setAirline(e.target.value)}
          placeholder="e.g. Saudi Arabian Airlines"
        />
      </div>

      {loading && <PageSkeleton />}
      {error && <ErrorBox message={error} />}

      {data && !loading && (
        <div className="grid-2 stagger">
          <div className="card">
            <h3 className="result-block-title">Overview</h3>
            <div className="insight-row">
              <span className="insight-label">Total flights</span>
              <span className="insight-value">{data.totalFlights?.toLocaleString("en-US")}</span>
            </div>
            <div className="insight-row">
              <span className="insight-label">Average price</span>
              <span className="insight-value" style={{ color: "var(--accent)" }}>
                ${data.avgPrice}
              </span>
            </div>
            <ScoreBar value={data.satisfaction || 78} label="Customer satisfaction" />
          </div>

          <div className="card">
            <h3 className="result-block-title">Sentiment breakdown</h3>
            <div style={{ marginTop: 8 }}>
              <SentimentBadge sentiment={data.sentiment || "positive"} />
            </div>
            {data.breakdown && (
              <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
                <ScoreBar value={data.breakdown.positive || 0} label="Positive" color="var(--success)" />
                <ScoreBar value={data.breakdown.neutral || 0} label="Neutral" color="var(--warning)" />
                <ScoreBar value={data.breakdown.negative || 0} label="Negative" color="var(--error)" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
