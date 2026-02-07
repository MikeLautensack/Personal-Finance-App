type MonthData = {
  label: string;
  income: number;
  expenses: number;
};

type MonthlyTrendsChartProps = {
  data: MonthData[];
};

function formatCompact(amount: number): string {
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}k`;
  }
  return `$${amount.toFixed(0)}`;
}

export function MonthlyTrendsChart({ data }: MonthlyTrendsChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-zinc-500">No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(
    ...data.map((d) => Math.max(d.income, d.expenses)),
    1
  );

  // SVG dimensions
  const width = 500;
  const height = 200;
  const padding = { top: 10, right: 10, bottom: 30, left: 50 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const barGroupWidth = chartW / data.length;
  const barWidth = barGroupWidth * 0.3;
  const gap = barGroupWidth * 0.05;

  // Y-axis ticks
  const tickCount = 4;
  const yTicks = Array.from({ length: tickCount + 1 }, (_, i) =>
    Math.round((maxValue / tickCount) * i)
  );

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Grid lines */}
      {yTicks.map((tick) => {
        const y = padding.top + chartH - (tick / maxValue) * chartH;
        return (
          <g key={tick}>
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

      {/* Bars */}
      {data.map((d, i) => {
        const groupX = padding.left + i * barGroupWidth + barGroupWidth * 0.15;
        const incomeHeight = (d.income / maxValue) * chartH;
        const expenseHeight = (d.expenses / maxValue) * chartH;

        return (
          <g key={i}>
            {/* Income bar */}
            <rect
              x={groupX}
              y={padding.top + chartH - incomeHeight}
              width={barWidth}
              height={incomeHeight}
              rx={3}
              className="fill-green-400"
            />
            {/* Expense bar */}
            <rect
              x={groupX + barWidth + gap}
              y={padding.top + chartH - expenseHeight}
              width={barWidth}
              height={expenseHeight}
              rx={3}
              className="fill-red-400"
            />
            {/* Month label */}
            <text
              x={groupX + barWidth + gap / 2}
              y={height - 8}
              textAnchor="middle"
              className="fill-zinc-500 text-[10px]"
            >
              {d.label}
            </text>
          </g>
        );
      })}

      {/* Legend */}
      <circle cx={padding.left + 4} cy={height - 6} r={4} className="fill-green-400" />
      <text
        x={padding.left + 12}
        y={height - 3}
        className="fill-zinc-500 text-[9px]"
      >
        Income
      </text>
      <circle cx={padding.left + 54} cy={height - 6} r={4} className="fill-red-400" />
      <text
        x={padding.left + 62}
        y={height - 3}
        className="fill-zinc-500 text-[9px]"
      >
        Expenses
      </text>
    </svg>
  );
}
