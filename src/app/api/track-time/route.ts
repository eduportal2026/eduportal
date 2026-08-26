import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { lessonId, timeSpent } = body;

    if (!lessonId || typeof timeSpent !== 'number') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // ในระบบจริง จะทำการ Upsert (อัปเดตหรือสร้างใหม่) ข้อมูลเวลาเรียน
    // await prisma.lessonProgress.upsert({
    //   where: {
    //     userId_lessonId: {
    //       userId: session.user.id,
    //       lessonId: lessonId,
    //     },
    //   },
    //   update: {
    //     timeSpent: timeSpent, // หรือสะสมเวลาเพิ่มขึ้น
    //   },
    //   create: {
    //     userId: session.user.id,
    //     lessonId: lessonId,
    //     timeSpent: timeSpent,
    //   },
    // });

    return NextResponse.json({ success: true, timeRecorded: timeSpent });
  } catch (error) {
    console.error('Track time error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
