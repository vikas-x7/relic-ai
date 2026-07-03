import { useState } from 'react';
import { FiCheck, FiCopy } from 'react-icons/fi';

type CodeBlockProps = {
  language: string;
  text: string;
};

export default function CodeBlock({ language, text }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="overflow-hidden rounded-[6px] border border-[#3c3c3c] bg-[#1e1e1e] shadow-sm">
      <div className="flex h-9 items-center justify-between border-b border-[#2d2d2d] bg-[#252526] px-3">
        <span className="font-mono text-[11px] leading-none text-[#cccccc]">
          {language || 'code'}
        </span>
        <button
          type="button"
          onClick={copyCode}
          className="flex items-center gap-1 rounded-[4px] border border-[#3c3c3c] bg-[#2d2d30] px-2 py-1 font-mono text-[11px] leading-none text-[#cccccc] transition-colors hover:border-[#5a5a5a] hover:bg-[#37373d] hover:text-white"
        >
          {copied ? <FiCheck size={11} /> : <FiCopy size={11} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto bg-[#1e1e1e] p-4 font-mono text-[13px] leading-6 text-[#d4d4d4]">
        <code>{highlightCode(text)}</code>
      </pre>
    </div>
  );
}

function highlightCode(code: string) {
  return code
    .split(
      /(\s+|\/\/.*|\/\*[\s\S]*?\*\/|(["'`])(?:\\.|(?!\2).)*\2|\b\d+(?:\.\d+)?\b|\b(?:async|await|break|case|catch|class|const|continue|default|else|export|extends|finally|for|from|function|if|import|in|interface|let|new|null|return|string|switch|throw|try|type|undefined|var|void|while)\b)/g,
    )
    .map((part, index) => {
      if (!part) return null;

      if (/^\/\/|^\/\*/.test(part)) {
        return (
          <span key={index} className="text-[#6a9955]">
            {part}
          </span>
        );
      }

      if (/^(["'`])/.test(part)) {
        return (
          <span key={index} className="text-[#ce9178]">
            {part}
          </span>
        );
      }

      if (/^\d/.test(part)) {
        return (
          <span key={index} className="text-[#b5cea8]">
            {part}
          </span>
        );
      }

      if (
        /^(async|await|break|case|catch|class|const|continue|default|else|export|extends|finally|for|from|function|if|import|in|interface|let|new|null|return|string|switch|throw|try|type|undefined|var|void|while)$/.test(
          part,
        )
      ) {
        return (
          <span key={index} className="text-[#569cd6]">
            {part}
          </span>
        );
      }

      return part;
    });
}
