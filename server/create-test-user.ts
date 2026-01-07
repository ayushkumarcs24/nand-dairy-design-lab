import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestSamiti() {
    try {
        const hashedPassword = await bcrypt.hash('password123', 10);

        // Check if owner exists
        let owner = await prisma.ownerAdmin.findFirst({
            include: { user: true },
        });

        if (!owner) {
            // Create owner
            const ownerUser = await prisma.user.create({
                data: {
                    email: 'owner@nanddairy.com',
                    name: 'Nand Dairy Owner',
                    passwordHash: hashedPassword,
                    role: 'OWNER',
                },
            });

            owner = await prisma.ownerAdmin.create({
                data: {
                    userId: ownerUser.id,
                },
                include: { user: true },
            });

            console.log('✅ Owner created:', owner.user.email);
        } else {
            console.log('✅ Owner already exists:', owner.user.email);
        }

        // Check if Samiti already exists
        let samiti = await prisma.samiti.findUnique({
            where: { code: 'SAM001' },
            include: { user: true },
        });

        if (!samiti) {
            // Create Samiti User
            const samitiUser = await prisma.user.create({
                data: {
                    email: 'samiti@test.com',
                    name: 'Test Samiti User',
                    passwordHash: hashedPassword,
                    role: 'SAMITI',
                },
            });

            // Create Samiti
            samiti = await prisma.samiti.create({
                data: {
                    name: 'Test Samiti',
                    code: 'SAM001',
                    location: 'Test Location',
                    userId: samitiUser.id,
                    ownerId: owner.id,
                },
                include: { user: true },
            });

            console.log('✅ Samiti created successfully!');
        } else {
            console.log('✅ Samiti already exists!');
        }

        console.log('');
        console.log('════════════════════════════════════');
        console.log('  LOGIN CREDENTIALS');
        console.log('════════════════════════════════════');
        console.log('📧 Email: samiti@test.com');
        console.log('🔑 Password: password123');
        console.log('🌐 Login URL: http://localhost:8081/samiti-login');
        console.log('════════════════════════════════════');
        console.log('');

    } catch (error: any) {
        console.error('❌ Error:', error.message);
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

createTestSamiti();
