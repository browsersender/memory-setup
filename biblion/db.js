const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DATA_DIR = path.join(__dirname, 'data');

const SCHEMAS = {
    catalog: `
        CREATE TABLE IF NOT EXISTS pages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            path TEXT UNIQUE NOT NULL,
            title TEXT,
            domain TEXT,
            bible TEXT,
            category TEXT,
            type TEXT,
            paper_num INTEGER,
            hash TEXT,
            size INTEGER,
            modified TEXT,
            scanned_at TEXT
        );
        CREATE TABLE IF NOT EXISTS headings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            page_id INTEGER NOT NULL,
            level INTEGER,
            text TEXT,
            FOREIGN KEY (page_id) REFERENCES pages(id)
        );
        CREATE INDEX IF NOT EXISTS idx_pages_domain ON pages(domain);
        CREATE INDEX IF NOT EXISTS idx_pages_type ON pages(type);
        CREATE INDEX IF NOT EXISTS idx_pages_bible ON pages(bible);
        CREATE INDEX IF NOT EXISTS idx_pages_paper ON pages(paper_num);
    `,
    links: `
        CREATE TABLE IF NOT EXISTS forward_links (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source_id INTEGER NOT NULL,
            target_path TEXT,
            target_label TEXT,
            link_type TEXT DEFAULT 'reference'
        );
        CREATE TABLE IF NOT EXISTS backlinks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            target_path TEXT NOT NULL,
            source_id INTEGER NOT NULL,
            source_title TEXT
        );
        CREATE TABLE IF NOT EXISTS auto_links (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            page_id INTEGER NOT NULL,
            match_text TEXT,
            target_path TEXT,
            link_type TEXT
        );
        CREATE INDEX IF NOT EXISTS idx_flinks_source ON forward_links(source_id);
        CREATE INDEX IF NOT EXISTS idx_flinks_target ON forward_links(target_path);
        CREATE INDEX IF NOT EXISTS idx_blinks_target ON backlinks(target_path);
        CREATE INDEX IF NOT EXISTS idx_blinks_source ON backlinks(source_id);
    `,
    search: `
        CREATE VIRTUAL TABLE IF NOT EXISTS search_index USING fts5(
            path,
            title,
            content,
            domain,
            tokenize='porter unicode61'
        );
    `,
    connections: `
        CREATE TABLE IF NOT EXISTS connections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cluster TEXT,
            paper_a INTEGER,
            paper_b INTEGER,
            description TEXT,
            status TEXT,
            thread TEXT
        );
        CREATE TABLE IF NOT EXISTS experiments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            exp_id TEXT,
            paper_num INTEGER,
            thread TEXT,
            result TEXT,
            finding TEXT
        );
        CREATE TABLE IF NOT EXISTS follow_ups (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source TEXT,
            item TEXT,
            status TEXT,
            priority TEXT
        );
        CREATE INDEX IF NOT EXISTS idx_conn_status ON connections(status);
        CREATE INDEX IF NOT EXISTS idx_conn_cluster ON connections(cluster);
        CREATE INDEX IF NOT EXISTS idx_exp_paper ON experiments(paper_num);
        CREATE INDEX IF NOT EXISTS idx_exp_result ON experiments(result);
    `,
    git: `
        CREATE TABLE IF NOT EXISTS commits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            file_path TEXT,
            hash TEXT,
            author TEXT,
            date TEXT,
            message TEXT,
            insertions INTEGER,
            deletions INTEGER
        );
        CREATE INDEX IF NOT EXISTS idx_commits_file ON commits(file_path);
        CREATE INDEX IF NOT EXISTS idx_commits_date ON commits(date);
    `
};

const dbs = {};

function open(name) {
    if (dbs[name]) return dbs[name];
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const dbPath = path.join(DATA_DIR, `${name}.db`);
    const db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('synchronous = NORMAL');
    if (SCHEMAS[name]) {
        db.exec(SCHEMAS[name]);
    }
    dbs[name] = db;
    return db;
}

function close(name) {
    if (dbs[name]) {
        dbs[name].close();
        delete dbs[name];
    }
}

function closeAll() {
    for (const name of Object.keys(dbs)) {
        close(name);
    }
}

function drop(name) {
    close(name);
    const dbPath = path.join(DATA_DIR, `${name}.db`);
    try { fs.unlinkSync(dbPath); } catch {}
    try { fs.unlinkSync(dbPath + '-wal'); } catch {}
    try { fs.unlinkSync(dbPath + '-shm'); } catch {}
}

function stats() {
    const result = {};
    for (const name of Object.keys(SCHEMAS)) {
        const dbPath = path.join(DATA_DIR, `${name}.db`);
        try {
            const stat = fs.statSync(dbPath);
            result[name] = { size: stat.size, exists: true };
        } catch {
            result[name] = { size: 0, exists: false };
        }
    }
    return result;
}

module.exports = { open, close, closeAll, drop, stats, DATA_DIR, DB_NAMES: Object.keys(SCHEMAS) };
