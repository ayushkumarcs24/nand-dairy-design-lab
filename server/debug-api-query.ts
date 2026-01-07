import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugAPI() {
    try {
        // Get the test farmer
        const farmer = await prisma.farmer.findUnique({
            where: { farmerCode: 'FARM001' },
        });

        if (!farmer) {
            console.error('❌ Test farmer not found');
            return;
        }

        console.log(`\n🔍 Fetching December 2025 entries for Farmer ID: ${farmer.id}\n`);

        // This simulates what the API endpoint does
        const startOfMonth = new Date(2025, 11, 1, 0, 0, 0); // Dec 1, 2025, 00:00:00 local time
        const endOfMonth = new Date(2026, 0, 1, 0, 0, 0); // Jan 1, 2026, 00:00:00 local time

        console.log(`Start of month: ${startOfMonth.toISOString()}`);
        console.log(`End of month: ${endOfMonth.toISOString()}\n`);

        const entries = await prisma.milkEntry.findMany({
            where: {
                farmerId: farmer.id,
                date: {
                    gte: startOfMonth,
                    lt: endOfMonth,
                },
            },
            orderBy: {
                date: 'asc',
            },
        });

        console.log(`Found ${entries.length} entries\n`);

        if (entries.length > 0) {
            console.log('First 5 entries:');
            entries.slice(0, 5).forEach(entry => {
                console.log(`  ${entry.date.toISOString()} - ${entry.session}: ${entry.quantityLitre}L`);
            });
        }

    } catch (error: any) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

debugAPI();
