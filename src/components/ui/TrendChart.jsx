"use client";

export default function TrendChart({
  data = [],
  title,
  subtitle,
  accent = "from-amber-400 to-orange-500",
}) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);
  const width = 320;
  const height = 150;
  const padding = 20;
  const points = data.map((item, index) => {
    const x =
      padding + (index * (width - padding * 2)) / Math.max(data.length - 1, 1);
    const y =
      height - padding - (item.value / maxValue) * (height - padding * 2);
    return { x, y, label: item.label, value: item.value };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
      : "";

  return (
    <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
          {title}
        </p>
        {subtitle ? (
          <p className="text-base font-bold text-gray-900 dark:text-white">
            {subtitle}
          </p>
        ) : null}
      </div>

      {data.length === 0 ? (
        <div className="mt-6 grid place-items-center rounded-3xl border border-dashed border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-10 text-sm text-gray-500 dark:text-gray-400">
          No trend data available.
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-3xl bg-slate-950/5 dark:bg-white/5 p-4">
          <svg viewBox={`0 0 ${width} ${height}`} className="h-44 w-full">
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#fb923c" />
              </linearGradient>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#fb923c" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g opacity="0.25">
              {[1, 2, 3].map((row) => (
                <line
                  key={row}
                  x1={padding}
                  y1={padding + row * ((height - padding * 2) / 4)}
                  x2={width - padding}
                  y2={padding + row * ((height - padding * 2) / 4)}
                  stroke="#a1a1aa"
                  strokeWidth="1"
                />
              ))}
            </g>
            <path d={areaPath} fill="url(#areaGradient)" />
            <path
              d={linePath}
              fill="none"
              stroke="url(#trendGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {points.map((point, index) => (
              <g key={index}>
                <circle cx={point.x} cy={point.y} r="4" fill="#f59e0b" />
                <text
                  x={point.x}
                  y={point.y - 10}
                  textAnchor="middle"
                  className="text-[11px] font-semibold"
                  fill="#111827"
                >
                  {point.value}
                </text>
              </g>
            ))}
          </svg>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-500 dark:text-gray-400">
            {points.map((point) => (
              <div
                key={point.label}
                className="flex items-center justify-between rounded-2xl bg-white/80 dark:bg-slate-950/80 px-3 py-2"
              >
                <span>{point.label}</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {point.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
