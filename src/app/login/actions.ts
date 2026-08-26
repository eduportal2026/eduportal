'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const data = Object.fromEntries(formData);
    await signIn('credentials', {
      ...data,
      redirectTo: '/dashboard',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'ข้อมูลผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง';
        default:
          return 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง';
      }
    }
    throw error;
  }
}
