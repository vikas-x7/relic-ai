import type { ChatModel, ChatNodeType } from '@/src/modules/chat/types';

export const CHAT_NODE_WIDTH = 750;
export const CHAT_NODE_HANDLE_TOP = 25;
export const CHAT_INPUT_LINE_HEIGHT = 32;
export const CHAT_INPUT_MAX_LINES = 7;
export const CHAT_INPUT_MAX_HEIGHT = CHAT_INPUT_LINE_HEIGHT * CHAT_INPUT_MAX_LINES;
export const CHAT_INPUT_FOCUS_ZOOM = 0.95;
export const CHAT_TEXT_INTERACTION_CLASS = 'nodrag nopan cursor-text select-text';

export const CHAT_NODE_HANDLE_IDS = {
  left: 'left',
  right: 'right',
} as const;

export const NEW_NODE_HORIZONTAL_GAP = 160;
export const NEW_NODE_VERTICAL_GAP = 60;
export const ARRANGE_NODE_HORIZONTAL_GAP = 180;

export const STREAM_MIN_REVEAL_RATE = 70;
export const STREAM_MAX_REVEAL_RATE = 520;
export const STREAM_FRAME_CAP_MS = 80;

export const DEFAULT_CHAT_ID = 'new-chat';

export const INITIAL_NODE_ID = 'root';

export const initialNodes: ChatNodeType[] = [
  {
    id: INITIAL_NODE_ID,
    type: 'chatNode',
    position: { x: 510, y: 550 },
    data: { customId: INITIAL_NODE_ID },
  },
];

export const MODELS: ChatModel[] = [
  { id: 'gemma', name: 'Gemma 2', icon: 'fc-google', available: true },
  { id: 'minimax', name: 'Minimax', icon: 'thesvg-minimax', available: false, tag: 'coming soon' },
  { id: 'kimi', name: 'Kimi', icon: 'thesvg-kimi', available: false, tag: 'coming soon' },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    icon: 'thesvg-deepseek',
    available: false,
    tag: 'coming soon',
  },
  { id: 'mistral', name: 'Mistral', icon: 'thesvg-mistral', available: false, tag: 'coming soon' },
];

export const MODEL_ICON_SRC: Record<string, string> = {
  'fc-google': 'https://relicai.in/images/logo.png',
  'thesvg-minimax': 'https://thesvg.org/icons/minimax/default.svg',
  'thesvg-kimi': 'https://thesvg.org/icons/kimi/default.svg',
  'thesvg-deepseek': 'https://thesvg.org/icons/deepseek/default.svg',
  'thesvg-mistral': 'https://thesvg.org/icons/mistral/default.svg',
};

export const EXAMPLE_PROMPTS = [
  { text: 'Write a to-do list for a personal project', icon: 'user' },
  { text: 'Generate an email to reply to a job offer', icon: 'mail' },
  { text: 'Summarize this article in one paragraph', icon: 'message' },
  { text: 'How does AI work in a technical capacity', icon: 'code' },
];

export const DEFAULT_VIEWPORT = { x: 0, y: 0, zoom: 0.7 };
