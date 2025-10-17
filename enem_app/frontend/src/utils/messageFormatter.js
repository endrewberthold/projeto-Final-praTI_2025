// Utilitário simples para formatar mensagens de texto em HTML seguro
// - Converte quebras de linha em parágrafos
// - Suporta blocos de código entre ``` ```
// - Suporta listas iniciadas por "- " ou "* "

export function formatMessage(text) {
  if (!text) return '';

  try {
    const lines = text.split(/\r?\n/);
    const htmlParts = [];
    let inCodeBlock = false;
    let inList = false;

    for (let raw of lines) {
      const line = raw.trimEnd();

      // Toggle code block
      if (line.trim() === '```') {
        if (!inCodeBlock) {
          htmlParts.push('<pre><code>');
          inCodeBlock = true;
        } else {
          htmlParts.push('</code></pre>');
          inCodeBlock = false;
        }
        continue;
      }

      // Inside code block: preserve verbatim
      if (inCodeBlock) {
        htmlParts.push(escapeHtml(line) + '\n');
        continue;
      }

      // Lists
      if (/^(- |\* )/.test(line)) {
        if (!inList) {
          htmlParts.push('<ul>');
          inList = true;
        }
        const item = line.replace(/^(- |\* )/, '');
        htmlParts.push(`<li>${escapeHtml(item)}</li>`);
        continue;
      } else if (inList && line.trim() === '') {
        // End list on blank line
        htmlParts.push('</ul>');
        inList = false;
        continue;
      }

      // Paragraphs
      if (line.trim() !== '') {
        htmlParts.push(`<p>${escapeHtml(line)}</p>`);
      }
    }

    // Close any open structures
    if (inCodeBlock) htmlParts.push('</code></pre>');
    if (inList) htmlParts.push('</ul>');

    return htmlParts.join('');
  } catch (e) {
    // Fallback: escape and replace newlines with <br/>
    return escapeHtml(text).replace(/\r?\n/g, '<br/>');
  }
}

export function copyFormattedText(htmlString) {
  try {
    const temp = document.createElement('div');
    temp.innerHTML = htmlString;
    const plain = temp.textContent || temp.innerText || '';
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(plain);
    } else {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = plain;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  } catch (e) {
    // silenciosamente ignora erros de cópia
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}