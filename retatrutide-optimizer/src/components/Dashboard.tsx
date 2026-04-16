"use client";

import { useMemo, useState } from "react";
import { Beaker, CalendarDays, TrendingUp, AlertTriangle } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

type ModelInputs = {
  enrollmentMonths: number;
  screenFailureRate: number;
  dropoutRate: number;
  protocolAmendments: number;
  dbLockMonths: number;
  submissionPrepMonths: number;
  reviewMonths: number;
  monthlyPeakRevenue: number;
};

type ScenarioPreset = "Conservative" | "Cursor-Assisted" | "Best Case";

const baseline: ModelInputs = {
  enrollmentMonths: 18,
  screenFailureRate: 30,
  dropoutRate: 12,
  protocolAmendments: 2,
  dbLockMonths: 4,
  submissionPrepMonths: 5,
  reviewMonths: 10,
  monthlyPeakRevenue: 450000000,
};

const presetConfig: Record<ScenarioPreset, ModelInputs> = {
  Conservative: {
    enrollmentMonths: 17,
    screenFailureRate: 28,
    dropoutRate: 11,
    protocolAmendments: 2,
    dbLockMonths: 4,
    submissionPrepMonths: 5,
    reviewMonths: 10,
    monthlyPeakRevenue: 450000000,
  },
  "Cursor-Assisted": {
    enrollmentMonths: 14,
    screenFailureRate: 22,
    dropoutRate: 9,
    protocolAmendments: 1,
    dbLockMonths: 3,
    submissionPrepMonths: 3,
    reviewMonths: 9,
    monthlyPeakRevenue: 450000000,
  },
  "Best Case": {
    enrollmentMonths: 12,
    screenFailureRate: 18,
    dropoutRate: 7,
    protocolAmendments: 0,
    dbLockMonths: 2,
    submissionPrepMonths: 2,
    reviewMonths: 8,
    monthlyPeakRevenue: 450000000,
  },
};

const presetOrder: ScenarioPreset[] = [
  "Conservative",
  "Cursor-Assisted",
  "Best Case",
];

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function addMonthsToDate(start: Date, months: number) {
  const d = new Date(start);
  d.setMonth(d.getMonth() + months);
  return d;
}

function formatMonthYear(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export default function Dashboard() {
  const [inputs, setInputs] = useState<ModelInputs>(baseline);
  const [activePreset, setActivePreset] = useState<ScenarioPreset | null>(null);

  const update = <K extends keyof ModelInputs>(key: K, value: ModelInputs[K]) => {
    setActivePreset(null);
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const applyPreset = (preset: ScenarioPreset) => {
    setInputs({ ...presetConfig[preset] });
    setActivePreset(preset);
  };

  const results = useMemo(() => {
    const baselineTotal =
      baseline.enrollmentMonths +
      baseline.dbLockMonths +
      baseline.submissionPrepMonths +
      baseline.reviewMonths +
      baseline.protocolAmendments * 1.5 +
      (baseline.screenFailureRate / 100) * 4 +
      (baseline.dropoutRate / 100) * 3;

    const optimizedTotal =
      inputs.enrollmentMonths +
      inputs.dbLockMonths +
      inputs.submissionPrepMonths +
      inputs.reviewMonths +
      inputs.protocolAmendments * 1.5 +
      (inputs.screenFailureRate / 100) * 4 +
      (inputs.dropoutRate / 100) * 3;

    const monthsSaved = Math.max(0, baselineTotal - optimizedTotal);

    const today = new Date("2026-04-16");
    const baselineLaunch = addMonthsToDate(today, Math.round(baselineTotal));
    const optimizedLaunch = addMonthsToDate(today, Math.round(optimizedTotal));

    const revenuePulledForward = monthsSaved * inputs.monthlyPeakRevenue;

    const riskScoreRaw =
      inputs.screenFailureRate * 0.25 +
      inputs.dropoutRate * 0.2 +
      inputs.protocolAmendments * 12 +
      inputs.dbLockMonths * 6 +
      inputs.submissionPrepMonths * 5;

    const riskScore = Math.min(100, Math.round(riskScoreRaw));

    const timeSavedBreakdown = [
      {
        label: "Enrollment acceleration",
        baseline: `${baseline.enrollmentMonths} months`,
        current: `${inputs.enrollmentMonths} months`,
        monthsSaved: Math.max(0, baseline.enrollmentMonths - inputs.enrollmentMonths),
      },
      {
        label: "Fewer protocol amendments",
        baseline: `${baseline.protocolAmendments} amendments`,
        current: `${inputs.protocolAmendments} amendments`,
        monthsSaved: Math.max(
          0,
          (baseline.protocolAmendments - inputs.protocolAmendments) * 1.5,
        ),
      },
      {
        label: "Faster database lock",
        baseline: `${baseline.dbLockMonths} months`,
        current: `${inputs.dbLockMonths} months`,
        monthsSaved: Math.max(0, baseline.dbLockMonths - inputs.dbLockMonths),
      },
      {
        label: "Faster submission prep",
        baseline: `${baseline.submissionPrepMonths} months`,
        current: `${inputs.submissionPrepMonths} months`,
        monthsSaved: Math.max(
          0,
          baseline.submissionPrepMonths - inputs.submissionPrepMonths,
        ),
      },
    ].map((row) => ({
      ...row,
      monthsSaved: Number(row.monthsSaved.toFixed(1)),
    }));

    return {
      baselineTotal: Number(baselineTotal.toFixed(1)),
      optimizedTotal: Number(optimizedTotal.toFixed(1)),
      monthsSaved: Number(monthsSaved.toFixed(1)),
      baselineLaunch: formatMonthYear(baselineLaunch),
      optimizedLaunch: formatMonthYear(optimizedLaunch),
      revenuePulledForward,
      riskScore,
      chartData: [
        { name: "Baseline", months: Number(baselineTotal.toFixed(1)) },
        { name: "Optimized", months: Number(optimizedTotal.toFixed(1)) },
      ],
      timeSavedBreakdown,
    };
  }, [inputs]);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-400/15 p-3">
              <Beaker className="h-6 w-6 text-cyan-300" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Retatrutide Time-to-Market Optimizer
              </h1>
              <p className="mt-1 text-sm text-slate-300">
                Strategic simulation for how digital workflow improvements could
                compress launch readiness for an investigational obesity therapy.
              </p>
            </div>
          </div>

          <section className="mb-6 rounded-2xl border border-white/10 bg-slate-900/60 p-5">
            <h2 className="text-sm font-semibold tracking-wide text-slate-100">
              Why Retatrutide?
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
              <li>Investigational, Phase 3 obesity asset</li>
              <li>Multiple obesity-related development programs underway</li>
              <li>
                Large commercial value makes even modest timeline acceleration
                strategically meaningful
              </li>
            </ul>
          </section>

          <div className="grid gap-4 md:grid-cols-4">
            <KpiCard
              icon={<CalendarDays className="h-5 w-5 text-cyan-300" />}
              label="Projected Launch"
              value={results.optimizedLaunch}
              subValue={`Baseline: ${results.baselineLaunch}`}
            />
            <KpiCard
              icon={<TrendingUp className="h-5 w-5 text-emerald-300" />}
              label="Months Saved"
              value={`${results.monthsSaved} months`}
              subValue="vs baseline plan"
            />
            <KpiCard
              icon={<TrendingUp className="h-5 w-5 text-violet-300" />}
              label="Revenue Pulled Forward"
              value={formatMoney(results.revenuePulledForward)}
              subValue="Illustrative estimate"
            />
            <KpiCard
              icon={<AlertTriangle className="h-5 w-5 text-amber-300" />}
              label="Development Risk Score"
              value={`${results.riskScore}/100`}
              subValue="Higher = more risk"
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-xl font-semibold">Timeline Optimization Inputs</h2>

            <div className="mb-5">
              <p className="mb-3 text-xs uppercase tracking-wide text-slate-400">
                Scenario Presets
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {presetOrder.map((preset) => {
                  const isActive = activePreset === preset;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "border-cyan-300 bg-cyan-300/20 text-cyan-100"
                          : "border-white/15 bg-slate-900/70 text-slate-200 hover:border-cyan-300/60 hover:text-white"
                      }`}
                    >
                      {preset}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-5">
              <SliderRow
                label="Enrollment timeline (months)"
                value={inputs.enrollmentMonths}
                min={6}
                max={24}
                step={1}
                onChange={(v) => update("enrollmentMonths", v)}
              />
              <SliderRow
                label="Screen failure rate (%)"
                value={inputs.screenFailureRate}
                min={5}
                max={50}
                step={1}
                onChange={(v) => update("screenFailureRate", v)}
              />
              <SliderRow
                label="Dropout rate (%)"
                value={inputs.dropoutRate}
                min={2}
                max={25}
                step={1}
                onChange={(v) => update("dropoutRate", v)}
              />
              <SliderRow
                label="Protocol amendments"
                value={inputs.protocolAmendments}
                min={0}
                max={6}
                step={1}
                onChange={(v) => update("protocolAmendments", v)}
              />
              <SliderRow
                label="Database lock time (months)"
                value={inputs.dbLockMonths}
                min={1}
                max={8}
                step={1}
                onChange={(v) => update("dbLockMonths", v)}
              />
              <SliderRow
                label="Submission prep (months)"
                value={inputs.submissionPrepMonths}
                min={1}
                max={8}
                step={1}
                onChange={(v) => update("submissionPrepMonths", v)}
              />
              <SliderRow
                label="Regulatory review assumption (months)"
                value={inputs.reviewMonths}
                min={6}
                max={14}
                step={1}
                onChange={(v) => update("reviewMonths", v)}
              />
              <SliderRow
                label="Monthly peak revenue assumption ($)"
                value={inputs.monthlyPeakRevenue}
                min={100000000}
                max={800000000}
                step={10000000}
                onChange={(v) => update("monthlyPeakRevenue", v)}
                formatValue={(v) => formatMoney(v)}
              />
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="mb-4 text-xl font-semibold">Baseline vs Optimized Timeline</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.chartData}>
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="months" name="Total Months to Launch" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="mb-4 text-xl font-semibold">Where Time Was Saved</h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-400">
                    <tr>
                      <th className="pb-2 pr-4 font-medium">Driver</th>
                      <th className="pb-2 pr-4 font-medium">Baseline</th>
                      <th className="pb-2 pr-4 font-medium">Current Scenario</th>
                      <th className="pb-2 text-right font-medium">Estimated Months Saved</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.timeSavedBreakdown.map((row) => (
                      <tr key={row.label} className="border-b border-white/5 last:border-0">
                        <td className="py-3 pr-4 text-slate-200">{row.label}</td>
                        <td className="py-3 pr-4 text-slate-300">{row.baseline}</td>
                        <td className="py-3 pr-4 text-slate-300">{row.current}</td>
                        <td className="py-3 text-right font-medium text-cyan-200">
                          {row.monthsSaved.toFixed(1)} months
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="mb-3 text-xl font-semibold">Executive Interpretation</h2>
              <p className="text-sm leading-7 text-slate-300">
                This simulation shows how operational and software-assisted improvements
                across enrollment planning, protocol stability, data management, and
                submission readiness can move a launch timeline left. In a real pharma
                setting, tools built faster with Cursor could help teams model scenarios,
                reduce manual coordination, and identify bottlenecks earlier.
              </p>

              <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4 text-sm text-cyan-100">
                <strong>Current scenario:</strong>{" "}
                By reducing enrollment drag, limiting amendments, and shortening
                database lock plus submission prep, the program saves{" "}
                <span className="font-semibold">{results.monthsSaved} months</span> and
                shifts the modeled launch from{" "}
                <span className="font-semibold">{results.baselineLaunch}</span> to{" "}
                <span className="font-semibold">{results.optimizedLaunch}</span>.
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-xs leading-6 text-slate-400">
              Retatrutide is investigational and not approved. This application is a
              strategic commercialization and operations simulation for demo purposes only.
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function KpiCard({
  icon,
  label,
  value,
  subValue,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <span className="text-sm text-slate-300">{label}</span>
      </div>
      <div className="text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-xs text-slate-400">{subValue}</div>
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <label className="text-slate-200">{label}</label>
        <span className="text-slate-400">
          {formatValue ? formatValue(value) : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-cyan-400"
      />
    </div>
  );
}
