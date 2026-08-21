import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import { useData } from '../../context/DataContext';
import DateFilter from '../common/DateFilter';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-navy-900 text-white p-2.5 rounded-xl shadow-xl text-xs border border-navy-800">
        <p className="font-bold text-slate-200">{label}</p>
        <p className="text-emerald-400 font-extrabold text-sm mt-0.5">
          ₹{data.earnings.toLocaleString('en-IN')}
        </p>
        {data.orders && (
          <p className="text-slate-400 text-[10px] mt-0.5">
            {data.orders} Completed Orders
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function EarningsPreviewChart({ className = "" }) {
  const [period, setPeriod] = useState("thisWeek");
  const { data: globalData } = useData();
  const chartData = globalData.earnings.chartData;
  const currentChartData = chartData[period] || chartData.thisWeek;

  const totalPeriodEarnings = currentChartData.reduce((acc, curr) => acc + curr.earnings, 0);

  return (
    <div className={`bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-card ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-bold text-navy-900">Earnings Overview</h3>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full flex items-center">
              +14% <TrendingUp className="w-3 h-3 ml-0.5" />
            </span>
          </div>
          <p className="text-lg font-extrabold text-navy-900 mt-0.5">
            ₹{totalPeriodEarnings.toLocaleString('en-IN')}
          </p>
        </div>

        <DateFilter
          selected={period}
          onChange={setPeriod}
          options={[
            { id: "today", label: "Today" },
            { id: "thisWeek", label: "This Week" },
            { id: "thisMonth", label: "This Month" }
          ]}
        />
      </div>

      {/* Chart */}
      <div className="h-44 sm:h-52 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={currentChartData} margin={{ top: 8, right: 0, left: -24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => `₹${val}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
            <Bar
              dataKey="earnings"
              radius={[6, 6, 0, 0]}
              animationDuration={800}
            >
              {currentChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.label === 'Fri' || entry.label === 'Sat' || entry.label === 'Week 2' ? '#2563eb' : '#93c5fd'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Link */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-400 text-[11px]">Payout cycle closes every Sunday</span>
        <Link
          to="/app/earnings"
          className="font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
        >
          <span>Detailed Breakdown</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
