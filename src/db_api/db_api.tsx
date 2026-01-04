import type { Client } from '../types/Client';

const host = import.meta.env.VITE_DB_API_HOST;
const port = import.meta.env.VITE_DB_API_PORT=3000;
const API_URL = `http://${host}:${port}/api`;

export async function getClients(filter: boolean) : Promise<Client[]> {
	const res = await fetch(
		(filter) ? `${API_URL}/clientes?ativo=true` :
			`${API_URL}/clientes`);

	if (!res.ok) {
		throw new Error('Erro ao buscar os clientes')
	}

	const data = await res.json();

	return data.data;
}

export async function deleteClient(id: number) : Promise<void> {
	const res = await fetch(`${API_URL}/clientes/${id}`, {
		method: 'DELETE'
	});

	if (!res.ok) {
		throw new Error('Erro ao excluir cliente')
	}
}
