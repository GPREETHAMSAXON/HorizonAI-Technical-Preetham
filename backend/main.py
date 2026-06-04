import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict
from fastapi.responses import RedirectResponse

app = FastAPI(title="Horizon AI Career Simulation Backend")

@app.get("/")
def read_root():
    return RedirectResponse(url="/docs")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DigitalTwinProfile(BaseModel):
    current_state: int
    years_to_simulate: int
    num_simulations: int
    modifier: Optional[str] = None

STATES = ["Student", "Junior Developer", "ML Engineer", "Procrastinator", "Stuck"]

BASE_MATRIX = np.array([
    [0.3, 0.4, 0.1, 0.1, 0.1],  # 0: Student
    [0.1, 0.3, 0.4, 0.1, 0.1],  # 1: Junior Developer
    [0.0, 0.1, 0.7, 0.1, 0.1],  # 2: ML Engineer
    [0.1, 0.1, 0.0, 0.6, 0.2],  # 3: Procrastinator
    [0.0, 0.0, 0.0, 0.0, 1.0],  # 4: Stuck (absorbing)
])

STUCK_INDEX = 4
ML_ENGINEER_INDEX = 2
PROCRASTINATOR_INDEX = 3

@app.post("/api/v1/simulate-career")
def run_simulation(profile: DigitalTwinProfile) -> Dict:
    matrix = BASE_MATRIX.copy()
    num_states = len(matrix)
    
    if profile.modifier == 'high_distraction':
        for i in range(num_states):
            if i != STUCK_INDEX:
                matrix[i, PROCRASTINATOR_INDEX] += 0.2
    elif profile.modifier == 'high_focus':
        for i in range(num_states):
            if i != STUCK_INDEX:
                matrix[i, ML_ENGINEER_INDEX] += 0.2
                
    # Normalize weights
    for i in range(num_states):
        if i != STUCK_INDEX:
            row_sum = np.sum(matrix[i])
            if row_sum > 0:
                matrix[i] = matrix[i] / row_sum
                
    outcomes = {i: 0 for i in range(num_states)}
    
    # Monte Carlo simulation
    for _ in range(profile.num_simulations):
        current = profile.current_state
        for _ in range(profile.years_to_simulate):
            current = np.random.choice(num_states, p=matrix[current])
        outcomes[current] += 1
        
    # Map back to readable string labels matching the UI
    final_distribution = {
        STATES[i]: (count / profile.num_simulations)
        for i, count in outcomes.items()
    }
    
    return {
        "total_simulations": profile.num_simulations,
        "final_distribution": final_distribution,
        "transition_matrix": matrix.tolist()
    }