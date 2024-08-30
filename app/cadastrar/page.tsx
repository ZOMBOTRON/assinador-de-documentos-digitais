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

    const usuario = await cadastrarUsuario({ nome, email, senha });
    if (usuario?.id) {
      console.log('Usuário cadastrado com sucesso!');
      console.log(usuario);
      alert('Usuário cadastrado com sucesso!');
      return '';
    }
    if (usuario?.error) {
      console.log(usuario.error);
      alert(usuario.error);
      return '';
    }
  };
  return (
    <>
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
    </>
  );
}
