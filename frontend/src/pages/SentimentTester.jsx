import { useState } from "react";
import { api } from "../utils";
import { Spinner, FormField, SentimentBadge, InsightRow, ErrorBox } from "../components/Ui";

export default function SentimentTester() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      setResult(await api.sentiment(text.trim()));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stack">
      <div className="form-panel form-panel--mint">
        <FormField
          type="textarea"
          label="Comment text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Great flight but the service was slow…"
          rows={5}
        />
        <button type="button" className="btn btn-primary" onClick={analyze} disabled={loading || !text.trim()}>
          {loading ? "Analyzing…" : "Analyze sentiment"}
        </button>
      </div>

      {loading && <Spinner label="Analyzing text…" />}
      {error && <ErrorBox message={error} />}

      {result && (
        <div className="card card--rose">
          <InsightRow label="Overall sentiment" value={<SentimentBadge sentiment={result.sentiment} />} />
          <InsightRow label="Positive score" value={`${result.positiveScore}%`} />
          <InsightRow label="Negative score" value={`${result.negativeScore}%`} />
        </div>
      )}
    </div>
  );
}
