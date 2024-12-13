import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: 'Visiteur' | 'Consulter' | 'Admin'| 'SuperAdmin';
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: 'Visiteur' | 'Consulter' | 'Admin'| 'SuperAdmin';
  }

  interface JWT {
    role?: 'Visiteur' | 'Consulter' | 'Admin'| 'SuperAdmin';
  }
}
