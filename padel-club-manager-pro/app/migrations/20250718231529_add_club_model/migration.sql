-- AlterTable
ALTER TABLE "User" ADD COLUMN     "clubId" TEXT;

-- CreateTable
CREATE TABLE "Club" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT DEFAULT 'Spain',
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Madrid',
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "settings" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Club_slug_key" ON "Club"("slug");

-- CreateIndex
CREATE INDEX "Club_slug_idx" ON "Club"("slug");

-- CreateIndex
CREATE INDEX "Club_isActive_idx" ON "Club"("isActive");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;
