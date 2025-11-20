# backend/rag_dnd.py

from __future__ import annotations

import os
from typing import List, Dict, Any

import numpy as np
import os as _os

# Avoid pulling TensorFlow / tf-keras when loading sentence-transformers.
# We only need the PyTorch pipeline, so hard-disable TF to dodge the Keras 3 import error.
_os.environ.setdefault("TRANSFORMERS_NO_TF", "1")

from sentence_transformers import SentenceTransformer

from llm_model import generate_text  # re-use your TinyLlama wrapper

# ---------- 1. PATHS & GLOBALS ----------

# Resolve path to project root: backend/ -> project root
BACKEND_DIR = os.path.dirname(__file__)
PROJECT_ROOT = os.path.dirname(BACKEND_DIR)
KB_PATH = os.path.join(PROJECT_ROOT, "public", "dnd_2024_rule_changes.txt")

# We'll lazily initialize these on first use
_embed_model: SentenceTransformer | None = None
_kb_chunks: List[Dict[str, Any]] | None = None
_kb_embeddings: np.ndarray | None = None


# ---------- 2. KB LOADING & CHUNKING ----------

def load_kb_text() -> str:
    with open(KB_PATH, "r", encoding="utf-8") as f:
        return f.read()


def chunk_kb(text: str) -> List[Dict[str, Any]]:
    """
    Very simple chunker: split on blank lines, drop tiny chunks.
    You can later improve this (e.g., split on 'RULE:' headers).
    """
    raw_chunks = [c.strip() for c in text.split("\n\n") if c.strip()]
    chunks = [c for c in raw_chunks if len(c) > 80]  # filter out very short bits

    return [
        {"id": i, "text": chunk}
        for i, chunk in enumerate(chunks)
    ]


# ---------- 3. EMBEDDING INITIALIZATION ----------

def get_embed_model() -> SentenceTransformer:
    global _embed_model
    if _embed_model is None:
        # Tiny but good enough sentence embedding model
        model_name = "sentence-transformers/all-MiniLM-L6-v2"
        _embed_model = SentenceTransformer(model_name)
    return _embed_model


def ensure_kb_index():
    """
    Lazily load + embed the KB on first RAG request.
    """
    global _kb_chunks, _kb_embeddings

    if _kb_chunks is not None and _kb_embeddings is not None:
        return

    kb_text = load_kb_text()
    _kb_chunks = chunk_kb(kb_text)

    texts = [c["text"] for c in _kb_chunks]
    model = get_embed_model()
    # Normalize embeddings => cosine similarity = dot product
    _kb_embeddings = model.encode(
        texts,
        convert_to_numpy=True,
        normalize_embeddings=True
    )


# ---------- 4. RETRIEVAL ----------

def retrieve_top_k(query: str, k: int = 2) -> List[Dict[str, Any]]:
    ensure_kb_index()

    assert _kb_chunks is not None
    assert _kb_embeddings is not None

    model = get_embed_model()
    q_emb = model.encode([query], convert_to_numpy=True, normalize_embeddings=True)[0]

    # Cosine similarity for normalized vectors = dot product
    sims = _kb_embeddings @ q_emb  # shape: (num_chunks,)

    top_idx = np.argsort(-sims)[:k]

    results: List[Dict[str, Any]] = []
    for idx in top_idx:
        chunk = _kb_chunks[idx]
        results.append({
            "id": int(chunk["id"]),
            "text": chunk["text"],
            "score": float(sims[idx]),
        })
    return results


# ---------- 5. PROMPT CONSTRUCTION ----------

def build_dnd_rag_prompt(
    query: str,
    retrieved_chunks: List[Dict[str, Any]],
    has_relevant: bool,
) -> str:
    """
    Build a prompt that:
    - passes context chunks
    - instructs TinyLlama to stick to those chunks and admit ignorance otherwise
    """
    context_parts = []
    total_chars = 0
    max_context_chars = 2500  # simple safeguard

    for hit in retrieved_chunks:
        t = hit["text"]
        if total_chars + len(t) > max_context_chars:
            break
        context_parts.append(t)
        total_chars += len(t)

    if context_parts:
        context = "\n\n---\n\n".join(context_parts)
    else:
        context = "[no relevant chunks found for this question]"

    # NOTE: generate_text() already wraps this inside a system instruction; here we
    # just add extra instructions in the user portion.
    prompt = f"""
You are a rules assistant for Dungeons & Dragons 5e, with a focus on the 2024 rules update.

You are given reference text that summarizes specific 2024 rule changes.
Context status: { "relevant context found" if has_relevant else "NO relevant context found - refuse" }.
Answer the user's question using ONLY this reference text.

If the answer is not clearly present in the reference, say exactly:
"I don't have that information in the provided 2024 rules summary."

Do NOT invent rules, and do NOT rely on outside knowledge. The reference
does not contain spaceship combat or other systems beyond D&D 2024 rules
changes—if the question asks about those, use the refusal sentence above.
If no relevant chunks were found, you must refuse with that sentence.

REFERENCE TEXT:
{context}

QUESTION: {query}

Answer in a clear, concise way. If needed, quote or paraphrase the rules from the reference.
"""
    return prompt.strip()


# ---------- 6. RAG ORCHESTRATOR ----------

def rag_dnd_answer(query: str, k: int = 2) -> Dict[str, Any]:
    """
    High-level RAG call:
    - retrieve top-k chunks
    - build prompt
    - call TinyLlama via generate_text()
    - return both answer and retrieval metadata (for debugging / UI)
    """
    retrieved = retrieve_top_k(query, k=k)

    # Filter out weak matches to reduce hallucination pressure on out-of-scope questions.
    min_score = 0.4
    relevant_chunks = [c for c in retrieved if c["score"] >= min_score]
    has_relevant = len(relevant_chunks) > 0

    prompt = build_dnd_rag_prompt(query, relevant_chunks, has_relevant)

    answer = generate_text(
        prompt=prompt,
        max_new_tokens=256,
        temperature=0.4,   # lower temp = more stable
        top_p=0.9,
        do_sample=True,
    )

    return {
        "question": query,
        "answer": answer,
        # Return the chunks actually used in the prompt for transparency.
        "retrieved_chunks": relevant_chunks if has_relevant else [],
    }


if __name__ == "__main__":
    # Quick manual smoke test (run: python backend/rag_dnd.py)
    test_q = "How does exhaustion work in the 2024 rules?"
    result = rag_dnd_answer(test_q, k=3)
    print("Q:", result["question"])
    print("\nANSWER:\n", result["answer"])
    print("\nRETRIEVED CHUNKS:")
    for c in result["retrieved_chunks"]:
        print(f"- id={c['id']} score={c['score']:.3f}")
