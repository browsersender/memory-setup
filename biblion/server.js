const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const db = require('./db');
const scanner = require('./scanner');
const { dashboardView } = require('./views/dashboard');
const { pageView } = require('./views/page');
const { biblesView, papersView, connectionsView, experimentsView } = require('./views/browse');
const { searchView } = require('./views/search');

const CONFIG_PATH = path.join(__dirname, 'biblion.config.json');

function loadConfig() {
    try {
        const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
        return JSON.parse(raw);
    } catch (e) {
        console.error('Failed to load config:', e.message);
        process.exit(1);
    }
}

// --- Route handlers ---

function handleDashboard(req, res) {
    const catalog = db.open('catalog');
    const linksDb = db.open('links');
    const connDb = db.open('connections');

    const pageCount = catalog.prepare('SELECT COUNT(*) as c FROM pages').get().c;
    const bibleCount = catalog.prepare("SELECT COUNT(*) as c FROM pages WHERE type='bible'").get().c;
    const paperCount = catalog.prepare("SELECT COUNT(*) as c FROM pages WHERE type='paper'").get().c;

    let expCount = 0, connCount = 0;
    try {
        expCount = connDb.prepare('SELECT COUNT(*) as c FROM experiments').get().c;
        connCount = connDb.prepare('SELECT COUNT(*) as c FROM connections').get().c;
    } catch {}

    let linkCount = 0;
    try { linkCount = linksDb.prepare('SELECT COUNT(*) as c FROM forward_links').get().c; } catch {}

    const stats = { pages: pageCount, bibles: bibleCount, papers: paperCount, experiments: expCount, connections: connCount, links: linkCount };

    const recentPages = catalog.prepare('SELECT path, title, type, modified FROM pages ORDER BY modified DESC LIMIT 20').all();

    const bibles = catalog.prepare("SELECT path, title, bible FROM pages WHERE type='bible' ORDER BY bible, title").all();
    const groups = {};
    for (const b of bibles) {
        const g = b.bible || 'Other';
        if (!groups[g]) groups[g] = [];
        groups[g].push(b);
    }

    send(res, 200, dashboardView(stats, recentPages, groups));
}

function handlePage(req, res, query) {
    const filePath = query.path;
    if (!filePath) return send(res, 400, 'Missing path parameter');

    let content;
    try { content = fs.readFileSync(filePath, 'utf8'); } catch {
        return send(res, 404, 'File not found: ' + filePath);
    }

    const catalog = db.open('catalog');
    const linksDb = db.open('links');

    const page = catalog.prepare('SELECT * FROM pages WHERE path = ?').get(filePath);
    if (!page) return send(res, 404, 'Page not indexed: ' + filePath);

    const headings = catalog.prepare('SELECT level, text FROM headings WHERE page_id = ? ORDER BY id').all(page.id);

    let backlinks = [];
    try {
        backlinks = linksDb.prepare(`
            SELECT bl.source_id, bl.source_title, p.path as source_path
            FROM backlinks bl
            JOIN pages p ON bl.source_id = p.id
            WHERE bl.target_path LIKE ?
        `).all('%' + path.basename(filePath) + '%');
    } catch {}

    send(res, 200, pageView(page, content, headings, backlinks));
}

function handleBibles(req, res) {
    const catalog = db.open('catalog');
    const bibles = catalog.prepare("SELECT path, title, bible, type FROM pages WHERE type='bible' ORDER BY bible, title").all();
    send(res, 200, biblesView(bibles));
}

function handlePapers(req, res, query) {
    const catalog = db.open('catalog');

    if (query.number) {
        const num = parseInt(query.number, 10);
        const page = catalog.prepare('SELECT * FROM pages WHERE paper_num = ?').get(num);
        if (page) {
            const filePath = page.path;
            let content;
            try { content = fs.readFileSync(filePath, 'utf8'); } catch { return send(res, 404, 'File not found'); }
            const headings = catalog.prepare('SELECT level, text FROM headings WHERE page_id = ? ORDER BY id').all(page.id);
            const linksDb = db.open('links');
            let backlinks = [];
            try {
                backlinks = linksDb.prepare(`
                    SELECT bl.source_id, bl.source_title, p.path as source_path
                    FROM backlinks bl JOIN pages p ON bl.source_id = p.id
                    WHERE bl.target_path LIKE ?
                `).all(`%paper-${num}%`);
            } catch {}
            return send(res, 200, pageView(page, content, headings, backlinks));
        }
        return send(res, 404, 'Paper not found: ' + num);
    }

    const papers = catalog.prepare("SELECT path, title, paper_num, type FROM pages WHERE type='paper' ORDER BY paper_num DESC").all();
    send(res, 200, papersView(papers));
}

function handleConnections(req, res) {
    const connDb = db.open('connections');
    let connections = [];
    try { connections = connDb.prepare('SELECT * FROM connections ORDER BY cluster, id').all(); } catch {}
    send(res, 200, connectionsView(connections));
}

function handleExperiments(req, res) {
    const connDb = db.open('connections');
    let experiments = [];
    try { experiments = connDb.prepare('SELECT * FROM experiments ORDER BY paper_num DESC, id').all(); } catch {}
    send(res, 200, experimentsView(experiments));
}

function handleSearch(req, res, query) {
    const q = query.q;
    if (!q) return send(res, 200, searchView('', []));

    const searchDb = db.open('search');
    let results = [];
    try {
        results = searchDb.prepare(`
            SELECT path, title, snippet(search_index, 2, '<mark>', '</mark>', '...', 40) as content, domain
            FROM search_index
            WHERE search_index MATCH ?
            ORDER BY rank
            LIMIT 50
        `).all(q);
    } catch (e) {
        results = searchDb.prepare(`
            SELECT path, title, substr(content, 1, 200) as content, domain
            FROM search_index
            WHERE content LIKE ?
            LIMIT 50
        `).all('%' + q + '%');
    }

    send(res, 200, searchView(q, results));
}

function handleRecent(req, res) {
    const catalog = db.open('catalog');
    const pages = catalog.prepare('SELECT path, title, type, modified, size FROM pages ORDER BY modified DESC LIMIT 50').all();

    const { layout } = require('./views/layout');
    const { escapeHtml } = require('./renderer');

    let html = '<h1>Recent Changes</h1>';
    html += '<ul class="file-list">';
    for (const p of pages) {
        const date = p.modified ? new Date(p.modified).toLocaleDateString() : '';
        html += `<li>
            <a href="/page?path=${encodeURIComponent(p.path)}">${escapeHtml(p.title)}</a>
            <span style="color:var(--text2);font-size:12px">${date} · <span class="file-type ${p.type}">${p.type}</span></span>
        </li>`;
    }
    html += '</ul>';
    send(res, 200, layout('Recent', html));
}

function handleStale(req, res) {
    const { layout } = require('./views/layout');
    const body = `<h1>Stale Pages</h1><p style="color:var(--text2)">Stale detection runs after git tracking is enabled (Phase 5).</p>`;
    send(res, 200, layout('Stale', body));
}

function handleRescan(req, res, config) {
    console.log('\n  Rescanning...');
    const result = scanner.scan(config);
    res.writeHead(302, { Location: '/' });
    res.end();
}

function handleApi(req, res) {
    const catalog = db.open('catalog');
    const stats = {
        pages: catalog.prepare('SELECT COUNT(*) as c FROM pages').get().c,
        bibles: catalog.prepare("SELECT COUNT(*) as c FROM pages WHERE type='bible'").get().c,
        papers: catalog.prepare("SELECT COUNT(*) as c FROM pages WHERE type='paper'").get().c,
        databases: db.stats()
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(stats, null, 2));
}

// --- Server ---

function send(res, code, html) {
    res.writeHead(code, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
}

function start(config) {
    const port = config.port || 3900;

    // Initial scan
    console.log('\n  Biblion — Documentation Database');
    console.log('  ─────────────────────────────────');
    console.log(`  Scanning ${config.roots.length} content roots...`);

    const validRoots = config.roots.filter(r => {
        try { fs.accessSync(r.path); return true; } catch { console.log(`  ⚠ Skipping ${r.path} (not found)`); return false; }
    });
    const scanConfig = { roots: validRoots };

    const result = scanner.scan(scanConfig);
    console.log(`\n  Scan complete: ${result.pages} pages indexed`);

    // Start server
    const server = http.createServer((req, res) => {
        const parsed = url.parse(req.url, true);
        const pathname = parsed.pathname;
        const query = parsed.query;

        try {
            if (pathname === '/') return handleDashboard(req, res);
            if (pathname === '/bibles') return handleBibles(req, res);
            if (pathname === '/papers') return handlePapers(req, res, query);
            if (pathname === '/page') return handlePage(req, res, query);
            if (pathname === '/search') return handleSearch(req, res, query);
            if (pathname === '/connections') return handleConnections(req, res);
            if (pathname === '/experiments') return handleExperiments(req, res);
            if (pathname === '/recent') return handleRecent(req, res);
            if (pathname === '/stale') return handleStale(req, res);
            if (pathname === '/rescan') return handleRescan(req, res, scanConfig);
            if (pathname === '/api/stats') return handleApi(req, res);

            // /papers/NNN shortcut
            const paperMatch = pathname.match(/^\/papers\/(\d+)$/);
            if (paperMatch) return handlePapers(req, res, { number: paperMatch[1] });

            send(res, 404, 'Not found');
        } catch (e) {
            console.error('Route error:', e);
            send(res, 500, 'Internal error: ' + e.message);
        }
    });

    server.listen(port, () => {
        console.log(`\n  Server running at http://localhost:${port}`);
        console.log(`  ${result.pages} pages · ${result.links} links · ${result.search} searchable\n`);
    });

    process.on('SIGINT', () => {
        console.log('\n  Shutting down...');
        db.closeAll();
        process.exit(0);
    });
}

// Run
const config = loadConfig();
start(config);
