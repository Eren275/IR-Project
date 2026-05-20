export const Spinner = ({ size = 28, label }) => (
  <div className="loading-center" style={{ "--spinner-size": `${size}px` }}>
    <div className="spinner" style={{ width: size, height: size }} />
    {label && <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>{label}</span>}
  </div>
);

export const StatCard = ({ title, value, icon, variant = "indigo", color, glow }) => (
  <article className={`card stat-card stat-card--${variant}`}>
    <div className="stat-card-icon" aria-hidden>
      {icon}
    </div>
    <div className="stat-card-body">
      <p className="stat-card-label">{title}</p>
      <p className="stat-card-value" style={color ? { color } : undefined}>{value}</p>
    </div>
  </article>
);

export const SectionTitle = ({ children, icon }) => (
  <h2 className="section-title">
    {icon && <span className="section-title-icon" aria-hidden>{icon}</span>}
    {children}
  </h2>
);

export const InsightRow = ({ label, value, trend }) => (
  <div className="insight-row">
    <span className="insight-label">{label}</span>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span className="insight-value">{value}</span>
      {trend !== undefined && (
        <span className={trend > 0 ? "trend-up" : "trend-down"}>
          {trend > 0 ? `↑ ${trend}%` : `↓ ${Math.abs(trend)}%`}
        </span>
      )}
    </div>
  </div>
);

const CHIP_VARIANTS = {
  accent: { bg: "var(--accent-soft)", border: "rgba(79, 70, 229, 0.25)", strong: "var(--accent)" },
  purple: { bg: "var(--purple-soft)", border: "rgba(124, 58, 237, 0.25)", strong: "var(--purple)" },
  sky: { bg: "var(--sky-soft)", border: "rgba(14, 165, 233, 0.25)", strong: "var(--sky)" },
  success: { bg: "var(--success-soft)", border: "rgba(5, 150, 105, 0.25)", strong: "var(--success)" },
  warning: { bg: "var(--warning-soft)", border: "rgba(217, 119, 6, 0.25)", strong: "var(--warning)" },
};

export const InsightChip = ({ label, value, variant = "accent" }) => {
  const v = CHIP_VARIANTS[variant] || CHIP_VARIANTS.accent;
  return (
    <span className="chip" style={{ background: v.bg, borderColor: v.border, color: "var(--text)" }}>
      {label} <strong style={{ color: v.strong }}>{value}</strong>
    </span>
  );
};

export const ErrorBox = ({ message, onRetry }) => (
  <div className="error-box" role="alert">
    <p className="error-box-title">Something went wrong</p>
    <p style={{ fontSize: "0.9rem", marginBottom: onRetry ? 16 : 0 }}>{message || "Could not load data."}</p>
    {onRetry && (
      <button type="button" className="btn btn-ghost" onClick={onRetry}>
        Try again
      </button>
    )}
  </div>
);

export const EmptyState = ({ icon = "✈️", title, description }) => (
  <div className="empty-state">
    <div className="empty-state-icon">{icon}</div>
    <p className="empty-state-title">{title}</p>
    {description && <p style={{ fontSize: "0.9rem", marginTop: 6 }}>{description}</p>}
  </div>
);

export const ScoreBar = ({ value, max = 100, label, color = "var(--accent)" }) => {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="score-bar-wrap">
      {label && (
        <div className="score-bar-label">
          <span>{label}</span>
          <span style={{ fontWeight: 600, color }}>{value}/{max}</span>
        </div>
      )}
      <div className="score-bar-track">
        <div className="score-bar-fill" style={{ width: `${percent}%`, "--bar-color": color }} />
      </div>
    </div>
  );
};

export const FormField = ({ label, type = "text", value, onChange, placeholder, options, rows, id }) => (
  <div className="form-field">
    {label && <label className="form-label" htmlFor={id}>{label}</label>}
    {type === "select" ? (
      <select id={id} className="form-select" value={value} onChange={onChange}>
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    ) : type === "textarea" ? (
      <textarea
        id={id}
        className="form-textarea"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows || 4}
      />
    ) : (
      <input
        id={id}
        className="form-input"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    )}
  </div>
);

export const SentimentBadge = ({ sentiment }) => {
  const config = {
    positive: { label: "Positive", color: "var(--success)", bg: "var(--success-soft)", icon: "😊" },
    negative: { label: "Negative", color: "var(--error)", bg: "var(--error-soft)", icon: "😠" },
    neutral: { label: "Neutral", color: "var(--warning)", bg: "var(--warning-soft)", icon: "😐" },
  };
  const { label, color, bg, icon } = config[sentiment?.toLowerCase()] || config.neutral;
  return (
    <span className="sentiment-badge" style={{ background: bg, color }}>
      {icon} {label}
    </span>
  );
};

export const FlightCard = ({ flight, onClick }) => {
  const tierColors = {
    Low: { bg: "var(--success-soft)", color: "var(--success)" },
    Medium: { bg: "var(--warning-soft)", color: "var(--warning)" },
    High: { bg: "var(--error-soft)", color: "var(--error)" }
  };
  const tierStyle = tierColors[flight.price_tier] || { bg: "var(--accent-soft)", color: "var(--accent)" };

  return (
    <article
      className="card flight-card"
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="flight-card-header">
        <div>
          <span className="flight-airline">{flight.airline || "Airline"}</span>
          <span className="flight-number">{flight.flightNumber}</span>
          {flight.cabin && (
            <span style={{ marginLeft: 8, fontSize: "0.75rem", padding: "2px 6px", borderRadius: 4, background: "rgba(0,0,0,0.05)", color: "var(--text-secondary)" }}>
              {flight.cabin}
            </span>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
          <span className="flight-price">${flight.price}</span>
          {flight.price_tier && (
            <span className="badge" style={{ background: tierStyle.bg, color: tierStyle.color, border: "1px solid rgba(0,0,0,0.05)", fontSize: "0.7rem", padding: "1px 6px" }}>
              {flight.price_tier} Tier
            </span>
          )}
        </div>
      </div>
      <div className="flight-route">
        <div className="flight-route-point">
          <p className="flight-route-code">{flight.origin || "—"}</p>
          <p className="flight-route-time">{flight.departureTime || "—"}</p>
        </div>
        <div className="flight-route-line">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
          </svg>
          <span>{flight.num_stops === 0 ? "Direct" : `${flight.num_stops} Stop${flight.num_stops > 1 ? "s" : ""}`}</span>
        </div>
        <div className="flight-route-point">
          <p className="flight-route-code">{flight.destination || "—"}</p>
          <p className="flight-route-time">{flight.arrivalTime || "—"}</p>
        </div>
      </div>
      {flight.best_provider_name && (
        <div className="flight-provider-deal" style={{ marginTop: 8, paddingTop: 8, borderTop: "1.5px dashed var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
          <span>🏷️ Best Deal: <strong style={{ color: "var(--text)" }}>{flight.best_provider_name}</strong></span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <strong style={{ color: "var(--success)", fontWeight: 700 }}>${flight.best_provider_price}</strong>
            {flight.savings_vs_best > 0 && (
              <span style={{ fontSize: "0.72rem", color: "var(--success)" }}>(Save ${flight.savings_vs_best}!)</span>
            )}
          </span>
        </div>
      )}
    </article>
  );
};

export const PageSkeleton = () => (
  <div className="stack">
    <div className="grid-stats stagger">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="skeleton skeleton-stat" />
      ))}
    </div>
    <div className="grid-2">
      <div className="skeleton" style={{ height: 280 }} />
      <div className="skeleton" style={{ height: 280 }} />
    </div>
  </div>
);
