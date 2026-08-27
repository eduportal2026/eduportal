import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import ClientPortal from "./ClientPortal";

export default async function Home() {
  const session = await auth();
  const role = (session?.user as any)?.role;

  const apps = await prisma.appLink.findMany({
    where: { isActive: true },
    orderBy: [
      { orderIndex: 'asc' },
      { name: 'asc' }
    ]
  });

  // Filter apps by role on the server (don't leak admin URLs to public)
  const filteredApps = apps.filter(app => {
    if (app.visibility === 'ADMIN_ONLY') return role === 'ADMIN';
    if (app.visibility === 'TEACHER_ONLY') return role === 'ADMIN' || role === 'TEACHER';
    return true; // PUBLIC apps visible to all
  });

  return <ClientPortal apps={filteredApps} session={session} />;
}
