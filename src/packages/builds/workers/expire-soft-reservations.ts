// <!-- BEGIN RBP GENERATED: reservations-ttl -->
import { PrismaClient } from "@prisma/client";
const prisma: any = new PrismaClient();

async function main() {
  const now = new Date();
  const res = await prisma.reservation.updateMany({
    where: { status: "SOFT" as any, expiresAt: { lt: now } },
    data: { status: "EXPIRED" as any },
  });
  console.log("reservations:expire", { count: (res as any).count ?? 0 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
// <!-- END RBP GENERATED: reservations-ttl -->
