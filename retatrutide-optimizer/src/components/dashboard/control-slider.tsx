"use client";

import { ChangeEvent } from "react";

type ControlSliderProps = {
  label: string;
  description: string;
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function ControlSlider({
  label,
  description,
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
}: ControlSliderProps) {
  const handleSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(event.target.value));
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value);
    if (Number.isNaN(next)) {
      return;
    }

    onChange(clamp(next, min, max));
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/75 p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{label}</h3>
          <p className="mt-1 text-xs text-slate-600">{description}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-slate-950">{value}%</p>
          <p className="text-[11px] uppercase tracking-wide text-slate-500">
            impact
          </p>
        </div>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleSliderChange}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-indigo-600"
      />

      <div className="mt-3 flex justify-end">
        <label className="flex items-center gap-2 text-xs text-slate-600">
          Manual
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleInputChange}
            className="w-20 rounded-lg border border-slate-300 bg-white px-2 py-1 text-right text-sm text-slate-900 outline-none ring-indigo-200 focus:ring-2"
          />
        </label>
      </div>
    </div>
  );
}
