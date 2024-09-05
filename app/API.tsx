'use server';

import prisma from '@/prisma/prisma';
import jwt from 'jsonwebtoken';
import { env } from 'process';
import { Usuario } from './API.d';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const secretKey = env.SECRET_KEY as string;

const crypto = require('node:crypto');

// Geração de chaves RSA
function gerarChavesRSA() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });
  return { publicKey, privateKey };
}

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
    const { publicKey, privateKey } = gerarChavesRSA();
    await prisma.user.update({
      data: {
        chavePrivada: privateKey,
        chavePublica: publicKey,
      },
      where: {
        id: usuario.id,
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

export async function getDocumentos() {
  const documentos = await prisma.documentos.findMany();

  const documentosComCriador = await Promise.all(
    documentos.map(async (documento) => {
      const criador = await prisma.user.findFirst({
        where: {
          id: documento.userId, // Corrigi a referência do userId para usar o documento atual.
        },
      });

      return {
        id: documento.id,
        nome: documento.nome,
        descricao: documento.descricao,
        assinatura: documento.assinatura,
        criador: criador?.nome,
      };
    }),
  );

  return documentosComCriador;
}
