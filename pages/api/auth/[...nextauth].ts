import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_AUTH!,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
});
