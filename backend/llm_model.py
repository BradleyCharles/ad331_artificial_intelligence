# backend/llm_model.py

import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

# Small but modern chat model
MODEL_NAME = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# Use fast tokenizer (no sentencepiece python package needed)
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, use_fast=True)

# Ensure we have a pad token
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token

# Load the model in standard precision
# If you have GPU, you can use float16; otherwise default dtype is fine.
if DEVICE == "cuda":
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_NAME,
        torch_dtype=torch.float16,
    ).to(DEVICE)
else:
    model = AutoModelForCausalLM.from_pretrained(MODEL_NAME).to(DEVICE)

model.eval()


def generate_text(
    prompt: str,
    max_new_tokens: int = 100,
    temperature: float = 0.7,
    top_p: float = 0.9,
    do_sample: bool = True,
    repetition_penalty: float = 1.0,
) -> str:
    """
    Generate a response from TinyLlama-1.1B-Chat.

    We treat `prompt` as an instruction-style input and let the model
    "complete" it. Parameters match your FastAPI endpoint and experiment script.
    """

    if not prompt:
        raise ValueError("Prompt must not be empty.")

    # Use the prompt directly without prepending system message
    # This allows for more natural conversations
    clean_prompt = prompt.strip()

    inputs = tokenizer(clean_prompt, return_tensors="pt").to(DEVICE)
    input_length = inputs.input_ids.shape[1]

    with torch.no_grad():
        output_ids = model.generate(
            **inputs,
            max_new_tokens=max_new_tokens,
            temperature=temperature,
            top_p=top_p,
            do_sample=do_sample,
            repetition_penalty=repetition_penalty,
            pad_token_id=tokenizer.pad_token_id,
        )

    # Decode only the newly generated tokens (exclude the input prompt)
    generated_ids = output_ids[0][input_length:]
    generated_text = tokenizer.decode(generated_ids, skip_special_tokens=True)

    return generated_text.strip()
