"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  FileText,
  RefreshCcw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

// Types
type AnalyticsData = {
  kpi: {
    totalRevenue: number;
    totalBookings: number;
    activeGuests: number;
    avgRating: number;
  };
  revenueChart: { name: string; total: number }[];
  roomPopularity: { name: string; bookings: number; color: string }[];
  recentReports: {
    id: string;
    report_type: string;
    generated_at: string;
    success: boolean;
  }[];
};

// Component for Stat Cards
type StatCardProps = {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ElementType;
};

const StatCard = ({
  title,
  value,
  change,
  isPositive,
  icon: Icon,
}: StatCardProps) => (
  <div className="bg-white/60 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-white/50 flex items-start justify-between transition-transform hover:-translate-y-1 duration-300">
    <div>
      <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">
        {title}
      </p>
      <h3 className="text-3xl font-serif font-bold text-[#0A1A44]">{value}</h3>
      <div
        className={`flex items-center gap-1 mt-2 text-sm font-bold ${
          isPositive ? "text-green-600" : "text-red-500"
        }`}
      >
        {isPositive ? (
          <ArrowUpRight className="w-4 h-4" />
        ) : (
          <ArrowDownRight className="w-4 h-4" />
        )}
        <span>{change}</span>
        <span className="text-slate-400 font-medium ml-1">vs last month</span>
      </div>
    </div>
    <div className="p-3 bg-[#cde4fa] rounded-2xl text-[#0A1A44]">
      <Icon className="w-6 h-6" />
    </div>
  </div>
);

export default function ReportsAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/analytics");
        if (!res.ok) throw new Error("Failed");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading)
    return (
      <div className="p-10 text-center text-slate-500 animate-pulse">
        Crunching numbers...
      </div>
    );
  if (!data)
    return (
      <div className="p-10 text-center text-red-500">
        Failed to load analytics.
      </div>
    );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#cde4fa] p-8 -m-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-black">
            Analytics & Insights
          </h1>
          <p className="text-slate-600 font-medium mt-1">
            Real-time performance metrics.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#0A1A44] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#1a3a75] transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
          <Download className="w-4 h-4" />
          <span>Export Summary</span>
        </button>
      </div>

      {/* 1. KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={`₱ ${data.kpi.totalRevenue.toLocaleString()}`}
          change="+12.5%"
          isPositive={true}
          icon={TrendingUp}
        />
        <StatCard
          title="Total Bookings"
          value={data.kpi.totalBookings.toString()}
          change="+8.2%"
          isPositive={true}
          icon={CalendarDays}
        />
        <StatCard
          title="Active Guests"
          value={data.kpi.activeGuests.toString()}
          change="Live"
          isPositive={true}
          icon={Users}
        />
        <StatCard
          title="Avg. Rating"
          value={data.kpi.avgRating.toString()}
          change="+0.2"
          isPositive={true}
          icon={BarChart3}
        />
      </div>

      {/* 2. Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-blue-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#0A1A44]">
              Revenue Overview (Yearly)
            </h3>
            <select className="bg-slate-100 border-none rounded-lg text-sm font-medium px-3 py-1 text-slate-600 focus:ring-0">
              <option>2025</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueChart}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A1A44" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0A1A44" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E2E8F0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  tickFormatter={(value) => `₱${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#0A1A44"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Room Popularity */}
        <div className="bg-[#0A1A44] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>

          <h3 className="text-xl font-bold mb-6 relative z-10">
            Popular Rooms
          </h3>
          <div className="h-[300px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.roomPopularity}
                layout="vertical"
                barSize={20}
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={100}
                  tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{ borderRadius: "8px", color: "#000" }}
                />
                <Bar dataKey="bookings" radius={[0, 4, 4, 0]}>
                  {data.roomPopularity.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index % 2 === 0 ? "#ffffff" : "#38bdf8"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Recent Reports Table */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-blue-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-[#0A1A44]">
            Recent Generated Reports
          </h3>
          <button className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-2">
            <RefreshCcw className="w-4 h-4" /> Refresh List
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <th className="pb-4 pl-4">Report ID</th>
                <th className="pb-4">Report Type</th>
                <th className="pb-4">Generated Date</th>
                <th className="pb-4">Status</th>
                <th className="pb-4 text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.recentReports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-slate-500">
                    No reports generated yet.
                  </td>
                </tr>
              ) : (
                data.recentReports.map((report) => (
                  <tr
                    key={report.id}
                    className="group hover:bg-blue-50/50 transition-colors"
                  >
                    <td className="py-4 pl-4 font-mono text-sm font-medium text-slate-600">
                      {report.id.substring(0, 8)}...
                    </td>
                    <td className="py-4 font-bold text-[#0A1A44]">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-400" />
                        {report.report_type}
                      </div>
                    </td>
                    <td className="py-4 text-sm text-slate-600">
                      {new Date(report.generated_at).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize
                                        ${
                                          report.success
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                      >
                        {report.success ? "Success" : "Failed"}
                      </span>
                    </td>
                    <td className="py-4 text-right pr-4">
                      <button className="text-slate-400 hover:text-[#0A1A44] transition-colors">
                        <Download className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
