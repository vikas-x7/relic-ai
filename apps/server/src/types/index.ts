import type { Role } from "@prisma/client";

export type AppVariables = {
  userId: string;
};

export type MessageInput = {
  role: Role;
  content: string;
  tokenCount?: number;
  metadata?: unknown;
};

export type SearchResult = {
  title: string;
  url: string;
  content: string;
};
