/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `ItemImage` table. All the data in the column will be lost.
  - You are about to drop the column `publicId` on the `ItemImage` table. All the data in the column will be lost.
  - Added the required column `points` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Item` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `url` to the `ItemImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "location" TEXT,
ADD COLUMN     "points" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ItemImage" DROP COLUMN "imageUrl",
DROP COLUMN "publicId",
ADD COLUMN     "isPrimary" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "url" TEXT NOT NULL;
