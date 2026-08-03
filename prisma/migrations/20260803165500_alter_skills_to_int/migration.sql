/*
  Warnings:
  - Modified manually to cast strings to integers safely without dropping columns.
*/
-- Step 1: Add new extra columns
ALTER TABLE "product_characters" 
  ADD COLUMN "axe_fighting_extra" INTEGER,
  ADD COLUMN "club_fighting_extra" INTEGER,
  ADD COLUMN "distance_fighting_extra" INTEGER,
  ADD COLUMN "fishing_extra" INTEGER,
  ADD COLUMN "fist_fighting_extra" INTEGER,
  ADD COLUMN "magic_level_extra" INTEGER,
  ADD COLUMN "shielding_extra" INTEGER,
  ADD COLUMN "sword_fighting_extra" INTEGER;

-- Step 2: Populate extra columns using split on existing string columns
UPDATE "product_characters"
SET 
  "magic_level_extra" = NULLIF(SPLIT_PART("magic_level", '+', 2), '')::integer,
  "fist_fighting_extra" = NULLIF(SPLIT_PART("fist_fighting", '+', 2), '')::integer,
  "sword_fighting_extra" = NULLIF(SPLIT_PART("sword_fighting", '+', 2), '')::integer,
  "axe_fighting_extra" = NULLIF(SPLIT_PART("axe_fighting", '+', 2), '')::integer,
  "club_fighting_extra" = NULLIF(SPLIT_PART("club_fighting", '+', 2), '')::integer,
  "distance_fighting_extra" = NULLIF(SPLIT_PART("distance_fighting", '+', 2), '')::integer,
  "shielding_extra" = NULLIF(SPLIT_PART("shielding", '+', 2), '')::integer,
  "fishing_extra" = NULLIF(SPLIT_PART("fishing", '+', 2), '')::integer;

-- Step 3: Alter base columns to integer (taking only the base part)
ALTER TABLE "product_characters"
  ALTER COLUMN "magic_level" DROP DEFAULT,
  ALTER COLUMN "magic_level" TYPE INTEGER USING COALESCE(NULLIF(SPLIT_PART("magic_level", '+', 1), ''), '0')::integer,
  ALTER COLUMN "magic_level" SET DEFAULT 0,
  ALTER COLUMN "fist_fighting" TYPE INTEGER USING NULLIF(SPLIT_PART("fist_fighting", '+', 1), '')::integer,
  ALTER COLUMN "sword_fighting" TYPE INTEGER USING NULLIF(SPLIT_PART("sword_fighting", '+', 1), '')::integer,
  ALTER COLUMN "axe_fighting" TYPE INTEGER USING NULLIF(SPLIT_PART("axe_fighting", '+', 1), '')::integer,
  ALTER COLUMN "club_fighting" TYPE INTEGER USING NULLIF(SPLIT_PART("club_fighting", '+', 1), '')::integer,
  ALTER COLUMN "distance_fighting" TYPE INTEGER USING NULLIF(SPLIT_PART("distance_fighting", '+', 1), '')::integer,
  ALTER COLUMN "shielding" TYPE INTEGER USING NULLIF(SPLIT_PART("shielding", '+', 1), '')::integer,
  ALTER COLUMN "fishing" TYPE INTEGER USING NULLIF(SPLIT_PART("fishing", '+', 1), '')::integer;
