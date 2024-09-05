export interface Usuario {
  nome: string;
  email: string;
  senha: string;
}

export interface Documento {
  id: string;
  nome: string;
  descricao: string;
  assinatura: string;
  criador?: string;
}
