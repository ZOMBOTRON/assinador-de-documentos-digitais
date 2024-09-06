'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getDocumentos, verificarAssinatura } from '../API';
import { Documento } from '../API.d';

export default function Home() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [verificacao, setVerificacao] = useState<Record<string, string>>({});

  useEffect(() => {
    getDocumentos().then((documentos) => setDocumentos(documentos));
  }, []);

  const handleVerificar = async (documento: Documento) => {
    try {
      const resultado = await verificarAssinatura(documento);
      setVerificacao((prev) => ({
        ...prev,
        [documento.id]: resultado ? 'Documento validado com sucesso.' : 'Falha na validação do documento.'
      }));
    } catch (error) {
      setVerificacao((prev) => ({
        ...prev,
        [documento.id]: 'Erro ao verificar o documento.'
      }));
    }
  };

  return (
    <div style={styles.container}>
      <Link href="./../documento" style={styles.link}>
        Criar Documento
      </Link>
      <h1 style={styles.header}>Lista de documentos assinados</h1>
      <ul style={styles.list}>
        {documentos?.map((documento) => (
          <li key={documento.id} style={styles.listItem}>
            <h2 style={styles.documentTitle}>{documento.nome}</h2>
            <p style={styles.documentText}>{documento.descricao}</p>
            <p style={styles.documentCreator}>Criador: {documento.criador}</p>
            <button
              onClick={() => handleVerificar(documento)}
              style={styles.verifyButton}
            >
              Verificar Assinatura
            </button>
            {verificacao[documento.id] && <p>{verificacao[documento.id]}</p>}
          </li>
        ))}
      </ul>
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
  linkHover: {
    backgroundColor: '#0056b3',
  },
  header: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333',
  },
  list: {
    listStyleType: 'none',
    paddingLeft: '0',
  },
  listItem: {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '6px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  documentTitle: {
    fontSize: '20px',
    marginBottom: '10px',
    color: '#007BFF',
  },
  documentText: {
    fontSize: '16px',
    marginBottom: '5px',
    color: '#555',
  },
  documentSignature: {
    fontSize: '14px',
    color: '#777',
    fontStyle: 'italic',
  },
  documentCreator: {
    fontSize: '14px',
    color: '#333',
    fontStyle: 'italic',
    marginBottom: '10px',
  },
  verifyButton: {
    marginTop: '10px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
  },
};
