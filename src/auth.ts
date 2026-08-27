import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        // Find user in DB - only fetch needed fields
        const user = await prisma.user.findUnique({
          where: { username: credentials.username as string },
          select: { id: true, name: true, role: true, password: true, status: true }
        });

        if (!user) return null;

        // Block inactive accounts
        if (user.status !== 'ACTIVE') return null;
        
        // Compare hashed passwords only (no plaintext fallback)
        let isPasswordMatch = false;
        try {
          isPasswordMatch = await bcrypt.compare(credentials.password as string, user.password);
        } catch (e) {
          // bcrypt error - password format invalid
          return null;
        }

        if (isPasswordMatch) {
          return {
            id: user.id,
            name: user.name,
            role: user.role,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login', // Custom login page
  },
});
