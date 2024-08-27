import os
from abc import ABC, abstractmethod
from fireworks.client import Fireworks
import openai
import google.generativeai as genai
import anthropic
from groq import Groq
from mistralai import Mistral
from pydantic import BaseModel
from typing import List
import sys
import json

TOP_K = 40
PRESENCE_PENALTY = 0
FREQUENCY_PENALTY = 0

class Result(BaseModel):
    errors: List[str]

class CodeGenerator(ABC):
    def set_model(self, model_name: str):
        self.model_name = model_name
    def set_temperature(self, temperature: float):
        self.temperature = temperature
    def set_top_p(self, top_p: float):
        self.top_p = top_p
    def set_system_prompt(self, system_prompt: str):
        self.system_prompt = system_prompt
    def make_prompt(self, prompt: str) -> str:
        if not hasattr(self, 'system_prompt'):
            return [{ "role": "user", "content": prompt }]
        return [{"role": "system", "content": self.system_prompt}, { "role": "user", "content": prompt }]

    @abstractmethod
    def generate_code(self, prompt: str) -> str:
        pass

    def find_errors(self, prompt: str) -> str:
        pass

class FireworksCodeGenerator(CodeGenerator):
    def __init__(self, api_key: str):
        self.client = Fireworks(api_key=api_key)

    def generate_code(self, prompt: str) -> str:
        response = self.client.chat.completions.create(
            messages=self.make_prompt(prompt), model=f"accounts/fireworks/models/{self.model_name}", max_tokens=2048,
            temperature=self.temperature, top_p=self.top_p, presence_penalty=PRESENCE_PENALTY, frequency_penalty=FREQUENCY_PENALTY)
        return response.choices[0].message.content.strip()

    def find_errors(self, prompt: str) -> str:
        response = self.client.chat.completions.create(
            messages=self.make_prompt(prompt), model=f"accounts/fireworks/models/{self.model_name}", max_tokens=2048,
            response_format={"type": "json_object", "schema": Result.model_json_schema()})
        return response.choices[0].message.content

class GPTCodeGenerator(CodeGenerator):
    def __init__(self, api_key: str):
        self.client = openai.OpenAI(api_key=api_key)

    def generate_code(self, prompt: str) -> str:
        response = self.client.chat.completions.create(
            messages=self.make_prompt(prompt), model=self.model_name,
            temperature=self.temperature, top_p=self.top_p, presence_penalty=PRESENCE_PENALTY, frequency_penalty=FREQUENCY_PENALTY)
        return response.choices[0].message.content.strip()

class GeminiCodeGenerator(CodeGenerator):
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)

    def generate_code(self, prompt: str) -> str:
        if hasattr(self, 'system_prompt'):
            model = genai.GenerativeModel(model_name=self.model_name, system_instruction=self.system_prompt)
        else:
            model = genai.GenerativeModel(self.model_name)
        config = genai.types.GenerationConfig(temperature=self.temperature, top_p=self.top_p, top_k=TOP_K)
        return model.generate_content(prompt, generation_config=config).text.strip()

class ClaudeCodeGenerator(CodeGenerator):
    def __init__(self, api_key: str):
        self.client = anthropic.Anthropic(api_key=api_key)

    def generate_code(self, prompt: str) -> str:
        response = self.client.messages.create(
            messages=self.make_prompt(prompt), model=self.model_name, max_tokens=2048,
            temperature=self.temperature, top_p=self.top_p, top_k=TOP_K)
        return response.content[0].text.strip()

class MistralCodeGenerator(CodeGenerator):
    def __init__(self, api_key: str):
        self.client = Mistral(api_key=api_key)

    def generate_code(self, prompt: str) -> str:
        response = self.client.chat.complete(messages=self.make_prompt(prompt), model=self.model_name, temperature=self.temperature, top_p=self.top_p)
        return response.choices[0].message.content.strip()

class GroqCodeGenerator(CodeGenerator):
    def __init__(self, api_key: str):
        self.client = Groq(api_key=api_key)

    def generate_code(self, prompt: str) -> str:
        response = self.client.chat(messages=self.make_prompt(prompt), model=self.model_name, temperature=self.temperature, top_p=self.top_p)
        return response.choices[0].message.content.strip()

def extract_code(content: str) -> str:
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
        prompt = f"Generate {implementation_file} to pass the tests below:\n\n{test_content}. RETURN CODE ONLY."

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
                  f"List explanations to ALL errors in JSON array, one element per error")
        return generator.find_errors(prompt)
    return ""

def choose_generator(generator_type: str) -> CodeGenerator:
    generators = {
        "gpt": GPTCodeGenerator(api_key=os.environ.get("OPENAI_API_KEY")),
        "gemini": GeminiCodeGenerator(api_key=os.environ.get("GEMINI_API_KEY")),
        "claude": ClaudeCodeGenerator(api_key=os.environ.get("ANTHROPIC_API_KEY")),
        "mistral": MistralCodeGenerator(api_key=os.environ.get("MISTRAL_API_KEY")),
        "fireworks": FireworksCodeGenerator(api_key=os.environ.get("FIREWORKS_API_KEY")),
        "groq": GroqCodeGenerator(api_key=os.environ.get("GROQ_API_KEY"))
    }
    
    if generator_type not in generators:
        print(f"Unsupported generator type: {generator_type}")
        sys.exit(1)
    return generators[generator_type]
