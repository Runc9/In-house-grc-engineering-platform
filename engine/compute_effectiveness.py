from typing import Dict, List, Tuple
from math import prod
from utils import write_json
from load import load_all

def _to_float(x: str, default: float = 0.0) -> float:
    try:
        return float(x)
    except Exception:
        return default

def combine_effectiveness(values: List[float]) -> float:
    # 1 − Π(1 − e_i)
    if not values:
        return 0.0
    keep = [max(0.0, min(1.0, v)) for v in values]
    return 1.0 - prod(1.0 - v for v in keep)

def compute_effectiveness(data: Dict[str, List[Dict[str, str]]]) -> Dict:
    impls = data["implementations"]

    # per CCC (org-wide) and per system
    per_ccc_values: Dict[str, List[float]] = {}
    per_ccc_system_values: Dict[Tuple[str, str], List[float]] = {}

    for row in impls:
        ccc = row["ccc_id"]
        system = row["system"]
        eff = _to_float(row.get("control_effectiveness", "0"))
        per_ccc_values.setdefault(ccc, []).append(eff)
        per_ccc_system_values.setdefault((ccc, system), []).append(eff)

    # Build outputs
    controls = []
    systems = {}

    # Map CCC → title/domain for nicer output
    ccc_meta = {c["ccc_id"]: {"title": c["title"], "domain": c["domain"], "control_type": c["control_type"]}
                for c in data["canonical_controls"]}

    for ccc, vals in per_ccc_values.items():
        combined = round(combine_effectiveness(vals), 3)
        meta = ccc_meta.get(ccc, {"title": "", "domain": "", "control_type": ""})
        controls.append({
            "ccc_id": ccc,
            "title": meta["title"],
            "domain": meta["domain"],
            "control_type": meta["control_type"],
            "effectiveness": combined,
            "implementations_count": len(vals)
        })

    # Per CCC per system
    for (ccc, system), vals in per_ccc_system_values.items():
        combined = round(combine_effectiveness(vals), 3)
        systems.setdefault(system, []).append({
            "ccc_id": ccc,
            "effectiveness": combined,
            "implementations_count": len(vals)
        })

    # Domain averages (org-wide)
    domain_buckets: Dict[str, List[float]] = {}
    for c in controls:
        domain_buckets.setdefault(c["domain"], []).append(c["effectiveness"])
    domain_avg = {d: round(sum(v)/len(v), 3) for d, v in domain_buckets.items() if v}

    return {
        "generated_by": "compute_effectiveness.py",
        "controls": sorted(controls, key=lambda x: x["ccc_id"]),
        "domain_average_effectiveness": domain_avg,
        "systems": systems
    }

if __name__ == "__main__":
    data = load_all()
    out = compute_effectiveness(data)
    write_json("dist/effectiveness.json", out)
    print("Wrote dist/effectiveness.json")
