import { useState } from "react";
import { FaTimes, FaRobot, FaCopy, FaCheck } from "react-icons/fa";
import { generateCoverLetter } from "../services/aiService";

const CoverLetterModal = ({ isOpen, onClose, job }) => {
  const [loading, setLoading] = useState(false);
  const [letter, setLetter] = useState("");
  const [copied, setCopied] = useState(false);

  if (!isOpen || !job) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setLetter("");
    try {
      // Send the job data to our new Gemini backend!
      const data = await generateCoverLetter({
        company: job.company,
        role: job.role,
        jobDescription: job.notes,
      });
      setLetter(data.coverLetter);
    } catch (error) {
      console.error(error);
      setLetter("Failed to generate cover letter. Please ensure your Profile is filled out and your API key is correct.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
              <FaRobot className="text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Cover Letter</h2>
              <p className="text-slate-400 text-sm">For {job.role} at {job.company}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-2">
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
          {!letter && !loading ? (
            <div className="h-64 flex flex-col items-center justify-center text-center space-y-4">
              <FaRobot className="text-5xl text-slate-700 mb-2" />
              <p className="text-slate-400 max-w-md">
                Click below to let Gemini analyze your profile and draft a highly personalized cover letter for this specific role.
              </p>
              <button 
                onClick={handleGenerate}
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2"
              >
                ✨ Generate Letter Now
              </button>
            </div>
          ) : loading ? (
            <div className="h-64 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin"></div>
              <p className="text-cyan-400 font-semibold animate-pulse">Gemini is writing...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button 
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg transition-colors border border-slate-700"
                >
                  {copied ? <FaCheck className="text-green-400" /> : <FaCopy className="text-cyan-400" />}
                  {copied ? "Copied!" : "Copy to Clipboard"}
                </button>
              </div>
              <textarea 
                className="w-full h-96 bg-slate-950 border border-slate-800 rounded-xl p-6 text-slate-300 leading-relaxed outline-none focus:border-cyan-500 transition-colors resize-none custom-scrollbar"
                value={letter}
                onChange={(e) => setLetter(e.target.value)}
              />
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default CoverLetterModal;