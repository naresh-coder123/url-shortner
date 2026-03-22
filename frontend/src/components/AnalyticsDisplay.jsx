import { useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const PALETTE = ["#3266ad","#1d9e75","#ba7517","#d4537e","#534ab7","#d85a30","#639922","#888780"];

function last14Days() {
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return d.toISOString().slice(0, 10);
  });
}

function MetricCard({ label, value }) {
  return (
    <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
      <p className="text-xs text-yellow-800/60 mb-1">{label}</p>
      <p className="text-2xl font-semibold text-yellow-950">{value}</p>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-yellow-200 p-5 mb-4">
      <p className="text-sm font-medium text-yellow-800/60 mb-4">{title}</p>
      {children}
    </div>
  );
}

function Legend({ items }) {
  return (
    <div className="flex flex-wrap gap-4 mb-3 text-xs text-yellow-900/60">
      {items.map(({ label, color, pct }, i) => (
        <span key={i} className="flex items-center gap-1">
          <span style={{ width: 10, height: 10, borderRadius: 2, background: color, display: "inline-block" }} />
          {label}{pct != null ? ` ${pct}%` : ""}
        </span>
      ))}
    </div>
  );
}

/**
 * Props:
 *   data — object returned by GET /shorten/analytics/:id shaped as:
 *   {
 *     shortUrl:  string,
 *     longUrl:   string,
 *     clicks:    number,
 *     analytics: [{ timestamp: ISO string, device: string }]
 *   }
 */
export default function AnalyticsDisplay({ data = {} }) {
  const { shortUrl, longUrl, clicks: totalClicks = 0, analytics = [] } = data;

  const metrics = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayCount = analytics.filter(a => a.timestamp?.slice(0, 10) === todayStr).length;
    const deviceMap = {};
    analytics.forEach(a => { deviceMap[a.device] = (deviceMap[a.device] || 0) + 1; });
    const topDevice = Object.entries(deviceMap).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
    return { todayCount, topDevice };
  }, [analytics]);

  const timelineData = useMemo(() => {
    const days = last14Days();
    return days.map(day => ({
      day: day.slice(5),
      clicks: analytics.filter(a => a.timestamp?.slice(0, 10) === day).length,
    }));
  }, [analytics]);

  const deviceData = useMemo(() => {
    const map = {};
    analytics.forEach(a => { map[a.device] = (map[a.device] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [analytics]);

  const hourData = useMemo(() => {
    const buckets = Array(24).fill(0);
    analytics.forEach(a => {
      const h = new Date(a.timestamp).getHours();
      if (!isNaN(h)) buckets[h]++;
    });
    return buckets.map((clicks, h) => ({ hour: `${h}h`, clicks }));
  }, [analytics]);

  return (
    <div className="font-sans">

      {/* header */}
      <div className="mb-6">
        {longUrl && (
          <p className="text-sm text-yellow-900/50 truncate max-w-xl mb-1">{longUrl}</p>
        )}
        {shortUrl && (
          <a
            href={`https://url-shortner-zg8l.vercel.app/${shortUrl}`}
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-yellow-100 text-yellow-800 font-mono text-sm px-3 py-1 rounded-lg hover:bg-yellow-200 transition-colors"
          >
            https://url-shortner-zg8l.vercel.app/`${shortUrl}`
          </a>
        )}
      </div>

      {/* metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <MetricCard label="Total clicks"    value={totalClicks.toLocaleString()} />
        <MetricCard label="Today"           value={metrics.todayCount} />
        <MetricCard label="Tracked events"  value={analytics.length.toLocaleString()} />
        <MetricCard label="Top device"      value={metrics.topDevice.charAt(0).toUpperCase() + metrics.topDevice.slice(1)} />
      </div>

      {analytics.length === 0 ? (
        <div className="bg-white rounded-2xl border border-yellow-200 p-8 text-center text-yellow-900/40 text-sm">
          {totalClicks > 0
            ? `${totalClicks} clicks recorded — detailed per-click analytics not available yet.`
            : "No clicks yet — share your short URL to start tracking."}
        </div>
      ) : (
        <>
          <SectionCard title="Clicks over time (last 14 days)">
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={timelineData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#92400e" }} />
                <YAxis tick={{ fontSize: 11, fill: "#92400e" }} allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="clicks" stroke="#d97706" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </SectionCard>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <SectionCard title="Device breakdown">
              <Legend items={deviceData.map(({ name, value }, i) => ({
                label: name.charAt(0).toUpperCase() + name.slice(1),
                color: PALETTE[i % PALETTE.length],
                pct: Math.round(value / analytics.length * 100)
              }))} />
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={deviceData} dataKey="value" nameKey="name"
                    cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3}>
                    {deviceData.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </SectionCard>

            <SectionCard title="Clicks by hour">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={hourData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                  <XAxis dataKey="hour" tick={{ fontSize: 9, fill: "#92400e" }} interval={2} />
                  <YAxis tick={{ fontSize: 10, fill: "#92400e" }} allowDecimals={false} />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Bar dataKey="clicks" fill="rgba(217,119,6,0.5)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </SectionCard>
          </div>
        </>
      )}
    </div>
  );
}
