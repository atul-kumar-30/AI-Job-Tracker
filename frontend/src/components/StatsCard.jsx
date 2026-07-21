const StatsCard = ({ title, value, color }) => {
  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 transition-all duration-300 hover:bg-slate-800/50 hover:-translate-y-1">
      <p className="text-slate-400 font-medium mb-3 text-sm uppercase tracking-wider">
        {title}
      </p>
      <h2 className={`text-5xl font-black ${color}`}>
        {value}
      </h2>
    </div>
  );
};

export default StatsCard;