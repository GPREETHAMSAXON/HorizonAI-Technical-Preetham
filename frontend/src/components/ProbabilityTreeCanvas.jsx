import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import WebGLBackground from './WebGLBackground';


// HEATMAP COLOR LOGIC
const getDynamicColor = (prob, highestProb) => {
  if (prob === highestProb) return 'bg-sky-400 drop-shadow-[0_0_20px_rgba(56,189,248,0.8)]';
  if (prob > 25) return 'bg-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]';
  if (prob > 10) return 'bg-indigo-500/80';
  if (prob > 5) return 'bg-purple-600/70';
  return 'bg-slate-700/50';
};

const ProbabilityTreeCanvas = ({ data, onReset }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Mouse Tracking for Interactive Glow
  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!data || !data.final_distribution) return null;

  const chartData = Object.entries(data.final_distribution).map(([state, prob]) => ({
    state,
    prob: prob * 100
  }));

  const highestProb = Math.max(...chartData.map(d => d.prob));

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
  };

  const barVariants = {
    hidden: { height: 0 },
    show: { height: "100%", transition: { type: "spring", stiffness: 40, damping: 15 } }
  };

  return (
    <div className="fixed inset-0 z-50 w-full min-h-screen text-white overflow-hidden flex flex-col items-center justify-center p-4 md:p-12">
      {/* Lock progress to 100 so it stays as a scattered galaxy */}
      <WebGLBackground progress={100} isSimulating={false} />

      {/* Interactive Mouse Flashlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        animate={{ background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(56, 189, 248, 0.05), transparent 80%)` }}
      />

      {/* The macOS Terminal Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-6xl h-[85vh] bg-[#0a0a0c]/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_30px_100px_-15px_rgba(0,0,0,0.8),_0_0_40px_rgba(56,189,248,0.1)] flex flex-col overflow-hidden"
      >
        {/* macOS Top Bar */}
        <div className="w-full h-12 bg-white/[0.02] border-b border-white/5 flex items-center relative px-4 flex-shrink-0">
          <div className="flex space-x-2 absolute left-4">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-inner"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-inner"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-inner"></div>
          </div>
          <div className="w-full text-center text-xs font-mono text-white/40 tracking-widest">
            bash ~ monte_carlo_results
          </div>
          <button onClick={onReset} className="absolute right-4 text-xs font-mono text-sky-400 hover:text-white transition-colors">
            [ Recalibrate ]
          </button>
        </div>

        {/* Content Area */}
        <div className="p-8 md:p-12 flex flex-col grow relative">

          <div className="mb-8">
            <span className="text-sky-400 font-mono tracking-widest uppercase text-xs mb-2 block opacity-80">
              Total Iterations: {data.total_simulations}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white">
              Digital Twin Forecast.
            </h1>
          </div>

          {/* The Graph */}
          <div className="grow w-full flex flex-col justify-end mt-auto pb-4">
            <motion.div
              variants={containerVariants} initial="hidden" animate="show"
              className="flex items-end justify-between w-full h-full relative z-10 gap-2 md:gap-6"
            >
              {chartData.map((item) => {
                const isWinner = item.prob === highestProb;
                const barColorClass = getDynamicColor(item.prob, highestProb);

                return (
                  <div key={item.state} className="flex flex-col items-center justify-end h-full w-full group relative cursor-pointer">

                    {/* Floating Percentages */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
                      className="mb-4 flex flex-col items-center transition-transform duration-300 group-hover:-translate-y-2"
                    >
                      <span className={`text-2xl md:text-4xl font-black tracking-tighter ${isWinner ? 'text-sky-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]' : 'text-white'} group-hover:text-white transition-colors`}>
                        {item.prob.toFixed(1)}<span className="text-sm md:text-xl opacity-40">%</span>
                      </span>
                    </motion.div>

                    {/* The Color-Coded Bar Track with Interactive Brightness */}
                    <div className="w-full max-w-[100px] h-[35vh] md:h-[40vh] bg-white/[0.02] border-x border-t border-white/5 flex items-end justify-center relative overflow-hidden rounded-t-sm group-hover:bg-white/[0.05] transition-colors">
                      <motion.div
                        variants={barVariants}
                        style={{ height: `${item.prob}%` }}
                        className={`w-full absolute bottom-0 ${barColorClass} transition-all duration-300 group-hover:brightness-125 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]`}
                      />
                    </div>

                    {/* Label */}
                    <div className="w-full border-t border-white/20 pt-4 mt-0 flex justify-center">
                      <span className="text-[10px] md:text-xs font-mono tracking-widest text-white/60 group-hover:text-sky-400 transition-colors text-center uppercase h-10 flex items-start px-1">
                        {item.state}
                      </span>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default ProbabilityTreeCanvas;