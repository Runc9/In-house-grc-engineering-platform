from typing import Dict, List
from utils import write_json, clamp01
from load import load_all

# Formula:
# coverage_ccc = min(1, sum(coverage_weight * confidence for all mappings to that CCC))

def _to_float(x: str, default: float = 0.0) -> float:
    try:
        return float(x)
    except Exception:
        return default

def compute_coverage(data: Dict[str, List[Dict[str, str]]]) -> Dict:
    # Index mappings by CCC
    by_ccc: Dict[str, List[Dict[str, str]]] = {}
    for m in data['mappings']:
        by_ccc.setdefault(m['ccc_id'], []).append(m)

    results = []
    per_ccc = {}

    for c in data['canonical_controls']:
        ccc_id = c['ccc_id']
        mappings = by_ccc.get(ccc_id, [])
        raw_sum = 0.0
        detail = []
        for m in mappings:
            w = _to_float(m.get('coverage_weight', '0'))
            conf = _to_float(m.get('confidence', '0'))
            contrib = w * conf
            raw_sum += contrib
            detail.append({
                "fw": m.get('fw'),
                "fw_id": m.get('fw_id'),
                "relationship": m.get('relationship'),
                "coverage_weight": w,
                "confidence": conf,
                "contribution": round(contrib, 3),
                "rationale": m.get('rationale', '')
            })

        cov = clamp01(raw_sum)
        entry = {
            "ccc_id": ccc_id,
            "title": c['title'],
            "domain": c['domain'],
            "control_type": c['control_type'],
            "coverage": round(cov, 3),
            "raw_sum": round(raw_sum, 3),
            "mappings_count": len(mappings),
            "detail": detail
        }
        results.append(entry)
        per_ccc[ccc_id] = entry

    # Summary by domain
    domains: Dict[str, List[float]] = {}
    for r in results:
        domains.setdefault(r["domain"], []).append(r["coverage"])
    domain_avg = {d: round(sum(v)/len(v), 3) for d, v in domains.items()}

    return {
        "generated_by": "compute_coverage.py",
        "ccc_count": len(results),
        "domain_average_coverage": domain_avg,
        "controls": results
    }

if __name__ == "__main__":
    data = load_all()
    coverage = compute_coverage(data)
    write_json("dist/coverage.json", coverage)
    print("Wrote dist/coverage.json")
