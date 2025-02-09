/*
  Warnings:

  - Made the column `userId` on table `Entry` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Entry" DROP CONSTRAINT "Entry_userId_fkey";

-- AlterTable
ALTER TABLE "Entry" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
