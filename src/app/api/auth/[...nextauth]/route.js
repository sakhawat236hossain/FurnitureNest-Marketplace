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
          role: 'user', // default role
          provider: 'google',
          createdAt: new Date(),
        });
      }

      return true;
    },

    async jwt({ token }) {
      if (token.email) {
        const usersCollection = await dbConnect(collections.USERS);
        const dbUser = await usersCollection.findOne({
          email: token.email,
        });

        if (dbUser) {
          token.role = dbUser.role || 'user';
          token.id = dbUser._id.toString();
          token.name = dbUser.name || token.name;
          token.image = dbUser.image || token.image;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role || 'user';
        session.user.name = token.name;
        session.user.image = token.image;
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