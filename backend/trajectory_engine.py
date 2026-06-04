import csv
import random
from collections import defaultdict

# The core states of our simulation
STATES = ['CS Student', 'Junior Developer', 'ML Engineer', 'Procrastinator', 'Stuck']

def generate_synthetic_market_data(filename='market_trajectories.csv', num_profiles=500):
    """
    Simulates mining 500 real-world career paths. 
    Instead of perfect linear paths, we inject messy detours, getting stuck, and pivots.
    """
    trajectories = []
    
    for i in range(num_profiles):
        # Determine starting point (70% start as students, 30% as procrastinators)
        current_state = 'CS Student' if random.random() < 0.7 else 'Procrastinator'
        path = [current_state]
        
        # Simulate 5 years of transitions for each profile
        for _ in range(5):
            roll = random.random()
            
            if current_state == 'CS Student':
                if roll < 0.50: next_state = 'Junior Developer'
                elif roll < 0.70: next_state = 'CS Student' # Extended degree/masters
                elif roll < 0.90: next_state = 'Procrastinator'
                else: next_state = 'Stuck'
                
            elif current_state == 'Junior Developer':
                if roll < 0.40: next_state = 'ML Engineer'
                elif roll < 0.70: next_state = 'Junior Developer' # Staying at current level
                elif roll < 0.90: next_state = 'Stuck'
                else: next_state = 'Procrastinator'
                
            elif current_state == 'ML Engineer':
                if roll < 0.85: next_state = 'ML Engineer' # High retention once achieved
                else: next_state = 'Junior Developer' # Downgrade/Pivot
                
            elif current_state == 'Procrastinator':
                if roll < 0.60: next_state = 'Stuck'
                elif roll < 0.85: next_state = 'Procrastinator'
                else: next_state = 'CS Student' # Snapping out of it
                
            elif current_state == 'Stuck':
                if roll < 0.40: next_state = 'Stuck'
                elif roll < 0.70: next_state = 'Procrastinator'
                else: next_state = 'Junior Developer' # Breaking through
                
            path.append(next_state)
            current_state = next_state
            
        trajectories.append([f"Profile_{i}"] + path)

    # Write to CSV
    with open(filename, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['Profile_ID', 'Year_0', 'Year_1', 'Year_2', 'Year_3', 'Year_4', 'Year_5'])
        writer.writerows(trajectories)
        
    print(f"[+] Successfully mined {num_profiles} market trajectories into {filename}")

def build_transition_matrix(filename='market_trajectories.csv'):
    """
    Reads the market data and calculates the exact probability of moving from State A to State B.
    """
    transition_counts = defaultdict(lambda: defaultdict(int))
    state_totals = defaultdict(int)

    # 1. Count every single transition across all 500 profiles
    with open(filename, mode='r') as file:
        reader = csv.reader(file)
        next(reader) # Skip header
        
        for row in reader:
            path = row[1:] # Exclude Profile_ID
            for i in range(len(path) - 1):
                current_state = path[i]
                next_state = path[i+1]
                transition_counts[current_state][next_state] += 1
                state_totals[current_state] += 1

    # 2. Normalize counts into percentages/probabilities
    transition_matrix = defaultdict(dict)
    
    for state in STATES:
        total_transitions = state_totals.get(state, 0)
        for next_state in STATES:
            if total_transitions > 0:
                prob = transition_counts[state].get(next_state, 0) / total_transitions
            else:
                prob = 0.0
            transition_matrix[state][next_state] = prob

    return transition_matrix

# Run this once to generate your fake database
if __name__ == "__main__":
    generate_synthetic_market_data()
    matrix = build_transition_matrix()
    
    print("\n[+] Dynamic Reverse-Engineered Transition Matrix Generated:")
    for state, transitions in matrix.items():
        print(f"\nFrom {state}:")
        for next_state, prob in transitions.items():
            if prob > 0:
                print(f"  -> {next_state}: {prob*100:.1f}%")