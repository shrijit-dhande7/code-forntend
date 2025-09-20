
import { useEffect, useState, useRef } from 'react';
import { NavLink, Navigate,Link ,useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';
import { motion } from 'framer-motion';
import { FaCode, FaUser, FaSignOutAlt, FaFilter, FaCheck ,FaCog} from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';
import heroImg from '../assets/leetcode_1.webp';
import Header from "../components/Header";
import LandingAnimation from'../UI_Design/landingSteps'
import Leaderboard from './Leadboard'
// 🖌️ Dark Neon Color Theme
const COLORS = {
  bg: '#0B1120',
  primary: '#0F172A',
  secondary: '#1E293B',
  accent: '#3B82F6',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  gray: '#94A3B8',
  highlight: '#A855F7',
};

export default function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ difficulty: 'all', tag: 'all', status: 'all' });

  const problemSectionRef = useRef(null);

  // 🧠 Authentication protection
//  if (!user) return <Navigate to="/login" />;

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data);
      } catch (err) {
        console.error('Error loading problems', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchSolved = async () => {
       if (!user) return; 
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(data);
      } catch (err) {
        console.error('Error fetching solved problems:', err);
      }
    };

    fetchProblems();
    if (user) fetchSolved();
  }, [user]);

  // 🧠 Filter logic
  const filtered = problems.filter((p) => {
    const d = filters.difficulty === 'all' || p.difficulty === filters.difficulty;
    const t = filters.tag === 'all' || (p.tags && p.tags.includes(filters.tag));
    const s =
      filters.status === 'all' ||
      (filters.status === 'solved' && solvedProblems.some((sp) => sp._id === p._id));
    return d && t && s;
  });

  const scrollToProblems = () => {
    problemSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getDiffColor = (level) => {
    switch (level) {
      case 'easy': return COLORS.success;
      case 'medium': return COLORS.warning;
      case 'hard': return COLORS.danger;
      default: return COLORS.gray;
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
  };

const navigate = useNavigate();
   const handleClick = () => {
    if (user) {
      navigate("/leaderboard");
    } else {
      alert("Please login first to view the leaderboard.");
      // Replace with your popup/modal code here
    }
   }

const gotoProblems = (problemId) => {
  if (user) {
    navigate(`/problem/${problemId}`);
  } else {
    alert("Please login first to view the leaderboard.");
    // Replace with popup/modal code if needed
  }
};

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ background: COLORS.bg }}>
      {/* HEADER */}

<Header
  user={user}
  COLORS={COLORS}
  handleLogout={handleLogout}
/>

      {/* HERO */}
      <section className="relative pt-28 pb-20 text-center px-4">
        <motion.h1
          className="text-4xl md:text-5xl font-bold"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Master Your Coding Journey
        </motion.h1>
        <p className="text-gray-400 text-lg mt-3">Sharpen your skills. Track your growth. Beat every challenge.</p>

        <motion.div
          className="flex justify-center gap-6 mt-8 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button onClick={scrollToProblems} className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full font-semibold transition">
            Start Solving
          </button>
        <button
      className="border border-blue-400 hover:bg-blue-800 px-6 py-2 rounded-full transition font-semibold"
      onClick={handleClick}
    >
      Leaderboard
    </button>
        </motion.div>

        {/* Floating Code Symbols */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-indigo-400 text-lg font-mono select-none"
            style={{
              top: `${Math.random() * 90}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.07 + Math.random() * 0.3,
            }}
            animate={{
              y: [0, 25, 0],
              x: [0, 15, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
            }}
          >
            {['{', '}', '<', '>', '=', ';'][Math.floor(Math.random() * 6)]}
          </motion.div>
        ))}
      </section>
<LandingAnimation></LandingAnimation>
      {/* FILTERS */}
      <section className="bg-[#111827] py-6 px-4 border-t border-gray-800">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-4">
          {['status', 'difficulty', 'tag'].map((filter) => (
            <div key={filter}>
              <label className="block mb-1 text-gray-300 capitalize">{filter}</label>
              <select
                className="w-full rounded-md px-3 py-2 bg-gray-900 text-white border border-gray-700"
                value={filters[filter]}
                onChange={(e) => setFilters({ ...filters, [filter]: e.target.value })}
              >
                {filter === 'status' && (
                  <>
                    <option value="all">All</option>
                    <option value="solved">Solved</option>
                  </>
                )}
                {filter === 'difficulty' && (
                  <>
                    <option value="all">All</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </>
                )}
                {filter === 'tag' && (
                  <>
                    <option value="all">All</option>
                    <option value="array">Array</option>
                    <option value="linkedList">Linked List</option>
                    <option value="graph">Graph</option>
                      <option value="stack">Stack</option>
                    <option value="queue">Queue</option>
                    <option value="dp">Dynamic Programming</option>
                  </>
                )}
              </select>
            </div>
          ))}
        </div>
      </section>

      {/* PROBLEMS LIST */}
      <section className="py-10 px-4" ref={problemSectionRef}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">🚀 Problems ({filtered.length})</h2>

          {loading ? (
            <p className="text-center text-gray-500">Loading problems...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-500">No problems match current filters.</p>
          ) : (
            <div className="space-y-6">
              {filtered.map((problem) => (
                <motion.div
                  key={problem._id}
                  whileHover={{ scale: 1.015 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#1e293b] border border-gray-700 p-4 rounded-lg shadow-sm flex justify-between items-start"
                >
                  <div>
                    <button  onClick={() => gotoProblems(problem._id)} className="text-lg font-semibold hover:underline">
                      {problem.title}
                    </button>
                    <div className="flex gap-2 mt-1 flex-wrap text-sm">
                      <span style={{ backgroundColor: getDiffColor(problem.difficulty) }} className="px-2 py-0.5 rounded-full text-black font-semibold capitalize">
                        {problem.difficulty}
                      </span>
                      {problem.tags && problem.tags.length > 0 && (
                        <span className="text-xs text-gray-400 border border-gray-600 px-2 py-0.5 rounded-full">
                          {/* {problem.tags.join(', ')} */}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex-shrink-0 flex items-center gap-2">
                    {solvedProblems.some((sp) => sp._id === problem._id) && (
                      <FaCheck className="text-green-400" title="Solved" />
                    )}
                <button
                onClick={() => gotoProblems(problem._id)}
                className="text-sm px-3 py-1 bg-blue-600 rounded-full hover:bg-blue-700 transition"
                   >
                    Solve
                      </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0F172A] py-6 text-center text-gray-400 border-t border-gray-700">
        <p>&copy; {new Date().getFullYear()} Code_Decode • Practice. Compete. Conquer 💪</p>
      </footer>
    </div>
  );
}
