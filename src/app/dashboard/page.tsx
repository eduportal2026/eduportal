import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();
  const role = (session?.user as any)?.role || "STUDENT";

  return (
    <div>
      <h1 style={{ fontSize: "2rem", color: "var(--primary-dark)", marginBottom: "1rem" }}>
        ยินดีต้อนรับ, {session?.user?.name}
      </h1>
      <p style={{ marginBottom: "2rem", color: "var(--foreground)", opacity: 0.8 }}>
        นี่คือแผงควบคุม (Dashboard) สำหรับ {role === 'STUDENT' ? 'นักเรียนเพื่อเข้าถึงบทเรียน' : 'ครูเพื่อจัดการการเรียนการสอน'}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {/* Placeholder for Courses */}
        <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "0.75rem", padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1.25rem", color: "var(--primary-blue)", marginBottom: "0.5rem" }}>วิชาคณิตศาสตร์พื้นฐาน ม.4</h3>
          <p style={{ fontSize: "0.9rem", color: "var(--foreground)", opacity: 0.7, marginBottom: "1rem" }}>บทเรียน: 5 บท • แบบทดสอบ: 2 ชุด</p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <a href="/dashboard/courses" className="btn-primary" style={{ flex: 1, padding: "0.5rem 1rem", textAlign: "center" }}>เข้าสู่บทเรียน</a>
            <a href="/dashboard/quiz" className="btn-secondary" style={{ flex: 1, padding: "0.5rem 1rem", textAlign: "center", backgroundColor: "var(--surface-hover)", border: "1px solid var(--border)", borderRadius: "0.5rem" }}>คลังแบบทดสอบ</a>
          </div>
        </div>
      </div>
    </div>
  );
}
