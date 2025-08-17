import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectDB();

          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            isVerified: user.isVerified,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      try {
        if (user) {
          token.role = user?.role;
          token.isVerified = user?.isVerified;
        }
        return token;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    async session({ session, token }: any) {
      try {
        if (token) {
          session.user.id = token.sub as string;
          session.user.role = token.role as string;
          session.user.isVerified = token.isVerified as boolean;
        }
        return session;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key",
});

export { handler as GET, handler as POST };
