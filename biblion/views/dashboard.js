const { layout } = require('./layout');

function dashboardView(stats, recentPages, bibleGroups) {
    const cards = [
        { num: stats.pages || 0, label: 'Pages' },
        { num: stats.bibles || 0, label: 'Bibles' },
        { num: stats.papers || 0, label: 'Papers' },
        { num: stats.experiments || 0, label: 'Experiments' },
        { num: stats.connections || 0, label: 'Connections' },
        { num: stats.links || 0, label: 'Links' },
    ];

    const statsHtml = cards.map(c =>
        `<div class="stat-card"><div class="num">${c.num.toLocaleString()}</div><div class="label">${c.label}</div></div>`
    ).join('');

    const recentHtml = recentPages.map(p =>
        `<li><a href="/page?path=${encodeURIComponent(p.path)}">${esc(p.title)}</a><span class="file-type ${p.type}">${p.type}</span></li>`
    ).join('');

    let biblesHtml = '';
    if (bibleGroups && Object.keys(bibleGroups).length > 0) {
        for (const [group, bibles] of Object.entries(bibleGroups)) {
            biblesHtml += `<h3>${esc(group)}</h3><ul class="file-list">`;
            for (const b of bibles) {
                biblesHtml += `<li><a href="/page?path=${encodeURIComponent(b.path)}">${esc(b.title)}</a></li>`;
            }
            biblesHtml += '</ul>';
        }
    }

    const body = `
<h1>Dashboard</h1>
<div class="stats-grid">${statsHtml}</div>
<h2>Recent Changes</h2>
<ul class="file-list">${recentHtml || '<li>No pages scanned yet</li>'}</ul>
<h2>Bibles by Category</h2>
${biblesHtml || '<p>No bibles found yet. Plug in your thumb drive and rescan.</p>'}
`;

    return layout('Dashboard', body);
}

function esc(s) {
    if (!s) return '';
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

module.exports = { dashboardView };
