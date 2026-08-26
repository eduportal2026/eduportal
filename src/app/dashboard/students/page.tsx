import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import StudentClientPage from "./ClientPage";

export default async function StudentsPage() {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (role !== "TEACHER" && role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Fetch all users with STUDENT role
  const students = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    orderBy: [
      { gradeLevel: 'asc' },
      { room: 'asc' },
      { rollNumber: 'asc' }
    ]
  });

  return <StudentClientPage initialStudents={students} />;
}
