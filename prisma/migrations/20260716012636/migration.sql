/*
  Warnings:

  - You are about to drop the `_OutfitToProductCharacter` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "OutfitLevel" AS ENUM ('OUTFIT', 'ADDON_ONE', 'ADDON_TWO', 'FULL');

-- DropForeignKey
ALTER TABLE "_OutfitToProductCharacter" DROP CONSTRAINT "_OutfitToProductCharacter_A_fkey";

-- DropForeignKey
ALTER TABLE "_OutfitToProductCharacter" DROP CONSTRAINT "_OutfitToProductCharacter_B_fkey";

-- DropTable
DROP TABLE "_OutfitToProductCharacter";

-- CreateTable
CREATE TABLE "map_character_outfits" (
    "id" TEXT NOT NULL,
    "nivel" "OutfitLevel" NOT NULL DEFAULT 'OUTFIT',
    "outfit_id" TEXT NOT NULL,
    "character_id" TEXT NOT NULL,

    CONSTRAINT "map_character_outfits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "map_character_outfits_outfit_id_character_id_key" ON "map_character_outfits"("outfit_id", "character_id");

-- AddForeignKey
ALTER TABLE "map_character_outfits" ADD CONSTRAINT "map_character_outfits_outfit_id_fkey" FOREIGN KEY ("outfit_id") REFERENCES "outfits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "map_character_outfits" ADD CONSTRAINT "map_character_outfits_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "product_characters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
