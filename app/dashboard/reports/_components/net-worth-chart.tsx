type NetWorthPoint = {
  label: string;
  value: number;
};

type NetWorthChartProps = {
  data: NetWorthPoint[];
  currentNetWorth: number;
};

function formatCompact(amount: number): string {
  if (Math.abs(amount) >= 1000) {
    return `$${(amount / 1000).toFixed(1)}k`;
  }
  return `$${amount.toFixed(0)}`;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function NetWorthChart({ data, currentNetWorth }: NetWorthChartProps) {
  if (data.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          {formatCurrency(currentNetWorth)}
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          Current net worth — need more months of data for trends
        </p>
      </div>
    );
  }

  // SVG dimensions
  const width = 500;
  const height = 200;
  const padding = { top: 15, right: 10, bottom: 30, left: 55 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;
  // Add 10% vertical padding
  const yMin = minVal - range * 0.1;
  const yMax = maxVal + range * 0.1;
  const yRange = yMax - yMin;

  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartW;
    const y = padding.top + chartH - ((d.value - yMin) / yRange) * chartH;
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  // Area path (close to bottom)
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

  // Y-axis ticks
  const tickCount = 4;
  const yTicks = Array.from({ length: tickCount + 1 }, (_, i) =>
    yMin + (yRange / tickCount) * i
  );

  const isPositiveTrend = data[data.length - 1].value >= data[0].value;

  return (
    <div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor={isPositiveTrend ? "#22c55e" : "#ef4444"}
              stopOpacity={0.3}
            />
            <stop
              offset="100%"
              stopColor={isPositiveTrend ? "#22c55e" : "#ef4444"}
              stopOpacity={0.02}
            />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yTicks.map((tick, i) => {
          const y = padding.top + chartH - ((tick - yMin) / yRange) * chartH;
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="currentColor"
                strokeWidth={0.5}
                className="text-zinc-200 dark:text-zinc-700"
              />
              <text
                x={padding.left - 6}
                y={y + 3}
                textAnchor="end"
                className="fill-zinc-400 text-[9px]"
              >
                {formatCompact(tick)}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill="url(#netWorthGradient)" />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke={isPositiveTrend ? "#22c55e" : "#ef4444"}
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={3}
            fill="white"
            stroke={isPositiveTrend ? "#22c55e" : "#ef4444"}
            strokeWidth={2}
          />
        ))}

        {/* X-axis labels */}
        {points.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={height - 8}
            textAnchor="middle"
            className="fill-zinc-500 text-[10px]"
          >
            {p.label}
          </text>
        ))}
      </svg>

      {/* Summary below chart */}
      <div className="mt-3 flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-2 dark:bg-zinc-800/50">
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          Current Net Worth
        </span>
        <span
          className={`text-lg font-bold ${
            currentNetWorth >= 0
              ? "text-zinc-900 dark:text-zinc-50"
              : "text-red-600"
          }`}
        >
          {formatCurrency(currentNetWorth)}
        </span>
      </div>
    </div>
  );
}
