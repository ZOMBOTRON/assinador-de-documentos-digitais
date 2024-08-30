'use server';

import prisma from '@/prisma/prisma';
import jwt from 'jsonwebtoken';
import { env } from 'process';
import { Usuario } from './API.d';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const secretKey = env.SECRET_KEY as string;

function gerarToken(usuario: Usuario & { id: string }) {
  const payload = {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
  };
  return jwt.sign(payload, secretKey, { expiresIn: '1d' });
}

export async function cadastrarUsuario({ nome, email, senha }: Usuario) {
  if (!nome || !email || !senha) return;
  try {
    const usuario = await prisma.user.create({
      data: {
        nome,
        email,
        senha,
      },
    });
    if (!usuario) return;
    await prisma.chaves.create({
      data: {
        chavePrivada: '1',
        chavePublica: '1',
        userId: usuario.id,
      },
    });
    const token = gerarToken(usuario);
    cookies().set('token', token, {
      httpOnly: true,
      secure: true,
    });
  } catch (error) {
    console.log('Email já cadastrado!');
    return { error: 'Email já cadastrado!' };
  }
  revalidatePath('/home');
  redirect('/home');
}

export async function loginUsuario({
  email,
  senha,
}: {
  email: string;
  senha: string;
}) {
  if (!email || !senha) return;
  const usuario = await prisma.user.findFirst({
    where: {
      email,
      senha,
    },
  });
  if (!usuario) return { error: 'Email ou senha incorretos!' };
  const token = gerarToken(usuario);
  cookies().set('token', token, {
    httpOnly: true,
    secure: true,
  });
  revalidatePath('/home');
  redirect('/home');
}
