import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import ClientPortal from "./ClientPortal";

export default async function Home() {
  const session = await auth();

  const apps = await prisma.appLink.findMany({
    where: { isActive: true },
    orderBy: [
      { orderIndex: 'asc' },
      { name: 'asc' }
    ]
  });

  return <ClientPortal apps={apps} session={session} />;
}
