import { useState } from 'react';
import { FiCheck, FiCopy, FiRefreshCw, FiThumbsDown, FiThumbsUp } from 'react-icons/fi';

type MessageActionsProps = {
  content: string;
  onRetry: () => void;
};

export default function MessageActions({ content, onRetry }: MessageActionsProps) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedback = (type: 'like' | 'dislike') => {
    setFeedback((prev) => (prev === type ? null : type));
  };

  const buttonClass =
    'flex h-7 w-7 items-center justify-center rounded-[5px] transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-75';

  return (
    <div className="mt-2 flex items-center text-white/40">
      <button onClick={handleCopy} className={buttonClass} title="Copy">
        {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
      </button>
      <button
        onClick={() => handleFeedback('like')}
        className={`${buttonClass} ${feedback === 'like' ? 'scale-110 bg-white/10 text-white' : ''}`}
        title="Like"
      >
        <FiThumbsUp size={14} />
      </button>
      <button
        onClick={() => handleFeedback('dislike')}
        className={`${buttonClass} ${feedback === 'dislike' ? 'scale-110 bg-white/10 text-white' : ''}`}
        title="Dislike"
      >
        <FiThumbsDown size={14} />
      </button>
      <button onClick={onRetry} className={buttonClass} title="Retry">
        <FiRefreshCw size={14} />
      </button>
    </div>
  );
}
