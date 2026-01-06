export interface Telefone {
	telefone: string,
	tipo: string
}

// Tipo completo do cliente (retorno do backend)
export interface Client {
	id: number;
	nome: string;
	idade: number;
	cpf: string;
	email: string;
	endereco: string;
	cidade: string;
	estado: string;
	data_nascimento: string;
	telefones: Telefone[];
	ativo: boolean;
}

// Tipo usado para criar cliente (não precisa de id)
export interface ClientCreate {
	nome: string;
	idade: number;
	cpf: string;
	email: string;
	endereco: string;
	cidade: string;
	estado: string;
	data_nascimento: string;
	telefones: Telefone[];
	ativo?: boolean;
}
