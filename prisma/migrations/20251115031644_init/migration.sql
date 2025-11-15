-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "OwnerAdmin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "OwnerAdmin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Samiti" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,
    CONSTRAINT "Samiti_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Samiti_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "OwnerAdmin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Farmer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "farmerCode" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "samitiId" INTEGER NOT NULL,
    CONSTRAINT "Farmer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Farmer_samitiId_fkey" FOREIGN KEY ("samitiId") REFERENCES "Samiti" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FatSnfValue" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "minFat" REAL NOT NULL,
    "maxFat" REAL NOT NULL,
    "minSnf" REAL NOT NULL,
    "maxSnf" REAL NOT NULL,
    "pricePerLitre" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "MilkEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "session" TEXT NOT NULL,
    "quantityLitre" REAL NOT NULL,
    "fat" REAL NOT NULL,
    "snf" REAL NOT NULL,
    "pricePerLitre" REAL NOT NULL,
    "totalAmount" REAL NOT NULL,
    "farmerId" INTEGER NOT NULL,
    "samitiId" INTEGER NOT NULL,
    "fatSnfValueId" INTEGER,
    CONSTRAINT "MilkEntry_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Farmer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MilkEntry_samitiId_fkey" FOREIGN KEY ("samitiId") REFERENCES "Samiti" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MilkEntry_fatSnfValueId_fkey" FOREIGN KEY ("fatSnfValueId") REFERENCES "FatSnfValue" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SamitiMonthlyTotal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "totalMilkLitre" REAL NOT NULL DEFAULT 0,
    "avgFat" REAL NOT NULL DEFAULT 0,
    "avgSnf" REAL NOT NULL DEFAULT 0,
    "totalPayout" REAL NOT NULL DEFAULT 0,
    "samitiId" INTEGER NOT NULL,
    CONSTRAINT "SamitiMonthlyTotal_samitiId_fkey" FOREIGN KEY ("samitiId") REFERENCES "Samiti" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'L',
    "inventory" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "ownerId" INTEGER NOT NULL,
    CONSTRAINT "Product_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "OwnerAdmin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DistributorOrder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "quantity" INTEGER NOT NULL,
    "totalAmount" REAL NOT NULL,
    "distributorId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    CONSTRAINT "DistributorOrder_distributorId_fkey" FOREIGN KEY ("distributorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DistributorOrder_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DistributorPayment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'UNPAID',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" DATETIME,
    "orderId" INTEGER NOT NULL,
    CONSTRAINT "DistributorPayment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "DistributorOrder" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LogisticsVehicle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "vehicleCode" TEXT NOT NULL,
    "plateNumber" TEXT NOT NULL,
    "capacityLitre" INTEGER NOT NULL,
    "driverName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "LogisticsRoute" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "distanceKm" REAL NOT NULL,
    "estimatedMinutes" INTEGER NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    CONSTRAINT "LogisticsRoute_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "LogisticsVehicle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LogisticsDispatch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "scheduledDate" DATETIME NOT NULL,
    "departedAt" DATETIME,
    "deliveredAt" DATETIME,
    "vehicleId" INTEGER NOT NULL,
    "routeId" INTEGER NOT NULL,
    "orderId" INTEGER NOT NULL,
    CONSTRAINT "LogisticsDispatch_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "LogisticsVehicle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LogisticsDispatch_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "LogisticsRoute" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LogisticsDispatch_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "DistributorOrder" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" DATETIME,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "OwnerAdmin_userId_key" ON "OwnerAdmin"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Samiti_code_key" ON "Samiti"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Samiti_userId_key" ON "Samiti"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Farmer_farmerCode_key" ON "Farmer"("farmerCode");

-- CreateIndex
CREATE UNIQUE INDEX "Farmer_userId_key" ON "Farmer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SamitiMonthlyTotal_samitiId_month_year_key" ON "SamitiMonthlyTotal"("samitiId", "month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "LogisticsVehicle_vehicleCode_key" ON "LogisticsVehicle"("vehicleCode");
