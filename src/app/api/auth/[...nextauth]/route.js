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
          provider: 'google',
          createdAt: new Date(),
        });
      }

      return true;
    },

    async session({ session }) {
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };