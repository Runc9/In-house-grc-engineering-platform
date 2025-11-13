import csv, json, os
from typing import List, Dict

def read_csv(path: str) -> List[Dict[str, str]]:
    with open(path, newline='', encoding='utf-8') as f:
        return list(csv.DictReader(f))

def write_json(path: str, data) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

def clamp01(x: float) -> float:
    return max(0.0, min(1.0, x))
