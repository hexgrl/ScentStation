/*
  Warnings:

  - Changed the type of `status` on the `CollectionEntry` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CollectionStatus" AS ENUM ('owned', 'wishlisted');

-- AlterTable
ALTER TABLE "CollectionEntry" DROP COLUMN "status",
ADD COLUMN     "status" "CollectionStatus" NOT NULL;
