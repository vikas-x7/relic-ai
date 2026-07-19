import { Fragment } from 'react';
import { FiExternalLink } from 'react-icons/fi';
import { parseMessageBlocks, isCodeLike } from '@/src/modules/chat/utils/messageParser';
import type { Citation } from '@/src/modules/chat/types';
import CodeBlock from '@/src/modules/chat/components/CodeBlock';

type MessageContentProps = {
  content: string;
  isUser?: boolean;
  citations?: Citation[];
};

export default function MessageContent({ content, isUser, citations }: MessageContentProps) {
  let finalContent = content;

  if (isUser && isCodeLike(content)) {
    finalContent = `\`\`\`\n${content}\n\`\`\``;
  }

  const blocks = parseMessageBlocks(finalContent);
  const hasCitations = !isUser && Boolean(citations?.length);

  return (
    <div className="space-y-3">
      {blocks.map((block, index) => (
        <Fragment key={index}>{renderBlock(block, hasCitations ? citations : undefined)}</Fragment>
      ))}

      {hasCitations && <SourcesList citations={citations as Citation[]} />}
    </div>
  );
}

function renderBlock(block: ReturnType<typeof parseMessageBlocks>[number], citations?: Citation[]) {
  if (block.type === 'heading') {
    return <h3 className="text-[17px] font-semibold leading-7 text-gray-100">{block.text}</h3>;
  }

  if (block.type === 'list') {
    return (
      <ul className="ml-5 list-disc space-y-1 text-gray-300">
        {block.items.map((item, index) => (
          <li key={index} className="pl-1 leading-7">
            {renderInlineCitations(item, citations)}
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === 'code') {
    return <CodeBlock language={block.language} text={block.text} />;
  }

  return <p className="leading-7 text-gray-300">{renderInlineCitations(block.text, citations)}</p>;
}

const CITATION_MARKER_REGEX = /(\[\d+\])/g;

export function renderInlineCitations(text: string, citations?: Citation[]) {
  if (!citations?.length || !/\[\d+\]/.test(text)) return text;

  return text.split(CITATION_MARKER_REGEX).map((part, index) => {
    const marker = part.match(/^\[(\d+)\]$/);

    if (!marker) return <Fragment key={index}>{part}</Fragment>;

    const sourceNumber = Number(marker[1]);
    const citation = citations.find((item) => item.citationIndex === sourceNumber);

    if (!citation) return <Fragment key={index}>{part}</Fragment>;

    return (
      <sup key={index} title={citation.title}>
        <a
          href={citation.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => event.stopPropagation()}
          className="mx-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-sky-500/20 px-1 align-super text-[10px] font-bold leading-none text-sky-300 transition-colors hover:bg-sky-500/40 hover:text-sky-200"
        >
          {sourceNumber}
        </a>
      </sup>
    );
  });
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function SourcesList({ citations }: { citations: Citation[] }) {
  return (
    <div className="border-t border-white/10 pt-3">
      <p className="mb-2 text-[11px] font-semibold tracking-wide text-white/40 uppercase">
        Sources
      </p>
      <div className="flex flex-wrap gap-2">
        {citations.map((citation) => (
          <a
            key={`${citation.citationIndex}-${citation.url}`}
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="flex max-w-[240px] items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-gray-300 transition-colors hover:border-sky-400/40 hover:bg-sky-500/10 hover:text-gray-100"
          >
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-sky-500/25 text-[10px] font-bold text-sky-300">
              {citation.citationIndex}
            </span>
            <span className="truncate">{citation.title || getDomain(citation.url)}</span>
            <FiExternalLink className="shrink-0 text-[10px] opacity-50" />
          </a>
        ))}
      </div>
    </div>
  );
}
