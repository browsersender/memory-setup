function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderMarkdown(md) {
    const lines = md.split('\n');
    const out = [];
    let inCode = false;
    let inTable = false;
    let inList = false;
    let listType = null;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        // Fenced code blocks
        if (line.match(/^```/)) {
            if (inCode) {
                out.push('</code></pre>');
                inCode = false;
            } else {
                const lang = line.replace(/^```\s*/, '');
                out.push(`<pre><code class="lang-${escapeHtml(lang)}">`);
                inCode = true;
            }
            continue;
        }
        if (inCode) {
            out.push(escapeHtml(line));
            continue;
        }

        // Close list if needed
        if (inList && !line.match(/^\s*[-*+]\s/) && !line.match(/^\s*\d+\.\s/) && line.trim() !== '') {
            out.push(listType === 'ul' ? '</ul>' : '</ol>');
            inList = false;
            listType = null;
        }

        // Blank line
        if (line.trim() === '') {
            if (inList) {
                out.push(listType === 'ul' ? '</ul>' : '</ol>');
                inList = false;
                listType = null;
            }
            if (inTable) {
                out.push('</tbody></table>');
                inTable = false;
            }
            continue;
        }

        // Headings
        const headingMatch = line.match(/^(#{1,6})\s+(.+)/);
        if (headingMatch) {
            const level = headingMatch[1].length;
            const text = inlineFormat(headingMatch[2]);
            const slug = headingMatch[2].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            out.push(`<h${level} id="${slug}">${text}</h${level}>`);
            continue;
        }

        // Horizontal rule
        if (line.match(/^(-{3,}|_{3,}|\*{3,})\s*$/)) {
            out.push('<hr>');
            continue;
        }

        // Table
        if (line.includes('|') && line.trim().startsWith('|')) {
            const cells = line.split('|').slice(1, -1).map(c => c.trim());
            if (!inTable) {
                out.push('<table><thead><tr>');
                for (const cell of cells) {
                    out.push(`<th>${inlineFormat(cell)}</th>`);
                }
                out.push('</tr></thead>');
                // Skip separator row
                if (i + 1 < lines.length && lines[i + 1].match(/^\|[\s\-:|]+\|/)) {
                    i++;
                }
                out.push('<tbody>');
                inTable = true;
            } else {
                out.push('<tr>');
                for (const cell of cells) {
                    out.push(`<td>${inlineFormat(cell)}</td>`);
                }
                out.push('</tr>');
            }
            continue;
        }

        // Unordered list
        const ulMatch = line.match(/^(\s*)[-*+]\s+(.+)/);
        if (ulMatch) {
            if (!inList) {
                out.push('<ul>');
                inList = true;
                listType = 'ul';
            }
            out.push(`<li>${inlineFormat(ulMatch[2])}</li>`);
            continue;
        }

        // Ordered list
        const olMatch = line.match(/^(\s*)\d+\.\s+(.+)/);
        if (olMatch) {
            if (!inList) {
                out.push('<ol>');
                inList = true;
                listType = 'ol';
            }
            out.push(`<li>${inlineFormat(olMatch[2])}</li>`);
            continue;
        }

        // Blockquote
        if (line.startsWith('>')) {
            out.push(`<blockquote>${inlineFormat(line.replace(/^>\s*/, ''))}</blockquote>`);
            continue;
        }

        // Paragraph
        out.push(`<p>${inlineFormat(line)}</p>`);
    }

    if (inCode) out.push('</code></pre>');
    if (inList) out.push(listType === 'ul' ? '</ul>' : '</ol>');
    if (inTable) out.push('</tbody></table>');

    return out.join('\n');
}

function inlineFormat(text) {
    let s = escapeHtml(text);

    // Images
    s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

    // Links
    s = s.replace(/\[([^\]]*)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // Bold+italic
    s = s.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');

    // Bold
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Italic
    s = s.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Inline code
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Strikethrough
    s = s.replace(/~~(.+?)~~/g, '<del>$1</del>');

    // Auto-link Papers
    s = s.replace(/\bPaper\s+(\d{3,4})\b/gi, (match, num) => {
        return `<a href="/papers/${num}" class="auto-link paper-link">${match}</a>`;
    });

    // Auto-link Experiments
    s = s.replace(/\bExp(?:eriment)?\s+(\d{3,4})\b/gi, (match, num) => {
        return `<a href="/experiments?id=${num}" class="auto-link exp-link">${match}</a>`;
    });

    return s;
}

module.exports = { renderMarkdown, escapeHtml, inlineFormat };
