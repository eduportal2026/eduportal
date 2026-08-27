import { auth } from "@/auth";
import TimeTracker from "@/components/TimeTracker";
import Link from "next/link";

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const role = (session?.user as any)?.role || "STUDENT";
  
  // ในระบบจริงจะมีการ Query จากฐานข้อมูล
  const mockLesson = {
    id: id,
    title: "บทที่ 1: ตรรกศาสตร์เบื้องต้น",
    content: "เนื้อหาเกี่ยวกับการให้เหตุผล ประพจน์ ตัวเชื่อม และการหาค่าความจริง... (เนื้อหาจะถูกจัดเก็บในฐานข้อมูล)",
    timeRequired: 120, // 2 minutes for testing
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <Link href="/dashboard" style={{ color: "var(--primary-light)", fontSize: "0.9rem", marginBottom: "0.5rem", display: "inline-block" }}>← กลับหน้าบทเรียน</Link>
          <h1 style={{ fontSize: "2rem", color: "var(--primary-dark)" }}>{mockLesson.title}</h1>
        </div>
        
        {/* Time Tracker will only render for students or everyone depending on requirement. We show it for everyone here for demo. */}
        <TimeTracker lessonId={mockLesson.id} />
      </div>
      
      <div style={{ backgroundColor: "var(--surface)", padding: "2rem", borderRadius: "1rem", border: "1px solid var(--border)", minHeight: "400px" }}>
        <p style={{ lineHeight: 1.8, color: "var(--foreground)" }}>
          {mockLesson.content}
        </p>

        {/* Math Formula Demo */}
        <div style={{ marginTop: "2rem", padding: "1.5rem", backgroundColor: "var(--surface-hover)", borderRadius: "0.5rem" }}>
          <h3 style={{ marginBottom: "1rem", color: "var(--primary-blue)" }}>ตัวอย่างสูตรคณิตศาสตร์</h3>
          <p>
            สมการตัวอย่าง: <strong>x = (-b ± √(b² - 4ac)) / 2a</strong>
          </p>
          <p style={{ fontSize: "0.8rem", color: "gray", marginTop: "0.5rem" }}>* ระบบจะติดตั้ง KaTeX เพื่อแปลงสูตรให้สวยงามในภายหลัง</p>
        </div>
      </div>
    </div>
  );
}
