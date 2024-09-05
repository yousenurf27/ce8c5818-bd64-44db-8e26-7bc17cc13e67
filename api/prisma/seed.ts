import { dataEmployees } from './seeds-data/employees';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seedEmployees = async () => {
  console.log('--- Start seeding employees ---');

  await prisma.employee.deleteMany();
  await prisma.$queryRaw`ALTER TABLE employees AUTO_INCREMENT = 1`;

  await prisma.employee.createMany({
    data: dataEmployees,
    skipDuplicates: true,
  });

  console.log('--- Seeding employees success ---');
};

const main = async () => {
  await seedEmployees();
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit();
  });
