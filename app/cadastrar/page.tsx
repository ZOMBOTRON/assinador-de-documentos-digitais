export default function CadastrarUsuario() {
  return (
    <div>
      <h1>Cadastro</h1>
      <form action="" className="flex justify-center flex-col">
        <label htmlFor="nome">
          Nome:
          <input type="nome" name="nome" id="nome" />
        </label>
        <label htmlFor="email">
          Email:
          <input type="email" name="email" id="email" />
        </label>
        <label htmlFor="senha">
          Senha:
          <input type="password" name="senha" id="senha" />
        </label>
        <button>Criar conta</button>
      </form>
    </div>
  );
}
