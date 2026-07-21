const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
      
      {/* Enhanced Floating Glow Effects */}
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full top-0 left-0 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute w-[400px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full bottom-0 right-0 translate-x-1/3 translate-y-1/3"></div>

      {/* Main Glassmorphism Card */}
      <div className="relative w-full max-w-md z-10 backdrop-blur-2xl bg-slate-900/50 border border-white/10 rounded-[2rem] p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;