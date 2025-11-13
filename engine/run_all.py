from load import load_all
from utils import write_json
from compute_coverage import compute_coverage
from compute_effectiveness import compute_effectiveness
from compute_residual import compute_residual

def main():
    data = load_all()

    # 1) Coverage
    coverage = compute_coverage(data)
    write_json("dist/coverage.json", coverage)

    # 2) Effectiveness
    effectiveness = compute_effectiveness(data)
    write_json("dist/effectiveness.json", effectiveness)

    # 3) Residual risk (reads dist/*.json + data/risk_register.csv)
    compute_residual()

    print("Wrote dist/coverage.json, dist/effectiveness.json, dist/residual.json")

if __name__ == "__main__":
    main()
