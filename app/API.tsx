'use server';

import prisma from '@/prisma/prisma';
import jwt from 'jsonwebtoken';
import { env } from 'process';
import { Usuario, Documento } from './API.d';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { obterIdUsuario } from './utils/auth';

const secretKey = env.SECRET_KEY as string;

import crypto from 'crypto';

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

    const chavePublica = await prisma.user.findFirst({
      where: {
        id: usuario.id,
      },
      select: {
        chavePublica: true,
      },
    });

    const chavePrivada = await prisma.user.findFirst({
      where: {
        id: usuario.id,
      },
      select: {
        chavePrivada: true,
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

export async function getDocumento(id: string) {
  const documento = await prisma.documentos.findFirst({
    where: {
      id,
    },
  });

  if (!documento) {
    throw new Error('Documento não encontrado.');
  }

  const criador = await prisma.user.findFirst({
    where: {
      id: documento.userId,
    },
  });

  return {
    id: documento.id,
    nome: documento.nome,
    descricao: documento.descricao,
    assinatura: documento.assinatura,
    criador: criador?.nome,
    userId: documento.userId,
  };
}

export async function getDocumentos(): Promise<Documento[]> {
  const documentos = await prisma.documentos.findMany();

  const documentosComCriador = await Promise.all(
    documentos.map(async (documento) => {
      const criador = await prisma.user.findFirst({
        where: {
          id: documento.userId,
        },
      });

      return {
        id: documento.id,
        nome: documento.nome,
        descricao: documento.descricao,
        assinatura: documento.assinatura,
        criador: criador?.nome,
        userId: documento.userId,
      };
    }),
  );

  return documentosComCriador;
}

// Função para gerar assinatura digital
async function gerarAssinatura(
  titulo: string,
  texto: string,
  chavePrivada: string,
) {
  const dados = `${titulo}\n${texto}`;

  const sign = crypto.createSign('SHA256');
  sign.update(dados);
  sign.end();

  return sign.sign(chavePrivada, 'base64');
}

export async function salvarESignarDocumento(nome: string, descricao: string) {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    throw new Error('Usuário não autenticado.');
  }

  const usuarioId = obterIdUsuario(token);

  if (!usuarioId) {
    throw new Error('ID do usuário não encontrado.');
  }

  const usuario = await prisma.user.findUnique({ where: { id: usuarioId } });

  if (!usuario || !usuario.chavePrivada) {
    throw new Error('Usuário não encontrado ou chave privada ausente.');
  }

  const assinatura = await gerarAssinatura(
    nome,
    descricao,
    usuario.chavePrivada,
  );

  const documento = await prisma.documentos.create({
    data: {
      nome,
      descricao,
      assinatura,
      userId: usuarioId,
    },
  });

  return documento;
}

// Função para verificar a assinatura de um documento
export async function verificarAssinatura(documento: Documento) {
  const usuario = await prisma.user.findUnique({
    where: { id: documento.userId },
  });

  if (!usuario?.chavePublica) {
    throw new Error('Usuário não encontrado ou chave pública ausente.');
  }

  const assinatura = Buffer.from(documento.assinatura, 'base64') as any;

  const dados = `${documento.nome}\n${documento.descricao}`;
  const verify = crypto.createVerify('SHA256');
  verify.update(dados);
  verify.end();

  const isValid = verify.verify(usuario.chavePublica, assinatura, 'base64');

  return isValid;
}
