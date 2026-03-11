import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const data = [
    { name: "Mon", clicks: 40 },
    { name: "Tue", clicks: 120 },
    { name: "Wed", clicks: 85 },
    { name: "Thu", clicks: 110 },
    { name: "Fri", clicks: 200 },
    { name: "Sat", clicks: 150 },
    { name: "Sun", clicks: 90 },
  ];

  //   showing the data for the last 7 days

  return (
    <main className="font-sans min-h-screen p-8 w-full bg-yellow-200 pt-28">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        <h1 className="text-5xl font-black text-center text-yellow-950">
          Your Analytics Dashboard
        </h1>

        <div className="bg-white rounded-3xl shadow-sm border border-yellow-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-yellow-700 text-white">
              <tr>
                <th className="p-4">Original URL</th>
                <th className="p-4">Short Link</th>
                <th className="p-4">Clicks</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="text-yellow-950">
              <tr className="border-b border-yellow-100">
                <td className="p-4 truncate max-w-xs">
                  https://very-long-link.com/example...
                </td>
                <td className="p-4 font-mono font-bold text-yellow-600">
                  url.sh/xY2z
                </td>
                <td className="p-4">452</td>
                <td className="p-4">
                  <button className="bg-yellow-100 px-3 py-1 rounded-lg mr-2">
                    Copy
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-yellow-300 h-112.5 w-full">
          <h2 className="text-xl font-bold text-yellow-800 mb-6">
            Weekly Clicks Trend
          </h2>

          <div className="w-full h-87.5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ca8a04" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ca8a04" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  stroke="#854d0e"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#854d0e"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fefce8",
                    borderRadius: "15px",
                    border: "2px solid #fde047",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="#ca8a04"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorClicks)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
