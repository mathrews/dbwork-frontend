// Tipo completo do cliente (retorno do backend)
export interface Client {
	id: number;
	nome: string;
	email: string;
	telefone: string;
	data_cadastro: string;
	ativo: boolean;
	cidade: string;
	estado: string;
}

// Tipo usado para criar cliente (não precisa de id nem data_cadastro)
export interface ClientCreate {
	nome: string;
	email: string;
	telefone: string;
	cidade: string;
	estado: string;
	ativo?: boolean; // opcional, default true
}
