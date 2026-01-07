import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanTodayEntries() {
    try {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        console.log(`🧹 Cleaning milk entries for ${startOfDay.toDateString()}...`);

        const result = await prisma.milkEntry.deleteMany({
            where: {
                date: {
                    gte: startOfDay,
                    lt: endOfDay,
                },
            },
        });

        console.log(`✅ Deleted ${result.count} milk entry(ies) from today`);

        if (result.count === 0) {
            console.log('ℹ️  No entries found for today');
        }

    } catch (error: any) {
        console.error('❌ Error:', error.message);
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

cleanTodayEntries();
