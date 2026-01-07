import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestFarmer() {
    try {
        const hashedPassword = await bcrypt.hash('password123', 10);

        // Get the test samiti
        const samiti = await prisma.samiti.findUnique({
            where: { code: 'SAM001' },
        });

        if (!samiti) {
            console.error('❌ Samiti not found. Please run create-test-user.ts first');
            return;
        }

        // Check if farmer already exists
        const existingFarmer = await prisma.farmer.findUnique({
            where: { farmerCode: 'FARM001' },
            include: { user: true },
        });

        if (existingFarmer) {
            console.log('✅ Farmer already exists!');
            console.log('');
            console.log('════════════════════════════════════');
            console.log('  FARMER LOGIN CREDENTIALS');
            console.log('════════════════════════════════════');
            console.log('📧 Email: farmer@test.com');
            console.log('🔑 Password: password123');
            console.log('🌐 Login URL: http://localhost:8081/farmer-login');
            console.log('════════════════════════════════════');
            console.log('');
            return;
        }

        // Create Farmer User
        const farmerUser = await prisma.user.create({
            data: {
                email: 'farmer@test.com',
                name: 'Test Farmer',
                passwordHash: hashedPassword,
                role: 'FARMER',
            },
        });

        // Create Farmer Profile
        const farmer = await prisma.farmer.create({
            data: {
                farmerCode: 'FARM001',
                village: 'Test Village',
                userId: farmerUser.id,
                samitiId: samiti.id,
            },
            include: { user: true },
        });

        console.log('✅ Farmer created successfully!');
        console.log('');
        console.log('════════════════════════════════════');
        console.log('  FARMER LOGIN CREDENTIALS');
        console.log('════════════════════════════════════');
        console.log('📧 Email: farmer@test.com');
        console.log('🔑 Password: password123');
        console.log('🌐 Login URL: http://localhost:8081/farmer-login');
        console.log('════════════════════════════════════');
        console.log('');

    } catch (error: any) {
        console.error('❌ Error:', error.message);
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

createTestFarmer();
