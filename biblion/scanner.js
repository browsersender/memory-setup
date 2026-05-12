const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const db = require('./db');

function walkDir(dir, fileList = []) {
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return fileList; }
    for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
        if (entry.isDirectory()) {
            walkDir(full, fileList);
        } else if (entry.name.endsWith('.md')) {
            fileList.push(full);
        }
    }
    return fileList;
}

function hashContent(content) {
    return crypto.createHash('md5').update(content).digest('hex');
}

function extractTitle(content, filePath) {
    const match = content.match(/^#\s+(.+)/m);
    if (match) return match[1].trim();
    return path.basename(filePath, '.md');
}

function extractHeadings(content) {
    const headings = [];
    const lines = content.split('\n');
    for (const line of lines) {
        const m = line.match(/^(#{1,6})\s+(.+)/);
        if (m) {
            headings.push({ level: m[1].length, text: m[2].trim() });
        }
    }
    return headings;
}

function extractPaperNum(filePath, title) {
    let m = filePath.match(/paper[_-]?(\d{3,4})/i);
    if (m) return parseInt(m[1], 10);
    m = title.match(/Paper\s+(\d{3,4})/i);
    if (m) return parseInt(m[1], 10);
    return null;
}

function classifyType(filePath, content) {
    const lower = filePath.toLowerCase();
    if (lower.includes('bible.md') || lower.includes('bible/')) return 'bible';
    if (lower.includes('paper-') || lower.includes('papers/')) return 'paper';
    if (lower.includes('experiment') || lower.includes('exp-')) return 'experiment';
    if (lower.includes('glossary')) return 'glossary';
    if (lower.includes('roadmap')) return 'roadmap';
    if (lower.includes('runbook')) return 'runbook';
    if (lower.includes('cold-start')) return 'cold-start';
    if (lower.includes('handoff')) return 'handoff';
    if (lower.includes('claude.md')) return 'claude-md';
    if (lower.includes('readme')) return 'readme';
    if (lower.includes('memory/')) return 'memory';
    if (lower.includes('index.md')) return 'index';
    if (lower.includes('connection')) return 'connection-index';
    return 'document';
}

function detectBible(filePath) {
    const parts = filePath.split(path.sep);
    for (let i = parts.length - 1; i >= 0; i--) {
        if (parts[i].toLowerCase() === 'bibles' && i + 1 < parts.length) {
            return parts[i + 1];
        }
        const dir = parts.slice(0, i + 1).join(path.sep);
        try {
            const files = fs.readdirSync(dir);
            if (files.some(f => f.toLowerCase() === 'bible.md')) {
                return parts[i];
            }
        } catch {}
    }
    return null;
}

function extractLinks(content) {
    const links = [];
    const mdLinkRe = /\[([^\]]*)\]\(([^)]+)\)/g;
    let m;
    while ((m = mdLinkRe.exec(content)) !== null) {
        links.push({ label: m[1], target: m[2] });
    }
    return links;
}

function extractAutoLinks(content) {
    const autoLinks = [];
    const paperRe = /\bPaper\s+(\d{3,4})\b/gi;
    let m;
    while ((m = paperRe.exec(content)) !== null) {
        autoLinks.push({ text: m[0], num: parseInt(m[1], 10), type: 'paper' });
    }
    const expRe = /\bExp(?:eriment)?\s+(\d{3,4})\b/gi;
    while ((m = expRe.exec(content)) !== null) {
        autoLinks.push({ text: m[0], num: parseInt(m[1], 10), type: 'experiment' });
    }
    return autoLinks;
}

function scanFile(filePath, domain, catalog, linksDb, searchDb) {
    let content;
    try { content = fs.readFileSync(filePath, 'utf8'); } catch { return null; }

    const hash = hashContent(content);
    const stat = fs.statSync(filePath);

    const existing = catalog.prepare('SELECT id, hash FROM pages WHERE path = ?').get(filePath);
    if (existing && existing.hash === hash) return existing.id;

    const title = extractTitle(content, filePath);
    const headings = extractHeadings(content);
    const paperNum = extractPaperNum(filePath, title);
    const type = classifyType(filePath, content);
    const bible = detectBible(filePath);
    const now = new Date().toISOString();

    let pageId;
    if (existing) {
        catalog.prepare(`UPDATE pages SET title=?, domain=?, bible=?, type=?, paper_num=?, hash=?, size=?, modified=?, scanned_at=? WHERE id=?`)
            .run(title, domain, bible, type, paperNum, hash, stat.size, stat.mtime.toISOString(), now, existing.id);
        pageId = existing.id;
        catalog.prepare('DELETE FROM headings WHERE page_id = ?').run(pageId);
    } else {
        const info = catalog.prepare(`INSERT INTO pages (path, title, domain, bible, type, paper_num, hash, size, modified, scanned_at) VALUES (?,?,?,?,?,?,?,?,?,?)`)
            .run(filePath, title, domain, bible, type, paperNum, hash, stat.size, stat.mtime.toISOString(), now);
        pageId = info.lastInsertRowid;
    }

    const insertHeading = catalog.prepare('INSERT INTO headings (page_id, level, text) VALUES (?,?,?)');
    for (const h of headings) {
        insertHeading.run(pageId, h.level, h.text);
    }

    // Links
    if (linksDb) {
        linksDb.prepare('DELETE FROM forward_links WHERE source_id = ?').run(pageId);
        linksDb.prepare('DELETE FROM auto_links WHERE page_id = ?').run(pageId);

        const links = extractLinks(content);
        const insertLink = linksDb.prepare('INSERT INTO forward_links (source_id, target_path, target_label) VALUES (?,?,?)');
        for (const link of links) {
            insertLink.run(pageId, link.target, link.label);
        }

        const autoLinks = extractAutoLinks(content);
        const insertAuto = linksDb.prepare('INSERT INTO auto_links (page_id, match_text, target_path, link_type) VALUES (?,?,?,?)');
        for (const al of autoLinks) {
            insertAuto.run(pageId, al.text, `paper-${al.num}`, al.type);
        }
    }

    // Search
    if (searchDb) {
        searchDb.prepare('DELETE FROM search_index WHERE path = ?').run(filePath);
        searchDb.prepare('INSERT INTO search_index (path, title, content, domain) VALUES (?,?,?,?)')
            .run(filePath, title, content.substring(0, 100000), domain);
    }

    return pageId;
}

function buildBacklinks(catalog, linksDb) {
    linksDb.prepare('DELETE FROM backlinks').run();
    const allLinks = linksDb.prepare('SELECT source_id, target_path FROM forward_links').all();

    const getTitle = catalog.prepare('SELECT title FROM pages WHERE id = ?');
    const insert = linksDb.prepare('INSERT INTO backlinks (target_path, source_id, source_title) VALUES (?,?,?)');
    const insertMany = linksDb.transaction((links) => {
        for (const link of links) {
            const row = getTitle.get(link.source_id);
            insert.run(link.target_path, link.source_id, row ? row.title : '');
        }
    });
    insertMany(allLinks);
}

function scan(config) {
    const catalog = db.open('catalog');
    const linksDb = db.open('links');
    const searchDb = db.open('search');

    let total = 0;
    let updated = 0;

    for (const root of config.roots) {
        console.log(`  Scanning ${root.path} (${root.domain})...`);
        const files = walkDir(root.path);
        for (const file of files) {
            const result = scanFile(file, root.domain, catalog, linksDb, searchDb);
            total++;
            if (result) updated++;
        }
        console.log(`    ${files.length} files found`);
    }

    console.log(`  Building backlinks...`);
    buildBacklinks(catalog, linksDb);

    const pageCount = catalog.prepare('SELECT COUNT(*) as c FROM pages').get().c;
    const linkCount = linksDb.prepare('SELECT COUNT(*) as c FROM forward_links').get().c;
    const searchCount = searchDb.prepare('SELECT COUNT(*) as c FROM search_index').get().c;

    console.log(`  Done: ${pageCount} pages, ${linkCount} links, ${searchCount} search entries`);

    return { total, updated, pages: pageCount, links: linkCount, search: searchCount };
}

module.exports = { scan, walkDir, scanFile, buildBacklinks, extractAutoLinks };
