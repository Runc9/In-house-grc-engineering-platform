A hands-on platform that ties **policy → controls → automated evidence → residual risk analytics**.
# In-House GRC Engineering Platform

A hands-on platform that ties **policy → controls → automated evidence → residual risk analytics**.

## What this project delivers
- CI/CD control enforcement (IaC checks, SBOM, secrets, attestations)
- Canonical control mapping (NIST 800-53, ISO 27001, SOC 2)
- Evidence ingestion and scoring (coverage, effectiveness)
- Residual risk computation and dashboard visualization

## Folder map (planned)
- `evidence/` — pipeline artifacts (JSON/CSV/logs)
- `data/` — canonical controls, framework maps, implementations, risks
- `engine/` — ingestion + scoring scripts
- `web/` — minimal dashboard (coverage + residual risk)
- `.github/workflows/` — secure pipeline

## Status
Phase 1: repo setup ✅
Phase 2: data schemas & starter CSVs ⏳
