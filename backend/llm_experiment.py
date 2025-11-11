# backend/llm_experiment.py

from llm_model import generate_text


def run_temperature_experiment():
    prompt = (
        "Write the opening paragraph of a fantasy story about a student "
        "who learns magic from an ancient, sentient library."
    )

    temperatures = [0.2, 0.7, 1.2]

    print("=== LLM Temperature Experiment (GPT-2) ===")
    print(f"Prompt:\n{prompt}\n")

    for temp in temperatures:
        print("=" * 80)
        print(f"Temperature: {temp}")
        print("-" * 80)

        result = generate_text(
            prompt=prompt,
            max_new_tokens=120,
            temperature=temp,
            top_p=0.9,
            do_sample=True,
        )

        print(result)
        print("\n\n")


def run_top_p_experiment():
    prompt = (
        "Explain in simple terms how a neural network learns to recognize handwritten digits."
    )

    top_p_values = [0.5, 0.9, 1.0]

    print("=== LLM Top-p Experiment (GPT-2) ===")
    print(f"Prompt:\n{prompt}\n")

    for top_p in top_p_values:
        print("=" * 80)
        print(f"Top-p: {top_p}")
        print("-" * 80)

        result = generate_text(
            prompt=prompt,
            max_new_tokens=120,
            temperature=0.7,
            top_p=top_p,
            do_sample=True,
        )

        print(result)
        print("\n\n")


def run_length_experiment():
    prompt = "Summarize the rules of Dungeons & Dragons combat in a few sentences."

    lengths = [40, 100, 200]

    print("=== LLM Max New Tokens Experiment (GPT-2) ===")
    print(f"Prompt:\n{prompt}\n")

    for length in lengths:
        print("=" * 80)
        print(f"max_new_tokens: {length}")
        print("-" * 80)

        result = generate_text(
            prompt=prompt,
            max_new_tokens=length,
            temperature=0.7,
            top_p=0.9,
            do_sample=True,
        )

        print(result)
        print("\n\n")


if __name__ == "__main__":
    # For the assignment, you only need ONE of these families.
    # Temperature is the easiest to reason about:
    run_temperature_experiment()
    # run_top_p_experiment()
    # run_length_experiment()

