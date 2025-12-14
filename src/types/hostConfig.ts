// Contrato mínimo que recibe el MF desde el host: token, usuario y métodos utilitarios.
import type { AuthContext } from "./auth";

export type HostConfig = {
  token: string;
  user?: { id: string; name: string };
  auth?: AuthContext;
  notify?: (message: string, options?: { title?: string; target?: string }) => Promise<void> | void;
};
