import { useState } from "react";
import { createJob } from "../services/jobService";

const AddJobModal = ({ closeModal, refreshJobs }) => {
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    status: "Applied",
    location: "",
    salary: "",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createJob(formData);
      refreshJobs();
      closeModal();
    } catch (error) {
      console.log(error);
      alert("Failed to create job");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background Blur Overlay */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={closeModal}
      ></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-white">Add New Application</h2>
          <button
            onClick={closeModal}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <input
              type="text"
              name="company"
              placeholder="Company Name"
              value={formData.company}
              onChange={handleChange}
              className="bg-slate-950/50 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder:text-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all"
            />
            <input
              type="text"
              name="role"
              placeholder="Job Role"
              value={formData.role}
              onChange={handleChange}
              className="bg-slate-950/50 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder:text-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="bg-slate-950/50 border border-white/10 rounded-xl px-5 py-3.5 text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all appearance-none cursor-pointer"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394A3B8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.2rem top 50%', backgroundSize: '0.65rem auto' }}
            >
              <option>Applied</option>
              <option>Interview</option>
              <option>Rejected</option>
              <option>Offer</option>
            </select>
            <input
              type="text"
              name="location"
              placeholder="Location (e.g. Pune, Remote)"
              value={formData.location}
              onChange={handleChange}
              className="bg-slate-950/50 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder:text-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all"
            />
          </div>

          <input
            type="text"
            name="salary"
            placeholder="Salary / CTC"
            value={formData.salary}
            onChange={handleChange}
            className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder:text-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all"
          />

          <textarea
            name="notes"
            placeholder="Any notes or requirements..."
            rows="3"
            value={formData.notes}
            onChange={handleChange}
            className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder:text-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all resize-none"
          />

          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors duration-300 rounded-xl py-3.5 font-bold text-[15px] mt-4 shadow-lg shadow-cyan-500/20"
          >
            Save Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddJobModal;