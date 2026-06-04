import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingOverlay from './LoadingOverlay';
import WebGLBackground from './WebGLBackground';

const STATES = [
  { label: 'CS Student', value: 0 },
  { label: 'Junior Developer', value: 1 },
  { label: 'ML Engineer', value: 2 },
  { label: 'Procrastinator', value: 3 },
  { label: 'Stuck', value: 4 }
];

const QUESTIONS = [
  { text: "How do you handle a tough bug?", options: [{ text: "Dive deep into the logs and trace the code.", trait: "focus" }, { text: "Check social media while 'thinking' about it.", trait: "distraction" }] },
  { text: "What is your ideal work environment?", options: [{ text: "A quiet room with noise-canceling headphones.", trait: "focus" }, { text: "A bustling coffee shop with constant activity.", trait: "distraction" }] },
  { text: "After learning a new concept, what's your next step?", options: [{ text: "Immediately build a small project to test it.", trait: "focus" }, { text: "Queue up 5 more tutorials without coding anything.", trait: "distraction" }] },
  { text: "When you get stuck on a difficult problem:", options: [{ text: "Read the official documentation thoroughly.", trait: "focus" }, { text: "Ask on Reddit and tab out until someone replies.", trait: "distraction" }] }
];

const PersonalityQuiz = ({ onComplete }) => {
  const [selectedState, setSelectedState] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(-1);
  const [focusScore, setFocusScore] = useState(0);
  const [distractionScore, setDistractionScore] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleStateSelect = (value) => { setSelectedState(value); setCurrentQuestion(0); };
  const handleAnswerSelect = (trait) => {
    if (trait === 'focus') setFocusScore(prev => prev + 1);
    if (trait === 'distraction') setDistractionScore(prev => prev + 1);
    setCurrentQuestion(prev => prev + 1);
  };

  const handleSubmit = async () => {
    setIsSimulating(true);
    const calculatedModifier = distractionScore > focusScore ? 'high_distraction' : 'high_focus';
    try {
      await new Promise(resolve => setTimeout(resolve, 3200));
      const response = await fetch('http://127.0.0.1:8000/api/v1/simulate-career', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_state: selectedState, years_to_simulate: 5, num_simulations: 1000, modifier: calculatedModifier }),
      });
      const data = await response.json();
      onComplete(data);
    } catch (error) {
      console.error(error);
      alert('Simulation engine offline.');
      onComplete(null);
    } finally {
      setIsSimulating(false);
    }
  };

  const totalSteps = QUESTIONS.length + 1;
  const currentStep = currentQuestion === -1 ? 0 : currentQuestion + 1;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
  };

  return (
    <div className="fixed inset-0 z-50 w-full min-h-screen text-white overflow-hidden flex flex-col items-center justify-center p-4 md:p-12">

      <WebGLBackground progress={progressPercentage} isSimulating={isSimulating} />

      <motion.div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 mix-blend-screen"
        animate={{ background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(56, 189, 248, 0.12), transparent 80%)` }}
      />

      {/* The Loading Overlay smoothly enters when triggered */}
      <AnimatePresence>
        {isSimulating && <LoadingOverlay key="loading-overlay" />}
      </AnimatePresence>

      {/* THE FIX: Wrap the Terminal Window in AnimatePresence so it can unmount/hide gracefully */}
      <AnimatePresence>
        {!isSimulating && (
          <motion.div
            key="terminal-window"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            // Cinematic dissolve when user clicks "Run Simulation"
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)", transition: { duration: 0.6, ease: "easeInOut" } }}
            className="relative z-10 w-full max-w-5xl bg-[#0a0a0c]/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_30px_100px_-15px_rgba(0,0,0,0.8),_0_0_40px_rgba(56,189,248,0.1)] flex flex-col overflow-hidden"
          >
            <div className="w-full h-12 bg-white/[0.02] border-b border-white/5 flex items-center relative px-4">
              <div className="flex space-x-2 absolute left-4">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-inner"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-inner"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-inner"></div>
              </div>
              <div className="w-full text-center text-xs font-mono text-white/40 tracking-widest">
                bash ~ horizon-engine
              </div>
            </div>

            <div className="w-full h-[2px] bg-white/5">
              <motion.div className="h-full bg-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.8)]" initial={{ width: 0 }} animate={{ width: `${progressPercentage}%` }} transition={{ duration: 0.8 }} />
            </div>

            <div className="p-8 md:p-16 min-h-[500px] flex flex-col justify-center">
              <AnimatePresence mode="wait">

                {currentQuestion === -1 && (
                  <motion.div key="step-0" variants={pageVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50">
                      Initialize Your Reality.
                    </h1>
                    <p className="text-lg text-gray-400 mb-10 max-w-xl font-light">
                      Select your current coordinate in the professional grid to begin calibration.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {STATES.map((stateObj) => (
                        <button key={stateObj.label} onClick={() => handleStateSelect(stateObj.value)} className="group relative overflow-hidden p-6 border border-white/10 bg-white/[0.02] hover:bg-white/[0.08] hover:border-sky-500/30 transition-all duration-300 text-left rounded-xl">
                          <div className="absolute inset-0 bg-gradient-to-r from-sky-500/0 via-sky-500/10 to-sky-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                          <span className="relative z-10 text-xl font-medium text-white/80 group-hover:text-white transition-colors">{stateObj.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {currentQuestion >= 0 && currentQuestion < QUESTIONS.length && (
                  <motion.div key={`question-${currentQuestion}`} variants={pageVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
                    <span className="text-sky-400 font-mono mb-4 block text-xs tracking-widest uppercase opacity-80">
                      Parameter {currentQuestion + 1} / {QUESTIONS.length}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-12 max-w-3xl text-white/90">
                      {QUESTIONS[currentQuestion].text}
                    </h2>
                    <div className="flex flex-col space-y-4 max-w-2xl">
                      {QUESTIONS[currentQuestion].options.map((option, idx) => (
                        <button key={idx} onClick={() => handleAnswerSelect(option.trait)} className="group relative overflow-hidden py-5 px-6 border border-white/10 bg-white/[0.02] hover:bg-white/[0.08] hover:border-sky-500/40 transition-all duration-500 text-left rounded-xl">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-sky-400 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom"></div>
                          <span className="relative z-10 text-lg text-white/70 group-hover:text-white transition-colors pl-2">{option.text}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {currentQuestion === QUESTIONS.length && (
                  <motion.div key="step-final" variants={pageVariants} initial="hidden" animate="visible" exit="exit" className="w-full flex flex-col items-center text-center">
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6">
                      Calibration Complete.
                    </h2>
                    <p className="text-xl text-gray-400 mb-12 font-light max-w-lg">
                      Behavioral topography mapped. Ready to execute probabilistic modeling.
                    </p>
                    <button onClick={handleSubmit} disabled={isSimulating} className="group relative overflow-hidden px-10 py-5 bg-white text-black rounded-xl font-bold text-lg uppercase tracking-widest hover:scale-[1.02] transition-all duration-300 disabled:opacity-50">
                      <div className="absolute inset-0 bg-sky-400 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300 ease-in-out"></div>
                      <span className="relative z-10 group-hover:text-white transition-colors duration-300">Run Simulation</span>
                    </button>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PersonalityQuiz;