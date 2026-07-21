import { useEffect, useState, useRef } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { getJobs, updateJobStatus } from "../services/jobService";
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaMoneyBillWave,
  FaChevronLeft,
  FaChevronRight,
  FaCrosshairs, // NEW ICON
  FaRobot,      // NEW ICON
  FaPlus        // ADD BUTTON ICON
} from "react-icons/fa";
import CoverLetterModal from "../components/CoverLetterModal";
import AtsModal from "../components/AtsModal"; // NEW IMPORT
import AddJobModal from "../components/AddJobModal"; // ADD JOB MODAL

const ApplicationsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  
  // Modals State
  const [selectedJobForAI, setSelectedJobForAI] = useState(null);
  const [selectedJobForAts, setSelectedJobForAts] = useState(null); // NEW STATE
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // ADD MODAL STATE
  
  // Drag State
  const [activeColumn, setActiveColumn] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  // --- DRAG AND DROP HANDLERS ---
  const handleDragStart = (e, jobId) => {
    e.dataTransfer.setData("jobId", jobId);
    setTimeout(() => { e.target.style.opacity = "0.5"; }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
    setActiveColumn(null);
  };

  const handleDragOver = (e, columnName) => {
    e.preventDefault();
    setActiveColumn(columnName);
  };

  const handleDragLeave = () => {
    setActiveColumn(null);
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    setActiveColumn(null);
    const jobId = e.dataTransfer.getData("jobId");

    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job._id === jobId ? { ...job, status: newStatus } : job
      )
    );

    try {
      await updateJobStatus(jobId, newStatus);
    } catch (error) {
      fetchJobs(); 
    }
  };

  // Filters & Columns
  const searchedJobs = jobs.filter(
    (job) =>
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.role.toLowerCase().includes(search.toLowerCase())
  );

  const columns = {
    Applied: { name: "Applied", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", items: searchedJobs.filter((job) => job.status === "Applied") },
    Interview: { name: "Interview", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", items: searchedJobs.filter((job) => job.status === "Interview") },
    Offer: { name: "Offer", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", items: searchedJobs.filter((job) => job.status === "Offer") },
    Rejected: { name: "Rejected", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", items: searchedJobs.filter((job) => job.status === "Rejected") },
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Applications Pipeline</h1>
          <p className="text-slate-400 text-sm">
            Drag and drop cards. Use AI to score your match and generate cover letters.
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search company or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-cyan-500 transition-colors shadow-sm"
            />
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-3 rounded-xl flex items-center gap-2 transition-colors whitespace-nowrap shadow-lg shadow-cyan-500/20"
          >
            <FaPlus /> Add New
          </button>
        </div>
      </div>

      <div className="relative group">
        <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-slate-800/90 backdrop-blur-sm border border-slate-700 text-white shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-slate-700 hover:border-cyan-500 hover:scale-110">
          <FaChevronLeft className="text-lg" />
        </button>

        <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-6 min-h-[60vh] scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {Object.entries(columns).map(([key, column]) => (
            <div
              key={key}
              onDragOver={(e) => handleDragOver(e, key)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, key)}
              className={`flex flex-col flex-shrink-0 w-80 bg-slate-900/50 border rounded-2xl overflow-hidden transition-all duration-300 ${
                activeColumn === key ? "border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]" : "border-slate-800"
              }`}
            >
              <div className="p-4 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
                <h3 className={`font-bold ${column.color}`}>{column.name}</h3>
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${column.bg} ${column.color} ${column.border} border`}>{column.items.length}</span>
              </div>

              <div className="p-4 flex-1 space-y-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {column.items.length === 0 ? (
                  <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-800 rounded-xl text-slate-500 text-sm font-medium">Drop here</div>
                ) : (
                  column.items.map((job) => (
                    <div
                      key={job._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, job._id)}
                      onDragEnd={handleDragEnd}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-600 transition-colors cursor-grab active:cursor-grabbing group/card flex flex-col"
                    >
                      <div className="flex-1">
                        <h4 className="font-bold text-white group-hover/card:text-cyan-400 transition-colors">{job.role}</h4>
                        <p className="text-slate-400 text-sm mb-4">{job.company}</p>

                        <div className="space-y-2 mb-4">
                          {job.location && (
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                              <FaMapMarkerAlt className="text-slate-600" />{job.location}
                            </div>
                          )}
                          {job.salary && (
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                              <FaMoneyBillWave className="text-slate-600" />{job.salary}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* NEW: 2-Button Grid Layout */}
                      <div className="pt-3 border-t border-slate-800/50 mt-auto grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => setSelectedJobForAts(job)}
                          className="w-full py-2 bg-slate-900 hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 text-xs font-bold rounded-lg transition-colors border border-slate-800 hover:border-cyan-500/30 flex items-center justify-center gap-1.5"
                        >
                          <FaCrosshairs /> ATS Score
                        </button>
                        <button 
                          onClick={() => setSelectedJobForAI(job)}
                          className="w-full py-2 bg-slate-900 hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 text-xs font-bold rounded-lg transition-colors border border-slate-800 hover:border-cyan-500/30 flex items-center justify-center gap-1.5"
                        >
                          <FaRobot /> AI Letter
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-slate-800/90 backdrop-blur-sm border border-slate-700 text-white shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-slate-700 hover:border-cyan-500 hover:scale-110">
          <FaChevronRight className="text-lg" />
        </button>
      </div>
      
      {/* Modals */}
      <CoverLetterModal 
        isOpen={!!selectedJobForAI} 
        onClose={() => setSelectedJobForAI(null)} 
        job={selectedJobForAI} 
      />
      
      <AtsModal 
        isOpen={!!selectedJobForAts} 
        onClose={() => setSelectedJobForAts(null)} 
        job={selectedJobForAts} 
      />
      
      {isAddModalOpen && (
        <AddJobModal 
          closeModal={() => setIsAddModalOpen(false)} 
          refreshJobs={fetchJobs} 
        />
      )}
      
    </DashboardLayout>
  );
};

export default ApplicationsPage;