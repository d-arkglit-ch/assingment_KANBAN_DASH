import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = { "To Do": "#94a3b8", "In Progress": "#60a5fa", "Done": "#34d399" };

function ProgressChart({ tasks }) {
  const data = ["To Do", "In Progress", "Done"].map((col) => ({
    name: col,
    count: tasks.filter((t) => t.columnId === col).length,
  }));

  return (
    <div className="mt-8 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <h3 className="text-slate-700 font-semibold mb-4">Task Distribution</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: "#f1f5f9" }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry) => <Cell key={entry.name} fill={COLORS[entry.name]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ProgressChart;
