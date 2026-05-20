import { useFetch, apiUrl } from "../utils";
import { StatCard, SectionTitle, InsightRow, ErrorBox, ScoreBar, PageSkeleton } from "../components/Ui";

const STAT_ICONS = {
  flights: "✈️",
  price: "💰",
  sentiment: "📈",
  dest: "🌍",
};

export default function Dashboard() {
  const { data: stats, loading, error, refetch } = useFetch(apiUrl("/api/stats"), []);

  if (loading) return <PageSkeleton />;
  if (error) return <ErrorBox message={error} onRetry={refetch} />;

  const s = stats || {
    totalFlights: 0,
    avgPrice: 0,
    positiveRatio: 0,
    topDestination: "—",
    lowSeason: "—",
    peakSeason: "—",
    bookingWindow: "—",
    satisfaction: 0,
    busiestRoute: "—",
    avgDelay: 0,
    priceTrend: 0,
  };

  return (
    <div className="stack">
      <div className="grid-stats stagger">
        <StatCard
          title="Total flights"
          value={s.totalFlights?.toLocaleString("en-US") ?? s.totalFlights}
          icon={STAT_ICONS.flights}
          variant="indigo"
        />
        <StatCard
          title="Average price"
          value={`$${s.avgPrice}`}
          icon={STAT_ICONS.price}
          variant="violet"
        />
        <StatCard
          title="Positive sentiment"
          value={`${s.positiveRatio}%`}
          icon={STAT_ICONS.sentiment}
          variant="mint"
        />
        <StatCard
          title="Top destination"
          value={s.topDestination}
          icon={STAT_ICONS.dest}
          variant="coral"
        />
      </div>

      <div className="grid-2 stagger">
        <div className="card card--sky">
          <SectionTitle icon="📈">Seasonal trends</SectionTitle>
          <InsightRow label="Peak season" value={s.peakSeason} trend={18} />
          <InsightRow label="Low season" value={s.lowSeason} trend={-9} />
          <InsightRow label="Best booking window" value={s.bookingWindow} trend={6} />
          <ScoreBar value={s.satisfaction} label="Customer satisfaction" color="var(--accent)" />
        </div>

        <div className="card card--violet">
          <SectionTitle icon="🎯">AI flight insights</SectionTitle>
          <InsightRow label="Busiest route" value={s.busiestRoute} trend={12} />
          <InsightRow label="Average delay" value={`${s.avgDelay} min`} trend={-3} />
          <div className="highlight-box">
            <p className="highlight-box-title">Next month forecast</p>
            <p>
              Prices expected to rise by{" "}
              <strong style={{ color: "var(--error)" }}>+{s.priceTrend}%</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
