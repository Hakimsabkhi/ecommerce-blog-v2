import { NextAuthOptions, Session, User, DefaultSession } from 'next-auth'; 
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import connectToDatabase from '@/lib/db';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import UserModel from '@/models/User';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role?: string | null; // This can remain as string | null
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: string | null; // Ensure role can be null
  }
}

type UserType = {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password?: string;
  role?: string | null; // Ensure role can be null
  save: () => Promise<UserType>;
};

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const googleClientId: string = getEnvVar('GOOGLE_CLIENT_ID');
const googleClientSecret: string = getEnvVar('GOOGLE_CLIENT_SECRET');
const nextAuthSecret: string = getEnvVar('NEXTAUTH_SECRET');

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      authorization: {
        params: {
          scope: 'openid email profile',
        },
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials || !credentials.email || !credentials.password) {
          console.error('Missing credentials');
          return null;
        }

        try {
          await connectToDatabase();

          const user = await UserModel.findOne({ email: credentials.email }).exec() as UserType | null;
          if (!user) {
            console.error('No user found with this email:', credentials.email);
            return null;
          }

          const isPasswordValid = bcrypt.compareSync(credentials.password, user.password || '');
          if (!isPasswordValid) {
            console.error('Invalid password for user:', credentials.email);
            return null;
          }

          return { id: user._id.toString(), name: user.username, email: user.email, role: user.role || null }; // Ensure role is nullable
        } catch (error) {
          console.error('Error during authorization:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT, user?: User }) {
      if (user) {
        token.id = user.id;
        token.role = user.role; // Ensure role is nullable
      } else {
        if (token?.id && typeof token.id === 'string') {
          await connectToDatabase();
          try {
            const objectId = new mongoose.Types.ObjectId(token.id);
            const dbUser = await UserModel.findById(objectId).lean().exec();
            if (dbUser) {
              token.role = dbUser.role || null; // Ensure role is nullable
            } else {
              console.error('User not found for ID:', token.id);
            }
          } catch (error) {
            console.error('Error fetching user with ID:', error);
          }
        }
      }
      return token;
    },
    
    async session({ session, token }: { session: Session, token: JWT }) {
      console.log('Session Callback - Token Role:', token.role);
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string; // Ensure role is nullable
      }
      return session;
    },
    
    async signIn({ user }: { user: User }) {
      try {
        await connectToDatabase();
    
        let existingUser = await UserModel.findOne({ email: user.email }).exec() as UserType | null;
    
        if (!existingUser) {
          const newUser = new UserModel({
            _id: new mongoose.Types.ObjectId(),
            username: user.name!,
            email: user.email as string,
            role: user.role, // Set role to 'Visiteur' for first-time users
          });
    
          const savedUser = await newUser.save();
          user.id = savedUser._id.toString();
          user.role = savedUser.role || null; // Ensure role is nullable
        } else {
          user.id = existingUser._id.toString();
          user.role = existingUser.role || null; // Ensure role is nullable
        }
    
        return true;
      } catch (error) {
        console.error('Error during sign-in:', error);
        return false;
      }
    },
    
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  secret: nextAuthSecret,
  debug: false,
};