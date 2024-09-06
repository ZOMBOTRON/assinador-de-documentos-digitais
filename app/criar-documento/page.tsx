'use client';
import { useState } from 'react';
import { salvarESignarDocumento } from '../API';
import { useRouter } from 'next/navigation';

export default function CriarDocumento() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!nome || !descricao) {
      setError('Preencha todos os campos!');
      return;
    }

    try {
      await salvarESignarDocumento(nome, descricao);
      router.push('/home');
    } catch (err) {
      setError('Erro ao salvar o documento!');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen">
      <h1>Formulario para criar um documento</h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <label htmlFor="nome">
          Nome:
          <input
            type="text"
            name="nome"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </label>
        <label htmlFor="descricao">
          Descrição:
          <textarea
            name="descricao"
            id="descricao"
            cols={30}
            rows={10}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          ></textarea>
        </label>
        {error && <p>{error}</p>}
        <button type="submit">Salvar e Assinar Documento</button>
      </form>
    </div>
  );
}
