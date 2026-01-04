export interface Client {
    id: number;
    nome: string;
    email: string;
    telefones: [string];
    data_cadastro: string;
    ativo: boolean;
    cidade: string;
    estado: string;
}
