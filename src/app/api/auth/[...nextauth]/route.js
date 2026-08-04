import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnect, collections } from "@/lib/dbConnect";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const usersCollection = await dbConnect(collections.USERS);
        const user = await usersCollection.findOne({
          email: credentials.email,
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role || "user",
          image: user.image,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const usersCollection = await dbConnect(collections.USERS);

        const existingUser = await usersCollection.findOne({
          email: user.email,
        });

        if (!existingUser) {
          await usersCollection.insertOne({
            name: user.name,
            email: user.email,
            image: user.image,
            role: "user",
            provider: "google",
            createdAt: new Date(),
          });
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || "user";
        token.id = user.id;
        token.name = user.name || token.name;
        token.image = user.image || token.image;
      }

      if (token.email) {
        const usersCollection = await dbConnect(collections.USERS);
        const dbUser = await usersCollection.findOne({
          email: token.email,
        });

        if (dbUser) {
          token.role = dbUser.role || token.role || "user";
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
        session.user.role = token.role || "user";
        session.user.name = token.name;
        session.user.image = token.image;
      }

      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
