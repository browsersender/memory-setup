const { layout } = require('./layout');
const { escapeHtml } = require('../renderer');

function searchView(query, results) {
    let html = '<h1>Search</h1>';
    html += `<form action="/search" method="get">
        <input type="text" name="q" class="search-box" value="${escapeHtml(query || '')}" placeholder="Search all documents..." autofocus>
    </form>`;

    if (query && results.length === 0) {
        html += `<p style="color:var(--text2)">No results for "${escapeHtml(query)}"</p>`;
    } else if (results.length > 0) {
        html += `<p style="color:var(--text2)">${results.length} result${results.length === 1 ? '' : 's'} for "${escapeHtml(query)}"</p>`;
        for (const r of results) {
            const snippet = highlightSnippet(r.content, query);
            html += `<div class="search-result">
                <a href="/page?path=${encodeURIComponent(r.path)}">${escapeHtml(r.title || r.path)}</a>
                <div class="path">${escapeHtml(r.domain || '')} · ${escapeHtml(r.path)}</div>
                <div class="snippet">${snippet}</div>
            </div>`;
        }
    }

    return layout('Search', html);
}

function highlightSnippet(content, query) {
    if (!content || !query) return '';
    const lower = content.toLowerCase();
    const qLower = query.toLowerCase();
    const idx = lower.indexOf(qLower);
    if (idx === -1) return escapeHtml(content.substring(0, 200)) + '...';

    const start = Math.max(0, idx - 80);
    const end = Math.min(content.length, idx + query.length + 80);
    let snippet = content.substring(start, end);
    if (start > 0) snippet = '...' + snippet;
    if (end < content.length) snippet += '...';

    snippet = escapeHtml(snippet);
    const re = new RegExp(`(${escapeRegex(escapeHtml(query))})`, 'gi');
    snippet = snippet.replace(re, '<mark>$1</mark>');

    return snippet;
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { searchView };
