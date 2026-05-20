import { useState } from "react";
import { useFetch, apiUrl } from "../utils";
import { Spinner, FlightCard, FormField, ErrorBox, EmptyState } from "../components/Ui";

export default function Recommend() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const from = origin.trim().toUpperCase();
  const to = destination.trim().toUpperCase();

  const url =
    submitted && from && to
      ? apiUrl(
          `/api/recommend?origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}&dest=${encodeURIComponent(to)}`
        )
      : null;

  const { data, loading, error } = useFetch(url, [submitted, origin, destination]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (origin.trim() && destination.trim()) setSubmitted(true);
  };

  return (
    <div className="stack">
      <form className="form-panel form-panel--sky" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField
            label="From (airport)"
            value={origin}
            onChange={(e) => setOrigin(e.target.value.toUpperCase())}
            placeholder="e.g. JED"
          />
          <FormField
            label="To (airport)"
            value={destination}
            onChange={(e) => setDestination(e.target.value.toUpperCase())}
            placeholder="e.g. DXB"
          />
          <button type="submit" className="btn btn-primary">
            Find flights
          </button>
        </div>
      </form>

      {loading && <Spinner label="Searching for the best flights…" />}
      {error && <ErrorBox message={error} />}
      {!loading && submitted && data?.flights?.length === 0 && (
        <EmptyState
          icon="🔎"
          title="No flights found"
          description="Try different airports or check your IATA codes."
        />
      )}

      <div className="stack" style={{ gap: 14 }}>
        {data?.flights?.map((flight) => (
          <FlightCard key={flight.id || `${flight.flightNumber}-${flight.origin}`} flight={flight} />
        ))}
      </div>
    </div>
  );
}
