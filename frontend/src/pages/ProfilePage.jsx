import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { FaUserCircle, FaGithub, FaLinkedin, FaBriefcase, FaCode, FaLock, FaTrashAlt, FaCamera } from "react-icons/fa";
import { getUserProfile, updateUserProfile, changePassword, deleteAccount } from "../services/userService";

const ProfilePage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    bio: "",
    skills: "",
    profilePhoto: "",
  });
  
  const fileInputRef = useRef(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Convert to base64 string
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePhoto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculate AI Readiness Score
  const calculateReadiness = () => {
    let score = 0;
    if (formData.role && formData.role.length > 2) score += 20;
    if (formData.bio && formData.bio.length > 30) score += 40;
    
    // Count skills (split by comma)
    const skillsList = formData.skills ? formData.skills.split(",").map(s => s.trim()).filter(s => s !== "") : [];
    if (skillsList.length >= 3) score += 40;
    else if (skillsList.length > 0) score += 20;

    return score;
  };

  const aiScore = calculateReadiness();

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // NOW FETCHING REAL DATA FROM MONGODB!
      const data = await getUserProfile();
      setFormData({
        name: data.name || "",
        email: data.email || "", 
        role: data.role || "",
        bio: data.bio || "",
        skills: data.skills || "",
        profilePhoto: data.profilePhoto || "",
      });
    } catch (error) {
      console.error("Failed to load profile", error);
    }
  };

  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile(formData);
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile.");
      console.error(error);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    
    try {
      await changePassword(passwords);
      alert("Password updated successfully!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      alert("Failed to change password. Check your current password.");
      console.error(error);
    }
  };

  const handleDeleteAccount = async () => {
    const isConfirmed = window.confirm(
      "Are you absolutely sure? This will delete your account and all your saved job applications permanently."
    );
    
    if (isConfirmed) {
      try {
        await deleteAccount();
        localStorage.removeItem("token");
        navigate("/");
      } catch (error) {
        alert("Failed to delete account.");
        console.error(error);
      }
    }
  };

  return (
    <DashboardLayout>
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-1">Your Profile</h1>
        <p className="text-slate-400 text-sm">
          Manage your personal information, security, and AI context.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
            <div 
              className="w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center mb-4 border-4 border-slate-950 shadow-lg relative group cursor-pointer overflow-hidden"
              onClick={() => fileInputRef.current?.click()}
              title="Click to update photo"
            >
              {formData.profilePhoto ? (
                <img src={formData.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <FaUserCircle className="text-7xl text-slate-500 group-hover:opacity-50 transition-opacity" />
              )}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <FaCamera className="text-white text-2xl" />
              </div>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handlePhotoChange} 
              className="hidden" 
            />
            <h2 className="text-xl font-bold text-white">{formData.name || "Loading..."}</h2>
            <p className="text-cyan-400 font-medium text-sm mb-4">{formData.role || "Add your role"}</p>
          </div>
          
          {/* DYNAMIC AI READINESS */}
          <div className={`border rounded-2xl p-6 transition-colors ${
            aiScore === 100 
              ? "bg-green-500/10 border-green-500/30" 
              : aiScore >= 60 
              ? "bg-yellow-500/10 border-yellow-500/30"
              : "bg-red-500/10 border-red-500/30"
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`font-bold flex items-center gap-2 ${
                aiScore === 100 ? "text-green-400" : aiScore >= 60 ? "text-yellow-400" : "text-red-400"
              }`}>
                 ✨ AI Readiness
              </h3>
              <span className={`text-xl font-bold ${
                aiScore === 100 ? "text-green-400" : aiScore >= 60 ? "text-yellow-400" : "text-red-400"
              }`}>
                {aiScore}%
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-slate-950 rounded-full h-2.5 mb-4 border border-slate-800">
              <div 
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  aiScore === 100 ? "bg-green-500" : aiScore >= 60 ? "bg-yellow-500" : "bg-red-500"
                }`} 
                style={{ width: `${aiScore}%` }}
              ></div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              {aiScore === 100 
                ? "Your profile is fully optimized! Gemini has enough context to generate highly accurate cover letters and ATS scores." 
                : "Add a longer professional bio (30+ characters) and at least 3 core skills to unlock the best AI results."}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* PERSONAL DETAILS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-white mb-6">Personal Details</h2>
            
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 ml-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleProfileChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 ml-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-500 outline-none cursor-not-allowed"
                    readOnly
                    title="Email cannot be changed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400 ml-1 flex items-center gap-2">
                   <FaBriefcase /> Target Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleProfileChange}
                  placeholder="e.g. Frontend Developer, ML Engineer"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400 ml-1">Professional Bio</label>
                <textarea
                  name="bio"
                  rows="3"
                  value={formData.bio}
                  onChange={handleProfileChange}
                  placeholder="A short summary of your background..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500 transition-colors resize-none custom-scrollbar"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400 ml-1 flex items-center gap-2">
                   <FaCode /> Core Skills (Comma separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleProfileChange}
                  placeholder="React, Python, Machine Learning..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
              
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>

          {/* SECURITY */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <FaLock className="text-slate-400" /> Security
            </h2>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400 ml-1">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwords.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500 transition-colors block"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 ml-1">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Create new password"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500 transition-colors"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 ml-1">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all border border-slate-700"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>

          {/* DANGER ZONE */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-red-400 mb-2 flex items-center gap-2">
              <FaTrashAlt /> Danger Zone
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              Permanently delete your account and all associated job tracking data. This action cannot be undone.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="px-6 py-3 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white font-bold rounded-xl transition-all border border-red-500/20"
            >
              Delete Account
            </button>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;