import React, { useState } from 'react';
import MarketTrajectories from './components/MarketTrajectories';
import PersonalityQuiz from './components/PersonalityQuiz';
import ProbabilityTreeCanvas from './components/ProbabilityTreeCanvas';

function App() {
  // We now start on the Quiz (The Hook)
  const [appState, setAppState] = useState('quiz');
  const [simulationData, setSimulationData] = useState(null);

  const handleQuizComplete = (data) => {
    if (data) {
      setSimulationData(data);
    } else {
      setSimulationData({
        total_simulations: 1000,
        final_distribution: { "Student": 0.05, "Junior Developer": 0.15, "ML Engineer": 0.55, "Procrastinator": 0.10, "Stuck": 0.15 }
      });
    }
    setAppState('results');
  };

  const handleViewMarketData = () => {
    setAppState('trajectories');
  };

  const handleReset = () => {
    setSimulationData(null);
    setAppState('quiz'); // Loop back to the beginning
  };

  return (
    <div className="min-h-screen bg-[#020204] text-white overflow-hidden">

      <div className="fixed top-6 left-6 z-[60] flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center font-black text-sm shadow-[0_0_15px_rgba(56,189,248,0.5)]">
          H
        </div>
        <h1 className="text-xl font-bold tracking-tight">Horizon AI</h1>
      </div>

      {appState === 'quiz' && (
        <PersonalityQuiz onComplete={handleQuizComplete} />
      )}

      {appState === 'results' && (
        <ProbabilityTreeCanvas
          data={simulationData}
          onViewData={handleViewMarketData}
          onReset={handleReset}
        />
      )}

      {appState === 'trajectories' && (
        <MarketTrajectories onContinue={handleReset} />
      )}

    </div>
  );
}

export default App;