'use client';
import { getMarks } from '@/requests/get';
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
} from 'recharts';
import { FiUsers, FiCheckCircle, FiBarChart, FiClock } from 'react-icons/fi';
import Spinner from '../Shared/Spinner';
import Link from 'next/link';
import { SectionTitleMinimal } from '../Shared/SectionTitle';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
const PRIMARY_COLOR = '#8e49b6'; // Use your primary color here
const GRAY_COLOR = '#9ca3af'; // Gray color for other sections
const QuizlyticsDashboard = () => {
  const { data: session } = useSession();
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        if (session?.user?.email) {
          const data = await getMarks(session.user.email);
          setMarks(data);
        }
      } catch (error) {
        console.error('Data fetching error', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong while fetching leaderboard data!',
          toast: true,
        });
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    fetchMarks();
  }, [session]);

  const getStatistics = () => {
    const totalExams = marks.length;
    const totalMarks = marks.reduce((acc, item) => acc + item.marks, 0);
    const averageMarks = (totalMarks / totalExams).toFixed(2);
    const highestMarks = totalExams > 0 ? Math.max(...marks.map((item) => item.marks)) : 0;
  const lowestMarks = totalExams > 0 ? Math.min(...marks.map((item) => item.marks)) : 0;

    return { totalExams, averageMarks, highestMarks, lowestMarks };
  };

  const categorizeMarks = () => {
    const ranges = { low: 0, mid: 0, high: 0 };
    marks.forEach((quiz) => {
      if (quiz.marks <= 50) ranges.low += 1;
      else if (quiz.marks <= 70) ranges.mid += 1;
      else ranges.high += 1;
    });
    return [
      { name: '0-50%', value: ranges.low },
      { name: '51-70%', value: ranges.mid },
      { name: '71-100%', value: ranges.high },
    ];
  };

  const getRecentQuizzes = () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

    return marks.filter((quiz) => new Date(quiz.date) >= thirtyDaysAgo).length;
  };

  const { totalExams, averageMarks, highestMarks, lowestMarks } = getStatistics();

  // Prepare data for charts
  const barChartData = marks.map((quiz) => ({
    quizTitle: quiz.quizTitle,
    marks: quiz.marks,
  }));

  const lineChartData = marks.map((quiz, index) => ({
    attempt: index + 1,
    marks: quiz.marks,
  }));

  const pieChartData = categorizeMarks();


  return (
    <div className="min-h-screen overflow-hidden">
      

     <SectionTitleMinimal heading={"Quizlytics Dashboard"}></SectionTitleMinimal>


      
      <div className="grid grid-cols-1  lg:grid-cols-3 gap-6 mb-5 px-5">
        <div className="bg-[#E3C8FF] py-8 px-4 rounded-lg shadow-md flex items-center justify-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex justify-center items-center mr-4">
            <FiBarChart className="" size={24} />
          </div>
          <div>
            <p className="text-xl font-semibold ">Total  Attempted</p>
            <p className="text-2xl font-bold">{totalExams}</p>
          </div>
        </div>

        <div className="bg-[#F4E1FF]  py-8 px-4 rounded-lg shadow-md flex items-center justify-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex justify-center items-center mr-4">
            <FiCheckCircle className="" size={24} />
          </div>
          <div>
            <p className="text-xl font-semibold ">Best Performance</p>
            <p className="text-2xl font-bold">{highestMarks <= 100? highestMarks: 0}%</p>
          </div>
        </div>

        

        <div className="bg-[#9B7EBD] bg-opacity-85 py-8 px-4 rounded-lg shadow-md flex items-center justify-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex justify-center items-center mr-4">
            <FiClock className="" size={24} />
          </div>
          <div>
            <p className="text-xl font-semibold ">Quiz History</p>
            <p className="text-2xl font-bold">{getRecentQuizzes()} days</p>
          </div>
        </div>
      </div>

      {/* Charts and Statistics section */}
      {marks.length === 0 ? (
        <div className="text-center mt-12">
          <h2 className="text-2xl font-semibold mb-4">No Quizzes Attempted Yet</h2>
          <p className="text-gray-600 mb-6">It seems like you haven&apos;t taken any quizzes yet. Start your learning journey by taking your first quiz now!</p>
          <Link href="/customQuiz">
  <button className="bg-primary-color font-semibold text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-200">
    Attempt Your First Quiz
  </button>
</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart for individual topic marks */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Marks by Quiz Topic</h3>
            <div className="flex justify-center">
              <BarChart width={500} height={300} data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quizTitle" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="marks" fill="#8e49b6" />
              </BarChart>
            </div>
          </div>

          {/* Line Chart for performance trend */}
          {/* <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Performance Trend Over Attempts</h3>
            <div className="flex justify-center">
              <LineChart width={500} height={300} data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="attempt" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="marks" stroke="#8e49b6" activeDot={{ r: 8 }} />
              </LineChart>
            </div>
          </div> */}

          {/* Pie Chart for marks distribution */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Marks Distribution</h3>
            <div className="flex justify-center">
            <PieChart width={450} height={450}>
                <Pie
                  data={pieChartData}
                  cx={200}
                  cy={200}
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={180} // Increased radius for a larger curve
                  fill={'#374151'}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? PRIMARY_COLOR : GRAY_COLOR} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizlyticsDashboard;
