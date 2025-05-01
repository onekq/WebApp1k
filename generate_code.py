import os
from abc import ABC, abstractmethod
from fireworks.client import Fireworks
import openai
from google import genai
import anthropic
from mistralai import Mistral
from pydantic import BaseModel
from typing import List
import sys
import json

class Result(BaseModel):
    errors: List[str]

class CodeGenerator(ABC):
    max_tokens = 2048

    def set_model(self, model_name: str):
        self.model_name = model_name
    def set_system_prompt(self, system_prompt: str):
        self.system_prompt = system_prompt
    def set_max_tokens(self, max_tokens: int):
        self.max_tokens = max_tokens
    def make_prompt(self, prompt: str) -> list[dict[str, str]]:
        if not hasattr(self, 'system_prompt'):
            return [{ "role": "user", "content": prompt }]
        return [{"role": "system", "content": self.system_prompt}, { "role": "user", "content": prompt }]

    @abstractmethod
    def generate_code(self, prompt: str) -> str:
        pass

    def find_errors(self, prompt: str) -> str:
        response = self.client.chat.completions.create(
            messages=self.make_prompt(prompt), model=self.model_name, response_format={"type": "json_object"})
        return response.choices[0].message.content

class FireworksCodeGenerator(CodeGenerator):
    def __init__(self, api_key: str):
        self.client = Fireworks(api_key=api_key)

    def generate_code(self, prompt: str) -> str:
        response = self.client.chat.completions.create(
            messages=self.make_prompt(prompt), model=f"accounts/fireworks/models/{self.model_name}", max_tokens=self.max_tokens)
        return response.choices[0].message.content.strip()

    def find_errors(self, prompt: str) -> str:
        response = self.client.chat.completions.create(
            messages=self.make_prompt(prompt), model=f"accounts/fireworks/models/{self.model_name}", max_tokens=self.max_tokens,
            response_format={"type": "json_object", "schema": Result.model_json_schema()})
        return response.choices[0].message.content

class GPTCodeGenerator(CodeGenerator):
    def __init__(self, api_key: str):
        self.client = openai.OpenAI(api_key=api_key)

    def generate_code(self, prompt: str) -> str:
        response = self.client.chat.completions.create(messages=self.make_prompt(prompt), model=self.model_name)
        return response.choices[0].message.content.strip()

class GeminiCodeGenerator(CodeGenerator):
    def __init__(self, api_key: str):
        self.client = genai.Client(api_key=api_key)

    def generate_code(self, prompt: str) -> str:
        return self.client.models.generate_content(model=self.model_name, contents=prompt).text.strip()

class ClaudeCodeGenerator(CodeGenerator):
    def __init__(self, api_key: str):
        self.client = anthropic.Anthropic(api_key=api_key)

    def generate_code(self, prompt: str) -> str:
        response = self.client.messages.create(messages=self.make_prompt(prompt), model=self.model_name, max_tokens=self.max_tokens)
        return response.content[0].text.strip()

class MistralCodeGenerator(CodeGenerator):
    def __init__(self, api_key: str):
        self.client = Mistral(api_key=api_key)

    def generate_code(self, prompt: str) -> str:
        response = self.client.chat.complete(messages=self.make_prompt(prompt), model=self.model_name)
        return response.choices[0].message.content.strip()

    def find_errors(self, prompt: str) -> str:
        response = self.client.chat.complete(messages=self.make_prompt(prompt), model=self.model_name, response_format={"type": "json_object"})
        return response.choices[0].message.content

class DeepSeekCodeGenerator(GPTCodeGenerator):
    def __init__(self, api_key: str):
        self.client = openai.OpenAI(api_key=api_key, base_url="https://api.deepseek.com")

class QwenCodeGenerator(GPTCodeGenerator):
    def __init__(self, api_key: str):
        self.client = openai.OpenAI(api_key=api_key, base_url="https://dashscope-intl.aliyuncs.com/compatible-mode/v1")

class DeepInfraCodeGenerator(GPTCodeGenerator):
    def __init__(self, api_key: str):
        self.client = openai.OpenAI(api_key=api_key, base_url="https://api.deepinfra.com/v1/openai")

class OpenRouterCodeGenerator(GPTCodeGenerator):
    def __init__(self, api_key: str):
        self.client = openai.OpenAI(api_key=api_key, base_url="https://openrouter.ai/api/v1")

class GroqCodeGenerator(GPTCodeGenerator):
    def __init__(self, api_key: str):
        self.client = openai.OpenAI(api_key=api_key, base_url="https://api.x.ai/v1")

class NvidiaCodeGenerator(CodeGenerator):
    def __init__(self, api_key: str):
        self.client = openai.OpenAI(base_url="https://integrate.api.nvidia.com/v1", api_key=api_key)

    def generate_code(self, prompt: str) -> str:
        response = self.client.chat.completions.create(messages=self.make_prompt(prompt), model=f"nvidia/{self.model_name}")
        return response.choices[0].message.content.strip()

def extract_code(content: str) -> str:
    # If </think> is found (reasoning model), clip content before it
    think_index = content.find("</think>")
    if think_index != -1:
        content = content[think_index + len("</think>"):] 

    js_keywords = {'import', 'export', 'const', 'let', 'var', 'function', 'class', 'extends', 'constructor', 'return', 'if', 'else', 'switch', 'case', 'break', 'continue', 'for', 'while', 'do', 'try', 'catch', 'finally', 'throw', 'new', 'this', 'super'}
    lines = content.split('\n')
    code_lines = []
    in_code_block = False

    for line in lines:
        stripped_line = line.strip()
        if not in_code_block:
            if any(stripped_line.startswith(keyword) for keyword in js_keywords):
                in_code_block = True
        if in_code_block:
            if stripped_line.endswith('```'):
                break
            code_lines.append(line)

    return '\n'.join(code_lines) if code_lines else content

def generate_implementation(test_file: str, generator: CodeGenerator, failed_implementation_file: str = None, failed_log_file: str = None) -> str:
    with open(test_file, 'r') as file:
        test_content = file.read()

    implementation_file = os.path.basename(test_file).replace('.test.js', '.js')

    if failed_implementation_file and failed_log_file:
        with open(failed_implementation_file, 'r') as file:
            failed_implementation_content = file.read()
        with open(failed_log_file, 'r') as file:
            if failed_log_file.endswith('.json'):
                json_data = json.load(file)
                failed_log_content = json.dumps(json_data, indent=4)
            else:
                failed_log_content = file.read()
        prompt = (f"{failed_implementation_content} \n\nThe above code is the implementation of {implementation_file}. "
                  f"It failed the tests below \n\n{test_content} \nBelow are test errors \n\n{failed_log_content} \n"
                  f"Try to generate {implementation_file} again to pass the tests. RETURN CODE ONLY.")
    else:
        prompt = (f"Generate {implementation_file} to pass the tests below:\n\n{test_content}. RETURN CODE ONLY.")

    implementation = generator.generate_code(prompt)
    return extract_code(implementation)

def find_errors(test_file: str, generator: CodeGenerator, failed_implementation_file: str = None, failed_log_file: str = None) -> str:
    with open(test_file, 'r') as file:
        test_content = file.read()

    implementation_file = os.path.basename(test_file).replace('.test.js', '.js')

    if failed_implementation_file and failed_log_file:
        with open(failed_implementation_file, 'r') as file:
            failed_implementation_content = file.read()
        with open(failed_log_file, 'r') as file:
            failed_log_content = file.read()
        prompt = (f"{failed_implementation_content} \n\nThe above code is the implementation of {implementation_file}. "
                  f"It failed the tests below \n\n{test_content} \nBelow is the test log \n\n{failed_log_content} \n"
                  f"List explanations to ALL errors in JSON array, one element per error. Avoid control characters.")
        return generator.find_errors(prompt)
    return ""

def choose_generator(generator_type: str) -> CodeGenerator:
    generators = {
        "gpt": GPTCodeGenerator(api_key=os.environ.get("OPENAI_API_KEY")),
        "gemini": GeminiCodeGenerator(api_key=os.environ.get("GEMINI_API_KEY")),
        "claude": ClaudeCodeGenerator(api_key=os.environ.get("ANTHROPIC_API_KEY")),
        "mistral": MistralCodeGenerator(api_key=os.environ.get("MISTRAL_API_KEY")),
        "fireworks": FireworksCodeGenerator(api_key=os.environ.get("FIREWORKS_API_KEY")),
        "deepseek": DeepSeekCodeGenerator(api_key=os.environ.get("DEEPSEEK_API_KEY")),
        "groq": GroqCodeGenerator(api_key=os.environ.get("XAI_API_KEY")),
        "nvidia": NvidiaCodeGenerator(api_key=os.environ.get("NVIDIA_API_KEY")),
        "qwen": QwenCodeGenerator(api_key=os.environ.get("QWEN_API_KEY")),
        "deepinfra": DeepInfraCodeGenerator(api_key=os.environ.get("DEEPINFRA_API_KEY")),
        "openrouter": OpenRouterCodeGenerator(api_key=os.environ.get("OPENROUTER_API_KEY"))
    }
    
    if generator_type not in generators:
        print(f"Unsupported generator type: {generator_type}")
        sys.exit(1)
    return generators[generator_type]
