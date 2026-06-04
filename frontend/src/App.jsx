import React, { useState } from 'react';
import PersonalityQuiz from './components/PersonalityQuiz';
import ProbabilityTreeCanvas from './components/ProbabilityTreeCanvas';

function App() {
  const [simulationData, setSimulationData] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-darker via-dark to-[#0a0f25] text-white">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[120px]"></div>
      </div>

      <header className="relative z-10 w-full p-6 flex justify-between items-center border-b border-white/10 glass-panel rounded-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-xl shadow-lg">
            H
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Horizon AI</h1>
        </div>
      </header>

      <main className="relative z-10 container mx-auto py-12 flex justify-center items-center min-h-[calc(100vh-100px)]">
        {!simulationData ? (
          <PersonalityQuiz onComplete={(data) => setSimulationData(data || { dummy: true, total_simulations: 1000, final_distribution: { EntryLevel: 0.1, MidLevel: 0.5, SeniorLevel: 0.3, Freelancer: 0.1 } })} />
        ) : (
          <ProbabilityTreeCanvas data={simulationData} onReset={() => setSimulationData(null)} />
        )}
      </main>
    </div>
  );
}

export default App;
