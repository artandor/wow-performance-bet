import NextAuth, { DefaultSession } from "next-auth";
import Discord from "next-auth/providers/discord";
import { DEMO_SESSION } from "./demo/session";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      avatar: string;
      guilds: Array<{
        id: string;
        name: string;
        icon: string | null;
      }>;
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = process.env.DEMO_MODE === 'true'
  ? {
      handlers: {
        GET: async () => new Response(null, { status: 404 }),
        POST: async () => new Response(null, { status: 404 }),
      },
      auth: async () => DEMO_SESSION as any,
      signIn: async () => {},
      signOut: async () => {},
    }
  : NextAuth({
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "identify guilds",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      // Store user info and guilds in JWT on initial sign in
      if (account && profile) {
        token.id = profile.id;
        token.username = (profile as any).username;
        token.avatar = (profile as any).avatar;
        token.accessToken = account.access_token;
        
        // Fetch user's guilds using the access token
        if (account.access_token) {
          try {
            const guildsResponse = await fetch(
              "https://discord.com/api/users/@me/guilds",
              {
                headers: {
                  Authorization: `Bearer ${account.access_token}`,
                },
              }
            );
            
            if (guildsResponse.ok) {
              const guilds = await guildsResponse.json();
              token.guilds = guilds.map((guild: any) => ({
                id: guild.id,
                name: guild.name,
                icon: guild.icon,
              }));
            }
          } catch (error) {
            console.error("Failed to fetch guilds:", error);
            token.guilds = [];
          }
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      // Make user info and guilds available in session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.avatar = token.avatar as string;
        session.user.guilds = token.guilds as Array<{
          id: string;
          name: string;
          icon: string | null;
        }>;
      }
      
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});
