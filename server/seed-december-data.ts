import { PrismaClient } from '@prisma/client';
import { calculateMilkPrice } from './src/pricing';

const prisma = new PrismaClient();

// Helper function to generate realistic random values
function getRandomInRange(min: number, max: number, decimals: number = 1): number {
    return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

async function seedDecemberData() {
    try {
        // Get the test farmer
        const farmer = await prisma.farmer.findUnique({
            where: { farmerCode: 'FARM001' },
            include: { user: true },
        });

        if (!farmer) {
            console.error('❌ Test farmer not found. Please run create-test-farmer.ts first');
            return;
        }

        console.log(`📅 Creating milk entries for ${farmer.user.name} (${farmer.farmerCode})...`);
        console.log('');

        let totalCreated = 0;

        // Create entries for December 1-19, 2025
        for (let day = 1; day <= 19; day++) {
            const date = new Date(2025, 11, day); // Month is 0-indexed, so 11 = December

            // Morning Session
            const morningQuantity = getRandomInRange(8, 15, 1); // 8-15 litres
            const morningFat = getRandomInRange(3.5, 5.0, 1); // 3.5-5.0% FAT
            const morningSnf = getRandomInRange(8.0, 9.5, 1); // 8.0-9.5% SNF

            const morningPricing = await calculateMilkPrice(morningFat, morningSnf, morningQuantity);

            const morningEntry = await prisma.milkEntry.create({
                data: {
                    session: 'MORNING',
                    quantityLitre: morningQuantity,
                    fat: morningFat,
                    snf: morningSnf,
                    pricePerLitre: morningPricing.pricePerLitre,
                    totalAmount: morningPricing.totalAmount,
                    farmerId: farmer.id,
                    samitiId: farmer.samitiId,
                    fatSnfValueId: morningPricing.bandId ?? undefined,
                    date: date,
                },
            });

            // Evening Session
            const eveningQuantity = getRandomInRange(10, 18, 1); // 10-18 litres
            const eveningFat = getRandomInRange(3.8, 5.5, 1); // 3.8-5.5% FAT
            const eveningSnf = getRandomInRange(8.2, 9.8, 1); // 8.2-9.8% SNF

            const eveningPricing = await calculateMilkPrice(eveningFat, eveningSnf, eveningQuantity);

            const eveningEntry = await prisma.milkEntry.create({
                data: {
                    session: 'EVENING',
                    quantityLitre: eveningQuantity,
                    fat: eveningFat,
                    snf: eveningSnf,
                    pricePerLitre: eveningPricing.pricePerLitre,
                    totalAmount: eveningPricing.totalAmount,
                    farmerId: farmer.id,
                    samitiId: farmer.samitiId,
                    fatSnfValueId: eveningPricing.bandId ?? undefined,
                    date: date,
                },
            });

            totalCreated += 2;

            const dailyTotal = morningQuantity + eveningQuantity;
            const dailyAmount = morningPricing.totalAmount + eveningPricing.totalAmount;

            console.log(`✅ Dec ${day.toString().padStart(2, '0')}: ${dailyTotal.toFixed(1)}L = ₹${dailyAmount.toFixed(2)}`);
        }

        console.log('');
        console.log('═══════════════════════════════════════════════');
        console.log(`✨ Successfully created ${totalCreated} entries!`);
        console.log('═══════════════════════════════════════════════');
        console.log('');
        console.log('📊 You can now:');
        console.log('1. Login as Farmer (farmer@test.com / password123)');
        console.log('2. View the calendar with populated dates');
        console.log('3. See the milk supply trend chart');
        console.log('4. Check monthly summary with real data');
        console.log('');

    } catch (error: any) {
        console.error('❌ Error:', error.message);
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

seedDecemberData();
