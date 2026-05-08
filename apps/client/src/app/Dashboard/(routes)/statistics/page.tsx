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
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import LoadingSpinner from '@/components/Spinner/LoadingSpinner';
import { getMarks } from '@/requests/get';
import type { HistoryWithMongoId } from '@/requests/get';
import { Trophy, Target, Activity, Award, Calendar } from 'lucide-react';

const PRIMARY_COLOR = '#7a1cac'; // Consistent with theme
const SECONDARY_COLOR = '#090909';
const COLORS = [PRIMARY_COLOR, '#9333ea', '#c084fc', '#e9d5ff'];

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

  const getStatistics = () => {
    const totalExams = marks.length;
    if (totalExams === 0) return { totalExams: 0, averageMarks: 0, highestMarks: 0, lowestMarks: 0 };
    
    const totalMarks = marks.reduce((acc, item) => acc + (item.marks ?? 0), 0);
    const averageMarks = (totalMarks / totalExams).toFixed(1);
    const highestMarks = Math.max(...marks.map((item) => item.marks ?? 0));
    const lowestMarks = Math.min(...marks.map((item) => item.marks ?? 0));

    return { totalExams, averageMarks, highestMarks, lowestMarks };
  };

  const { totalExams, averageMarks, highestMarks, lowestMarks } = getStatistics();

  const barChartData = marks.slice(-10).map((quiz) => ({
    name: quiz.quizTitle?.substring(0, 10) + (quiz.quizTitle && quiz.quizTitle.length > 10 ? '...' : ''),
    marks: quiz.marks ?? 0,
  }));

  const lineChartData = marks.map((quiz, index) => ({
    attempt: index + 1,
    marks: quiz.marks ?? 0,
  }));

  const pieChartData = [
    { name: 'Needs Improvement', value: marks.filter((item) => (item.marks ?? 0) <= 40).length },
    { name: 'Good', value: marks.filter((item) => (item.marks ?? 0) > 40 && (item.marks ?? 0) <= 75).length },
    { name: 'Excellent', value: marks.filter((item) => (item.marks ?? 0) > 75).length },
  ].filter(item => item.value > 0);

  if (loading) return <div className="flex h-screen items-center justify-center"><LoadingSpinner /></div>;

  if (marks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center">
        <div className="bg-primary-color/10 p-6 rounded-full mb-6">
          <Activity size={64} className="text-primary-color animate-pulse" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">No Performance Data Yet</h2>
        <p className="text-gray-500 max-w-md mb-8">
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
    <div className="p-4 md:p-8 lg:p-12 bg-gray-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Trophy className="text-yellow-500" />
              Your Performance Dashboard
            </h1>
            <p className="text-gray-500 mt-1">Detailed analysis of your learning journey</p>
          </div>
          <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
            <Calendar size={18} className="text-primary-color" />
            <span className="text-sm font-medium text-gray-600">
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
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg`}>
                  <stat.icon size={24} />
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Bar Chart */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
               Recent Performance
            </h3>
            <div className="h-75 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    cursor={{ fill: '#f9fafb' }}
                  />
                  <Bar dataKey="marks" fill={PRIMARY_COLOR} radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
               Learning Progress
            </h3>
            <div className="h-75 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="attempt" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="marks" 
                    stroke={PRIMARY_COLOR} 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: PRIMARY_COLOR, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 lg:col-span-2">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Score Distribution</h3>
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
                   <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                        <span className="text-sm font-semibold text-gray-700">{item.name}</span>
                      </div>
                      <span className="text-sm font-bold text-primary-color">{item.value} times</span>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
