import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import AppsClientPage from "./ClientPage";

export default async function AppsPage() {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (role !== "TEACHER" && role !== "ADMIN") {
    redirect("/dashboard");
  }

  const apps = await prisma.appLink.findMany({
    orderBy: [
      { orderIndex: 'asc' },
      { name: 'asc' }
    ]
  });

  return <AppsClientPage initialApps={apps} />;
}
