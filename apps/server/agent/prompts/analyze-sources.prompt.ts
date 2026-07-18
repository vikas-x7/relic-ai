export const ANALYZE_SOURCES_PROMPT = `You are a research assistant.
Given the user's question and a list of web search results, pick the result numbers
that contain genuinely useful evidence to answer the question.

Question:
{{query}}

Search results:
{{results}}

Reply with ONLY a JSON array of the relevant result numbers, e.g. [1,3].
If none are relevant, reply with an empty array: []`;
