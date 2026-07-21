import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { getJobs } from "../services/jobService";
import { FaBriefcase, FaCalendarCheck, FaTrophy, FaTimesCircle } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const DashboardPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- DATA PROCESSING FOR CHARTS ---
  const appliedCount = jobs.filter((j) => j.status === "Applied").length;
  const interviewCount = jobs.filter((j) => j.status === "Interview").length;
  const offerCount = jobs.filter((j) => j.status === "Offer").length;
  const rejectedCount = jobs.filter((j) => j.status === "Rejected").length;

  // Data for the Pie Chart
  const pieData = [
    { name: "Applied", value: appliedCount, color: "#22d3ee" },   // Cyan
    { name: "Interview", value: interviewCount, color: "#facc15" }, // Yellow
    { name: "Offer", value: offerCount, color: "#c084fc" },       // Purple
    { name: "Rejected", value: rejectedCount, color: "#f87171" }, // Red
  ];

  // Filter out empty categories so the pie chart looks clean
  const activePieData = pieData.filter(item => item.value > 0);

  // Data for the Bar Chart
  const barData = [
    { name: "Pipeline Health", Applied: appliedCount, Interview: interviewCount, Offer: offerCount }
  ];

  // Custom Tooltip for dark mode
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
          <p className="text-white font-medium">{`${payload[0].name} : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Analytics Overview</h1>
        <p className="text-slate-400 text-sm">
          Track your application conversion rates and pipeline health.
        </p>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
          <h2 className="text-xl font-bold text-white mb-2">No data to display yet</h2>
          <p className="text-slate-400">Head over to the Applications tab to add your first job!</p>
        </div>
      ) : (
        <>
          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-xl">
                <FaBriefcase />
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Applied</p>
                <h3 className="text-2xl font-bold text-white">{appliedCount}</h3>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-xl">
                <FaCalendarCheck />
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium">Interviews</p>
                <h3 className="text-2xl font-bold text-white">{interviewCount}</h3>
              </div>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xl">
                <FaTrophy />
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium">Offers</p>
                <h3 className="text-2xl font-bold text-white">{offerCount}</h3>
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-xl">
                <FaTimesCircle />
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium">Rejected</p>
                <h3 className="text-2xl font-bold text-white">{rejectedCount}</h3>
              </div>
            </div>
          </div>

          {/* CHARTS AREA */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* PIE CHART */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-white mb-6">Status Distribution</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={activePieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {activePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* BAR CHART */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-white mb-6">Active Pipeline Funnel</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" tick={{fill: '#94a3b8'}} />
                    <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8'}} />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: '#1e293b'}} />
                    <Bar dataKey="Applied" fill="#22d3ee" radius={[4, 4, 0, 0]} barSize={40} />
                    <Bar dataKey="Interview" fill="#facc15" radius={[4, 4, 0, 0]} barSize={40} />
                    <Bar dataKey="Offer" fill="#c084fc" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default DashboardPage;