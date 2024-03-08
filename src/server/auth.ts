import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
  type TokenSet,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import Twitch from "next-auth/providers/twitch";

import { type TypePlan } from "@prisma/client";

import { env } from "~/env";
import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      plan: TypePlan
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  callbacks: {
    session: async ({ session, token }) => {

      const [twitch] = await db.account.findMany({
        where: { userId: token.sub, provider: "twitch"},
      })
  
      const planStarter = await db.plan.findFirst({
        where: { type:'STARTER' },
        select: {
          id: true,
          type: true,
        },
      })

      if (planStarter === null) throw new Error('Plan not found')
      
      await db.subscription.upsert({
        where: { userId: token.sub },
        update: {},
        create: {            
          planId: planStarter.id,
          userId: token.sub!,
          type: "monthly",
          status: 'active'
        },
      })

      const subscriptionUser = await db.subscription.findFirst({
        where: { userId: token.sub },
        select: {
          plan: true,
        }
      })
      
      if (twitch){
        if (twitch.expires_at! < Date.now()) {
          const response = await fetch("https://id.twitch.tv/oauth2/token", {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              grant_type: "refresh_token",
              refresh_token: twitch.refresh_token!,
              client_id: env.TWITCH_CLIENT_ID,
              client_secret: env.TWITCH_CLIENT_SECRET, 
            }),
            method: "POST",
          })

          const tokens: TokenSet = await response.json() as TokenSet
          
          if (!response.ok) throw tokens

          if (tokens){
            const expire = tokens.expires_at!
            await db.account.update({
              data: {
                access_token: tokens.access_token,
                expires_in: Math.floor(Date.now() / 1000 + expire),
                expires_at: Math.floor(Date.now() / 1000 + expire),
                refresh_token: tokens.refresh_token ?? twitch.refresh_token,
              },
              where: {
                provider_providerAccountId: {
                  provider: "twitch",
                  providerAccountId: twitch.providerAccountId,
                },
              },
            })
          }
        }
      }

      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          plan: subscriptionUser?.plan.type ?? 'STARTER',
        },
      }
    }
  },
  pages: {  
    signIn: '/',
  },
  session: {
    strategy: "jwt",
  },
  secret: env.NEXTAUTH_SECRET,
  providers: [
    Twitch({
      clientId: env.TWITCH_CLIENT_ID,
      clientSecret: env.TWITCH_CLIENT_SECRET,
      authorization: {
        params : {
          scope:'openid user:read:email channel:manage:broadcast user:read:broadcast channel_read'
        }
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
