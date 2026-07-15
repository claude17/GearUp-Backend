-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CARD');

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "method" "PaymentMethod" NOT NULL DEFAULT 'CARD',
ALTER COLUMN "provider" SET DEFAULT 'STRIPE';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'CUSTOMER';
