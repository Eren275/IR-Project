import { useState } from "react";
import { useFetch, apiUrl } from "../utils";
import { Spinner, FormField, ErrorBox, SentimentBadge, ScoreBar, EmptyState, FlightCard } from "../components/Ui";

export default function Search() {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data, loading, error } = useFetch(
    searchTerm ? apiUrl(`/api/search?q=${encodeURIComponent(searchTerm)}`) : null,
    [searchTerm]
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) setSearchTerm(query.trim());
  };

  return (
    <div className="stack">
      <form className="form-panel" onSubmit={handleSearch}>
        <div className="form-grid">
          <FormField
            label="Search query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Flight number, airline, city, cabin, time of day…"
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </div>
      </form>

      {loading && <Spinner label="Searching…" />}
      {error && <ErrorBox message={error} />}

      {data && !loading && (
        <div className="grid-2">
          <div className="card card--sky result-block" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <h3 className="result-block-title">Flight results</h3>
            {data.flights?.length ? (
              <div className="stack" style={{ gap: 12 }}>
                {data.flights.map((f) => (
                  <FlightCard key={f.id} flight={f} />
                ))}
              </div>
            ) : (
              <EmptyState icon="✈️" title="No flights" description="Try a different search term." />
            )}
          </div>

          <div className="card card--violet result-block">
            <h3 className="result-block-title">Sentiment analysis</h3>
            <div style={{ marginBottom: 20 }}>
              <SentimentBadge sentiment={data.sentiment?.overall || "neutral"} />
            </div>
            <ScoreBar
              value={data.sentiment?.positivePercent || 65}
              label="Positive share"
              color="var(--success)"
            />
          </div>
        </div>
      )}
    </div>
  );
}
