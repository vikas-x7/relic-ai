import { Fragment } from 'react';
import { parseMessageBlocks, isCodeLike } from '@/src/modules/chat/utils/messageParser';
import CodeBlock from '@/src/modules/chat/components/CodeBlock';

type MessageContentProps = {
  content: string;
  isUser?: boolean;
};

export default function MessageContent({ content, isUser }: MessageContentProps) {
  let finalContent = content;

  if (isUser && isCodeLike(content)) {
    finalContent = `\`\`\`\n${content}\n\`\`\``;
  }

  const blocks = parseMessageBlocks(finalContent);

  return (
    <div className="space-y-3">
      {blocks.map((block, index) => (
        <Fragment key={index}>{renderBlock(block)}</Fragment>
      ))}
    </div>
  );
}

function renderBlock(block: ReturnType<typeof parseMessageBlocks>[number]) {
  if (block.type === 'heading') {
    return (
      <h3 className="text-[17px] font-semibold leading-7 text-gray-100">{block.text}</h3>
    );
  }

  if (block.type === 'list') {
    return (
      <ul className="ml-5 list-disc space-y-1 text-gray-300">
        {block.items.map((item, index) => (
          <li key={index} className="pl-1 leading-7">
            {item}
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === 'code') {
    return <CodeBlock language={block.language} text={block.text} />;
  }

  return <p className="leading-7 text-gray-300">{block.text}</p>;
}
