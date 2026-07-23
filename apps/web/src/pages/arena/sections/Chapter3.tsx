import { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";
import { Section, Card, Caption, Details, Eq, Slider, useChartTheme } from "../shared";
import { useArenaTheme } from "../ArenaLayout";
import { sweepConcentration, marketOutcomes, CH3_DEFAULT } from "../model";

interface ChartLine {
  key: string;
  name: string;
  color: string;
}

function OutChart({
  title,
  data,
  lines,
  currentC,
  caption,
}: {
  title: string;
  data: Record<string, number>[];
  lines: ChartLine[];
  currentC: number;
  caption: string;
}) {
  const { theme } = useArenaTheme();
  const ct = useChartTheme(theme);
  return (
    <Card title={title}>
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 6, right: 12, bottom: 2, left: -14 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={ct.grid} vertical={false} />
            <XAxis
              dataKey="C"
              tick={ct.tick}
              axisLine={{ stroke: ct.grid }}
              tickLine={false}
              tickFormatter={(v) => `${Math.round(v * 100)}`}
              interval="preserveStartEnd"
            />
            <YAxis tick={ct.tick} axisLine={false} tickLine={false} width={32} domain={[0, 100]} />
            <Tooltip
              contentStyle={ct.tooltip}
              formatter={(v: number, n: string) => [Number(v).toFixed(0), n]}
              labelFormatter={(l) => `Concentration ${Math.round(Number(l) * 100)}`}
            />
            <ReferenceLine x={currentC} stroke="var(--arena-accent)" strokeWidth={1.5} strokeDasharray="4 3" />
            {lines.map((l) => (
              <Line key={l.key} type="monotone" dataKey={l.key} name={l.name} stroke={l.color} strokeWidth={2.2} dot={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Caption>{caption}</Caption>
    </Card>
  );
}

export default function Chapter3() {
  const [concentration, setConcentration] = useState(CH3_DEFAULT.concentration);
  const [distSlider, setDistSlider] = useState(CH3_DEFAULT.distortion / 0.4);
  const D = distSlider * 0.4;

  // Snap the reference line to the nearest swept C so it lines up with the data.
  const snappedC = Math.round(concentration * 25) / 25;
  const data = useMemo(() => sweepConcentration(D), [D]);
  const now = marketOutcomes(concentration, D);

  const concBadge = concentration < 0.34 ? "competitive" : concentration < 0.67 ? "moderate" : "concentrated";

  return (
    <Section id="outcomes" eyebrow="3 · Market outcomes" title="Structure, behaviour, and what comes out">
      <div className="max-w-3xl mb-6 text-sm sm:text-base leading-relaxed" style={{ color: "var(--arena-text)" }}>
        Two dials now. Market concentration sets how few firms hold the market. Behavioural distortion is the
        share of effort burned on waste, the thing Chapter 2 produced. Watch all four outcomes move at once.
      </div>

      <div className="grid lg:grid-cols-5 gap-6 items-start">
        {/* Controls + readout */}
        <Card title="Two dials" className="lg:col-span-2 lg:sticky lg:top-20">
          <div className="space-y-5">
            <Slider
              label="Market concentration"
              lo="competitive"
              hi="monopoly"
              badge={concBadge}
              value={concentration}
              onChange={setConcentration}
            />
            <Slider
              label="Behavioural distortion"
              lo="0% wasted"
              hi="40% wasted"
              badge={`${Math.round(D * 100)}%`}
              value={distSlider}
              onChange={setDistSlider}
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2.5">
            {[
              { label: "Price", v: now.price, tone: "var(--arena-c2)" },
              { label: "Quality", v: now.quality, tone: "var(--arena-good)" },
              { label: "Innovation", v: now.innovation, tone: "var(--arena-accent-2)" },
              { label: "Consumer surplus", v: now.surplus, tone: "var(--arena-accent)" },
              { label: "Deadweight loss", v: now.deadweight, tone: "var(--arena-warn)" },
            ].map((m) => (
              <div key={m.label} className="rounded-lg p-2.5" style={{ backgroundColor: "var(--arena-surface-2)" }}>
                <div className="text-[0.6rem] font-mono uppercase tracking-wider mb-0.5" style={{ color: "var(--arena-muted)" }}>
                  {m.label}
                </div>
                <div className="text-lg font-mono font-semibold" style={{ color: m.tone }}>
                  {m.v.toFixed(0)}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[0.65rem] leading-relaxed" style={{ color: "var(--arena-muted)" }}>
            X-axis on each chart is concentration (0 to 100). The dashed line marks your current setting.
            Distortion shifts the whole quality, innovation, and surplus curves down.
          </p>
        </Card>

        {/* 2x2 charts */}
        <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
          <OutChart
            title="Price index"
            data={data}
            currentC={snappedC}
            lines={[{ key: "price", name: "Price", color: "var(--arena-c2)" }]}
            caption="Rises with concentration; markups climb as firms thin out."
          />
          <OutChart
            title="Quality index"
            data={data}
            currentC={snappedC}
            lines={[{ key: "quality", name: "Quality", color: "var(--arena-good)" }]}
            caption="Inverted-U in competition, pulled down by distortion."
          />
          <OutChart
            title="Innovation index"
            data={data}
            currentC={snappedC}
            lines={[{ key: "innovation", name: "Innovation", color: "var(--arena-accent-2)" }]}
            caption="Peaks at intermediate concentration; waste erodes it."
          />
          <OutChart
            title="Surplus vs deadweight loss"
            data={data}
            currentC={snappedC}
            lines={[
              { key: "surplus", name: "Consumer surplus", color: "var(--arena-accent)" },
              { key: "deadweight", name: "Deadweight loss", color: "var(--arena-warn)" },
            ]}
            caption="Surplus is highest where prices are low, quality high, waste low; deadweight rises with power and distortion."
          />
        </div>
      </div>

      <Details summary="Details · outcome model & sources">
        <p>Concentration C in [0,1], distortion D in [0,0.4]:</p>
        <Eq>price = 62 + 38·C^0.7</Eq>
        <Eq>quality = (45 + 55·exp(−(C−0.45)²/(2·0.22²)))·(1 − 0.8·D)</Eq>
        <Eq>innovation = (40 + 60·exp(−(C−0.40)²/(2·0.25²)))·(1 − 0.5·D)</Eq>
        <Eq>deadweight = 8 + 35·C^1.3 + 60·D + 25·C·D</Eq>
        <p className="mt-2">
          Price rising with concentration follows the markup evidence in De Loecker, Eeckhout and Unger (2020).
          Quality and innovation keep the Aghion et al. (2005) inverted-U, here over concentration. The
          deadweight term combines the Harberger (1954) welfare triangle with rent-seeking waste, where wasted
          effort dissipates the gains from a position rather than creating value (Tullock 1967; Posner 1975).
          Coefficients are rescaled to 0 to 100.
        </p>
      </Details>
    </Section>
  );
}
