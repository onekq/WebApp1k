# WebApp1K Benchmark

WebApp1K is a coding benchmark aiming to evaluate LLMs on their abilities to develop real-world web applications.

## Getting Started
WebApp1K is designed to run on any environment as long as it has Python and Node.js.

### System Requirements
Ensure your environmnt has the following installed:
- Python (version 3.8 or higher)
- Node.js (version 14 or higher)

### Setup
1. Clone the GitHub repository:
   ```bash
   git clone https://github.com/onekq/WebApp1K.git
   cd WebApp1K
   ```
2. Optional: Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux
   venv\Scripts\activate # Windows
   ```
3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Install Node.js dependencies:
   ```bash
   cd staging
   npm install
   cd ..
   ```
## For LLM Researchers and Benchmark Users
If you desire deeper insights into the coding performance of a leading LLM available via public token-based API, you can run this benchmark to obtain all raw results, e.g. generated code and error logs.

### Get your API keys:
| Vendor    | API key name      | Code Generator | Models                       |
|-----------|-------------------|----------------|------------------------------|
| OpenAI    | OPENAI_API_KEY    | gpt            | GPT-4o, GPT-4o-mini, etc     |
| Anthropic | ANTHROPIC_API_KEY | claude         | Claude-3.5-Sonnet, etc.      |
| Google    | GEMINI_API_KEY    | gemini         | Gemini-1.5-pro, etc.         |
| Mistral   | MISTRAL_API_KEY   | mistral        | mixtral-8x22b-instruct, etc. |
| Fireworks | FIREWORKS_API_KEY | fireworks      | open source models           |

The above table shows tbe latest popular LLMs and their hosting services. Depending on which LLMs interest you, you need to purchase the corresponding API keys and save them as your environment variables.

Using OpenAI as an example:
```bash
export OPENAI_API_KEY='your-openai-api-key' # For Linux/MacOS
set OPENAI_API_KEY=your-openai-api-key      # For Windows
```
### Run the benchmark
Make sure you have followed all steps outlined in the [Setup section](#setup), also you are in the `WebApp1K` directory. Then run the following script.
   ```bash
   python run_eval.py -g <code_generator> -m <model>
   ```
The code generator can be found in the above table. Using OpenAI as an example, if you want to evaluate the GPT-4o model, the script should be as follows.
   ```bash
   python run_eval.py -g gpt -m gpt-4o
   ```
After the evaluation is finished, all the generated code can be found under a new `models` subdirectory. If a Javascript file has the suffix `success.js`, this means the code passes the tests. If the file has the suffix `failure.js`, this means the code fails the tests. In addition, a companion `failure.log` file of the same name logs the test errors.

> **Note:** This script **takes hours to finish**. It is highly likely to crash due to various service-related exceptions
such as rate limiting, server overload, unsafe content. We purposely let it crash and let you decide what to do. A common scenario is that you reach the daily token limit to run the model inference, and the simplest solution is wait until the next day. Resuming the run is easy: simply run the same script again. By examining files in the `staging` and `models` folders, it is able to locate the breakpoint, then continue the evaluation from there.

## For LLM Trainers
If you pretrain or finetune your own LLM, and like to use this benchmark to evaluate your checkpoints, you should still follow the above process, but make the following changes.

1. **You won't need any API keys**, and majority of the code in `generate_code.py` won't be relevant to you.

2. **Modify the `generate_implementation` method** to run inference against your own checkpoint.

## Contact Us
For questions, inquiries, suggestions, please reach out to info@onekq.ai.