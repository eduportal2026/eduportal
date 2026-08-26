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
        
        console.log('--- LOGIN ATTEMPT ---');
        console.log('Username:', credentials.username);
        console.log('Password length:', (credentials.password as string)?.length);

        // Find user in DB
        const user = await prisma.user.findUnique({
          where: { username: credentials.username as string },
        });

        console.log('User found in DB:', user ? 'YES' : 'NO');
        
        let isPasswordMatch = false;
        if (user) {
          try {
            isPasswordMatch = await bcrypt.compare(credentials.password as string, user.password);
          } catch (e) {
            console.error('Bcrypt error:', e);
          }
          
          // Fallback for non-hashed old passwords during transition
          if (!isPasswordMatch && user.password === credentials.password) {
            isPasswordMatch = true;
          }
        }

        if (user && isPasswordMatch) {
          return {
            id: user.id,
            name: user.name,
            role: user.role, // Custom field
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
