# Department of Justice Virtual Assistant

A Smart India Hackathon (SIH) project: a **local, private chatbot** for the Department of Justice (DoJ), India. Citizens and staff can ask questions about justice-related documents and get answers **from a custom dataset**, without sending queries to a public cloud LLM.

The assistant is designed to run **on the machine** with **Ollama**. Knowledge comes from **your own documents** (PDF corpus). Retrieval over that index is meant to return answers in **milliseconds**, because search happens locally on pre-built embeddings instead of calling a remote API.

---

## What it does

- Answers questions about DoJ / legal service material grounded in a **custom dataset** (for example `data.pdf`: High Court and Supreme Court Judges salaries and service rules).
- Serves a web chat UI (text, optional voice input, dark theme) branded for the Department of Justice.
- Keeps inference **on-device**: the language model is served by **Ollama** on `localhost`.
- Restricts answers to retrieved context so the bot does not invent policy that is not in the dataset.

Typical user flow:

1. Open the landing page (`start.html`) → chat or voice assistant.
2. Type (or speak) a question.
3. The frontend `POST`s to the FastAPI backend (`/ask/` or `/ask_question`).
4. The backend embeds the query, **searches the local vector index** of the custom dataset, and asks the **local Ollama model** to answer only from that context.
5. The UI shows the reply.

---

## Why it is local, and why it can be fast

| Piece | Role | Latency |
| --- | --- | --- |
| Custom dataset (PDFs) | Source of truth: acts, rules, FAQs | Indexed once |
| Vector store (FAISS) | Nearest-neighbor search over chunks | Typically **milliseconds** |
| Ollama | Local LLM (no cloud round-trip) | Depends on model size / GPU; small models stay snappy |
| FastAPI | Thin HTTP API on `127.0.0.1:8000` | Local network only |

Speed comes from:

1. **No internet hop** to Gemini/OpenAI for production use — Ollama runs on the same PC or LAN.
2. **Precomputed embeddings** of the custom dataset. Each question is a vector lookup, not a full-document scan.
3. **Short, grounded generation**: the model only sees the few retrieved chunks, so it can reply quickly.

Retrieval over a modest legal corpus is the millisecond part. Full sentence generation still depends on the Ollama model you pull (smaller models such as `llama3.2`, `phi3`, or `mistral` are appropriate for this use case).

---

## Custom dataset

The knowledge base is **not** a general internet crawl. It is a curated set of documents you control.

Current corpus in this repo:

- `data.pdf` / `frontend/data.pdf` — High Court and Supreme Court Judges (Salaries and Conditions of Service) Amendment Act, 2021, and related service rules.

How the dataset is used:

1. Extract text from PDFs.
2. Split into overlapping chunks.
3. Embed chunks and store them in **FAISS** (`faiss_index`).
4. At query time, retrieve the closest chunks and pass them to Ollama as context.

If the answer is not in the retrieved text, the model should say the answer is not available in the context rather than guessing.

You can extend the dataset by adding more PDFs (judiciary FAQs, eCourts help, DoJ scheme notes) and rebuilding the index.

---

## Local Ollama setup

1. Install [Ollama](https://ollama.com/) for Windows.
2. Pull a model, for example:

```powershell
ollama pull llama3.2
```

3. Confirm the local API is up (default `http://127.0.0.1:11434`).
4. Point the backend at that host and model name (environment variables such as `OLLAMA_HOST` and `OLLAMA_MODEL`).

Ollama keeps weights on disk and serves them locally. Queries never need a Google API key for the intended local path.

---

## Architecture

```
User (browser)
    │  text / voice
    ▼
frontend/  (start.html, index.html, login, register)
    │  POST JSON { question }
    ▼
FastAPI  (app.py / main.py)  →  127.0.0.1:8000
    │
    ├─ embed question
    ├─ FAISS similarity search  (custom dataset index)
    └─ Ollama generate from retrieved chunks
            │
            ▼
        JSON { response }
```

**Frontend**

- `frontend/start.html` — DoJ landing (chat vs voice).
- `frontend/index.html` — main chat (DoJ logo, send, mic, theme).
- `frontend/script.js` — calls `http://127.0.0.1:8000/ask/`.
- Login / register / signup pages for a simple access gate.

**Backend (this repo)**

- `app.py` — FastAPI chat endpoint used by `index.html`.
- `main.py` — PDF upload + FAISS RAG endpoints (`/upload`, `/ask_question`).

The intended production path is **local Ollama + FAISS + custom PDFs**. An earlier prototype used Google Gemini to upload `data.pdf` and chat against it; that is cloud-based and is **not** the local millisecond design described here.

---

## Features

- Text chat grounded in DoJ documents.
- Browser speech-to-text (Web Speech API) on the chat page.
- Light / dark theme toggle.
- Optional PDF upload to refresh the vector index (`main.py`).
- CORS enabled so a static frontend (port 5500) can talk to the API (port 8000).
- Answers formatted as readable points where possible.

---

## Project layout

```
SIH_FINAL/
├── PROJECT.md          ← this file
├── app.py              ← FastAPI chat API
├── main.py             ← PDF ingest + FAISS Q&A
├── data.pdf            ← custom dataset (copy at repo root for the API)
├── styles.css
├── frontend/
│   ├── start.html
│   ├── index.html
│   ├── index2.html
│   ├── login.html
│   ├── register.html
│   ├── signup.html
│   ├── script.js
│   ├── styles.css
│   └── data.pdf
└── venv / venv2        ← Python environments (not source)
```

---

## How to run locally

**1. Ollama**

```powershell
ollama serve
ollama pull llama3.2
```

**2. Backend**

From `D:\SIH_FINAL`, with a virtualenv that has FastAPI, uvicorn, langchain, faiss, and an Ollama client:

```powershell
.\venv\Scripts\python.exe -m uvicorn app:app --host 127.0.0.1 --port 8000
```

Keep `data.pdf` in the project root (or rebuild `faiss_index` via `/upload`).

**3. Frontend**

```powershell
cd frontend
python -m http.server 5500
```

Open [http://127.0.0.1:5500/start.html](http://127.0.0.1:5500/start.html).

The chat page expects the API at `http://127.0.0.1:8000/ask/`.

---

## API (current frontend)

`POST /ask/`

```json
{ "question": "When does additional pension start for a High Court judge?" }
```

Response:

```json
{ "response": "..." }
```

`main.py` also exposes:

- `POST /upload` — ingest a PDF into FAISS.
- `POST /ask_question` — ask against the saved index.

---

## Privacy and deployment notes

- Designed for **air-gapped or intranet** DoJ kiosks: model + dataset stay on the server.
- Do not commit API keys. Local Ollama does not need a cloud key.
- Rebuild the FAISS index whenever the custom dataset changes.
- Pick a small Ollama model if the goal is interactive, near-instant replies on CPU-only machines.

---

## Summary

This project is a **Department of Justice virtual assistant** that answers from a **custom legal/DoJ dataset**, runs the model **locally with Ollama**, and uses **vector search** so lookup stays in the **millisecond** range. The web UI is a FastAPI-backed chat (and voice) client for that local pipeline.
