import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { loginUser } from "../services/authService";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(formData);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert("Invalid Credentials");
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-8"> {/* Increased overall spacing */}
        <div className="text-center">
          <h1 className="text-4xl font-black mb-2 text-white">
            Welcome Back
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            Login to manage your applications
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5"> {/* Consistent gap between fields */}
          <div className="space-y-2"> {/* Gap between label and input */}
            <label className="block text-sm font-medium text-slate-300 ml-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder:text-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all duration-300"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300 ml-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder:text-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all duration-300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors duration-300 rounded-xl py-3.5 font-bold text-[15px] mt-4 shadow-lg shadow-cyan-500/20"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-slate-400">
          Don’t have an account?{" "}
          <Link to="/register" className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">
            Register here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;