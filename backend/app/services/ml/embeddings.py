# app/services/ml/embeddings.py
from typing import List, Tuple
import numpy as np
from sqlalchemy.orm import Session
from app.models.log import Log

# lazy import to avoid import-time failure when package not installed
_MODEL = None

def _load_model():
    global _MODEL
    if _MODEL is None:
        try:
            from sentence_transformers import SentenceTransformer
        except Exception as e:
            raise RuntimeError(
                "sentence-transformers not available. Install with: pip install sentence-transformers"
            ) from e
        _MODEL = SentenceTransformer("all-MiniLM-L6-v2")
    return _MODEL

def embed_messages(messages: List[str]) -> np.ndarray:
    """
    Embed a list of messages (strings) -> numpy ndarray (n, d).
    """
    model = _load_model()
    return model.encode(messages, show_progress_bar=False, convert_to_numpy=True)

def embed_logs_from_db(db: Session, limit: int = None, testing: bool = False
                       ) -> Tuple[List[int], List[str], np.ndarray]:
    """
    Fetch log messages from DB and return (ids, messages, embeddings)
    - limit: number of logs to fetch (None = all)
    - testing: if True, fetch all logs (same as limit=None)
    """
    query = db.query(Log).order_by(Log.id.asc())
    if limit and not testing:
        query = query.limit(limit)
    rows = query.all()
    ids = []
    messages = []
    for r in rows:
        # skip empty messages
        if r.message and isinstance(r.message, str) and r.message.strip():
            ids.append(r.id)
            messages.append(r.message.strip())
    if not messages:
        return ids, messages, np.zeros((0, 384))
    embs = embed_messages(messages)
    return ids, messages, embs
