# GRC Engineering Platform (End-to-End Compliance & Risk Analytics Engine)

[![Status](https://img.shields.io/badge/status-active-success?style=flat-square)](#)
[![Focus](https://img.shields.io/badge/focus-GRC%20Engineering-4ea1ff?style=flat-square)](#)
[![Controls](https://img.shields.io/badge/frameworks-NIST%20800--53%20%7C%20ISO%2027001%20%7C%20SOC%202-6f42c1?style=flat-square)](#)
[![Stack](https://img.shields.io/badge/stack-Python%20%7C%20GitHub%20Actions%20%7C%20Vanilla%20JS-2b7489?style=flat-square)](#)
[![Deploy](https://img.shields.io/badge/deploy-GitHub%20Pages-0a9396?style=flat-square)](#)

**Live Demo → https://runc9.github.io/In-house-grc-engineering-platform/**  

A fully automated **Governance, Risk & Compliance (GRC) engineering platform** that turns CSV control datasets into an interactive visual risk dashboard.  

This project demonstrates how modern security teams operationalize GRC using **engineering-first workflows**, not static documents:

- Canonical control catalog with cross-framework mapping  
- Automated coverage & effectiveness scoring  
- Quantitative residual-risk modeling (with a risk floor)  
- System-level mitigation analytics  
- Visual dashboard (charts, donuts, heatmap)  
- Control drill-down & gaps analysis  
- CSV risk register ingestion (client-side)  
- CI/CD pipeline deploying to GitHub Pages

---

## 🧭 What This Platform Does

This platform ingests 3 core CSV datasets:

- `canonical_controls.csv` – canonical control catalog  
- `mappings.csv` + framework CSVs – mappings to NIST / ISO / SOC2  
- `risk_register.csv` – system + asset + inherent risk inputs  

The **Python engine** transforms these into:

- Coverage per canonical control & domain  
- Effectiveness per control and per system  
- Combined mitigation per system  
- Residual risk per risk item, with a **residual risk floor**  
- Per-system summaries (avg residual, worst level, mitigation)

Artifacts are written to:

```text
dist/
 ├─ coverage.json
 ├─ effectiveness.json
 └─ residual.json
