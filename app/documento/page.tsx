export default function CriarDocumento() {
  return (
    <div>
      <h1>Formulario para criar um documento</h1>
      <form action="" method="post" className="flex flex-col">
        <label htmlFor="nome">
          Nome:
          <input type="text" name="nome" id="nome" />
        </label>
        <label htmlFor="descricao" className="flex flex-col">
          Descrição:
          <textarea
            name="descricao"
            id="descricao"
            cols={30}
            rows={10}
          ></textarea>
        </label>
        <button type="submit">Salvar documento</button>
      </form>
    </div>
  );
}
