import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDecemberEntries() {
    try {
        const startOfDecember = new Date(2025, 11, 1); // December 1, 2025
        const endOfDecember = new Date(2025, 11, 20); // December 20, 2025

        console.log(`🧹 Cleaning milk entries from Dec 1-19, 2025...`);

        const result = await prisma.milkEntry.deleteMany({
            where: {
                date: {
                    gte: startOfDecember,
                    lt: endOfDecember,
                },
            },
        });

        console.log(`✅ Deleted ${result.count} milk entry(ies) from December`);

        if (result.count === 0) {
            console.log('ℹ️  No entries found for December 1-19, 2025');
        }

    } catch (error: any) {
        console.error('❌ Error:', error.message);
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

cleanDecemberEntries();
