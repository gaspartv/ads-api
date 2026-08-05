/*
  Warnings:

  - You are about to drop the column `cardContent` on the `product_characters` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "card_content" JSONB;

-- AlterTable
ALTER TABLE "product_characters" DROP COLUMN "cardContent";
