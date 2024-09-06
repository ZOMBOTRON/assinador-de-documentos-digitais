import jwt from 'jsonwebtoken';
import { env } from 'process';

const secretKey = env.SECRET_KEY as string;

export function obterIdUsuario(token: string): string | null {
  try {
    const decoded = jwt.verify(token, secretKey) as { id: string };
    return decoded.id;
  } catch (error) {
    return null;
  }
}