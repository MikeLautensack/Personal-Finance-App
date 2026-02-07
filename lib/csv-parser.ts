// Chase CSV parser for importing bank transactions
// Supports both Chase Credit Card and Chase Checking/Savings CSV formats

export type ChaseCSVRow = {
  date: string; // YYYY-MM-DD
  description: string;
  amount: number; // Positive = income/credit, Negative = expense/debit
  type: "expense" | "income";
  chase_category?: string;
  post_date?: string;
};

export type CSVParseResult = {
  rows: ChaseCSVRow[];
  format: "chase_credit" | "chase_checking" | "unknown";
  errors: string[];
};

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

function parseDate(dateStr: string): string {
  // Handle MM/DD/YYYY format from Chase
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const [month, day, year] = parts;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  // Already in YYYY-MM-DD or other format
  return dateStr;
}

function detectFormat(
  headers: string[]
): "chase_credit" | "chase_checking" | "unknown" {
  const normalized = headers.map((h) => h.toLowerCase().replace(/\s+/g, "_"));

  // Chase Credit Card: Transaction Date, Post Date, Description, Category, Type, Amount
  if (
    normalized.includes("transaction_date") &&
    normalized.includes("category")
  ) {
    return "chase_credit";
  }

  // Chase Checking/Savings: Details, Posting Date, Description, Amount, Type, Balance, Check or Slip #
  if (
    normalized.includes("details") &&
    normalized.includes("posting_date") &&
    normalized.includes("balance")
  ) {
    return "chase_checking";
  }

  return "unknown";
}

function parseCreditCardRow(fields: string[], headers: string[]): ChaseCSVRow {
  const headerMap = new Map(
    headers.map((h, i) => [h.toLowerCase().replace(/\s+/g, "_"), i])
  );

  const rawAmount = parseFloat(
    fields[headerMap.get("amount") ?? -1] || "0"
  );
  // Chase credit: negative = purchase/expense, positive = payment/credit
  const isExpense = rawAmount < 0;

  return {
    date: parseDate(fields[headerMap.get("transaction_date") ?? 0] || ""),
    post_date: parseDate(fields[headerMap.get("post_date") ?? 1] || ""),
    description: fields[headerMap.get("description") ?? 2] || "",
    chase_category: fields[headerMap.get("category") ?? 3] || "",
    amount: Math.abs(rawAmount),
    type: isExpense ? "expense" : "income",
  };
}

function parseCheckingRow(fields: string[], headers: string[]): ChaseCSVRow {
  const headerMap = new Map(
    headers.map((h, i) => [h.toLowerCase().replace(/\s+/g, "_"), i])
  );

  const rawAmount = parseFloat(
    fields[headerMap.get("amount") ?? -1] || "0"
  );
  // Chase checking: negative = debit/expense, positive = credit/income
  const isExpense = rawAmount < 0;

  return {
    date: parseDate(fields[headerMap.get("posting_date") ?? 1] || ""),
    description: fields[headerMap.get("description") ?? 2] || "",
    amount: Math.abs(rawAmount),
    type: isExpense ? "expense" : "income",
  };
}

export function parseChaseCSV(csvContent: string): CSVParseResult {
  const errors: string[] = [];
  const lines = csvContent
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) {
    return { rows: [], format: "unknown", errors: ["CSV file is empty or has no data rows"] };
  }

  const headers = parseCSVLine(lines[0]);
  const format = detectFormat(headers);

  if (format === "unknown") {
    return {
      rows: [],
      format: "unknown",
      errors: [
        `Unrecognized CSV format. Found headers: ${headers.join(", ")}. Expected Chase Credit Card or Chase Checking/Savings format.`,
      ],
    };
  }

  const rows: ChaseCSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    try {
      const fields = parseCSVLine(lines[i]);

      if (fields.length < 3) {
        errors.push(`Row ${i + 1}: Not enough fields, skipping`);
        continue;
      }

      const row =
        format === "chase_credit"
          ? parseCreditCardRow(fields, headers)
          : parseCheckingRow(fields, headers);

      if (!row.date || row.date === "NaN-NaN-NaN") {
        errors.push(`Row ${i + 1}: Invalid date, skipping`);
        continue;
      }

      if (isNaN(row.amount) || row.amount === 0) {
        errors.push(`Row ${i + 1}: Invalid amount, skipping`);
        continue;
      }

      rows.push(row);
    } catch (e) {
      errors.push(`Row ${i + 1}: Failed to parse`);
    }
  }

  return { rows, format, errors };
}
