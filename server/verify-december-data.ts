import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyDecemberData() {
    try {
        // Get the test farmer
        const farmer = await prisma.farmer.findUnique({
            where: { farmerCode: 'FARM001' },
            include: { user: true },
        });

        if (!farmer) {
            console.error('❌ Test farmer not found');
            return;
        }

        console.log(`\n📊 Checking milk entries for ${farmer.user.name} (${farmer.farmerCode})`);
        console.log(`   Farmer ID: ${farmer.id}`);
        console.log('');

        // Get all milk entries for this farmer
        const entries = await prisma.milkEntry.findMany({
            where: {
                farmerId: farmer.id,
            },
            orderBy: {
                date: 'asc',
            },
        });

        console.log(`Found ${entries.length} total entries`);
        console.log('');

        // Group by date
        const entriesByDate = new Map<string, any[]>();
        entries.forEach(entry => {
            const dateStr = entry.date.toISOString().split('T')[0];
            if (!entriesByDate.has(dateStr)) {
                entriesByDate.set(dateStr, []);
            }
            entriesByDate.get(dateStr)!.push(entry);
        });

        console.log('Entries by date:');
        console.log('═══════════════════════════════════════');

        entriesByDate.forEach((dateEntries, dateStr) => {
            const totalQty = dateEntries.reduce((sum, e) => sum + e.quantityLitre, 0);
            const totalAmt = dateEntries.reduce((sum, e) => sum + e.totalAmount, 0);
            console.log(`${dateStr}: ${dateEntries.length} sessions, ${totalQty.toFixed(1)}L, ₹${totalAmt.toFixed(2)}`);
            dateEntries.forEach(e => {
                console.log(`  - ${e.session}: ${e.quantityLitre}L, FAT: ${e.fat}%, SNF: ${e.snf}%, ₹${e.totalAmount}`);
            });
        });

        // Check December specifically
        const decemberStart = new Date(2025, 11, 1);
        const decemberEnd = new Date(2025, 11, 20);

        const decemberEntries = await prisma.milkEntry.findMany({
            where: {
                farmerId: farmer.id,
                date: {
                    gte: decemberStart,
                    lt: decemberEnd,
                },
            },
        });

        console.log('');
        console.log('═══════════════════════════════════════');
        console.log(`December 2025 entries: ${decemberEntries.length}`);
        console.log('═══════════════════════════════════════');

    } catch (error: any) {
        console.error('❌ Error:', error.message);
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

verifyDecemberData();
