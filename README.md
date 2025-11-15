# **GRC Engineering Platform — Continuous Compliance & Risk Analytics**

[![Status](https://img.shields.io/badge/status-active-success?style=flat-square)](#)
[![Focus](https://img.shields.io/badge/focus-GRC%20Engineering-4ea1ff?style=flat-square)](#)
[![Frameworks](https://img.shields.io/badge/frameworks-NIST%20800--53%20%7C%20ISO%2027001%20%7C%20SOC%202-6f42c1?style=flat-square)](#)
[![Tech Stack](https://img.shields.io/badge/stack-Python%20%7C%20GitHub%20Actions%20%7C%20JavaScript-2b7489?style=flat-square)](#)
[![Deployment](https://img.shields.io/badge/deployed-GitHub%20Pages-0a9396?style=flat-square)](#)

---

### 🚀 **Live Dashboard**  
https://runc9.github.io/In-house-grc-engineering-platform/

A data-driven **GRC Engineering Platform** that transforms CSV control data into automated compliance analytics and a live risk dashboard.  
Shows mastery of **control modeling**, **quantitative risk analysis**, **evidence automation**, and **GRC-as-code engineering**.

---
# 🧩 **Architecture Overview**


```
CSV Inputs
  ├─ canonical_controls.csv
  ├─ framework_controls_* (ISO, NIST, SOC2)
  └─ risk_register.csv
        ↓
Python Engine (coverage, effectiveness, mitigation, residual risk)
        ↓
JSON Artifacts in /dist
        ↓
Interactive Web Dashboard (HTML + CSS + JS)
        ↓
GitHub Actions → GitHub Pages (CI/CD)
```
### **Core Pipeline**

**CSV → Engine:**  
Canonical controls, framework mappings, implementation evidence, and risk register are ingested.

**Engine → JSON:**  
Python computes coverage, effectiveness, mitigation, and residual risk.

**JSON → Dashboard:**  
JavaScript renders charts, donuts, heatmaps, tables, and drill-downs.

**CI/CD → Pages:**  
GitHub Actions auto-generates artifacts and deploys the dashboard on every push.

---

# ⭐ **Key Features (High-Level)**

### ✔ Canonical control catalog  
Unified CCC model across NIST SP 800-53, ISO 27001, and SOC 2.

### ✔ Cross-framework mapping  
Coverage and gaps normalized across frameworks.

### ✔ Quantitative control scoring  
- Coverage × confidence → numeric coverage  
- Effectiveness → per-system and per-control scoring  

### ✔ System mitigation modeling  
Probabilistic product-of-inverses model of control strength.

### ✔ Residual risk engine with risk floor  
Prevents unrealistic “zero risk” outputs by applying a 5% uncertainty factor.

### ✔ Full compliance and risk visualizations  
- Coverage bar charts  
- Effectiveness bar charts  
- Donut charts by domain  
- Risk heatmap  
- Residual risk summary  
- Top risks table  
- Domain drill-down  
- Gap analysis (<80%)

### ✔ CSV ingestion & sandbox  
Upload your own risk register for instant client-side preview.

### ✔ GitHub Actions CI/CD  
Automatic build → JSON generation → deployment.

---
# 📦 **What’s Inside the Project**

## **Data Model** (in `data/`)
- `canonical_controls.csv`  
- `framework_controls_iso.csv`  
- `framework_controls_nist.csv`  
- `framework_controls_soc2.csv`  
- `mappings.csv`  
- `implementations.csv`  
- `risk_register.csv`  

## **Python Engine** (in `engine/`)
- `compute_coverage.py`  
- `compute_effectiveness.py`  
- `compute_residual.py`  
- `run_all.py`  
- `utils.py`, `load.py`

Outputs:

## **Dashboard** (in `web/`)
- `index.html`  
- `styles.css`  
- `app.js`  

---

# 🧠 **Why This Project Matters**

This project demonstrates how modern teams evolve from **compliance-as-checklist → compliance-as-engineering**.

### **Controls become structured data**  
Not static PDFs.

### **Evidence becomes machine-readable**  
Coverage and effectiveness turn into metrics.

### **Risk becomes quantitative**  
Residual risk uses:

likelihood × impact × (1 − mitigation)

with a realistic residual risk floor to account for operational uncertainty.

### **Compliance becomes continuous**  
Every commit regenerates risk and control analytics and redeploys the dashboard through CI/CD.

### **Leadership gets real visibility**  
Charts, donuts, heatmaps, summaries, and drill-down tables provide a living view of the control and risk posture.

---
# 🧪 **Technical Breakdown**

## **Python Engine Performs**
- CSV ingestion  
- Data normalization  
- Control mapping across frameworks  
- Mitigation modeling  
- Risk calculation  
- Floor-adjusted residual scoring  
- JSON artifact generation  

## **Frontend Performs**
- Bar chart rendering  
- Donut chart rendering  
- Heatmap rendering  
- Control-level drill-down  
- Gap detection  
- Risk table generation  
- CSV uploader (client-side only)  

## **GitHub Actions Performs**
- Python environment setup  
- Engine execution  
- Artifact packaging  
- GitHub Pages deployment  

---
# 🔮 **Roadmap**

- Time-series trends (coverage/effectiveness over time)  
- Multi-system architecture & comparison  
- SOC2 / ISO / NIST control diffing  
- Evidence ingestion from APIs  
- Export to PDF/CSV reports  
- “Control maturity” scoring  
- Gap alert notifications  
- ServiceNow / Jira integration  

---
# 💼 **Why This is Portfolio-Ready**

This project demonstrates real GRC engineering capability:

- You can model controls, mappings, and evidence as structured data  
- You can build automated compliance and risk scoring engines  
- You can visualize risk posture in a way leadership can act on  
- You understand CI/CD, automation, and reproducible workflows  
- You can convert governance requirements into working engineering systems  

This is an in-house compliance analytics platform, not a checklist tool.

---

# ✨ **Live Demo**  
https://runc9.github.io/In-house-grc-engineering-platform/

# 🤝 **Author**  
Designed and built by **@Runc9** as part of a GRC Engineering/AWS Cloud Security Compliance portfolio.

