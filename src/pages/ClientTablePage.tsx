import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import type { Client, ClientCreate } from '../types/Client';
import { getClients, deleteClient, createClient } from '../db_api/db_api';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

const ClientTablePage = () => {
	const [clients, setClients] = useState<Client[]>([]);
	const [ativos, setAtivos] = useState<boolean>(true);
	const [showDialog, setShowDialog] = useState(false);
	const [novoCliente, setNovoCliente] = useState<ClientCreate>({
		nome: '',
		email: '',
		telefone: '',
		cidade: '',
		estado: '',
	});

	useEffect(() => {
		getClients(ativos).then(setClients);
	}, [ativos]);

	const handleDelete = async (rowData: Client) => {
		try {
			await deleteClient(rowData.id);
			const newClients = await getClients(ativos);
			setClients(newClients);
		} catch (e) {
			console.error('Falha ao deletar:', e);
		}
	};

	const handleCreate = async () => {
  if (!novoCliente.nome || !novoCliente.email) {
    alert('Nome e email são obrigatórios!');
    return;
  }

  try {
    // Cria cliente no backend
    await createClient({ ...novoCliente, ativo: true });

    // Atualiza tabela sem depender de getClients imediatamente
    setClients(prev => [
      ...prev,
      {
        ...novoCliente,
        id: Date.now(), // ID temporário; backend deve retornar real se quiser
        data_cadastro: new Date().toISOString(),
        ativo: true,
      },
    ]);

    // Fecha o diálogo e limpa o formulário
    setShowDialog(false);
    setNovoCliente({ nome: '', email: '', telefone: '', cidade: '', estado: '' });
  } catch (e) {
    console.error('Erro ao criar cliente:', e);
    alert('Falha ao criar cliente!');
  }
};


	const actionBodyTemplate = (rowData: Client) => (
		<div style={{ display: 'flex', gap: '20px' }}>
			<Button icon="pi pi-trash" className="p-button-danger" onClick={() => handleDelete(rowData)} />
			<Button icon="pi pi-pencil" className="p-button-success" onClick={() => console.log('Editar', rowData.id)} />
		</div>
	);

	return (
		<>
			<label>
				Apenas clientes ativos?
				<input
					type="checkbox"
					name="checkativos"
					checked={ativos}
					onChange={async e => setAtivos(e.target.checked)}
				/>
			</label>

			<div style={{ display: 'flex', gap: '20px', height: '8rem', alignItems: 'center' }}>
				<h1>Tabela de Clientes</h1>
				<Button label="Adicionar" onClick={() => setShowDialog(true)} />
			</div>

			<Dialog
				header="Novo Cliente"
				visible={showDialog}
				style={{ width: '400px' }}
				onHide={() => setShowDialog(false)}
			>
				<div className="p-fluid">
					<label>Nome</label>
					<InputText value={novoCliente.nome} onChange={e => setNovoCliente({ ...novoCliente, nome: e.target.value })} />

					<label>Email</label>
					<InputText value={novoCliente.email} onChange={e => setNovoCliente({ ...novoCliente, email: e.target.value })} />

					<label>Telefone</label>
					<InputText value={novoCliente.telefone} onChange={e => setNovoCliente({ ...novoCliente, telefone: e.target.value })} />

					<label>Cidade</label>
					<InputText value={novoCliente.cidade} onChange={e => setNovoCliente({ ...novoCliente, cidade: e.target.value })} />

					<label>Estado</label>
					<InputText value={novoCliente.estado} onChange={e => setNovoCliente({ ...novoCliente, estado: e.target.value })} />

					<Button label="Salvar" className="p-mt-3" onClick={handleCreate} />
				</div>
			</Dialog>

			<DataTable value={clients} paginator rows={10} stripedRows tableStyle={{ minWidth: '50rem' }}>
				<Column field="id" header="ID" />
				<Column field="nome" header="Nome" />
				<Column field="email" header="E-mail" />
				<Column field="telefone" header="Telefone" />
				<Column field="data_cadastro" header="Data de cadastro" />
				<Column field="ativo" header="Ativo?" />
				<Column field="cidade" header="Cidade" />
				<Column field="estado" header="Estado" />
				<Column body={actionBodyTemplate} header="Ações" />
			</DataTable>
		</>
	);
};

export default ClientTablePage;
