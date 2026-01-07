import { PrismaClient } from '@prisma/client';
import { calculateMilkPrice } from './src/pricing';

const prisma = new PrismaClient();

// Helper function to generate realistic random values
function getRandomInRange(min: number, max: number, decimals: number = 1): number {
    return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

async function seedDecember19() {
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

        const day = 19;
        const date = new Date(2025, 11, day); // December 19, 2025 (month is 0-indexed)

        // Delete existing entries for Dec 19 if any
        await prisma.milkEntry.deleteMany({
            where: {
                farmerId: farmer.id,
                date: {
                    gte: new Date(2025, 11, 19, 0, 0, 0),
                    lt: new Date(2025, 11, 20, 0, 0, 0),
                },
            },
        });

        console.log(`📅 Creating milk entries for Dec 19, 2025...`);

        // Morning Session
        const morningQuantity = getRandomInRange(8, 15, 1);
        const morningFat = getRandomInRange(3.5, 5.0, 1);
        const morningSnf = getRandomInRange(8.0, 9.5, 1);

        const morningPricing = await calculateMilkPrice(morningFat, morningSnf, morningQuantity);

        await prisma.milkEntry.create({
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
        const eveningQuantity = getRandomInRange(10, 18, 1);
        const eveningFat = getRandomInRange(3.8, 5.5, 1);
        const eveningSnf = getRandomInRange(8.2, 9.8, 1);

        const eveningPricing = await calculateMilkPrice(eveningFat, eveningSnf, eveningQuantity);

        await prisma.milkEntry.create({
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

        const dailyTotal = morningQuantity + eveningQuantity;
        const dailyAmount = morningPricing.totalAmount + eveningPricing.totalAmount;

        console.log(`✅ Dec 19: ${dailyTotal.toFixed(1)}L = ₹${dailyAmount.toFixed(2)}`);
        console.log(`   Morning: ${morningQuantity}L, FAT: ${morningFat}%, SNF: ${morningSnf}%`);
        console.log(`   Evening: ${eveningQuantity}L, FAT: ${eveningFat}%, SNF: ${eveningSnf}%`);

    } catch (error: any) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

seedDecember19();
