import { useState, useEffect } from "react";
import { apiUrl, useFetch } from "./utils.js";
import Dashboard from "./pages/Dashboard.jsx";
import Recommend from "./pages/Recommend.jsx";
import Search from "./pages/Search.jsx";
import Predict from "./pages/Predict.jsx";
import Explorer from "./pages/Explorer.jsx";
import Keywords from "./pages/Keywords.jsx";
import SentimentTester from "./pages/SentimentTester.jsx";
import { Spinner } from "./components/Ui.jsx";
import { Icons } from "./icons.jsx";

const PAGES = [
  { id: "dashboard", label: "Dashboard", desc: "Overview of flight data and analytics", icon: Icons.dashboard, component: Dashboard },
  { id: "recommend", label: "Recommend", desc: "Smart flight suggestions for your route", icon: Icons.recommend, component: Recommend },
  { id: "search", label: "Search", desc: "Search flights and passenger comments", icon: Icons.search, component: Search },
  { id: "predict", label: "Predict", desc: "AI-powered ticket price forecasts", icon: Icons.predict, component: Predict },
  { id: "explorer", label: "Explorer", desc: "Explore airline performance data", icon: Icons.explorer, component: Explorer },
  { id: "keywords", label: "Keywords", desc: "Most common words in reviews", icon: Icons.keywords, component: Keywords },
  { id: "sentiment", label: "Sentiment", desc: "Analyze comment text instantly", icon: Icons.sentiment, component: SentimentTester },
];

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { data: health, loading: healthLoading, error: healthError } = useFetch(apiUrl("/api/health"), []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
    else setSidebarOpen(true);
  }, [isMobile]);

  const current = PAGES.find((item) => item.id === page) || PAGES[0];
  const PageComponent = current.component;
  const collapsed = !sidebarOpen && !isMobile;

  const sidebarClass = [
    "sidebar",
    collapsed && "sidebar--collapsed",
    isMobile && !sidebarOpen && "sidebar--mobile-hidden",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="app-shell">
      <div className="app-bg" aria-hidden />
      {sidebarOpen && isMobile && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-hidden />
      )}

      <aside className={sidebarClass}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-mark">{Icons.plane}</div>
          {sidebarOpen && (
            <div className="sidebar-logo-text">
              Wafrly<span>AI</span>
            </div>
          )}
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {PAGES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-item${page === item.id ? " nav-item--active" : ""}`}
              onClick={() => {
                setPage(item.id);
                if (isMobile) setSidebarOpen(false);
              }}
              title={!sidebarOpen ? item.label : undefined}
            >
              <span className="nav-item-icon">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          {sidebarOpen && (
            <div className={`api-pill${healthError ? " api-pill--offline" : ""}`}>
              <span className="api-pill-dot" />
              <div>
                <div>{healthLoading ? "Connecting…" : healthError ? "API offline" : "API online"}</div>
                <div className="api-pill-meta">
                  {healthError
                    ? "Run: python api.py"
                    : health?.records != null
                      ? `${health.records.toLocaleString("en-US")} records`
                      : "—"}
                </div>
              </div>
              {healthLoading && <Spinner size={16} />}
            </div>
          )}
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button
            type="button"
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
          >
            {sidebarOpen ? Icons.chevron : Icons.menu}
          </button>
          <div className="topbar-badges">
            <span className="badge badge--live">Live</span>
            <span className="badge badge--sky">{current.label}</span>
          </div>
        </header>

        <div className="page-content" key={page}>
          <header className="page-hero">
            <p className="page-hero-eyebrow">Wafrly</p>
            <h1 className="page-hero-title">{current.label}</h1>
            <p className="page-hero-desc">{current.desc}</p>
          </header>

          {healthLoading && !health && !healthError ? (
            <div className="loading-center">
              <Spinner size={40} label="Loading data…" />
            </div>
          ) : (
            <PageComponent />
          )}
        </div>
      </main>
    </div>
  );
}
