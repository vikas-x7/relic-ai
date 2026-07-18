export const CITATION_FORMAT_PROMPT = `You have been given numbered web sources below.
When you use information from a source, mark it inline with its number in square brackets,
e.g. [1] or [2]. Use only numbers that exist in the provided source list.
Every factual claim taken from a source must carry the matching citation marker.`;

export const VALIDATE_CITATIONS_PROMPT = `Citation validation rules:
- A citation marker is valid only if its number refers to an existing source (1..N).
- Invalid or dangling markers must be removed from the final answer.
- Valid markers must map to their source URL before persisting citations.`;
