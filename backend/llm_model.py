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
    max_new_tokens: int = 60,   # lower default
    temperature: float = 0.4,   # safer default
    top_p: float = 0.9,
    do_sample: bool = True,
    repetition_penalty: float = 1.05,
) -> str:
    if not prompt:
        raise ValueError("Prompt must not be empty.")

    system_instruction = (
        "You are a helpful, knowledgeable AI assistant. "
        "Answer the following question clearly and concisely in normal prose."
    )

    full_prompt = (
        system_instruction
        + "\n\nQuestion:\n"
        + prompt.strip()
        + "\n\nAnswer:"
    )


    inputs = tokenizer(full_prompt, return_tensors="pt").to(DEVICE)

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

    full_text = tokenizer.decode(output_ids[0], skip_special_tokens=True)

    if "Answer:" in full_text:
        full_text = full_text.split("Answer:", 1)[1]

    return full_text.strip()



