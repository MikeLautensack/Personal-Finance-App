type CategoryItem = {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  amount: number;
  percentage: number;
};

type CategoryBreakdownProps = {
  categories: CategoryItem[];
  total: number;
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function CategoryBreakdown({
  categories,
  total,
}: CategoryBreakdownProps) {
  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm text-zinc-500">No expense data for this period</p>
      </div>
    );
  }

  // Build SVG donut
  const size = 160;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativeOffset = 0;
  const segments = categories.map((cat) => {
    const dashLength = (cat.percentage / 100) * circumference;
    const offset = cumulativeOffset;
    cumulativeOffset += dashLength;
    return {
      ...cat,
      dashLength,
      dashOffset: circumference - offset,
    };
  });

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
      {/* Donut chart */}
      <div className="relative flex-shrink-0">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
        >
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-zinc-100 dark:text-zinc-800"
          />
          {/* Data segments */}
          {segments.map((seg) => (
            <circle
              key={seg.id}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color || "#71717a"}
              strokeWidth={strokeWidth}
              strokeDasharray={`${seg.dashLength} ${circumference - seg.dashLength}`}
              strokeDashoffset={seg.dashOffset}
              strokeLinecap="butt"
            />
          ))}
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Total
          </span>
          <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex-1 space-y-2">
        {categories.slice(0, 8).map((cat) => (
          <div key={cat.id} className="flex items-center gap-2">
            <div
              className="h-3 w-3 flex-shrink-0 rounded-full"
              style={{ backgroundColor: cat.color || "#71717a" }}
            />
            <span className="flex-1 truncate text-sm text-zinc-700 dark:text-zinc-300">
              {cat.icon ? `${cat.icon} ` : ""}
              {cat.name}
            </span>
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {formatCurrency(cat.amount)}
            </span>
            <span className="w-10 text-right text-xs text-zinc-500">
              {cat.percentage.toFixed(0)}%
            </span>
          </div>
        ))}
        {categories.length > 8 && (
          <p className="text-xs text-zinc-500">
            +{categories.length - 8} more categories
          </p>
        )}
      </div>
    </div>
  );
}
