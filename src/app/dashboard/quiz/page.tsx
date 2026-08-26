import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function QuizBankPage() {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (role !== "TEACHER" && role !== "ADMIN") {
    redirect("/dashboard");
  }

  const quizzes = await prisma.quiz.findMany({
    include: {
      _count: {
        select: { questions: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: "2rem", color: "var(--primary-dark)" }}>คลังแบบทดสอบ (Quiz Bank)</h1>
          <p style={{ color: "var(--foreground)", opacity: 0.7, marginTop: '0.5rem' }}>จัดการแบบทดสอบทั้งหมดในระบบ</p>
        </div>
        <Link href="/dashboard/quiz/create" className="btn-primary" style={{ textDecoration: 'none' }}>
          + สร้างแบบทดสอบใหม่
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'var(--surface)', borderRadius: '1rem', border: '1px dashed var(--border)' }}>
          <p style={{ color: 'var(--foreground)', opacity: 0.7, marginBottom: '1rem' }}>ยังไม่มีแบบทดสอบในคลัง</p>
          <Link href="/dashboard/quiz/create" className="btn-secondary" style={{ display: 'inline-block' }}>เริ่มสร้างข้อสอบชุดแรก</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {quizzes.map(quiz => (
            <div key={quiz.id} style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "0.75rem", padding: "1.5rem", display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '1rem', flex: 1 }}>
                <span style={{ 
                  display: 'inline-block', 
                  padding: '0.25rem 0.5rem', 
                  backgroundColor: quiz.type === 'PRE_TEST' ? 'rgba(252, 165, 165, 0.2)' : quiz.type === 'POST_TEST' ? 'rgba(134, 239, 172, 0.2)' : 'rgba(147, 197, 253, 0.2)',
                  color: quiz.type === 'PRE_TEST' ? '#ef4444' : quiz.type === 'POST_TEST' ? '#22c55e' : '#3b82f6',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  marginBottom: '0.75rem'
                }}>
                  {quiz.type}
                </span>
                <h3 style={{ fontSize: "1.25rem", color: "var(--primary-blue)", marginBottom: "0.5rem" }}>{quiz.title}</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--foreground)", opacity: 0.7 }}>จำนวน {quiz._count.questions} ข้อ</p>
                <p style={{ fontSize: "0.8rem", color: "var(--foreground)", opacity: 0.5 }}>สร้างเมื่อ: {new Date(quiz.createdAt).toLocaleDateString('th-TH')}</p>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: 'auto' }}>
                <Link href={`/dashboard/quiz/${quiz.id}`} className="btn-secondary" style={{ flex: 1, padding: "0.5rem", textAlign: "center", fontSize: '0.9rem' }}>ดูข้อสอบ</Link>
                {/* <button className="btn-secondary" style={{ padding: "0.5rem", textAlign: "center", fontSize: '0.9rem', backgroundColor: 'transparent', color: 'var(--danger)', borderColor: 'var(--danger)' }}>ลบ</button> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
