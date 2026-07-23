export interface Point {
  date: string;
  value: number;
}

export interface CountrySeries {
  annual_inflation: Point[];
  gdp_per_worker: Point[];
  // FRED-only enrichment (present once FRED_API_KEY is configured in CI):
  headline_cpi_yoy?: Point[];
  core_cpi_yoy?: Point[];
  core_pce_yoy?: Point[];
  software_ppi?: Point[];
  info_employment?: Point[];
  it_investment?: Point[];
  real_median_earnings?: Point[];
}

export interface ObservatoryData {
  generated: string;
  fred_enriched: boolean;
  default_country: string;
  countries: string[];
  country_names: Record<string, string>;
  ai_events: { date: string; label: string }[];
  series: Record<string, CountrySeries>;
  sources: { name: string; id: string; url: string }[];
}

export async function fetchObservatory(): Promise<ObservatoryData> {
  const res = await fetch("/api/observatory");
  if (!res.ok) throw new Error(`Observatory data unavailable (${res.status})`);
  return res.json();
}

// Compute year-over-year % growth from an annual level series.
export function annualGrowth(points: Point[]): Point[] {
  const out: Point[] = [];
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1].value;
    if (prev) out.push({ date: points[i].date, value: Math.round(((points[i].value / prev - 1) * 100) * 100) / 100 });
  }
  return out;
}
