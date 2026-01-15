import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Pass Google tokens to JWT callback
      if (account?.provider === "google") {
        token.id_token = account.id_token;
        token.access_token = account.access_token;
        token.provider = "google";
      }
      return token;
    },
    async session({ session, token }) {
      // Make tokens available in session
      if (token.provider === "google") {
        session.googleIdToken = token.id_token as string;
        session.googleAccessToken = token.access_token as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
});
