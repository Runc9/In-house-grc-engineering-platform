import json
from typing import Dict, List, Tuple
from utils import write_json
from load import load_all

def risk_bucket(score: float) -> str:
    if score <= 4:
        return "Low"
    if score <= 12:
        return "Medium"
    if score <= 20:
        return "High"
    return "Critical"

def _to_float(x: str, default: float = 0.0) -> float:
    try:
        return float(x)
    except Exception:
        return default

def _to_int(x: str, default: int = 0) -> int:
    try:
        return int(x)
    except Exception:
        return default

def load_json(path: str):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def build_system_mitigation(coverage: Dict, effectiveness: Dict) -> Dict[str, float]:
    """
    combined_mitigation(system) = 1 − Π_{ccc in system}(1 − coverage_ccc × effectiveness_ccc_system)
    """
    cov_map = {c["ccc_id"]: float(c.get("coverage", 0.0)) for c in coverage.get("controls", [])}
    systems = effectiveness.get("systems", {})

    sys_mit = {}
    for system, items in systems.items():
        prod_keep = 1.0
        for item in items:
            ccc = item.get("ccc_id")
            eff = float(item.get("effectiveness", 0.0))
            cov = float(cov_map.get(ccc, 0.0))
            contrib = cov * eff
            prod_keep *= (1.0 - max(0.0, min(1.0, contrib)))
        sys_mit[system] = round(1.0 - prod_keep, 3)
    return sys_mit

def guess_system_from_asset(asset_id: str) -> str:
    """
    Simple mapping for starter dataset: everything beginning with 'Payments' -> 'Payments'.
    Extend this later with a real assets.csv if desired.
    """
    if asset_id.startswith("Payments"):
        return "Payments"
    return "Default"

def compute_residual():
    data = load_all()  # to get risk_register.csv and CCC meta if needed
    coverage = load_json("dist/coverage.json")
    effectiveness = load_json("dist/effectiveness.json")

    sys_mit = build_system_mitigation(coverage, effectiveness)

    risks_out: Dict[str, List[Dict]] = {}
    for row in data["risk_register"]:
        asset_id = row["asset_id"]
        system = guess_system_from_asset(asset_id)
        likelihood = _to_int(row.get("likelihood_inherent", "0"))
        impact = _to_int(row.get("impact_inherent", "0"))
        inherent = likelihood * impact

        mit = float(sys_mit.get(system, 0.0))
        residual = round(inherent * (1.0 - mit), 3)
        bucket = risk_bucket(residual)

        entry = {
            "risk_id": row["risk_id"],
            "asset_id": asset_id,
            "system": system,
            "threat": row["threat"],
            "likelihood_inherent": likelihood,
            "impact_inherent": impact,
            "inherent_risk": inherent,
            "combined_mitigation": mit,
            "residual_risk": residual,
            "risk_level": bucket,
            "notes": row.get("notes", "")
        }
        risks_out.setdefault(system, []).append(entry)

    # Also provide a per-system summary
    summary = {}
    for system, items in risks_out.items():
        total = len(items)
        avg_res = round(sum(x["residual_risk"] for x in items) / total, 3) if total else 0.0
        max_level = max(items, key=lambda x: ["Low","Medium","High","Critical"].index(x["risk_level"]))["risk_level"] if items else "Low"
        summary[system] = {
            "combined_mitigation": float(sys_mit.get(system, 0.0)),
            "risks": total,
            "avg_residual": avg_res,
            "worst_level": max_level
        }

    out = {
        "generated_by": "compute_residual.py",
        "system_mitigation": sys_mit,
        "systems": risks_out,
        "summary": summary
    }
    write_json("dist/residual.json", out)
    print("Wrote dist/residual.json")

if __name__ == "__main__":
    compute_residual()
