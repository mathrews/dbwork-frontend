export interface Telefone {
	telefone: string,
	tipo: string
}

/* NOTA:
 * idade é um pseudo-valor. é calculado automaticamente no back quando um
 * usuário é retornado, e é calculado automaticamente no front por questão de
 * praticidade (não pode deixar o campo vazio, mas não podemos pegar o valor
 * calculado do back porque demora pra carregar a página
 */
// Tipo completo do cliente (retorno do backend)
export interface Client {
	id: number;
	nome: string;
	idade?: number;
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
	idade?: number;
	cpf: string;
	email: string;
	endereco: string;
	cidade: string;
	estado: string;
	data_nascimento: string;
	telefones: Telefone[];
	ativo?: boolean;
}
