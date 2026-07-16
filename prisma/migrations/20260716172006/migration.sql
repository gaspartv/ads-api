/*
  Warnings:

  - You are about to drop the column `account_warning` on the `product_characters` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "product_characters" DROP COLUMN "account_warning",
ADD COLUMN     "fishing" INTEGER NOT NULL DEFAULT 10;
