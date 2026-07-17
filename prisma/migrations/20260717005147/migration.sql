-- CreateTable
CREATE TABLE "product_account_loyalty" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "disabled_at" TIMESTAMP(3),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "points" INTEGER NOT NULL DEFAULT 0,
    "percentage" INTEGER NOT NULL DEFAULT 0,
    "price" INTEGER NOT NULL,
    "promotional_price" INTEGER,
    "price_tibia_coins" INTEGER NOT NULL,
    "promotional_price_tibia_coins" INTEGER,
    "safe_address" BOOLEAN NOT NULL DEFAULT true,
    "has_recovery_key" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,

    CONSTRAINT "product_account_loyalty_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_account_loyalty_code_key" ON "product_account_loyalty"("code");
