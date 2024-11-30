-- CreateTable
CREATE TABLE "CodeSnippet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "uniqueCode" TEXT NOT NULL,
    "expiry" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CodeSnippet_uniqueCode_key" ON "CodeSnippet"("uniqueCode");
