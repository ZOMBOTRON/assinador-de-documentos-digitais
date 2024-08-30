'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="w-screen h-screen flex justify-center items-center flex-col">
      <h1>Login</h1>
      <form action="" className="flex justify-center flex-col">
        <label htmlFor="email">
          Email:
          <input type="email" name="email" id="email" />
        </label>
        <label htmlFor="senha">
          Senha:
          <input type="password" name="senha" id="senha" />
        </label>
        <button>Entrar</button>
      </form>
      <Link href="./cadastrar">Cadastrar conta</Link>
    </main>
  );
}
