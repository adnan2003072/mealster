import User from "@/models/user";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { mongooseConnect } from "@/lib/mongoose";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        // Destructure name, email and password from credentials
        await mongooseConnect();
        const { name, email, password } = credentials;

        try {
          // Find the user by email
          const user = await User.findOne({ email });
          
          if (!user) {
            return null;
          }
          
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            console.log("password is incorrect");
            return null;
          }
          
          return user;
        } catch (error) {
          console.error("Error in authorize function:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: "adnanbouzkraouimealplanningchatbot",
  pages: {
    signIn: "/",
    error: "/auth/error",
  },
  adapter: MongoDBAdapter(clientPromise),
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};