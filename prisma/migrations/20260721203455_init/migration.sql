-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "ProductTibiaCoinsType" AS ENUM ('SELL', 'BUY');

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
CREATE TYPE "OutfitLevel" AS ENUM ('OUTFIT', 'ADDON_ONE', 'ADDON_TWO', 'FULL');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('BRL', 'TIBIA_COINS');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('PIX', 'MANUAL', 'MERCADO_PAGO', 'STRIPE');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('WAITING_PAYMENT', 'PROCESSING', 'COMPLETED', 'CANCELED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('TIBIA_COINS', 'CHARACTER', 'ACCOUNT_LOYALTY');

-- CreateTable
CREATE TABLE "modules" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_modules" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "starts_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "company_id" TEXT NOT NULL,
    "module_id" TEXT NOT NULL,

    CONSTRAINT "company_modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "disabled_at" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "address" TEXT,
    "number" TEXT,
    "neighborhood" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "country" TEXT,
    "reference" TEXT,
    "company_id" TEXT,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

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
    "slogan" TEXT,
    "cnpj" TEXT,
    "email" TEXT NOT NULL,
    "whatsapp_number" TEXT NOT NULL,
    "logo" TEXT,
    "favicon" TEXT,
    "banner" TEXT,
    "site" TEXT NOT NULL,
    "seo_title" TEXT,
    "seo_description" TEXT,
    "business_hours" JSONB,
    "settings" JSONB,
    "theme" JSONB,
    "socialNetworks" JSONB,
    "integrations" JSONB,

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
    "type" "UserType" NOT NULL DEFAULT 'USER',
    "company_id" TEXT NOT NULL,

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
    "company_id" TEXT NOT NULL,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_tibia_coins" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "disabled_at" TIMESTAMP(3),
    "type" "ProductTibiaCoinsType" NOT NULL DEFAULT 'BUY',
    "name" TEXT NOT NULL DEFAULT 'Tibia Coins',
    "slug" TEXT NOT NULL DEFAULT 'tibia-coins',
    "description" TEXT,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "seo_title" TEXT,
    "seo_description" TEXT,
    "columns" JSONB NOT NULL,
    "company_id" TEXT NOT NULL,

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
CREATE TABLE "map_character_outfits" (
    "id" TEXT NOT NULL,
    "nivel" "OutfitLevel" NOT NULL DEFAULT 'OUTFIT',
    "outfit_id" TEXT NOT NULL,
    "character_id" TEXT NOT NULL,

    CONSTRAINT "map_character_outfits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_characters" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "disabled_at" TIMESTAMP(3),
    "sold_at" TIMESTAMP(3),
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "cost_price" INTEGER NOT NULL DEFAULT 0,
    "price" INTEGER NOT NULL DEFAULT 0,
    "promotional_price" INTEGER,
    "price_tibia_coins" INTEGER,
    "promotional_price_tibia_coins" INTEGER,
    "seo_title" TEXT,
    "seo_description" TEXT,
    "vocation" "Vocations" NOT NULL,
    "level" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "loyalty" INTEGER NOT NULL,
    "world_id" TEXT NOT NULL,
    "magic_level" INTEGER NOT NULL DEFAULT 0,
    "fist_fighting" INTEGER,
    "sword_fighting" INTEGER,
    "axe_fighting" INTEGER,
    "club_fighting" INTEGER,
    "distance_fighting" INTEGER,
    "shielding" INTEGER,
    "fishing" INTEGER,
    "charm_points" INTEGER NOT NULL DEFAULT 0,
    "charm_expansion" BOOLEAN NOT NULL DEFAULT false,
    "inventory_value" INTEGER,
    "transferable" BOOLEAN NOT NULL DEFAULT true,
    "transfer_available_at" TIMESTAMP(3),
    "premium_ends_at" TIMESTAMP(3),
    "has_recovery_key" BOOLEAN NOT NULL DEFAULT false,
    "safe_address" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "columns" JSONB NOT NULL,
    "company_id" TEXT NOT NULL,

    CONSTRAINT "product_characters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_account_loyalty" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "disabled_at" TIMESTAMP(3),
    "sold_at" TIMESTAMP(3),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "points" INTEGER NOT NULL DEFAULT 0,
    "percentage" INTEGER NOT NULL DEFAULT 0,
    "cost_price" INTEGER NOT NULL DEFAULT 0,
    "price" INTEGER NOT NULL,
    "promotional_price" INTEGER,
    "price_tibia_coins" INTEGER NOT NULL,
    "promotional_price_tibia_coins" INTEGER,
    "safe_address" BOOLEAN NOT NULL DEFAULT true,
    "has_recovery_key" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "columns" JSONB NOT NULL,
    "company_id" TEXT NOT NULL,

    CONSTRAINT "product_account_loyalty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "images" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "index" INTEGER NOT NULL DEFAULT 0,
    "url" TEXT NOT NULL DEFAULT '/uploads/system/no-image.jpg',
    "product_character_id" TEXT,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "whatsapp_number" TEXT,
    "company_id" TEXT NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "company_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'BRL',
    "payment_method" "PaymentMethod",
    "payment_details" JSONB,
    "subtotal_amount" INTEGER,
    "discount_amount" INTEGER,
    "fee_amount" INTEGER,
    "shipping_amount" INTEGER,
    "total_amount" INTEGER,
    "total_tibia_coins" INTEGER,
    "total_cost_amount" INTEGER,
    "profit_amount" INTEGER,
    "status" "OrderStatus" NOT NULL DEFAULT 'WAITING_PAYMENT',
    "paid_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "canceled_at" TIMESTAMP(3),
    "refunded_at" TIMESTAMP(3),
    "created_by_id" TEXT,
    "updated_by_id" TEXT,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order_id" TEXT NOT NULL,
    "product_type" "ProductType" NOT NULL,
    "unit_price" INTEGER,
    "unit_price_coins" INTEGER,
    "unit_cost_price" INTEGER,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "product_snapshot" JSONB NOT NULL,
    "product_tibia_coins_id" TEXT,
    "product_character_id" TEXT,
    "product_account_loyalty_id" TEXT,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CharmToProductCharacter" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CharmToProductCharacter_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_MountToProductCharacter" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MountToProductCharacter_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "modules_code_key" ON "modules"("code");

-- CreateIndex
CREATE UNIQUE INDEX "company_modules_company_id_module_id_key" ON "company_modules"("company_id", "module_id");

-- CreateIndex
CREATE UNIQUE INDEX "companies_code_key" ON "companies"("code");

-- CreateIndex
CREATE UNIQUE INDEX "companies_email_key" ON "companies"("email");

-- CreateIndex
CREATE UNIQUE INDEX "companies_whatsapp_number_key" ON "companies"("whatsapp_number");

-- CreateIndex
CREATE UNIQUE INDEX "companies_site_key" ON "companies"("site");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_code_company_id_key" ON "users"("code", "company_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_company_id_key" ON "users"("email", "company_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_tibia_coins_slug_company_id_key" ON "product_tibia_coins"("slug", "company_id");

-- CreateIndex
CREATE UNIQUE INDEX "outfit_genders_gender_outfit_id_key" ON "outfit_genders"("gender", "outfit_id");

-- CreateIndex
CREATE UNIQUE INDEX "map_character_outfits_outfit_id_character_id_key" ON "map_character_outfits"("outfit_id", "character_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_characters_code_company_id_key" ON "product_characters"("code", "company_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_characters_slug_company_id_key" ON "product_characters"("slug", "company_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_account_loyalty_code_company_id_key" ON "product_account_loyalty"("code", "company_id");

-- CreateIndex
CREATE UNIQUE INDEX "images_index_product_character_id_key" ON "images"("index", "product_character_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_code_company_id_key" ON "orders"("code", "company_id");

-- CreateIndex
CREATE INDEX "_CharmToProductCharacter_B_index" ON "_CharmToProductCharacter"("B");

-- CreateIndex
CREATE INDEX "_MountToProductCharacter_B_index" ON "_MountToProductCharacter"("B");

-- AddForeignKey
ALTER TABLE "company_modules" ADD CONSTRAINT "company_modules_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_modules" ADD CONSTRAINT "company_modules_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_tibia_coins" ADD CONSTRAINT "product_tibia_coins_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_tibia_coins_variable" ADD CONSTRAINT "product_tibia_coins_variable_product_tibia_coins_id_fkey" FOREIGN KEY ("product_tibia_coins_id") REFERENCES "product_tibia_coins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_tibia_coins_stock_batches" ADD CONSTRAINT "product_tibia_coins_stock_batches_product_tibia_coins_id_fkey" FOREIGN KEY ("product_tibia_coins_id") REFERENCES "product_tibia_coins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfit_genders" ADD CONSTRAINT "outfit_genders_outfit_id_fkey" FOREIGN KEY ("outfit_id") REFERENCES "outfits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "map_character_outfits" ADD CONSTRAINT "map_character_outfits_outfit_id_fkey" FOREIGN KEY ("outfit_id") REFERENCES "outfits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "map_character_outfits" ADD CONSTRAINT "map_character_outfits_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "product_characters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_characters" ADD CONSTRAINT "product_characters_world_id_fkey" FOREIGN KEY ("world_id") REFERENCES "worlds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_characters" ADD CONSTRAINT "product_characters_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_account_loyalty" ADD CONSTRAINT "product_account_loyalty_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_product_character_id_fkey" FOREIGN KEY ("product_character_id") REFERENCES "product_characters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_tibia_coins_id_fkey" FOREIGN KEY ("product_tibia_coins_id") REFERENCES "product_tibia_coins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_character_id_fkey" FOREIGN KEY ("product_character_id") REFERENCES "product_characters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_account_loyalty_id_fkey" FOREIGN KEY ("product_account_loyalty_id") REFERENCES "product_account_loyalty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharmToProductCharacter" ADD CONSTRAINT "_CharmToProductCharacter_A_fkey" FOREIGN KEY ("A") REFERENCES "charms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharmToProductCharacter" ADD CONSTRAINT "_CharmToProductCharacter_B_fkey" FOREIGN KEY ("B") REFERENCES "product_characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MountToProductCharacter" ADD CONSTRAINT "_MountToProductCharacter_A_fkey" FOREIGN KEY ("A") REFERENCES "mounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MountToProductCharacter" ADD CONSTRAINT "_MountToProductCharacter_B_fkey" FOREIGN KEY ("B") REFERENCES "product_characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
