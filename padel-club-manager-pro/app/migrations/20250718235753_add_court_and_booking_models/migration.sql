-- CreateTable
CREATE TABLE "Court" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'outdoor',
    "surface" TEXT NOT NULL DEFAULT 'artificial_grass',
    "status" TEXT NOT NULL DEFAULT 'active',
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "pricePerHour" DOUBLE PRECISION NOT NULL DEFAULT 25.0,
    "operatingHours" JSONB,
    "clubId" TEXT NOT NULL,

    CONSTRAINT "Court_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 90,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT,
    "customerEmail" TEXT,
    "notes" TEXT,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "paymentMethod" TEXT,
    "courtId" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "createdById" TEXT,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Court_clubId_idx" ON "Court"("clubId");

-- CreateIndex
CREATE INDEX "Court_clubId_status_idx" ON "Court"("clubId", "status");

-- CreateIndex
CREATE INDEX "Court_clubId_isAvailable_idx" ON "Court"("clubId", "isAvailable");

-- CreateIndex
CREATE INDEX "Booking_clubId_idx" ON "Booking"("clubId");

-- CreateIndex
CREATE INDEX "Booking_clubId_date_idx" ON "Booking"("clubId", "date");

-- CreateIndex
CREATE INDEX "Booking_clubId_courtId_date_idx" ON "Booking"("clubId", "courtId", "date");

-- CreateIndex
CREATE INDEX "Booking_clubId_status_idx" ON "Booking"("clubId", "status");

-- CreateIndex
CREATE INDEX "Booking_date_startTime_idx" ON "Booking"("date", "startTime");

-- AddForeignKey
ALTER TABLE "Court" ADD CONSTRAINT "Court_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_courtId_fkey" FOREIGN KEY ("courtId") REFERENCES "Court"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
