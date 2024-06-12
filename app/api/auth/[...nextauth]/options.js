import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "../../../../utils/database";
import user from "../../../../models/user";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const options = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),


    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        try {
          await connectToDB();

          const { email, password } = credentials;

          const foundUser = await user.findOne({ email: email });

          if (!foundUser) {
            throw new Error("Invalid email or password");
          }

          if (foundUser.verifiedCredentials === false) {
            throw new Error("User is not verified");
          }

          const isCorrect = await bcrypt.compare(password, foundUser.password);

          if (!isCorrect) {
            throw new Error("Wrong credentials");
          }

          return foundUser;
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async redirect({ url, baseUrl }) {
      const isRelativeUrl = url.startsWith("/");
      if (isRelativeUrl) {
        return `${baseUrl}${url}`;
      }

      const isSameOriginUrl = new URL(url).origin === baseUrl;
      const alreadyRedirected = url.includes("callbackUrl=");
      if (isSameOriginUrl && alreadyRedirected) {
        const originalCallbackUrl = decodeURIComponent(
          url.split("callbackUrl=")[1]
        );
        return originalCallbackUrl;
      }

      if (isSameOriginUrl) {
        return url;
      }

      return baseUrl;
    },

    async session({ session, token }) {
      await connectToDB();
      const sessionUser = await user.findOne({
        email: session.user.email,
      });

      if (sessionUser) {
        if (token.access_token) {
          session.access_token = token.access_token;
        }
        session.user.id = sessionUser._id.toString();
        session.user.username = sessionUser.username;
        session.user.profileImageKey = sessionUser.profileImageKey;
        session.user.weightOption = sessionUser.weightOption
        session.user.distance = sessionUser.distance
        return session;
      }
    },

    async jwt({ token, account, profile }) {
      if (account) {
        token.access_token = account.access_token;
      }
      return token;
    },

    async signIn({ profile, credentials }) {
      try {

        await connectToDB();

        if (!credentials) {
        const userExists = await user.findOne({ email: profile?.email });

        console.log(profile);
        console.log(userExists);

        if (!userExists) {
          let imageUrl = profile?.picture;

          if (
            typeof profile?.picture === "object" &&
            profile?.picture?.data &&
            profile?.picture?.data?.url
          ) {
            imageUrl = profile?.picture?.data?.url;
          }
          await user.create({
            email: profile?.email,
            username: profile?.name?.replace(" ", "").toLowerCase(),
            image: imageUrl || null,
          });
        }

      }

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
};
