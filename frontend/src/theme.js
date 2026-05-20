/** Design tokens — mirrors CSS variables in index.css */
export const C = {
  bg: "var(--bg)",
  surface: "var(--surface-solid)",
  surfaceGlass: "var(--surface)",
  text: "var(--text)",
  textSub: "var(--text-secondary)",
  textMuted: "var(--text-muted)",
  accent: "var(--accent)",
  accentSoft: "var(--accent-soft)",
  sky: "var(--sky)",
  purple: "var(--purple)",
  border: "var(--border)",
  error: "var(--error)",
  success: "var(--success)",
  warning: "var(--warning)",
};

export const S = {
  badge: (variant = "accent") => {
    const map = {
      accent: "badge badge--accent",
      sky: "badge badge--sky",
      live: "badge badge--live",
    };
    return map[variant] || map.accent;
  },
};
