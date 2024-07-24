import os
import shutil
import subprocess
from prepare_staging import copy_files, STAGING_SRC_DIR, MODELS_DIR
from generate_code import choose_generator, generate_implementation
from pass_at_k import calculate_pass_at_k
from tqdm import tqdm
import argparse

USE_RETRY_PROMPT = False

def write_code(code_generator, model_name, temperature=None, top_p=None, system_prompt=None):
    generator = choose_generator(code_generator)
    generator.set_model(model_name)
    if temperature is not None:
        generator.set_temperature(temperature)
    if top_p is not None:
        generator.set_top_p(top_p)
    if system_prompt is not None:
        generator.set_system_prompt(system_prompt)

    files_generated = 0
    files_to_process = []

    # Collect all files to process
    for root, _, files in os.walk(STAGING_SRC_DIR):
        for file in files:
            if file.endswith('.test.js'):
                files_to_process.append((root, file))
    
    for root, file in tqdm(files_to_process, desc="Generating code"):
        relative_path = os.path.relpath(os.path.join(root, file), STAGING_SRC_DIR)
        base_name = relative_path[:-8]
        test_file = os.path.join(STAGING_SRC_DIR, relative_path)
        impl_file = os.path.join(STAGING_SRC_DIR, base_name + '.js')
        failure_file = os.path.join(STAGING_SRC_DIR, base_name + '.failure.js')
        failure_log = os.path.join(STAGING_SRC_DIR, base_name + '.failure.log')
        # In case of rerun due to crash, avoid calling LLM API for files already implemented by the previous run.
        if os.path.exists(impl_file):
            tqdm.write(f"Implementation file {impl_file} already exists.")
            continue

        if USE_RETRY_PROMPT and os.path.exists(failure_file):
            implementation = generate_implementation(test_file, generator, failure_file, failure_log)
        else:
            implementation = generate_implementation(test_file, generator)

        try:
            with open(impl_file, 'w') as f:
                f.write(implementation)
        except UnicodeEncodeError as e:
            tqdm.write(str(e).encode('utf-8', errors='replace').decode('utf-8'))
            # Write an empty string upon encode error
            with open(impl_file, 'w') as f:
                f.write('')
        files_generated += 1

    return files_generated

def run_test_and_process_log(test_timeout):
    os.chdir('staging')
    # After constructing the retry prompt, failure files are no longer needed.
    for root, dirs, _ in os.walk('src'):
        for subdir in dirs:
            subdir_path = os.path.join(root, subdir)
            for subroot, _, files in os.walk(subdir_path):
                for file in files:
                    if file.endswith('.failure.js') or file.endswith('.failure.log'):
                        os.remove(os.path.join(subroot, file))
    # Determine npm path
    if os.name == 'nt':  # 'nt' indicates Windows
        npm_path = r'C:\Program Files\nodejs\npm.cmd'
    else:
        npm_path = 'npm'


    directories = []
    for framework_dir in os.listdir('src'):
        framework_path = os.path.join('src', framework_dir)
        for dir in os.listdir(framework_path):
            directories.append(os.path.join(framework_path, dir).replace('\\', '/'))

    for dir in tqdm(directories, desc="Running tests and processing logs"):
        # Run npm test and save output
        try:
            with open("output.log", "w") as file:
                subprocess.run([npm_path, "test", "--", "--testPathPattern", dir], stdout=file, stderr=subprocess.STDOUT, timeout=test_timeout)
        except subprocess.TimeoutExpired:
            subprocess.run(['python', 'process_log.py', '--timedout'])
            tqdm.write(f"Test results for {dir} (timedout) are saved and parsed.")
            continue

        subprocess.run(['python', 'process_log.py'])
        tqdm.write(f"Test results for {dir} are saved and parsed.")

    os.chdir('..')

def archive(model_name, run_dir):
    model_dir = os.path.join(MODELS_DIR, model_name)
    # Copy all files under STAGING_SRC_DIR, except *.test.js
    for root, dirs, _ in os.walk(STAGING_SRC_DIR):
        for subdir in dirs:
            subdir_path = os.path.join(root, subdir)
            for sub_root, _, sub_files in os.walk(subdir_path):
                for file in sub_files:
                    if not file.endswith('.test.js'):
                        # Calculate the new path considering the additional directory level
                        rel_path = os.path.relpath(os.path.join(sub_root, file), STAGING_SRC_DIR)
                        newpath = os.path.join(model_dir, run_dir, rel_path)
                        os.makedirs(os.path.dirname(newpath), exist_ok=True)
                        shutil.move(os.path.join(sub_root, file), newpath)

    # Delete everything recursively under STAGING_SRC_DIR
    for root, dirs, files in os.walk(STAGING_SRC_DIR, topdown=False):
        for file in files:
            os.remove(os.path.join(root, file))
        for dir in dirs:
            os.rmdir(os.path.join(root, dir))

    tqdm.write(f"Archived {model_name} {run_dir}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run model experiments and archive results.")
    parser.add_argument('--model_name', '-m', type=str, required=True, help='The name of the model.')
    parser.add_argument('--code_generator', '-g', type=str, required=True, help='The code generator to use.')

    args = parser.parse_args()

    for run_number in range(1, 11):
        run_dir = f"run{run_number}"
        # Skip runs which have been done before.
        if not copy_files(args.model_name, 'tests', run_dir, run_number):
            tqdm.write(f"Skipped {args.model_name} {run_dir}")
            continue
        write_code(args.code_generator, args.model_name, temperature=0.2, top_p=0.8)
        run_test_and_process_log(60)
        archive(args.model_name, run_dir)

    # Calculate pass@k
    pass_at_k_results = calculate_pass_at_k(MODELS_DIR)
    for model, pass_at_k in pass_at_k_results.items():
        print(f"Model: {model}")
        for k, value in pass_at_k.items():
            print(f"  {k}: {value:.4f}")
