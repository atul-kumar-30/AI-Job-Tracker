import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { registerUser } from "../services/authService";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const generateStrongPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let generated = "";
    for (let i = 0; i < 16; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password: generated });
    setShowPassword(true); // Automatically show the password so they can copy it
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await registerUser(formData);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert("Registration Failed");
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-2 text-white">
            Create Account
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            Start tracking your applications smarter
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300 ml-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              autoComplete="name"
              className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder:text-slate-500 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 transition-all duration-300"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300 ml-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder:text-slate-500 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 transition-all duration-300"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300 ml-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
                autoComplete="new-password"
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-5 py-3.5 pr-16 text-white placeholder:text-slate-500 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
            <div className="flex justify-end mt-1 pr-1">
              <button
                type="button"
                onClick={generateStrongPassword}
                className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                ✨ Suggest strong password
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-400 text-white transition-colors duration-300 rounded-xl py-3.5 font-bold text-[15px] mt-4 shadow-lg shadow-purple-500/20"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/" className="text-purple-400 font-semibold hover:text-purple-300 transition-colors">
            Login here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;