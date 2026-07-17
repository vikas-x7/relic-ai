-- CreateEnum
CREATE TYPE "MessageRole" AS ENUM ('USER', 'ASSISTANT');

-- CreateTable
CREATE TABLE "Conversation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "conversationId" INTEGER NOT NULL,
    "role" "MessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "webUsed" BOOLEAN NOT NULL DEFAULT false,
    "model" TEXT,
    "inputTokens" INTEGER,
    "outputTokens" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "domain" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageCitation" (
    "id" SERIAL NOT NULL,
    "messageId" INTEGER NOT NULL,
    "sourceId" INTEGER NOT NULL,
    "citationIndex" INTEGER NOT NULL,

    CONSTRAINT "MessageCitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Conversation_userId_updatedAt_idx" ON "Conversation"("userId", "updatedAt");

-- CreateIndex
CREATE INDEX "Message_conversationId_createdAt_idx" ON "Message"("conversationId", "createdAt");

-- CreateIndex
CREATE INDEX "Source_domain_idx" ON "Source"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "Source_url_key" ON "Source"("url");

-- CreateIndex
CREATE INDEX "MessageCitation_messageId_idx" ON "MessageCitation"("messageId");

-- CreateIndex
CREATE INDEX "MessageCitation_sourceId_idx" ON "MessageCitation"("sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "MessageCitation_messageId_sourceId_key" ON "MessageCitation"("messageId", "sourceId");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageCitation" ADD CONSTRAINT "MessageCitation_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageCitation" ADD CONSTRAINT "MessageCitation_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE CASCADE ON UPDATE CASCADE;
