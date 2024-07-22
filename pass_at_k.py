import os
import numpy as np
from collections import defaultdict

def estimate_pass_at_k(num_samples, num_correct, k):
    def estimator(n, c, k):
        if n - c < k:
            return 1.0
        return 1.0 - np.prod(1.0 - k / np.arange(n - c + 1, n + 1))

    return np.array([estimator(n, c, k) for n, c in zip(num_samples, num_correct)])

def calculate_pass_at_k(base_dir, k_values=[1, 5, 10]):
    models_pass_at_k = defaultdict(dict)

    for model in os.listdir(base_dir):
        model_path = os.path.join(base_dir, model)
        if os.path.isdir(model_path):
            num_samples = defaultdict(lambda: 0)
            num_correct = defaultdict(lambda: 0)

            for run in os.listdir(model_path):
                run_path = os.path.join(model_path, run)
                if os.path.isdir(run_path):
                    for entry in os.listdir(run_path):
                        entry_path = os.path.join(run_path, entry)
                        if os.path.isdir(entry_path):
                            for scenario in os.listdir(entry_path):
                                scenario_path = os.path.join(entry_path, scenario)
                                if os.path.isdir(scenario_path):
                                    scenario_dir = scenario_path if os.listdir(scenario_path) else entry_path
                                    for file in os.listdir(scenario_dir):
                                        problem_name = file.rsplit('.', 2)[0]
                                        problem_key = os.path.join(entry, scenario, problem_name) if scenario_dir == scenario_path else os.path.join(entry, problem_name)
                                        if file.endswith('.success.js'):
                                            num_samples[problem_key] += 1
                                            num_correct[problem_key] += 1
                                        elif file.endswith('.failure.js'):
                                            num_samples[problem_key] += 1

            for problem_key in num_samples:
                if problem_key not in num_correct:
                    num_correct[problem_key] = 0

            problem_keys = list(num_samples.keys())
            total_samples = np.array([num_samples[key] for key in problem_keys])
            correct_samples = np.array([num_correct[key] for key in problem_keys])

            pass_at_k = {f"pass@{k}": estimate_pass_at_k(total_samples, correct_samples, k).mean() for k in k_values}
            models_pass_at_k[model] = pass_at_k

    return models_pass_at_k
