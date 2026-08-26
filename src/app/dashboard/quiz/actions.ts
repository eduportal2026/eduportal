'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function createQuiz(data: {
  title: string;
  type: string;
  questions: {
    text: string;
    options: string[];
    correctAnswer: string;
  }[];
}) {
  const session = await auth();
  
  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }

  // Admin or Teacher only
  const role = (session.user as any).role;
  if (role !== 'ADMIN' && role !== 'TEACHER') {
    throw new Error('Forbidden');
  }

  try {
    const quiz = await prisma.quiz.create({
      data: {
        title: data.title,
        type: data.type,
        // lessonId is optional now, so we don't pass it for standalone quizzes
        questions: {
          create: data.questions.map(q => ({
            text: q.text,
            options: JSON.stringify(q.options),
            correctAnswer: q.correctAnswer
          }))
        }
      }
    });
    return { success: true, quizId: quiz.id };
  } catch (error) {
    console.error('Error creating quiz:', error);
    return { success: false, error: 'Failed to create quiz' };
  }
}

export async function submitQuiz(quizId: string, answers: Record<string, string>) {
  const session = await auth();
  
  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }

  try {
    // 1. Fetch quiz to get correct answers
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true }
    });

    if (!quiz) {
      throw new Error('Quiz not found');
    }

    // 2. Calculate score
    let score = 0;
    const totalScore = quiz.questions.length;
    
    // Check each question
    quiz.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        score++;
      }
    });

    // 3. Save result
    const result = await prisma.quizResult.create({
      data: {
        score,
        totalScore,
        answers: JSON.stringify(answers), // Save raw answers for Item Analysis later
        userId: session.user.id as string,
        quizId: quizId
      }
    });

    // 4. Update LessonProgress if this quiz is attached to a lesson and score >= 60%
    const passingScore = Math.ceil(totalScore * 0.6); // 60% pass rate
    const passed = score >= passingScore;

    if (quiz.lessonId && passed) {
      await prisma.lessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId: session.user.id as string,
            lessonId: quiz.lessonId
          }
        },
        update: {
          isCompleted: true
        },
        create: {
          userId: session.user.id as string,
          lessonId: quiz.lessonId,
          isCompleted: true,
          timeSpent: 0
        }
      });
    }

    return { 
      success: true, 
      score, 
      totalScore, 
      passed, 
      resultId: result.id 
    };

  } catch (error) {
    console.error('Error submitting quiz:', error);
    return { success: false, error: 'Failed to submit quiz' };
  }
}
