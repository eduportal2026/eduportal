import { auth } from "@/auth";
import QuizViewer from "@/components/QuizViewer";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;
  
  // Fetch real quiz from database
  const dbQuiz = await prisma.quiz.findUnique({
    where: { id: id },
    include: { questions: true }
  });

  if (!dbQuiz) {
    notFound();
  }

  const quiz = {
    id: dbQuiz.id,
    title: dbQuiz.title,
    questions: dbQuiz.questions.map(q => ({
      id: q.id,
      text: q.text,
      options: JSON.parse(q.options)
    }))
  };

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <Link href="/dashboard" style={{ color: "var(--primary-light)", fontSize: "0.9rem", marginBottom: "0.5rem", display: "inline-block" }}>← กลับหน้าบทเรียน</Link>
      </div>
      
      <QuizViewer 
        quizId={quiz.id}
        title={quiz.title} 
        questions={quiz.questions} 
      />
    </div>
  );
}
