-- AlterTable
ALTER TABLE "public"."case_notes" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."cases" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."clients" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."court_types" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."documents" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."hearings" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."law_firms" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."time_entries" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "updated_at" DROP NOT NULL;
