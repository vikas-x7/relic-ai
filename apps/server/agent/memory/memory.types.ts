export type MemoryTypeValue = 'FACT' | 'PREFERENCE' | 'CONTEXT';

export interface ExtractedMemory {
  content: string;
  type: MemoryTypeValue;
  importance: number;
}

export interface MemoryExtractionResult {
  shouldRemember: boolean;
  memories: ExtractedMemory[];
}

export interface MemoryItem {
  id: number;
  content: string;
  type: string;
  importance: number;
}
