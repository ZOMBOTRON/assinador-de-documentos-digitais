'use client';
import { useEffect, useState } from 'react';
import { getDocumento } from '../API';
import { Documento } from '../API.d';
import Link from 'next/link';

export default function DetalhesDocumento({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const [documento, setDocumento] = useState<Documento | null>(null);

  useEffect(() => {
    if (id) {
      getDocumento(id as string).then(setDocumento);
    }
  }, [id]);

  if (!documento) return <p>Carregando...</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>{documento.nome}</h1>
      <p style={styles.documentText}>{documento.descricao}</p>
      <p style={styles.documentCreator}>Criador: {documento.criador}</p>
      <Link href="/home" style={styles.link}>
        Voltar
      </Link>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    marginTop: '50px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  header: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333',
  },
  documentText: {
    fontSize: '16px',
    marginBottom: '5px',
    color: '#555',
  },
  link: {
    display: 'inline-block',
    marginBottom: '20px',
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
  },
  documentCreator: {
    fontSize: '14px',
    color: '#333',
    fontStyle: 'italic',
    marginBottom: '10px',
  },
};
