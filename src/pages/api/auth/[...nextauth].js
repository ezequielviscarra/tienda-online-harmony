import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import { conexionDb } from '../../../lib/mongodb';
import User from "../../../models/User";
import bcrypt from 'bcryptjs'
import { signIn } from "next-auth/react";
export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password", placeholder: "*****" }
      },
      async authorize(credentials, req) {
        
       
        await conexionDb()
        // Aquí deberías realizar la lógica para validar el usuario con las credenciales proporcionadas


        const userFound = await User.findOne({ email: credentials.email });
        if (!userFound) throw new Error("Credencial Invalida ")
        const passwordMatch = await bcrypt.compare(credentials.password, userFound.password)
        if (!passwordMatch) throw new Error("Credencial Invalida ")
        if (userFound.estado === false) throw new Error("Credencial Invalida ")

        return userFound
      }
    })
  ], callbacks: {
    jwt({ account, user, token, profile, session }) {

      if (user) token.user = user

      return token
    },
    session({ session, token }) {
     
      session.user = {
        name: token.user.nombre || undefined,
        apellido: token.user.apellido || undefined,
        cuil: token.user.cuil || undefined,
        email: token.user.email || undefined,
        celular: token.user.celular || undefined,
        id: token.user._id || undefined
      };
      return session
    }
  }, pages: {
    signIn: '/login'
  }

});
