from utils import read_csv

def load_all():
    data = {}
    data['canonical_controls'] = read_csv('data/canonical_controls.csv')
    data['nist']               = read_csv('data/framework_controls_nist.csv')
    data['iso']                = read_csv('data/framework_controls_iso.csv')
    data['soc2']               = read_csv('data/framework_controls_soc2.csv')
    data['mappings']           = read_csv('data/mappings.csv')
    data['implementations']    = read_csv('data/implementations.csv')
    data['risk_register']      = read_csv('data/risk_register.csv')
    return data

if __name__ == "__main__":
    # quick smoke test
    d = load_all()
    print("Loaded keys:", list(d.keys()))
    print("CCC count:", len(d['canonical_controls']))
    print("Mappings:", len(d['mappings']))
    print("Implementations:", len(d['implementations']))
