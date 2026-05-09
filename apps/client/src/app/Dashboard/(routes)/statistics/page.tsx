'use client'
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useSession } from 'next-auth/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { Trophy, Target, Activity, Award, Calendar } from 'lucide-react';
import { getMarks } from '@/requests/get';
import type { HistoryWithMongoId } from '@/requests/get';

const PRIMARY_COLOR = '#7a1cac';
const COLORS = ['#7a1cac', '#9333ea', '#c084fc', '#e9d5ff', '#f0abfc'];

/* ───────────── Skeleton ───────────── */
function ChartSkeleton() {
  return (
    <div className="bg-card p-6 md:p-8 rounded-3xl shadow-sm border border-border animate-pulse">
      <div className="h-5 w-40 bg-muted rounded mb-6" />
      <div className="h-75 w-full bg-muted rounded-2xl" />
    </div>
  );
}

function KpiSkeleton() {
  return (
    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border animate-pulse">
      <div className="h-12 w-12 bg-muted rounded-xl mb-4" />
      <div className="h-3 w-20 bg-muted rounded mb-2" />
      <div className="h-6 w-16 bg-muted rounded" />
    </div>
  );
}

/* ───────────── Page ───────────── */
const Page = () => {
  const { data: session } = useSession();
  const [marks, setMarks] = useState<HistoryWithMongoId[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        if (session?.user?.email) {
          const data = await getMarks(session.user.email);
          setMarks(data);
        }
      } catch {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong while fetching statistics!',
          toast: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchMarks();
  }, [session]);

  /* ── KPIs ── */
  const totalExams = marks.length;
  const averageMarks =
    totalExams > 0
      ? (marks.reduce((acc, item) => acc + (item.marks ?? 0), 0) / totalExams).toFixed(1)
      : '0';
  const highestMarks =
    totalExams > 0 ? Math.max(...marks.map((item) => item.marks ?? 0)) : 0;
  const lowestMarks =
    totalExams > 0 ? Math.min(...marks.map((item) => item.marks ?? 0)) : 0;

  /* ── Line chart: quiz attempts over last 30 days ── */
  const lineChartData = (() => {
    const now = new Date();
    const days: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      days[d.toISOString().slice(0, 10)] = 0;
    }
    marks.forEach((q) => {
      if (!q.date) return;
      const d = new Date(q.date).toISOString().slice(0, 10);
      if (d in days) days[d]++;
    });
    return Object.entries(days).map(([date, count]) => ({
      date: date.slice(5), // MM-DD
      attempts: count,
    }));
  })();

  /* ── Bar chart: score distribution buckets ── */
  const buckets = [
    { range: '0–20', min: 0, max: 20 },
    { range: '21–40', min: 21, max: 40 },
    { range: '41–60', min: 41, max: 60 },
    { range: '61–80', min: 61, max: 80 },
    { range: '81–100', min: 81, max: 100 },
  ];
  const barChartData = buckets.map((b) => ({
    range: b.range,
    count: marks.filter((m) => {
      const s = m.marks ?? 0;
      return s >= b.min && s <= b.max;
    }).length,
  }));

  /* ── Pie chart: quiz type breakdown ── */
  const pieChartData = (() => {
    let ai = 0,
      manual = 0,
      link = 0;
    marks.forEach((q) => {
      const creator = (q.quizCreator ?? '').toLowerCase();
      if (creator === 'ai' || creator === 'system ai' || creator === '') {
        ai++;
      } else if (q.linkId && q.linkId !== '1001') {
        link++;
      } else {
        manual++;
      }
    });
    return [
      { name: 'AI Quiz', value: ai },
      { name: 'Manual Quiz', value: manual },
      { name: 'Link Quiz', value: link },
    ].filter((d) => d.value > 0);
  })();

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="p-4 md:p-8 lg:p-12 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-72 bg-muted rounded mb-10 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <KpiSkeleton key={i} />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <ChartSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── Empty state ── */
  if (marks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center">
        <div className="bg-primary-color/10 p-6 rounded-full mb-6">
          <Activity size={64} className="text-primary-color animate-pulse" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">No Performance Data Yet</h2>
        <p className="text-muted-foreground max-w-md mb-8">
          Take your first quiz to start tracking your progress and see detailed performance analytics here.
        </p>
        <button 
           onClick={() => window.location.href = '/Dashboard'}
           className="bg-primary-color text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-primary-color/20 hover:scale-105 transition-transform"
        >
          Start Your First Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 lg:p-12 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Trophy className="text-yellow-500" />
              Your Performance Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Detailed analysis of your learning journey</p>
          </div>
          <div className="flex items-center gap-2 bg-card p-2 rounded-xl shadow-sm border border-border">
            <Calendar size={18} className="text-primary-color" />
            <span className="text-sm font-medium text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Quizzes Taken', value: totalExams, icon: Award, color: 'bg-blue-500' },
            { label: 'Average Score', value: `${averageMarks}%`, icon: Target, color: 'bg-primary-color' },
            { label: 'Best Score', value: `${highestMarks}%`, icon: Trophy, color: 'bg-yellow-500' },
            { label: 'Lowest Score', value: `${lowestMarks}%`, icon: Activity, color: 'bg-orange-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-card p-6 rounded-2xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg`}>
                  <stat.icon size={24} />
                </div>
              </div>
              <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Line Chart: Attempts over 30 days */}
          <div className="bg-card p-6 md:p-8 rounded-3xl shadow-sm border border-border">
            <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
               Quiz Attempts (Last 30 Days)
            </h3>
            {lineChartData.every((d) => d.attempts === 0) ? (
              <div className="h-75 flex items-center justify-center text-muted-foreground">
                No attempts in the last 30 days
              </div>
            ) : (
              <div className="h-75 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} interval={4} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', backgroundColor: 'hsl(var(--card))' }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="attempts" 
                      stroke={PRIMARY_COLOR} 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: PRIMARY_COLOR, strokeWidth: 2, stroke: 'hsl(var(--card))' }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Bar Chart: Score Distribution */}
          <div className="bg-card p-6 md:p-8 rounded-3xl shadow-sm border border-border">
            <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
               Score Distribution
            </h3>
            {barChartData.every((d) => d.count === 0) ? (
              <div className="h-75 flex items-center justify-center text-muted-foreground">
                No score data available
              </div>
            ) : (
              <div className="h-75 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', backgroundColor: 'hsl(var(--card))' }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Bar dataKey="count" fill={PRIMARY_COLOR} radius={[6, 6, 0, 0]} barSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Pie Chart: Quiz Type Breakdown */}
          <div className="bg-card p-6 md:p-8 rounded-3xl shadow-sm border border-border lg:col-span-2">
            <h3 className="text-lg font-bold text-foreground mb-6">Quiz Type Breakdown</h3>
            {pieChartData.length === 0 ? (
              <div className="h-75 flex items-center justify-center text-muted-foreground">
                No quiz type data available
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center justify-around gap-8">
                <div className="h-75 w-full md:w-1/2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={8}
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-4 w-full md:w-1/3">
                   {pieChartData.map((item, i) => (
                     <div key={i} className="flex items-center justify-between p-4 bg-muted rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                          <span className="text-sm font-semibold text-foreground">{item.name}</span>
                        </div>
                        <span className="text-sm font-bold text-primary-color">{item.value} quizzes</span>
                     </div>
                   ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
