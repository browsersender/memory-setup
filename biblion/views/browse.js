const { layout } = require('./layout');
const { escapeHtml } = require('../renderer');

function biblesView(bibles) {
    const grouped = {};
    for (const b of bibles) {
        const cat = b.bible || 'Ungrouped';
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(b);
    }

    let html = '<h1>Bibles</h1>';
    const cats = Object.keys(grouped).sort();
    for (const cat of cats) {
        const items = grouped[cat].sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        html += `<h2>${escapeHtml(cat)}</h2><ul class="file-list">`;
        for (const item of items) {
            html += `<li>
                <a href="/page?path=${encodeURIComponent(item.path)}">${escapeHtml(item.title)}</a>
                <span class="file-type bible">bible</span>
            </li>`;
        }
        html += '</ul>';
    }

    return layout('Bibles', html);
}

function papersView(papers) {
    let html = '<h1>Papers</h1>';
    html += `<p style="color:var(--text2)">${papers.length} papers indexed</p>`;
    html += '<ul class="file-list">';

    const sorted = papers.sort((a, b) => (b.paper_num || 0) - (a.paper_num || 0));
    for (const p of sorted) {
        html += `<li>
            <a href="/page?path=${encodeURIComponent(p.path)}">
                ${p.paper_num ? `<strong>Paper ${p.paper_num}</strong> — ` : ''}${escapeHtml(p.title)}
            </a>
            <span class="file-type paper">paper</span>
        </li>`;
    }
    html += '</ul>';

    return layout('Papers', html);
}

function connectionsView(connections) {
    let html = '<h1>Connections</h1>';
    html += `<p style="color:var(--text2)">${connections.length} connections indexed</p>`;

    const grouped = {};
    for (const c of connections) {
        const cluster = c.cluster || 'Other';
        if (!grouped[cluster]) grouped[cluster] = [];
        grouped[cluster].push(c);
    }

    for (const [cluster, conns] of Object.entries(grouped)) {
        html += `<h2>${escapeHtml(cluster)}</h2><table><thead><tr>
            <th>Paper A</th><th>Paper B</th><th>Description</th><th>Status</th>
        </tr></thead><tbody>`;
        for (const c of conns) {
            const statusClass = c.status === 'C' ? 'color:var(--green)' :
                                c.status === 'F' ? 'color:var(--red)' :
                                c.status === 'P' ? 'color:var(--yellow)' : '';
            html += `<tr>
                <td><a href="/papers/${c.paper_a}">Paper ${c.paper_a}</a></td>
                <td><a href="/papers/${c.paper_b}">Paper ${c.paper_b}</a></td>
                <td>${escapeHtml(c.description || '')}</td>
                <td style="${statusClass}">${escapeHtml(c.status || '')}</td>
            </tr>`;
        }
        html += '</tbody></table>';
    }

    return layout('Connections', html);
}

function experimentsView(experiments) {
    let html = '<h1>Experiments</h1>';
    html += `<p style="color:var(--text2)">${experiments.length} experiments indexed</p>`;
    html += '<table><thead><tr><th>ID</th><th>Paper</th><th>Thread</th><th>Result</th><th>Finding</th></tr></thead><tbody>';

    for (const e of experiments) {
        const resultStyle = e.result === 'CONFIRMED' ? 'color:var(--green)' :
                           e.result === 'FALSIFIED' ? 'color:var(--red)' :
                           e.result === 'PARTIAL' ? 'color:var(--yellow)' : '';
        html += `<tr>
            <td>${escapeHtml(e.exp_id || '')}</td>
            <td>${e.paper_num ? `<a href="/papers/${e.paper_num}">Paper ${e.paper_num}</a>` : ''}</td>
            <td>${escapeHtml(e.thread || '')}</td>
            <td style="${resultStyle}">${escapeHtml(e.result || '')}</td>
            <td>${escapeHtml(e.finding || '')}</td>
        </tr>`;
    }
    html += '</tbody></table>';

    return layout('Experiments', html);
}

module.exports = { biblesView, papersView, connectionsView, experimentsView };
