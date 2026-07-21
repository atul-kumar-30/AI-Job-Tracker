import { FaBriefcase, FaChartBar, FaUser } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="h-screen w-screen bg-slate-950 text-white flex overflow-hidden font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-[280px] bg-slate-900 border-r border-slate-800 p-[24px] flex flex-col justify-between shrink-0 z-10">
        <div>
          <div className="mb-[40px] flex items-center gap-[12px] px-[8px]">
             <div className="w-[40px] h-[40px] rounded-[12px] bg-cyan-500 flex items-center justify-center font-bold text-[20px] text-slate-950 shadow-md shadow-cyan-500/20">
                JT
             </div>
             <h1 className="text-[24px] font-bold tracking-tight text-white">
              JobTracker
            </h1>
          </div>

          <nav className="space-y-[8px]">
            <Link
              to="/dashboard"
              className={`flex items-center gap-[12px] px-[16px] py-[14px] rounded-[12px] transition-all font-medium ${
                isActive("/dashboard") ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <FaChartBar className="text-[18px]" /> Dashboard
            </Link>
            <Link
              to="/applications"
              className={`flex items-center gap-[12px] px-[16px] py-[14px] rounded-[12px] transition-all font-medium ${
                isActive("/applications") ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <FaBriefcase className="text-[18px]" /> Applications
            </Link>
            
            {/* NEW: Profile Link added here! */}
            <Link
              to="/profile"
              className={`flex items-center gap-[12px] px-[16px] py-[14px] rounded-[12px] transition-all font-medium ${
                isActive("/profile") ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <FaUser className="text-[18px]" /> Profile
            </Link>
          </nav>
        </div>

        <button
          onClick={logout}
          className="w-full py-[14px] rounded-[12px] bg-slate-800 text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-all font-semibold"
        >
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 h-full overflow-y-auto bg-slate-950 p-[32px] md:p-[48px]">
        <div className="max-w-[1200px] mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
};

export default DashboardLayout;