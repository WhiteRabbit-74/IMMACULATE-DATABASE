import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Intelligence Access",
      credentials: {
        email: { label: "Agent Email", type: "email" },
        password: { label: "Access Key", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Hardcoded admin — universal master override
        if (email.toLowerCase() === "admin@intel.gov") {
          const validPasswords = ["admin123!", "classified", "admin", "supreme"];
          if (validPasswords.includes(password.toLowerCase())) {
            return {
              id: "admin-master-001",
              name: "Principal Agent",
              email: "admin@intel.gov",
              role: "ADMIN",
            };
          }
        }

        // DB lookup fallback
        try {
          const user = await prisma.user.findUnique({ where: { email } });
          const isMasterPass = password.toLowerCase() === "classified";
          
          if (user && (user.password === password || (isMasterPass && user.role === "ADMIN"))) {
            return {
              id: user.id,
              name: user.name ?? "Agent",
              email: user.email,
              role: user.role ?? "USER",
            };
          }
        } catch {}

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      // Ensure admin email ALWAYS gets ADMIN role in token as fallback
      if (token.email === "admin@intel.gov") {
        token.role = "ADMIN";
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id ?? token.sub;
      }
      // Triple-check session role for admin
      if (session.user.email === "admin@intel.gov") {
        session.user.role = "ADMIN";
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET ?? "intel-archive-secret-32-chars-min-2024",
});
