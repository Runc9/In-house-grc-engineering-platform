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

async function main() {
  // NOTE: We fetch from ../dist because index.html is inside /web
  const coverage = await loadJSON('../dist/coverage.json').catch(() => null);
  const effectiveness = await loadJSON('../dist/effectiveness.json').catch(() => null);
  const residual = await loadJSON('../dist/residual.json').catch(() => null);

  // Coverage by domain
  if (coverage) {
    const dom = document.getElementById('coverage-domain');
    const d = coverage.domain_average_coverage || {};
    Object.entries(d).forEach(([k, v]) => kv(dom, k, `${Math.round(v * 100)}%`));
  }

  // Effectiveness by domain
  if (effectiveness) {
    const dom = document.getElementById('effectiveness-domain');
    const d = effectiveness.domain_average_effectiveness || {};
    Object.entries(d).forEach(([k, v]) => kv(dom, k, `${Math.round(v * 100)}%`));
  }

  // Residual summary and table
  if (residual) {
    const sum = residual.summary || {};
    const wrap = document.getElementById('residual-summary');
    Object.entries(sum).forEach(([system, s]) => {
      kv(wrap, system, `Mitigation ${(s.combined_mitigation*100).toFixed(0)}% • Avg Resid ${s.avg_residual} • Worst ${s.worst_level}`);
    });

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
    rows.slice(0, 20).forEach(r => {
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
  }
}

main().catch(err => {
  console.error(err);
  alert('Failed to load dashboard data. Make sure you ran the engine and are serving via a local web server.');
});
