import argparse
import re
import os

FILE_NAME = 'output.log'
timed_out = False

def clean_text(text):
    text = re.sub(r'[^\x00-\x7F]+', '', text)  # remove non-ASCII characters
    text = re.compile(r'(?:\x1B[@-_][0-?]*[ -/]*[@-~])').sub('', text)  # remove ANSI escape codes
    return text

def process_log_file(timed_out):
    # Cleanse log file into pure ASCII
    with open(FILE_NAME, 'r', encoding='utf-8') as file:
        content = file.read()

    with open(FILE_NAME, 'w') as file:
        file.write(clean_text(content))

    try:
        with open(FILE_NAME, 'r') as file:
            cleaned_content = file.read()
    except Exception as e:
        print("Error opening file without encoding:", e)
        return

    # Process the log file for PASS/FAIL and handle renaming and logging
    lines = cleaned_content.split('\n')
    current_test_file = None
    failure_log = []
    traversed_dirs = set()

    for line in lines:
        match_pass = re.match(r'PASS\s+(.*)\.test\.js', line)
        match_fail = re.match(r'FAIL\s+(.*)\.test\.js', line)

        if match_pass or match_fail:
            if current_test_file:
                # Save the failure log if we are currently processing a failure
                log_file_path = current_test_file + '.failure.log'
                with open(log_file_path, 'w') as log_file:
                    log_file.write('\n'.join(failure_log))
                current_test_file = None  # Clear current test file

            if match_pass:
                test_file_path = match_pass.group(1) + '.js'
                success_file_path = match_pass.group(1) + '.success.js'
                if os.path.exists(test_file_path):
                    os.rename(test_file_path, success_file_path)

            elif match_fail:
                test_file_path = match_fail.group(1) + '.js'
                failure_file_path = match_fail.group(1) + '.failure.js'
                if os.path.exists(test_file_path):
                    os.rename(test_file_path, failure_file_path)
                current_test_file = match_fail.group(1)  # Set current test file to capture failure logs
                failure_log = [line]  # Start new failure log with this line

            # Memorize the directory
            directory = os.path.dirname(test_file_path)
            if directory:
                traversed_dirs.add(directory)

        elif current_test_file:
            # Collect failure log lines
            failure_log.append(line)

    # Ensure the last failure log is written out if there's an ongoing failure
    if current_test_file:
        log_file_path = current_test_file + '.failure.log'
        with open(log_file_path, 'w') as log_file:
            log_file.write('\n'.join(failure_log))

    if timed_out:
        for dir in traversed_dirs:
            for root, _, files in os.walk(dir):
                for file in files:
                    if file.endswith('.js') and not file.endswith(('.test.js', '.success.js', '.failure.js')):
                        js_file_path = os.path.join(root, file)
                        failure_js_path = js_file_path.replace('.js', '.failure.js')
                        os.rename(js_file_path, failure_js_path)
                        with open(failure_js_path.replace('.failure.js', '.failure.log'), 'w') as log_file:
                            log_file.write("Timedout")

def main():
    parser = argparse.ArgumentParser(description='Process the output log with an optional timedout flag.')
    parser.add_argument('--timedout', action='store_true', help='Handle timedout scenario by renaming remaining .js files')
    
    args = parser.parse_args()

    process_log_file(args.timedout)

if __name__ == "__main__":
    main()
