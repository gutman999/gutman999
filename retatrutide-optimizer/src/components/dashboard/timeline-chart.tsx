"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ProgramPhase } from "@/types/simulation";

type TimelineChartProps = {
  phases: ProgramPhase[];
};

export function TimelineChart({ phases }: TimelineChartProps) {
  const data = phases.map((phase) => ({
    name: phase.label,
    Baseline: phase.baselineMonths,
    Optimized: phase.optimizedMonths,
  }));

  if (typeof window === "undefined") {
    return (
      <div className="flex h-96 w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-500">
        Preparing chart...
      </div>
    );
  }

  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 12, right: 16, left: 0, bottom: 8 }}
          barGap={10}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
          <XAxis
            dataKey="name"
            tick={{ fill: "#374151", fontSize: 12 }}
            axisLine={{ stroke: "#9ca3af" }}
            tickLine={{ stroke: "#9ca3af" }}
          />
          <YAxis
            tick={{ fill: "#374151", fontSize: 12 }}
            axisLine={{ stroke: "#9ca3af" }}
            tickLine={{ stroke: "#9ca3af" }}
            width={40}
          />
          <Tooltip
            cursor={{ fill: "rgba(226,232,240,0.3)" }}
            contentStyle={{
              borderRadius: "0.75rem",
              border: "1px solid #d1d5db",
              backgroundColor: "#ffffff",
            }}
          />
          <Legend />
          <Bar dataKey="Baseline" fill="#94a3b8" radius={[6, 6, 0, 0]} />
          <Bar dataKey="Optimized" fill="#0f766e" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
