import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { dbConnect, collections } from '@/lib/dbConnect';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    // Google login হলে user DB তে save
    async signIn({ user }) {
      const usersCollection = await dbConnect(collections.USERS);

      const existingUser = await usersCollection.findOne({
        email: user.email,
      });

      if (!existingUser) {
        await usersCollection.insertOne({
          name: user.name,
          email: user.email,
          image: user.image,
          role: 'user', // default role
          provider: 'google',
          createdAt: new Date(),
        });
      }

      return true;
    },

    // JWT token এ role save
    async jwt({ token }) {
      if (token.email) {
        const usersCollection = await dbConnect(collections.USERS);

        const dbUser = await usersCollection.findOne({
          email: token.email,
        });

        token.role = dbUser?.role || 'user';
      }

      return token;
    },

    // Session এ role পাঠানো
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role || 'user';
      }

      return session;
    },
  },

  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };