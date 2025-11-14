async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

function kv(parent, k, v) {
  const box = document.createElement('div');
  box.className = 'kv';
  const kk = document.createElement('div');
  kk.className = 'k';
  kk.textContent = k;
  const vv = document.createElement('div');
  vv.className = 'v';
  vv.textContent = v;
  box.appendChild(kk); box.appendChild(vv);
  parent.appendChild(box);
}

function levelBadge(level) {
  const span = document.createElement('span');
  const cls = (level || '').toLowerCase();
  span.className = `badge ${cls}`;
  span.textContent = level || 'Unknown';
  return span;
}

/* ---------- Chart helpers ---------- */

function renderBarChart(containerId, dataObj) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  Object.entries(dataObj).forEach(([label, value]) => {
    const row = document.createElement('div');
    row.className = 'bar-row';

    const lab = document.createElement('div');
    lab.className = 'bar-label';
    lab.textContent = label;

    const bar = document.createElement('div');
    bar.className = 'bar';

    const fill = document.createElement('div');
    fill.className = 'bar-fill';
    const pct = Math.max(0, Math.min(1, value)) * 100;
    fill.style.width = pct + '%';

    // color shift for low/medium/high
    if (pct < 50) {
      fill.style.background = 'linear-gradient(90deg, #ff5a5a, #ffb020)';
    } else if (pct < 80) {
      fill.style.background = 'linear-gradient(90deg, #ffb020, #4ea1ff)';
    } else {
      fill.style.background = 'linear-gradient(90deg, #35c48a, #4ea1ff)';
    }

    bar.appendChild(fill);
    row.appendChild(lab);
    row.appendChild(bar);
    container.appendChild(row);
  });
}

function renderDomainDonuts(containerId, coverageDomains, effectivenessDomains) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  const domains = new Set([
    ...Object.keys(coverageDomains || {}),
    ...Object.keys(effectivenessDomains || {})
  ]);

  domains.forEach(domain => {
    const cov = coverageDomains?.[domain] ?? 0;
    const eff = effectivenessDomains?.[domain] ?? 0;
    const avg = (cov + eff) / 2;
    const pct = Math.round(avg * 100);

    const card = document.createElement('div');
    card.className = 'donut-card';

    const donut = document.createElement('div');
    donut.className = 'donut';
    donut.style.background = `conic-gradient(#4ea1ff ${pct}%, #20252e ${pct}%)`;

    const inner = document.createElement('div');
    inner.className = 'donut-inner';
    inner.textContent = pct + '%';

    donut.appendChild(inner);

    const label = document.createElement('div');
    label.textContent = domain;

    card.appendChild(donut);
    card.appendChild(label);
    container.appendChild(card);
  });
}

/* Heatmap builder */
function renderRiskHeatmap(residual) {
  const tbody = document.querySelector('#risk-heatmap tbody');
  if (!tbody || !residual) return;
  tbody.innerHTML = '';

  const systems = residual.systems || {};
  const summary = residual.summary || {};

  Object.entries(systems).forEach(([system, items]) => {
    const counts = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    items.forEach(r => {
      counts[r.risk_level] = (counts[r.risk_level] || 0) + 1;
    });

    const tr = document.createElement('tr');
    const avgRes = summary[system]?.avg_residual ?? 0;

    tr.innerHTML = `
      <td>${system}</td>
      <td class="level-cell">${counts.Low || 0}</td>
      <td class="level-cell">${counts.Medium || 0}</td>
      <td class="level-cell">${counts.High || 0}</td>
      <td class="level-cell">${counts.Critical || 0}</td>
      <td>${avgRes}</td>
    `;

    // apply background intensity based on worst level
    const worst = summary[system]?.worst_level || 'Low';
    const index = ['Low','Medium','High','Critical'].indexOf(worst);
    const cells = tr.querySelectorAll('.level-cell');
    cells.forEach((cell, i) => {
      if (i === index) {
        if (worst === 'Low') cell.classList.add('level-low');
        else if (worst === 'Medium') cell.classList.add('level-medium');
        else if (worst === 'High') cell.classList.add('level-high');
        else if (worst === 'Critical') cell.classList.add('level-critical');
      }
    });

    tbody.appendChild(tr);
  });
}

/* Control drilldown + gaps */
function renderControlsAndGaps(coverage, effectiveness) {
  if (!coverage || !effectiveness) return;

  const controlsTableBody = document.querySelector('#controls-table tbody');
  const gapsTableBody = document.querySelector('#gaps-table tbody');
  controlsTableBody.innerHTML = '';
  gapsTableBody.innerHTML = '';

  const covMap = {};
  (coverage.controls || []).forEach(c => {
    covMap[c.ccc_id] = c;
  });

  const effMap = {};
  (effectiveness.controls || []).forEach(c => {
    effMap[c.ccc_id] = c;
  });

  const rows = [];

  Object.keys(covMap).forEach(cccId => {
    const cov = covMap[cccId];
    const eff = effMap[cccId] || {
      effectiveness: 0,
      domain: cov.domain,
      control_type: cov.control_type,
      title: cov.title
    };

    const covPct = Math.round((cov.coverage || 0) * 100);
    const effPct = Math.round((eff.effectiveness || 0) * 100);

    rows.push({
      domain: cov.domain,
      ccc_id: cccId,
      title: cov.title,
      coverage: covPct,
      effectiveness: effPct
    });
  });

  // sort by domain then CCC ID
  rows.sort((a, b) => {
    if (a.domain === b.domain) return a.ccc_id.localeCompare(b.ccc_id);
    return a.domain.localeCompare(b.domain);
  });

  const GAP_THRESHOLD = 80; // 80%

  rows.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.domain}</td>
      <td>${r.ccc_id}</td>
      <td>${r.title}</td>
      <td>${r.coverage}%</td>
      <td>${r.effectiveness}%</td>
    `;
    controlsTableBody.appendChild(tr);

    const gapTypes = [];
    if (r.coverage < GAP_THRESHOLD) gapTypes.push('Coverage');
    if (r.effectiveness < GAP_THRESHOLD) gapTypes.push('Effectiveness');

    if (gapTypes.length > 0) {
      const gtr = document.createElement('tr');
      gtr.innerHTML = `
        <td>${r.domain}</td>
        <td>${r.ccc_id}</td>
        <td>${r.title}</td>
        <td>${r.coverage}%</td>
        <td>${r.effectiveness}%</td>
        <td>${gapTypes.join(' & ')}</td>
      `;
      gapsTableBody.appendChild(gtr);
    }
  });
}

/* CSV upload preview (client side only) */
function setupCsvUpload() {
  const input = document.getElementById('csv-upload');
  const tbody = document.querySelector('#csv-preview-table tbody');
  if (!input || !tbody) return;

  input.addEventListener('change', () => {
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
      if (lines.length === 0) return;

      const headers = lines[0].split(',').map(h => h.trim());
      const rows = lines.slice(1).map(line => {
        const cols = line.split(',');
        const obj = {};
        headers.forEach((h, i) => { obj[h] = (cols[i] || '').trim(); });
        return obj;
      });

      tbody.innerHTML = '';
      rows.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${r.risk_id || ''}</td>
          <td>${r.asset_id || ''}</td>
          <td>${r.threat || ''}</td>
          <td>${r.likelihood_inherent || ''}</td>
          <td>${r.impact_inherent || ''}</td>
          <td>${r.notes || ''}</td>
        `;
        tbody.appendChild(tr);
      });
    };
    reader.readAsText(file);
  });
}

/* ---------- Main ---------- */

async function main() {
  // Live site structure: index.html + dist/ in same root
  const coverage = await loadJSON('dist/coverage.json').catch(() => null);
  const effectiveness = await loadJSON('dist/effectiveness.json').catch(() => null);
  const residual = await loadJSON('dist/residual.json').catch(() => null);

  // Old cards: Coverage & Effectiveness by domain
  if (coverage) {
    const dom = document.getElementById('coverage-domain');
    const d = coverage.domain_average_coverage || {};
    Object.entries(d).forEach(([k, v]) => kv(dom, k, `${Math.round(v * 100)}%`));
  }

  if (effectiveness) {
    const dom = document.getElementById('effectiveness-domain');
    const d = effectiveness.domain_average_effectiveness || {};
    Object.entries(d).forEach(([k, v]) => kv(dom, k, `${Math.round(v * 100)}%`));
  }

  // Residual summary
  if (residual) {
    const sum = residual.summary || {};
    const wrap = document.getElementById('residual-summary');
    Object.entries(sum).forEach(([system, s]) => {
      kv(
        wrap,
        system,
        `Mitigation ${(s.combined_mitigation*100).toFixed(0)}% • Avg Resid ${s.avg_residual} • Worst ${s.worst_level}`
      );
    });

    // Top risks table
    const tbody = document.querySelector('#risks-table tbody');
    tbody.innerHTML = '';
    const systems = residual.systems || {};
    const rows = [];
    Object.entries(systems).forEach(([system, items]) => {
      items.forEach(r => rows.push({
        system,
        risk_id: r.risk_id,
        asset_id: r.asset_id,
        threat: r.threat,
        inherent: r.inherent_risk,
        mitigation: r.combined_mitigation,
        residual: r.residual_risk,
        level: r.risk_level
      }));
    });
    rows.sort((a,b) => b.residual - a.residual);
    rows.slice(0, 50).forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${r.system}</td>
        <td>${r.risk_id}</td>
        <td>${r.asset_id}</td>
        <td>${r.threat}</td>
        <td>${r.inherent}</td>
        <td>${(r.mitigation*100).toFixed(0)}%</td>
        <td>${r.residual}</td>
        <td></td>
      `;
      const lvl = levelBadge(r.level);
      tr.lastElementChild.appendChild(lvl);
      tbody.appendChild(tr);
    });

    // Heatmap
    renderRiskHeatmap(residual);
  }

  // Charts + drilldown + gaps
  const covDom = coverage?.domain_average_coverage || {};
  const effDom = effectiveness?.domain_average_effectiveness || {};
  renderBarChart('coverage-bars', covDom);
  renderBarChart('effectiveness-bars', effDom);
  renderDomainDonuts('domain-donuts', covDom, effDom);
  renderControlsAndGaps(coverage, effectiveness);

  // CSV upload
  setupCsvUpload();
}

main().catch(err => {
  console.error(err);
  alert('Failed to load dashboard data. Make sure the JSON artifacts exist and GitHub Pages is configured.');
});
