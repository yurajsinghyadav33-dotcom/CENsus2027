import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        phone: { label: "Phone Number", type: "text", placeholder: "1234567890" },
        password: { label: "OTP / Password", type: "password" },
      },
      authorize: async (credentials) => {
        // Mock authentication for development
        if (credentials?.phone === "1234567890" && credentials?.password === "password") {
          return { id: "user_123", name: "Ramesh Kumar", phone: "1234567890" }
        }
        return null
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
})
