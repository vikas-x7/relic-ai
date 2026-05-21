import { get_encoding } from "tiktoken";

export function countTokens(text: string) {
  const encoding = get_encoding("cl100k_base");

  try {
    return encoding.encode(text).length;
  } finally {
    encoding.free();
  }
}
