import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import type { Client } from '../types/Client';
import {getClients, deleteClient} from '../db_api/db_api';


const ClientTablePage = () => {

	const [clients, setClients] = useState<Client[]>([]);
	const [ativos, setAtivos] = useState<boolean>(true);

	useEffect(() => {
		getClients(ativos).then(setClients)
	}, []);

	const handleDelete = async (rowData: Client) => {
		// Isso aqui, na verdade, só faz com que o cliente seja marcado
		// como inativo.
		// Filtrar as respostas no back-end???
		try {
			console.log('Deleting:', rowData.id);
			await deleteClient(rowData.id)
			const newClients = await getClients(ativos)
			setClients(newClients)
		} catch (e) {
			console.error('Fail:', e)
		}
	};

	const handleUpdate = (rowData: Client) => {
		console.log('Uploading for:', rowData.id);
		// Implement your upload logic here
	};

	const actionBodyTemplate = (rowData: Client) => {
		return (
			<>
			<div style={{
				display: 'flex', // Enable flexbox for the parent div
				gap: '20px',    // Set the gap between child elements
			}}>
			<Button
			icon="pi pi-trash"
			className="p-button-danger p-mr-2"
			onClick={() => handleDelete(rowData)}
			/>
			<Button
			icon="pi pi-pencil"
			className="p-button-success"
			onClick={() => handleUpdate(rowData)}
			/>
			</div>
			</>
		);
	};

	return (
		<>
		<label>
			Apenas clientes ativos?
			<input
				type="checkbox"
				name="checkativos"
				defaultChecked={true}
				onChange={
					// TOFIX: DOESN'T WORK
					async e => {
						setAtivos(Boolean(e.target.value))
						const newClients = await getClients(ativos)
						setClients(newClients)
					}
				}
			/>
		</label>

		<div style={{
			display: 'flex', // Enable flexbox for the parent div
			gap: '20px',    // Set the gap between child elements
			height: "8rem",
			alignItems: "center"
		}}>
		<h1>Tabela de Clientes</h1>
		<Button label='Adicionar'></Button>
		</div>

		<DataTable value={clients} paginator rows={10} stripedRows tableStyle={{ minWidth: '50rem' }}>
		<Column field="id" header="ID"></Column>
		<Column field="nome" header="Nome"></Column>
		<Column field="email" header="E-mail"></Column>
		<Column field="telefone" header="Telefone"></Column>
		<Column field="data_cadastro" header="Data de cadastro"></Column>
		<Column field="ativo" header="Ativo?"></Column>
		<Column field="cidade" header="Cidade"></Column>
		<Column field="estado" header="Estado"></Column>
		<Column body={actionBodyTemplate} header="Actions" />
		</DataTable>
		</>
	)
}

export default ClientTablePage
