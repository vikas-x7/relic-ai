export type MessageBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'code'; text: string; language: string };

export function isCodeLike(text: string) {
  if (text.includes('```')) return false;

  const lines = text.trim().split('\n');
  if (lines.length < 2) return false;

  let codeLines = 0;

  for (const line of lines) {
    if (
      /[{}[\]();]/.test(line) ||
      /^(import|export|const|let|var|function|class|interface|type)\b/.test(line) ||
      /^\s+/.test(line) ||
      /<[^>]+>/.test(line)
    ) {
      codeLines++;
    }
  }

  return codeLines / lines.length > 0.4;
}

export function parseMessageBlocks(content: string): MessageBlock[] {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const blocks: MessageBlock[] = [];
  let paragraphLines: string[] = [];
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (!paragraphLines.length) return;

    blocks.push({ type: 'paragraph', text: cleanInlineText(paragraphLines.join(' ')) });
    paragraphLines = [];
  };

  const flushList = () => {
    if (!listItems.length) return;

    blocks.push({ type: 'list', items: listItems.map(cleanInlineText) });
    listItems = [];
  };

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index];
    const line = rawLine.trim();

    const fenceLanguage = getFenceLanguage(line);

    if (fenceLanguage !== null) {
      flushParagraph();
      flushList();

      const codeLines: string[] = [];
      index += 1;

      while (index < lines.length && getFenceLanguage(lines[index].trim()) === null) {
        codeLines.push(lines[index]);
        index += 1;
      }

      blocks.push({ type: 'code', text: codeLines.join('\n').trimEnd(), language: fenceLanguage });
      continue;
    }

    if (!line || isRuleLine(line)) {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = getHeadingText(line);

    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'heading', text: heading });
      continue;
    }

    const listItem = getListItemText(line);

    if (listItem) {
      flushParagraph();
      listItems.push(listItem);
      continue;
    }

    flushList();
    paragraphLines.push(line);
  }

  flushParagraph();
  flushList();

  return blocks;
}

function getFenceLanguage(line: string) {
  if (!line.startsWith('```')) return null;

  return line
    .slice(3)
    .trim()
    .replace(/[^\w+#.-]/g, '');
}

function isRuleLine(line: string) {
  return /^([*_=-]\s*){3,}$/.test(line);
}

function getHeadingText(line: string) {
  const hashHeading = line.match(/^#{1,6}\s+(.+)$/);

  if (hashHeading) return cleanInlineText(hashHeading[1]);

  const emphasizedHeading = line.match(/^(\*{2,3}|_{2,3})(.+)\1:?$/);

  if (emphasizedHeading) return cleanInlineText(emphasizedHeading[2]);

  const shortColonHeading = line.match(/^([A-Z][^.!?]{2,60}):$/);

  if (shortColonHeading) return cleanInlineText(shortColonHeading[1]);

  return '';
}

function getListItemText(line: string) {
  const bullet = line.match(/^[-*+]\s+(.+)$/);

  if (bullet) return bullet[1];

  const numbered = line.match(/^\d+[.)]\s+(.+)$/);

  if (numbered) return numbered[1];

  return '';
}

function cleanInlineText(text: string) {
  return text
    .replace(/`([^`]+)`/g, '$1')
    .replace(/(\*\*\*|___)(.*?)\1/g, '$2')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/^[*_#>\s-]+/, '')
    .replace(/[*_#>`]+$/g, '')
    .trim();
}
