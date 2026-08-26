import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const role = (session.user as any)?.role || "STUDENT";

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--background)" }}>
      {/* Sidebar */}
      <aside style={{ width: "250px", backgroundColor: "var(--surface)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", boxShadow: "4px 0 20px rgba(0,0,0,0.02)" }}>
        <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--border)", background: "linear-gradient(to bottom, #F8FAFC, #FFFFFF)" }}>
          <h1 className="text-gradient" style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>EduLMS</h1>
          <div style={{ fontSize: "0.85rem", color: "var(--foreground)", opacity: 0.7, marginTop: "0.25rem", fontWeight: 500 }}>
            {session?.user?.name} ({role})
          </div>
        </div>
        <nav style={{ flex: 1, padding: "1.5rem 1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <Link href="/dashboard" className="nav-link">หน้าหลัก</Link>
          
          {role === "TEACHER" || role === "ADMIN" ? (
            <>
              <Link href="/dashboard/apps" className="nav-link">จัดการแอประบบ</Link>
              <Link href="/dashboard/students" className="nav-link">จัดการนักเรียน</Link>
              <Link href="/dashboard/courses" className="nav-link">จัดการบทเรียน</Link>
              <Link href="/dashboard/quiz" className="nav-link">คลังแบบทดสอบ</Link>
              <Link href="/dashboard/attendance" className="nav-link">จัดการใบงานและเช็คชื่อ</Link>
              <Link href="/dashboard/analysis" className="nav-link">วิเคราะห์ข้อสอบ (Item Analysis)</Link>
            </>
          ) : (
            <>
              <Link href="/dashboard/courses" className="nav-link">บทเรียนของฉัน</Link>
              <Link href="/dashboard/quiz" className="nav-link">แบบทดสอบ</Link>
              <Link href="/dashboard/attendance" className="nav-link">ผลการเรียน/เวลาเรียน</Link>
            </>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <header style={{ padding: "1.5rem", backgroundColor: "var(--surface)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "flex-end" }}>
          <a href="/api/auth/signout" style={{ color: "var(--danger)", fontWeight: 500 }}>ออกจากระบบ</a>
        </header>
        <div style={{ padding: "2rem", flex: 1 }}>
          {children}
        </div>
      </main>
    </div>
  );
}
