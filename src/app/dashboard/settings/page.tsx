import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import ClientSettings from './ClientSettings';

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const userId = (session.user as any).id;
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) redirect('/login');

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>ตั้งค่าบัญชีส่วนตัว (Profile Settings)</h1>
      <ClientSettings user={{ name: user.name, username: user.username }} />
    </div>
  );
}
