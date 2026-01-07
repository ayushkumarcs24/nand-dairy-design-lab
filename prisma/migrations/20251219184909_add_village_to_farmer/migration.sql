-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Farmer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "farmerCode" TEXT NOT NULL,
    "village" TEXT NOT NULL DEFAULT '',
    "userId" INTEGER NOT NULL,
    "samitiId" INTEGER NOT NULL,
    CONSTRAINT "Farmer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Farmer_samitiId_fkey" FOREIGN KEY ("samitiId") REFERENCES "Samiti" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Farmer" ("farmerCode", "id", "samitiId", "userId") SELECT "farmerCode", "id", "samitiId", "userId" FROM "Farmer";
DROP TABLE "Farmer";
ALTER TABLE "new_Farmer" RENAME TO "Farmer";
CREATE UNIQUE INDEX "Farmer_farmerCode_key" ON "Farmer"("farmerCode");
CREATE UNIQUE INDEX "Farmer_userId_key" ON "Farmer"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
