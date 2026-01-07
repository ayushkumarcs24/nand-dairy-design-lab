import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupOldDecember() {
    try {
        // Get the test farmer
        const farmer = await prisma.farmer.findUnique({
            where: { farmerCode: 'FARM001' },
        });

        if (!farmer) {
            console.error('❌ Test farmer not found');
            return;
        }

        // Delete all December 2024 entries for this farmer
        const deleted = await prisma.milkEntry.deleteMany({
            where: {
                farmerId: farmer.id,
                date: {
                    gte: new Date('2024-12-01T00:00:00Z'),
                    lt: new Date('2025-01-01T00:00:00Z'),
                },
            },
        });

        console.log(`✅ Deleted ${deleted.count} December 2024 entries`);

        // Also delete November 2024
        const deletedNov = await prisma.milkEntry.deleteMany({
            where: {
                farmerId: farmer.id,
                date: {
                    gte: new Date('2024-11-01T00:00:00Z'),
                    lt: new Date('2024-12-01T00:00:00Z'),
                },
            },
        });

        console.log(`✅ Deleted ${deletedNov.count} November 2024 entries`);

    } catch (error: any) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

cleanupOldDecember();
