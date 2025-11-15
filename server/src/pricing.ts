import { prisma } from "./db";

export async function getPriceBand(fat: number, snf: number) {
  const band = await prisma.fatSnfValue.findFirst({
    where: {
      minFat: { lte: fat },
      maxFat: { gte: fat },
      minSnf: { lte: snf },
      maxSnf: { gte: snf },
    },
  });

  return band;
}

export async function calculateMilkPrice(fat: number, snf: number, quantityLitre: number) {
  const band = await getPriceBand(fat, snf);

  const pricePerLitre = band?.pricePerLitre ?? 35; // fallback base price
  const totalAmount = pricePerLitre * quantityLitre;

  return { pricePerLitre, totalAmount, bandId: band?.id ?? null };
}
