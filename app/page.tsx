'use client';
import Link from 'next/link';
import { loginUsuario } from './API';
import { useState } from 'react';

export default function Home() {
  const [error, setError] = useState('');
  const handleSubmit = async (form: FormData) => {
    const email = form.get('email') as string;
    const senha = form.get('senha') as string;

    if (!email || !senha) {
      console.log('Preencha todos os campos!');
      alert('Preencha todos os campos!');
      return '';
    }

    const er = await loginUsuario({ email, senha });
    if (er) {
      setError((error) => er.error);
    }
  };
  return (
    <main className="w-screen h-screen flex justify-center items-center flex-col">
      <h1>Login</h1>
      <form action={handleSubmit} className="flex justify-center flex-col">
        <label htmlFor="email">
          Email:
          <input type="email" name="email" id="email" />
        </label>
        <label htmlFor="senha">
          Senha:
          <input type="password" name="senha" id="senha" />
        </label>
        {error && <p>{error}</p>}
        <button>Entrar</button>
      </form>
      <Link href="./cadastrar">Cadastrar conta</Link>
    </main>
  );
}
