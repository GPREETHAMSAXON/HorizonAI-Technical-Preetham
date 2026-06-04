import csv
import os
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

# Keeping your exact sequence labels
STATES = ["Student", "Junior Developer", "ML Engineer", "Procrastinator", "Stuck"]
STUCK_INDEX = 4
ML_ENGINEER_INDEX = 2
PROCRASTINATOR_INDEX = 3

def load_dynamic_matrix_from_trajectories(csv_path: str = "market_trajectories.csv") -> np.ndarray:
    """
    Parses a CSV file containing historical career tracks and calculates
    the empirical transition matrix dynamically. Falls back to a baseline matrix
    if the CSV hasn't been generated yet.
    """
    num_states = len(STATES)
    
    # Fallback default baseline matrix if file doesn't exist yet
    if not os.path.exists(csv_path):
        return np.array([
            [0.3, 0.4, 0.1, 0.1, 0.1],  # 0: Student
            [0.1, 0.3, 0.4, 0.1, 0.1],  # 1: Junior Developer
            [0.0, 0.1, 0.7, 0.1, 0.1],  # 2: ML Engineer
            [0.1, 0.1, 0.0, 0.6, 0.2],  # 3: Procrastinator
            [0.0, 0.0, 0.0, 0.0, 1.0],  # 4: Stuck (absorbing state)
        ])

    # Mapping string items in historical records back to matrix indices
    state_to_idx = {state: idx for idx, state in enumerate(STATES)}
    counts = np.zeros((num_states, num_states))

    with open(csv_path, mode='r') as f:
        reader = csv.reader(f)
        next(reader)  # Skip header row
        
        for row in reader:
            # Reconstruct sequence of state names
            path = row[1:]  
            for t in range(len(path) - 1):
                curr_state, next_state = path[t], path[t+1]
                # Map strings to indices like "Student" -> 0
                if curr_state in state_to_idx and next_state in state_to_idx:
                    u = state_to_idx[curr_state]
                    v = state_to_idx[next_state]
                    counts[u, v] += 1

    # Convert raw frequency counts to row-normalized probabilities
    matrix = np.zeros((num_states, num_states))
    for i in range(num_states):
        row_sum = np.sum(counts[i])
        if row_sum > 0:
            matrix[i] = counts[i] / row_sum
        else:
            # Handle states with zero observed data by making them hold in place
            matrix[i, i] = 1.0
            
    # Guarantee that the 'Stuck' state behaves strictly as an absorbing state
    matrix[STUCK_INDEX] = 0.0
    matrix[STUCK_INDEX, STUCK_INDEX] = 1.0
    
    return matrix

@app.post("/api/v1/simulate-career")
def run_simulation(profile: DigitalTwinProfile) -> Dict:
    # Load dynamically derived transition parameters from historical profile tracking
    base_matrix = load_dynamic_matrix_from_trajectories("market_trajectories.csv")
    matrix = base_matrix.copy()
    num_states = len(matrix)
    
    # Inject behavioral biases to shifting paths
    if profile.modifier == 'high_distraction':
        for i in range(num_states):
            if i != STUCK_INDEX:
                matrix[i, PROCRASTINATOR_INDEX] += 0.2
    elif profile.modifier == 'high_focus':
        for i in range(num_states):
            if i != STUCK_INDEX:
                matrix[i, ML_ENGINEER_INDEX] += 0.2
                
    # Normalize weights post-modifiers
    for i in range(num_states):
        if i != STUCK_INDEX:
            row_sum = np.sum(matrix[i])
            if row_sum > 0:
                matrix[i] = matrix[i] / row_sum
                
    outcomes = {i: 0 for i in range(num_states)}
    
    # Monte Carlo simulation loops
    for _ in range(profile.num_simulations):
        current = profile.current_state
        for _ in range(profile.years_to_simulate):
            current = np.random.choice(num_states, p=matrix[current])
        outcomes[current] += 1
        
    final_distribution = {
        STATES[i]: (count / profile.num_simulations)
        for i, count in outcomes.items()
    }
    
    return {
        "total_simulations": profile.num_simulations,
        "final_distribution": final_distribution,
        "transition_matrix": matrix.tolist()
    }