function layout(title, body, nav = '') {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} — Biblion</title>
<style>
:root {
    --bg: #0d1117;
    --bg2: #161b22;
    --bg3: #21262d;
    --border: #30363d;
    --text: #e6edf3;
    --text2: #8b949e;
    --accent: #58a6ff;
    --green: #3fb950;
    --orange: #ffa657;
    --purple: #d2a8ff;
    --red: #f85149;
    --yellow: #e3b341;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
    background: var(--bg);
    color: var(--text);
    line-height: 1.6;
}
a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }
.shell {
    display: grid;
    grid-template-columns: 240px 1fr;
    min-height: 100vh;
}
.sidebar {
    background: var(--bg2);
    border-right: 1px solid var(--border);
    padding: 16px;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
}
.sidebar h1 {
    font-size: 18px;
    margin-bottom: 24px;
    color: var(--accent);
}
.sidebar h1 a { color: var(--accent); }
.nav-section {
    margin-bottom: 16px;
}
.nav-section h3 {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text2);
    margin-bottom: 8px;
}
.nav-section a {
    display: block;
    padding: 4px 8px;
    border-radius: 4px;
    color: var(--text);
    font-size: 14px;
}
.nav-section a:hover {
    background: var(--bg3);
    text-decoration: none;
}
.nav-section a.active {
    background: var(--bg3);
    color: var(--accent);
}
.main {
    padding: 32px 48px;
    max-width: 960px;
}
.breadcrumb {
    font-size: 13px;
    color: var(--text2);
    margin-bottom: 16px;
}
.breadcrumb a { color: var(--text2); }
.breadcrumb a:hover { color: var(--accent); }

/* Content styles */
.content h1 { font-size: 28px; margin: 24px 0 12px; border-bottom: 1px solid var(--border); padding-bottom: 8px; }
.content h2 { font-size: 22px; margin: 20px 0 10px; border-bottom: 1px solid var(--border); padding-bottom: 6px; }
.content h3 { font-size: 18px; margin: 16px 0 8px; }
.content h4 { font-size: 16px; margin: 12px 0 6px; }
.content p { margin: 8px 0; }
.content ul, .content ol { padding-left: 24px; margin: 8px 0; }
.content li { margin: 4px 0; }
.content pre {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 12px;
    overflow-x: auto;
    margin: 12px 0;
    font-size: 13px;
}
.content code {
    background: var(--bg3);
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 13px;
}
.content pre code {
    background: none;
    padding: 0;
}
.content table {
    border-collapse: collapse;
    width: 100%;
    margin: 12px 0;
}
.content th, .content td {
    border: 1px solid var(--border);
    padding: 8px 12px;
    text-align: left;
}
.content th { background: var(--bg2); font-weight: 600; }
.content blockquote {
    border-left: 3px solid var(--accent);
    padding-left: 12px;
    color: var(--text2);
    margin: 12px 0;
}
.content hr { border: none; border-top: 1px solid var(--border); margin: 16px 0; }
.content img { max-width: 100%; border-radius: 6px; }

/* Auto-links */
.auto-link { border-bottom: 1px dashed var(--accent); }
.paper-link { color: var(--orange); border-color: var(--orange); }
.exp-link { color: var(--purple); border-color: var(--purple); }

/* Search */
.search-box {
    width: 100%;
    padding: 8px 12px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--text);
    font-size: 14px;
    margin-bottom: 16px;
}
.search-box:focus { outline: none; border-color: var(--accent); }

/* Stats cards */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
    margin: 16px 0;
}
.stat-card {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 16px;
    text-align: center;
}
.stat-card .num {
    font-size: 28px;
    font-weight: 700;
    color: var(--accent);
}
.stat-card .label {
    font-size: 12px;
    color: var(--text2);
    text-transform: uppercase;
    letter-spacing: 1px;
}

/* File list */
.file-list { list-style: none; padding: 0; }
.file-list li {
    padding: 8px 12px;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.file-list li:hover { background: var(--bg2); }
.file-type {
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 10px;
    background: var(--bg3);
    color: var(--text2);
}
.file-type.bible { background: #1a3a1a; color: var(--green); }
.file-type.paper { background: #3a2a1a; color: var(--orange); }
.file-type.experiment { background: #2a1a3a; color: var(--purple); }

/* Backlinks panel */
.backlinks {
    margin-top: 32px;
    padding-top: 16px;
    border-top: 1px solid var(--border);
}
.backlinks h3 { font-size: 14px; color: var(--text2); margin-bottom: 8px; }
.backlinks a { display: block; padding: 4px 0; font-size: 14px; }

/* Search result */
.search-result {
    padding: 12px 0;
    border-bottom: 1px solid var(--border);
}
.search-result .path { font-size: 12px; color: var(--text2); }
.search-result .snippet { font-size: 14px; margin-top: 4px; }
.search-result mark { background: rgba(88, 166, 255, 0.2); color: var(--accent); }
</style>
</head>
<body>
<div class="shell">
<nav class="sidebar">
    <h1><a href="/">Biblion</a></h1>
    <form action="/search" method="get">
        <input type="text" name="q" class="search-box" placeholder="Search...">
    </form>
    <div class="nav-section">
        <h3>Browse</h3>
        <a href="/">Dashboard</a>
        <a href="/bibles">Bibles</a>
        <a href="/papers">Papers</a>
        <a href="/connections">Connections</a>
        <a href="/experiments">Experiments</a>
    </div>
    <div class="nav-section">
        <h3>Tools</h3>
        <a href="/search">Search</a>
        <a href="/stale">Stale Pages</a>
        <a href="/recent">Recent Changes</a>
    </div>
    ${nav}
</nav>
<main class="main">
${body}
</main>
</div>
</body>
</html>`;
}

module.exports = { layout };
