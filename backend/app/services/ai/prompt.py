import os

def load_prompt():
    base_path = os.path.dirname(__file__)
    prompt_path = os.path.join(base_path, "prompts", "rca_prompt.txt")

    with open(prompt_path, "r", encoding="utf-8") as f:
        return f.read()
