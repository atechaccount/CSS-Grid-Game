import type { ItemType } from "../types";

const palette: Record<ItemType, { fill: string; ink: string }> = {
  crate: { fill: "#c9a45c", ink: "#3a2a12" },
  airship: { fill: "#c45c4a", ink: "#2a1210" },
  crane: { fill: "#6a8ea0", ink: "#102028" },
  hangar: { fill: "#4d7a62", ink: "#102018" },
  beacon: { fill: "#d4a03c", ink: "#2a1c08" },
  balloon: { fill: "#c4734a", ink: "#2a160e" },
  barrel: { fill: "#8b5a3c", ink: "#1e120c" },
  platform: { fill: "#5c7a8a", ink: "#101820" },
  engine: { fill: "#4a5563", ink: "#0e1218" },
  tank: { fill: "#3d6b78", ink: "#0c181c" },
  winch: { fill: "#9a7b4f", ink: "#1c140a" },
  net: { fill: "#5a7d6b", ink: "#101c16" },
  flagship: { fill: "#8b3a3a", ink: "#1a0c0c" },
  sail: { fill: "#d9cbb0", ink: "#2a2418" },
  crew: { fill: "#c4b49a", ink: "#241c14" },
};

function Glyph({ type }: { type: ItemType }) {
  const stroke = "rgba(255,255,255,0.9)";
  const common = {
    fill: "none",
    stroke,
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (type) {
    case "crate":
      return (
        <svg viewBox="0 0 32 32" aria-hidden>
          <rect x="6" y="8" width="20" height="16" rx="1.5" {...common} />
          <path d="M6 16h20M16 8v16M10 8l12 16M22 8L10 24" {...common} />
        </svg>
      );
    case "airship":
      return (
        <svg viewBox="0 0 32 32" aria-hidden>
          <ellipse cx="16" cy="14" rx="12" ry="6" {...common} />
          <path d="M10 20h12l-1 4H11zM16 8v-2" {...common} />
        </svg>
      );
    case "crane":
      return (
        <svg viewBox="0 0 32 32" aria-hidden>
          <path d="M8 26V10h4l10 8v8M8 14h14M20 18v6" {...common} />
        </svg>
      );
    case "hangar":
      return (
        <svg viewBox="0 0 32 32" aria-hidden>
          <path d="M5 24V14l11-8 11 8v10H5z" {...common} />
          <path d="M12 24v-6h8v6" {...common} />
        </svg>
      );
    case "beacon":
      return (
        <svg viewBox="0 0 32 32" aria-hidden>
          <path d="M16 6v4M16 22v4M8 16H4M28 16h-4M8.5 8.5l2.5 2.5M23.5 8.5 21 11M8.5 23.5 11 21M23.5 23.5 21 21" {...common} />
          <circle cx="16" cy="16" r="4" {...common} />
        </svg>
      );
    case "balloon":
      return (
        <svg viewBox="0 0 32 32" aria-hidden>
          <ellipse cx="16" cy="13" rx="7" ry="9" {...common} />
          <path d="M16 22v2l-3 4h6l-3-4" {...common} />
        </svg>
      );
    case "barrel":
      return (
        <svg viewBox="0 0 32 32" aria-hidden>
          <path d="M10 8h12s2 4 2 8-2 8-2 8H10s-2-4-2-8 2-8 2-8z" {...common} />
          <path d="M8 16h16M10 11h12M10 21h12" {...common} />
        </svg>
      );
    case "platform":
      return (
        <svg viewBox="0 0 32 32" aria-hidden>
          <path d="M4 20h24M6 20v4M26 20v4M8 16h16v4H8z" {...common} />
        </svg>
      );
    case "engine":
      return (
        <svg viewBox="0 0 32 32" aria-hidden>
          <rect x="8" y="10" width="16" height="12" rx="2" {...common} />
          <circle cx="16" cy="16" r="3" {...common} />
          <path d="M16 7v3M16 22v3M7 16h3M22 16h3" {...common} />
        </svg>
      );
    case "tank":
      return (
        <svg viewBox="0 0 32 32" aria-hidden>
          <rect x="7" y="9" width="18" height="14" rx="7" {...common} />
          <path d="M16 9V6h4" {...common} />
        </svg>
      );
    case "winch":
      return (
        <svg viewBox="0 0 32 32" aria-hidden>
          <circle cx="16" cy="15" r="6" {...common} />
          <path d="M16 9v12M10 15h12M16 21v5h6" {...common} />
        </svg>
      );
    case "net":
      return (
        <svg viewBox="0 0 32 32" aria-hidden>
          <rect x="7" y="8" width="18" height="16" {...common} />
          <path d="M7 16h18M16 8v16M10 8l12 16M22 8 10 24" {...common} />
        </svg>
      );
    case "flagship":
      return (
        <svg viewBox="0 0 32 32" aria-hidden>
          <ellipse cx="16" cy="15" rx="13" ry="7" {...common} />
          <path d="M9 22h14l-2 4H11zM16 8V5M18 5h6l-2 3h-4" {...common} />
        </svg>
      );
    case "sail":
      return (
        <svg viewBox="0 0 32 32" aria-hidden>
          <path d="M10 26V8l14 10H10" {...common} />
        </svg>
      );
    case "crew":
      return (
        <svg viewBox="0 0 32 32" aria-hidden>
          <circle cx="16" cy="12" r="4" {...common} />
          <path d="M8 26c1-6 5-8 8-8s7 2 8 8" {...common} />
        </svg>
      );
  }
}

export function DockItem({
  type,
  label,
  className,
  id,
  showLabel,
}: {
  type: ItemType;
  label: string;
  className: string;
  id: string;
  showLabel: boolean;
}) {
  const color = palette[type];
  return (
    <div
      data-unit={id}
      className={`unit unit-${type} ${className}`}
      style={{ ["--unit-fill" as string]: color.fill, ["--unit-ink" as string]: color.ink }}
    >
      <div className="unit-face">
        <span className="unit-glyph">
          <Glyph type={type} />
        </span>
        {showLabel ? (
          <span className="unit-label" title={label}>
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}
