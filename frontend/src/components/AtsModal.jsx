import { useState, useEffect } from "react";
import { FaTimes, FaCrosshairs, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import { getAtsScore } from "../services/aiService";

const AtsModal = ({ isOpen, onClose, job }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && job) {
      analyzeMatch();
    } else {
      setResult(null);
      setError("");
    }
  }, [isOpen, job]);

  const analyzeMatch = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAtsScore({
        company: job.company,
        role: job.role,
        jobDescription: job.notes,
      });
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze profile. Please ensure your Skills and Bio are saved in the Profile tab.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !job) return null;

  // SVG Ring Calculations
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = result 
    ? circumference - (result.matchPercentage / 100) * circumference 
    : circumference;

  // Determine Ring Color
  let ringColor = "text-cyan-500";
  let glowColor = "shadow-cyan-500/20";
  if (result) {
    if (result.matchPercentage >= 80) {
      ringColor = "text-green-500";
      glowColor = "shadow-green-500/20";
    } else if (result.matchPercentage >= 50) {
      ringColor = "text-yellow-500";
      glowColor = "shadow-yellow-500/20";
    } else {
      ringColor = "text-red-500";
      glowColor = "shadow-red-500/20";
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center ${ringColor} border border-slate-700`}>
              <FaCrosshairs className="text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">ATS Match Score</h2>
              <p className="text-slate-400 text-sm">For {job.role} at {job.company}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-2">
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin"></div>
              <p className="text-cyan-400 font-semibold animate-pulse">Scanning Resume vs Job Description...</p>
            </div>
          ) : error ? (
            <div className="h-64 flex flex-col items-center justify-center text-center">
              <FaExclamationTriangle className="text-4xl text-red-400 mb-4" />
              <p className="text-red-400">{error}</p>
            </div>
          ) : result ? (
            <div className="flex flex-col md:flex-row gap-8 items-center">
              
              {/* Circular Progress Bar */}
              <div className="relative flex items-center justify-center">
                <svg className="w-48 h-48 transform -rotate-90">
                  {/* Background Circle */}
                  <circle
                    cx="96" cy="96" r={radius}
                    stroke="currentColor" strokeWidth="12" fill="transparent"
                    className="text-slate-800"
                  />
                  {/* Foreground Animated Circle */}
                  <circle
                    cx="96" cy="96" r={radius}
                    stroke="currentColor" strokeWidth="12" fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className={`${ringColor} transition-all duration-1500 ease-out`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-white">{result.matchPercentage}%</span>
                  <span className="text-xs text-slate-400 font-medium tracking-wider">MATCH</span>
                </div>
              </div>

              {/* Data & Feedback */}
              <div className="flex-1 space-y-6">
                <div>
                  <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                    <FaCheckCircle className="text-slate-500" /> Missing Keywords to Add
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.missingKeywords.map((keyword, index) => (
                      <span key={index} className="px-3 py-1 bg-slate-950 border border-slate-700 rounded-lg text-sm text-cyan-400 font-medium">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                  <h3 className="text-slate-300 font-bold mb-1 text-sm">AI Feedback</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{result.feedback}</p>
                </div>
              </div>

            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AtsModal;