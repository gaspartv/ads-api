-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('CLIENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "Vocations" AS ENUM ('NONE', 'KNIGHT', 'SORCERER', 'PALADIN', 'DRUID', 'MONK');

-- CreateEnum
CREATE TYPE "PvpType" AS ENUM ('OPEN_PVP', 'OPTIONAL_PVP', 'HARDCORE_PVP', 'RETRO_OPEN_PVP', 'RETRO_HARDCORE_PVP');

-- CreateEnum
CREATE TYPE "BattleyeType" AS ENUM ('YELLOW', 'GREEN');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "Location" AS ENUM ('EUA', 'REINO_UNIDO', 'BRASIL', 'OCEANIA');

-- CreateEnum
CREATE TYPE "CharmType" AS ENUM ('MAJOR', 'MINOR');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('CHARACTER', 'ACCOUNT', 'TIBIA_COINS');

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "disabled_at" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "whatsapp_number" TEXT NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "last_activity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" TEXT,
    "agent" TEXT,
    "is_valid" BOOLEAN NOT NULL DEFAULT true,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "disabled_at" TIMESTAMP(3),
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "type" "UserType" NOT NULL DEFAULT 'CLIENT',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "method" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "status_code" INTEGER NOT NULL,
    "request" JSONB,
    "response" JSONB,
    "user_id" TEXT,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_tibia_coins" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "disabled_at" TIMESTAMP(3),
    "name" TEXT NOT NULL DEFAULT 'Tibia Coins',
    "slug" TEXT NOT NULL DEFAULT 'tibia-coins',
    "description" TEXT,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "seo_title" TEXT,
    "seo_description" TEXT,

    CONSTRAINT "product_tibia_coins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_tibia_coins_variable" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "disabled_at" TIMESTAMP(3),
    "description" TEXT,
    "price" INTEGER NOT NULL DEFAULT 0,
    "promotional_price" INTEGER,
    "min" INTEGER,
    "max" INTEGER,
    "url" TEXT NOT NULL DEFAULT '/uploads/system/tibia-coins.gif',
    "product_tibia_coins_id" TEXT NOT NULL,

    CONSTRAINT "product_tibia_coins_variable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_tibia_coins_stock_batches" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "initial_amount" INTEGER NOT NULL,
    "current_amount" INTEGER NOT NULL,
    "cost_price" INTEGER NOT NULL,
    "supplier_name" TEXT,
    "product_tibia_coins_id" TEXT NOT NULL,

    CONSTRAINT "product_tibia_coins_stock_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worlds" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" "Location" NOT NULL,
    "battleye" "BattleyeType",
    "pvpType" "PvpType" NOT NULL,

    CONSTRAINT "worlds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "charms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "CharmType" NOT NULL,

    CONSTRAINT "charms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outfit_genders" (
    "id" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "outfit" TEXT NOT NULL,
    "addonOne" TEXT,
    "addonTwo" TEXT,
    "full" TEXT,
    "outfit_id" TEXT NOT NULL,

    CONSTRAINT "outfit_genders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outfits" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "outfits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mounts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "speed" INTEGER NOT NULL DEFAULT 10,
    "image" TEXT NOT NULL,

    CONSTRAINT "mounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_characters" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "disabled_at" TIMESTAMP(3),
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL DEFAULT 0,
    "promotional_price" INTEGER,
    "price_tibia_coins" INTEGER,
    "promotional_price_tibia_coins" INTEGER,
    "seo_title" TEXT,
    "seo_description" TEXT,
    "world_id" TEXT NOT NULL,
    "vocation" "Vocations" NOT NULL,
    "level" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "loyalty" INTEGER NOT NULL,
    "magic_level" INTEGER NOT NULL DEFAULT 0,
    "fist_fighting" INTEGER NOT NULL DEFAULT 10,
    "sword_fighting" INTEGER NOT NULL DEFAULT 10,
    "axe_fighting" INTEGER NOT NULL DEFAULT 10,
    "club_fighting" INTEGER NOT NULL DEFAULT 10,
    "distance_fighting" INTEGER NOT NULL DEFAULT 10,
    "shielding" INTEGER NOT NULL DEFAULT 10,
    "charm_points" INTEGER NOT NULL DEFAULT 0,
    "charm_expansion" BOOLEAN NOT NULL DEFAULT false,
    "inventory_value" INTEGER,
    "transferable" BOOLEAN NOT NULL DEFAULT true,
    "transfer_available_at" TIMESTAMP(3),
    "premium_ends_at" TIMESTAMP(3),
    "has_recovery_key" BOOLEAN NOT NULL DEFAULT false,
    "safe_address" BOOLEAN NOT NULL DEFAULT true,
    "account_warning" TEXT,
    "metadata" JSONB,

    CONSTRAINT "product_characters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "type" "ProductType" NOT NULL DEFAULT 'TIBIA_COINS',
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "disabled_at" TIMESTAMP(3),
    "is_fixed" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "price" INTEGER NOT NULL DEFAULT 0,
    "promotionalPrice" INTEGER,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "multiples" INTEGER NOT NULL DEFAULT 1,
    "seoTitle" TEXT,
    "seoDescription" TEXT,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_batches" (
    "id" TEXT NOT NULL,
    "initial_amount" INTEGER NOT NULL,
    "current_amount" INTEGER NOT NULL,
    "cost_price" INTEGER NOT NULL,
    "supplier_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "stock_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "disabled_at" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "images" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "index" INTEGER NOT NULL DEFAULT 0,
    "url" TEXT NOT NULL DEFAULT '/uploads/system/no-image.jpg',
    "category_id" TEXT,
    "product_id" TEXT,
    "product_character_id" TEXT,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CharmToProductCharacter" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CharmToProductCharacter_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_OutfitToProductCharacter" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_OutfitToProductCharacter_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_MountToProductCharacter" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MountToProductCharacter_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CategoryToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CategoryToProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_code_key" ON "companies"("code");

-- CreateIndex
CREATE UNIQUE INDEX "companies_whatsapp_number_key" ON "companies"("whatsapp_number");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_code_key" ON "users"("code");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "product_tibia_coins_slug_key" ON "product_tibia_coins"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "outfit_genders_gender_outfit_id_key" ON "outfit_genders"("gender", "outfit_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_characters_code_key" ON "product_characters"("code");

-- CreateIndex
CREATE UNIQUE INDEX "product_characters_slug_key" ON "product_characters"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_code_key" ON "products"("code");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "categories_code_key" ON "categories"("code");

-- CreateIndex
CREATE UNIQUE INDEX "images_index_category_id_product_id_product_character_id_key" ON "images"("index", "category_id", "product_id", "product_character_id");

-- CreateIndex
CREATE INDEX "_CharmToProductCharacter_B_index" ON "_CharmToProductCharacter"("B");

-- CreateIndex
CREATE INDEX "_OutfitToProductCharacter_B_index" ON "_OutfitToProductCharacter"("B");

-- CreateIndex
CREATE INDEX "_MountToProductCharacter_B_index" ON "_MountToProductCharacter"("B");

-- CreateIndex
CREATE INDEX "_CategoryToProduct_B_index" ON "_CategoryToProduct"("B");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_tibia_coins_variable" ADD CONSTRAINT "product_tibia_coins_variable_product_tibia_coins_id_fkey" FOREIGN KEY ("product_tibia_coins_id") REFERENCES "product_tibia_coins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_tibia_coins_stock_batches" ADD CONSTRAINT "product_tibia_coins_stock_batches_product_tibia_coins_id_fkey" FOREIGN KEY ("product_tibia_coins_id") REFERENCES "product_tibia_coins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfit_genders" ADD CONSTRAINT "outfit_genders_outfit_id_fkey" FOREIGN KEY ("outfit_id") REFERENCES "outfits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_characters" ADD CONSTRAINT "product_characters_world_id_fkey" FOREIGN KEY ("world_id") REFERENCES "worlds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_batches" ADD CONSTRAINT "stock_batches_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_product_character_id_fkey" FOREIGN KEY ("product_character_id") REFERENCES "product_characters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharmToProductCharacter" ADD CONSTRAINT "_CharmToProductCharacter_A_fkey" FOREIGN KEY ("A") REFERENCES "charms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharmToProductCharacter" ADD CONSTRAINT "_CharmToProductCharacter_B_fkey" FOREIGN KEY ("B") REFERENCES "product_characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OutfitToProductCharacter" ADD CONSTRAINT "_OutfitToProductCharacter_A_fkey" FOREIGN KEY ("A") REFERENCES "outfits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OutfitToProductCharacter" ADD CONSTRAINT "_OutfitToProductCharacter_B_fkey" FOREIGN KEY ("B") REFERENCES "product_characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MountToProductCharacter" ADD CONSTRAINT "_MountToProductCharacter_A_fkey" FOREIGN KEY ("A") REFERENCES "mounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MountToProductCharacter" ADD CONSTRAINT "_MountToProductCharacter_B_fkey" FOREIGN KEY ("B") REFERENCES "product_characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToProduct" ADD CONSTRAINT "_CategoryToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToProduct" ADD CONSTRAINT "_CategoryToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
