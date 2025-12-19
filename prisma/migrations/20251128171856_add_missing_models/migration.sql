/*
  Warnings:

  - You are about to drop the column `productId` on the `DistributorOrder` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `DistributorOrder` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "SamitiInvoice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "invoiceNumber" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "totalAmount" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'UNPAID',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" DATETIME,
    "samitiId" INTEGER NOT NULL,
    CONSTRAINT "SamitiInvoice_samitiId_fkey" FOREIGN KEY ("samitiId") REFERENCES "Samiti" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FarmerPayout" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "payoutNumber" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "totalAmount" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'UNPAID',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" DATETIME,
    "farmerId" INTEGER NOT NULL,
    "samitiId" INTEGER NOT NULL,
    CONSTRAINT "FarmerPayout_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Farmer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FarmerPayout_samitiId_fkey" FOREIGN KEY ("samitiId") REFERENCES "Samiti" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quantity" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "totalPrice" REAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "DistributorOrder" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DistributorOrder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "totalAmount" REAL NOT NULL,
    "distributorId" INTEGER NOT NULL,
    CONSTRAINT "DistributorOrder_distributorId_fkey" FOREIGN KEY ("distributorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DistributorOrder" ("createdAt", "distributorId", "id", "status", "totalAmount", "updatedAt") SELECT "createdAt", "distributorId", "id", "status", "totalAmount", "updatedAt" FROM "DistributorOrder";
DROP TABLE "DistributorOrder";
ALTER TABLE "new_DistributorOrder" RENAME TO "DistributorOrder";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "SamitiInvoice_invoiceNumber_key" ON "SamitiInvoice"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "FarmerPayout_payoutNumber_key" ON "FarmerPayout"("payoutNumber");
