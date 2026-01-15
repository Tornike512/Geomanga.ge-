import "next-auth";

declare module "next-auth" {
  interface Session {
    googleIdToken?: string;
    googleAccessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id_token?: string;
    access_token?: string;
    provider?: string;
  }
}
