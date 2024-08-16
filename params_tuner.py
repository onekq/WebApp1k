from prepare_staging import copy_files
from run_eval import write_code, run_test_and_process_log, archive
from tqdm import tqdm
import argparse
import numpy as np

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run model experiments and archive results.")
    parser.add_argument('--model_name', '-m', type=str, required=True, help='The name of the model.')
    parser.add_argument('--code_generator', '-g', type=str, required=True, help='The code generator to use.')

    args = parser.parse_args()

    for temperature in np.arange(0, 1.1, 0.1):
        for top_p in np.arange(0, 1.1, 0.1):
            run_dir = f"t{temperature:.1f}_p{top_p:.1f}"
            # Skip runs which have been done before.
            if not copy_files(args.model_name, 'params_tuning_tests', run_dir, 1):
                tqdm.write(f"Skipped {args.model_name} {run_dir}")
                continue
            write_code(args.code_generator, args.model_name, temperature=temperature, top_p=top_p)
            run_test_and_process_log(120)
            archive(args.model_name, run_dir)
