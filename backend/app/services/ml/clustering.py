# app/services/ml/clustering.py

from typing import Dict, Any, List, Tuple
import numpy as np
from sklearn.cluster import DBSCAN, KMeans
from sklearn.preprocessing import StandardScaler
from sqlalchemy.orm import Session
from collections import defaultdict

from app.services.ml.embeddings import embed_logs_from_db


# ---------------------------------------------------------
# INTERNAL — DBSCAN (Primary)
# ---------------------------------------------------------
def _apply_dbscan(
    embeddings: np.ndarray,
    eps: float = 0.85,
    min_samples: int = 3
) -> np.ndarray:

    if embeddings.shape[0] == 0:
        return np.array([], dtype=int)

    # Normalize vectors
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(embeddings)

    db = DBSCAN(
        eps=eps,
        min_samples=min_samples,
        metric="euclidean",
        n_jobs=-1
    )

    return db.fit_predict(X_scaled)


# ---------------------------------------------------------
# INTERNAL — KMEANS (Fallback)
# ---------------------------------------------------------
def _apply_kmeans(embeddings: np.ndarray, max_clusters: int = 8) -> np.ndarray:

    n = embeddings.shape[0]
    if n == 0:
        return np.array([], dtype=int)

    # Choose cluster count dynamically
    k = max(2, min(max_clusters, n // 10))  # heuristic

    km = KMeans(
        n_clusters=k,
        random_state=42,
        n_init=10
    )

    return km.fit_predict(embeddings)


# ---------------------------------------------------------
# PUBLIC — Main Semantic Log Clustering
# ---------------------------------------------------------
def run_semantic_clustering(
    db: Session,
    *,
    eps: float = 0.85,
    min_samples: int = 3,
    kmeans_fallback_max_clusters: int = 8,
    testing: bool = False,
    limit: int = 2000
) -> Dict[str, Any]:
    """
    Steps:
      1. Convert log messages to embeddings
      2. Try DBSCAN clustering
      3. If DBSCAN yields no clusters → fallback to KMeans
      4. Return clusters + outliers + metadata
    """

    # 1. Fetch embeddings + IDs
    ids, messages, embeddings = embed_logs_from_db(db, limit=limit, testing=testing)
    n_items = len(ids)

    if n_items == 0:
        return {
            "clusters": {},
            "outliers": [],
            "meta": {"method": "none", "n_items": 0, "reason": "no_logs"}
        }

    # 2. Run DBSCAN
    labels = _apply_dbscan(embeddings, eps=eps, min_samples=min_samples)

    unique = set(labels.tolist())
    non_noise = [c for c in unique if c >= 0]

    # 3. Fallback to KMeans if DBSCAN fails
    if len(non_noise) < 1:
        labels = _apply_kmeans(embeddings, max_clusters=kmeans_fallback_max_clusters)
        method = "kmeans"
    else:
        method = "dbscan"

    # 4. Build structured cluster response
    cluster_map = defaultdict(list)

    for idx, label in enumerate(labels):
        cluster_map[int(label)].append((ids[idx], messages[idx]))

    clusters = {}
    outliers = []

    for cluster_id, items in cluster_map.items():
        if cluster_id == -1:
            # Noise/outliers
            for _id, msg in items:
                outliers.append({"id": _id, "message": msg})
        else:
            clusters[cluster_id] = {
                "count": len(items),
                "ids": [i for i, _ in items],
                "sample_messages": [m for _, m in items[:5]]
            }

    return {
        "clusters": clusters,
        "outliers": outliers,
        "meta": {
            "method": method,
            "n_items": n_items,
            "n_clusters": len(clusters),
            "eps": eps,
            "min_samples": min_samples,
        }
    }
