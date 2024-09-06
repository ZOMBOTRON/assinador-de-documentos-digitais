'use client';
import { cadastrarUsuario } from './../API';

export default function CadastrarUsuario() {
  const handleSubmit = async (form: FormData) => {
    const nome = form.get('nome') as string;
    const email = form.get('email') as string;
    const senha = form.get('senha') as string;

    if (!nome || !email || !senha) {
      console.log('Preencha todos os campos!');
      alert('Preencha todos os campos!');
      return '';
    }

    await cadastrarUsuario({ nome, email, senha });
  };
  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen">
      <h1>Cadastro</h1>
      <form action={handleSubmit} className="flex justify-center flex-col">
        <label htmlFor="nome">
          Nome:
          <input type="text" name="nome" id="nome" />
        </label>
        <label htmlFor="email">
          Email:
          <input type="email" name="email" id="email" />
        </label>
        <label htmlFor="senha">
          Senha:
          <input type="password" name="senha" id="senha" />
        </label>
        <button className="">Criar conta</button>
      </form>
    </div>
  );
}
