const { layout } = require('./layout');
const { renderMarkdown, escapeHtml } = require('../renderer');

function pageView(page, content, headings, backlinks) {
    const rendered = renderMarkdown(content);

    const tocHtml = headings.map(h => {
        const slug = h.text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const indent = (h.level - 1) * 16;
        return `<a href="#${slug}" style="padding-left:${indent}px">${escapeHtml(h.text)}</a>`;
    }).join('');

    let backlinksHtml = '';
    if (backlinks && backlinks.length > 0) {
        backlinksHtml = `
<div class="backlinks">
    <h3>Linked from (${backlinks.length})</h3>
    ${backlinks.map(bl => `<a href="/page?path=${encodeURIComponent(bl.source_path)}">${escapeHtml(bl.source_title)}</a>`).join('')}
</div>`;
    }

    const breadcrumb = buildBreadcrumb(page.path, page.domain);

    const tocNav = headings.length > 0 ? `
<div class="nav-section">
    <h3>On this page</h3>
    ${tocHtml}
</div>` : '';

    const meta = `
<div style="font-size:12px;color:var(--text2);margin-bottom:16px;">
    <span>${escapeHtml(page.domain)}</span>
    ${page.type ? ` · <span class="file-type ${page.type}">${page.type}</span>` : ''}
    ${page.paper_num ? ` · Paper ${page.paper_num}` : ''}
    ${page.bible ? ` · ${escapeHtml(page.bible)}` : ''}
    · ${formatSize(page.size)}
</div>`;

    const body = `
${breadcrumb}
${meta}
<div class="content">
${rendered}
</div>
${backlinksHtml}
`;

    return layout(page.title || 'Page', body, tocNav);
}

function buildBreadcrumb(filePath, domain) {
    const parts = filePath.replace(/\\/g, '/').split('/');
    let crumbs = `<a href="/">Home</a>`;
    if (domain) crumbs += ` / <a href="/bibles">${domain}</a>`;
    crumbs += ` / ${escapeHtml(parts[parts.length - 1])}`;
    return `<div class="breadcrumb">${crumbs}</div>`;
}

function formatSize(bytes) {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
}

module.exports = { pageView };
