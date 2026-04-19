/*
  Warnings:

  - You are about to drop the column `budget` on the `Devis` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Devis` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Devis` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Devis` table. All the data in the column will be lost.
  - You are about to drop the column `projectType` on the `Devis` table. All the data in the column will be lost.
  - The `status` column on the `Devis` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[reference]` on the table `Devis` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clientEmail` to the `Devis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientName` to the `Devis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Devis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference` to the `Devis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Devis" DROP COLUMN "budget",
DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "phone",
DROP COLUMN "projectType",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "amount" TEXT,
ADD COLUMN     "assignedToId" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "clientEmail" TEXT NOT NULL,
ADD COLUMN     "clientName" TEXT NOT NULL,
ADD COLUMN     "clientPhone" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "reference" TEXT NOT NULL,
ADD COLUMN     "services" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "urgency" TEXT NOT NULL DEFAULT 'NORMAL',
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'NEW';

-- DropEnum
DROP TYPE "DevisStatus";

-- CreateIndex
CREATE UNIQUE INDEX "Devis_reference_key" ON "Devis"("reference");
