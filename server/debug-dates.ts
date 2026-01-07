import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugDateFormats() {
    try {
        const farmer = await prisma.farmer.findUnique({
            where: { farmerCode: 'FARM001' },
        });

        if (!farmer) {
            console.error('❌ Farmer not found');
            return;
        }

        // Get December 10, 2025 entries
        const entries = await prisma.milkEntry.findMany({
            where: {
                farmerId: farmer.id,
            },
            orderBy: {
                date: 'asc',
            },
            take: 5,
        });

        console.log('\n📅 First 5 entries - Date formats:');
        console.log('═══════════════════════════════════════');
        entries.forEach(entry => {
            console.log(`ID: ${entry.id}`);
            console.log(`  Raw date: ${entry.date}`);
            console.log(`  ISO String: ${entry.date.toISOString()}`);
            console.log(`  Date String: ${entry.date.toDateString()}`);
            console.log(`  Local String: ${entry.date.toLocaleString()}`);
            console.log(`  Session: ${entry.session}`);
            console.log(`  Quantity: ${entry.quantityLitre}L`);
            console.log('');
        });

        // Specifically check December 10
        const dec10Start = new Date(2025, 11, 10, 0, 0, 0); // Dec 10, 2025 00:00:00
        const dec10End = new Date(2025, 11, 11, 0, 0, 0);   // Dec 11, 2025 00:00:00

        const dec10Entries = await prisma.milkEntry.findMany({
            where: {
                farmerId: farmer.id,
                date: {
                    gte: dec10Start,
                    lt: dec10End,
                },
            },
        });

        console.log('═══════════════════════════════════════');
        console.log(`December 10, 2025 entries: ${dec10Entries.length}`);
        if (dec10Entries.length > 0) {
            dec10Entries.forEach(entry => {
                console.log(`  - ${entry.session}: ${entry.quantityLitre}L (${entry.date.toISOString()})`);
            });
        }
        console.log('');

    } catch (error: any) {
        console.error('❌ Error:', error.message);
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

debugDateFormats();
