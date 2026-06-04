import React, { useState } from 'react';

const STATES = [
  { label: 'CS Student', value: 0 },
  { label: 'Backend Dev', value: 1 },
  { label: 'ML Engineer', value: 2 },
  { label: 'Procrastinator', value: 3 },
  { label: 'Stuck', value: 4 }
];

const QUESTIONS = [
  {
    text: "How do you handle a tough bug?",
    options: [
      { text: "Dive deep into the logs and trace the code.", trait: "focus" },
      { text: "Check social media while 'thinking' about it.", trait: "distraction" }
    ]
  },
  {
    text: "What is your ideal work environment?",
    options: [
      { text: "A quiet room with noise-canceling headphones.", trait: "focus" },
      { text: "A bustling coffee shop with constant activity.", trait: "distraction" }
    ]
  },
  {
    text: "After learning a new concept, what's your next step?",
    options: [
      { text: "Immediately build a small project to test it.", trait: "focus" },
      { text: "Queue up 5 more tutorials without coding anything.", trait: "distraction" }
    ]
  },
  {
    text: "When you get stuck on a difficult problem:",
    options: [
      { text: "Read the official documentation thoroughly.", trait: "focus" },
      { text: "Ask on Reddit and tab out until someone replies.", trait: "distraction" }
    ]
  }
];

const PersonalityQuiz = ({ onComplete }) => {
  const [selectedState, setSelectedState] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(-1);
  const [focusScore, setFocusScore] = useState(0);
  const [distractionScore, setDistractionScore] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleStateSelect = (value) => {
    setSelectedState(value);
    setCurrentQuestion(0);
  };

  const handleAnswerSelect = (trait) => {
    if (trait === 'focus') setFocusScore(prev => prev + 1);
    if (trait === 'distraction') setDistractionScore(prev => prev + 1);
    
    setCurrentQuestion(prev => prev + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const calculatedModifier = distractionScore > focusScore ? 'high_distraction' : 'high_focus';
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/simulate-career', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_state: selectedState,
          years_to_simulate: 5,
          num_simulations: 1000,
          modifier: calculatedModifier
        }),
      });
      
      const data = await response.json();
      onComplete(data);
    } catch (error) {
      console.error('Error fetching simulation data:', error);
      onComplete(null);
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = QUESTIONS.length + 1; // +1 for the initial state selection
  const currentStep = currentQuestion === -1 ? 0 : currentQuestion + 1;
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="flex flex-col items-center justify-center p-8 w-full max-w-2xl mx-auto">
      <div className="glass-panel w-full p-8 animate-fade-in-up bg-white/5 backdrop-blur-lg rounded-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
        <h2 className="text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          Horizon Career Simulator
        </h2>
        
        {/* Progress Bar */}
        {currentQuestion > -1 && currentQuestion < QUESTIONS.length && (
          <div className="w-full bg-white/10 h-2 rounded-full mb-8 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-400 to-emerald-400 h-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        )}
        
        {/* Step 0: Starting State */}
        {currentQuestion === -1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-medium mb-4 text-white text-center">Where are you starting your journey?</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {STATES.map((stateObj) => (
                <button
                  key={stateObj.label}
                  onClick={() => handleStateSelect(stateObj.value)}
                  className="p-4 rounded-xl border border-white/10 hover:border-blue-400/50 hover:bg-blue-400/10 transition-all duration-300 group"
                >
                  <span className="text-lg font-medium text-white/80 group-hover:text-white">{stateObj.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1-4: Behavioral Questions */}
        {currentQuestion >= 0 && currentQuestion < QUESTIONS.length && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-medium mb-6 text-white text-center">
              {QUESTIONS[currentQuestion].text}
            </h3>
            <div className="grid gap-4">
              {QUESTIONS[currentQuestion].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(option.trait)}
                  className="p-4 rounded-xl border border-white/10 hover:border-emerald-400/50 hover:bg-emerald-400/10 transition-all duration-300 text-left group"
                >
                  <span className="text-lg font-medium text-white/80 group-hover:text-white">{option.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Final Step: Completion */}
        {currentQuestion === QUESTIONS.length && (
          <div className="space-y-8 animate-fade-in text-center">
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
              <h3 className="text-2xl font-semibold text-white mb-2">Profile Complete</h3>
              <p className="text-white/60">We've analyzed your behavioral patterns.</p>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-400 hover:to-emerald-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(52,211,153,0.6)] transition-all duration-300 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Initialize Simulation'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalityQuiz;
