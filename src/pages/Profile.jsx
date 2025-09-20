import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import {
  UserIcon,
  EnvelopeIcon,
  CalendarIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const TOTAL_PROBLEMS = 100;

const COLOR_MAP = {
  easy: '#22C55E',
  medium: '#FACC15',
  hard: '#EF4444',
};

const TAG_COLORS = {
  array: 'bg-blue-900 text-blue-100',
  linkedList: 'bg-green-900 text-green-100',
  graph: 'bg-pink-900 text-pink-100',
  dp: 'bg-purple-900 text-purple-100',
};

const DIFFICULTY_COLORS = {
  easy: 'bg-green-900 text-green-300',
  medium: 'bg-yellow-900 text-yellow-300',
  hard: 'bg-red-900 text-red-300',
};

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState(null);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [difficultyCounts, setDifficultyCounts] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
  });

  // Load data
  useEffect(() => {
    async function fetchData() {
      try {
        const [userRes, probRes] = await Promise.all([
          axiosClient.get('/user/getUser'),
          axiosClient.get('/problem/problemSolvedByUser'),
        ]);

        const problems = probRes.data || [];
        const counts = {
          easy: problems.filter(p => p.difficulty === 'easy').length,
          medium: problems.filter(p => p.difficulty === 'medium').length,
          hard: problems.filter(p => p.difficulty === 'hard').length,
        };

        setUserInfo(userRes.data);
        setSolvedProblems(problems);
        setDifficultyCounts(counts);
      } catch (err) {
        console.error("Error loading profile", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-gray-400">Loading...</div>;
  }

  if (!userInfo) {
    return <div className="text-center mt-10 text-red-400">User not found</div>;
  }

  const totalSolved = solvedProblems.length;
  const progressPercent = Math.round((totalSolved / TOTAL_PROBLEMS) * 100);

  // Extract submission dates for the calendar
  const submissionDates = solvedProblems.map(p => p.solvedAt?.slice(0, 10));

  // Calendar logic: last 60 days
  const today = new Date();
  const recentDates = [];
  for (let i = 59; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    const str = day.toISOString().slice(0, 10);
    recentDates.push(str);
  }

  const dateMap = {};
  submissionDates.forEach(d => {
    dateMap[d] = (dateMap[d] || 0) + 1;
  });

  const getBoxColor = count =>
    count >= 3 ? 'bg-green-400' : count === 2 ? 'bg-yellow-400' : count === 1 ? 'bg-green-900' : 'bg-gray-700';

  return (
    <div className="min-h-screen bg-[#161A23] px-4 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="bg-[#23253B] rounded-xl shadow-md p-6 flex items-center gap-6">
          <div className="bg-indigo-700 w-20 h-20 flex items-center justify-center rounded-full">
            <UserIcon className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {userInfo.firstName} {userInfo.lastName}
            </h1>
            <p className="flex items-center gap-2 text-sm text-gray-300 mt-1">
              <ShieldCheckIcon className="h-4 w-4 text-blue-300" />
              Role: {userInfo.role}
            </p>
            <p className="flex items-center gap-2 text-sm text-gray-400">
              <EnvelopeIcon className="h-4 w-4" />
              {userInfo.emailId}
            </p>
            <p className="flex items-center gap-2 text-sm text-gray-500">
              <CalendarIcon className="h-4 w-4" />
              Joined: {new Date(userInfo.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 my-8">
          {Object.entries(difficultyCounts).map(([key, count]) => (
            <div key={key} className="bg-[#23253B] rounded-xl shadow p-6 flex flex-col items-center">
              <p className="text-gray-300 font-semibold capitalize mb-2">{key}</p>
              <div className="w-[72px] h-[72px]">
                <CircularProgressbar
                  value={(count / TOTAL_PROBLEMS) * 100}
                  text={`${Math.round((count / TOTAL_PROBLEMS) * 100)}%`}
                  styles={buildStyles({
                    textColor: "#fff",
                    pathColor: COLOR_MAP[key],
                    trailColor: "#35365a"
                  })}
                />
              </div>
              <p className="mt-2 text-sm text-gray-400">
                {count} / {TOTAL_PROBLEMS}
              </p>
            </div>
          ))}

          {/* Total Solved Card */}
          <div className="bg-[#23253B] rounded-xl shadow p-6 flex flex-col items-center justify-center">
            <h4 className="text-white text-sm font-bold uppercase mb-2">Total Solved</h4>
            <div className="text-3xl font-bold text-indigo-200">{totalSolved}</div>
            <div className="w-full mt-2">
              <div className="h-2 w-full bg-gray-700 rounded-full">
                <div
                  className="h-2 bg-green-400 rounded-full transition duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-300">{progressPercent}% of 100</div>
          </div>
        </div>

        {/* Submission Calendar */}
        <div className="bg-[#23253B] rounded-xl shadow p-6 mb-6">
          <h3 className="text-white font-bold mb-3">Submissions Activity</h3>
          <div className="flex gap-1">
            {recentDates.map(date => (
              <div
                key={date}
                title={`${date}: ${dateMap[date] || 0} submissions`}
                className={`w-4 h-4 rounded-sm ${getBoxColor(dateMap[date] || 0)}`}
              />
            ))}
          </div>
          <div className="text-xs text-gray-400 mt-2">Last 60 days</div>
        </div>

        {/* Solved Problem List */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Solved Problems ({totalSolved})
          </h2>
          <div className="grid gap-4">
            {solvedProblems.map(problem => (
              <div
                key={problem._id}
                className="bg-[#1F2033] border border-[#3A3B4D] rounded-lg p-4 shadow hover:bg-[#2A2B3D] transition"
              >
                <div className="text-lg font-bold text-indigo-200">{problem.title}</div>
                <p className="text-sm text-gray-400 mt-1">{problem.description}</p>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${DIFFICULTY_COLORS[problem.difficulty]}`}>
                    {problem.difficulty}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${TAG_COLORS[problem.tags]}`}>
                    {problem.tags}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
