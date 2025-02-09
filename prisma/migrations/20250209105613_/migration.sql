/*
  Warnings:

  - A unique constraint covering the columns `[fileId]` on the table `Entry` will be added. If there are existing duplicate values, this will fail.
  - Made the column `fileId` on table `Entry` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_entryId_fkey";

-- DropIndex
DROP INDEX "File_entryId_key";

-- AlterTable
ALTER TABLE "Entry" ALTER COLUMN "fileId" SET NOT NULL;

-- AlterTable
ALTER TABLE "File" ALTER COLUMN "entryId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Entry_fileId_key" ON "Entry"("fileId");

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
