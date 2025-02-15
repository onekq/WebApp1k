import os
import shutil

MODELS_DIR = 'models'
STAGING_SRC_DIR = 'staging/src'
SUCCESS_ONCE = False # Stop retrying after the first successful run

def copy_files(model_name, test_dir, run_dir, max_runs) -> bool:
    # If the current run is already done, do nothing and return False.
    model_dir = os.path.join(MODELS_DIR, model_name)
    if os.path.exists(os.path.join(model_dir, run_dir)):
        return False

    for root, _, files in os.walk(test_dir):
        for file in files:
            if file.endswith('.test.js'):
                relative_path = os.path.relpath(os.path.join(root, file), test_dir)
                base_name = relative_path[:-8]
                staging_dir = os.path.join(STAGING_SRC_DIR, os.path.dirname(relative_path))

                success_file = None
                if SUCCESS_ONCE:
                    for run_num in range(max_runs, 0, -1):
                        run_dir = f'run{run_num}'
                        potential_success_file = os.path.join(model_dir, run_dir, base_name + '.success.js')
                        if os.path.exists(potential_success_file):
                            success_file = potential_success_file
                            break

                if not success_file:
                    failure_file = None
                    enough_tries = False
                    for run_num in range(max_runs, 0, -1):
                        run_dir = f'run{run_num}'
                        potential_failure_file = os.path.join(model_dir, run_dir, base_name + '.failure.js')
                        potential_failure_log = os.path.join(model_dir, run_dir, base_name + '.failure.log')
                        if os.path.exists(potential_failure_file):
                            failure_file = potential_failure_file
                            failure_log = potential_failure_log
                            if run_num == max_runs:
                                enough_tries = True
                            break

                    # Stop retrying after the maximum number of runs
                    if enough_tries:
                        continue

                    # Copy test files for all eligible cases
                    os.makedirs(staging_dir, exist_ok=True)
                    destination_path = os.path.join(STAGING_SRC_DIR, relative_path)
                    if not os.path.exists(destination_path):
                        shutil.copy(os.path.join(root, file), destination_path)

                    # If retried for no more than the maximum number of runs, copy the latest failure files
                    if failure_file:
                        shutil.copy(failure_file, os.path.join(STAGING_SRC_DIR, base_name + '.failure.js'))
                        shutil.copy(failure_log, os.path.join(STAGING_SRC_DIR, base_name + '.failure.log'))
    return True