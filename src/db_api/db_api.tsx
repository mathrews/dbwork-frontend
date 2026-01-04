import type { Client, ClientCreate } from '../types/Client';

const host = import.meta.env.VITE_DB_API_HOST;
const port = import.meta.env.VITE_DB_API_PORT || '3000';

const API_URL = `http://${host}:${port}/api`;

console.log('API_URL:', API_URL);

// Buscar clientes, com filtro de ativos
export async function getClients(filter: boolean): Promise<Client[]> {
	const res = await fetch(
		filter ? `${API_URL}/clientes?ativos=1` : `${API_URL}/clientes`
	);

	if (!res.ok) {
		throw new Error('Erro ao buscar os clientes');
	}

	const data = await res.json();
	return data.data;
}

// Deletar cliente
export async function deleteClient(id: number): Promise<void> {
	const res = await fetch(`${API_URL}/clientes/${id}`, { method: 'DELETE' });

	if (!res.ok) {
		throw new Error('Erro ao excluir cliente');
	}
}

// Criar cliente (novo tipo ClientCreate)
export async function createClient(client: ClientCreate): Promise<void> {
	const res = await fetch(`${API_URL}/clientes`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(client),
	});

	if (!res.ok) {
		throw new Error('Erro ao criar cliente');
	}
}

export async function updateClient(id: number, client: Partial<ClientCreate>): Promise<void> {
	const res = await fetch(`${API_URL}/clientes/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(client),
	});
}