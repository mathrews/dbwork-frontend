import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import type { Client, ClientCreate } from '../types/Client';
import { getClients, deleteClient, createClient, updateClient } from '../db_api/db_api';
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

  const [editCliente, setEditCliente] = useState<Client | null>(null);

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

  const handleSave = async () => {
    const clienteForm = editCliente || novoCliente;

    if (!clienteForm.nome || !clienteForm.email) {
      alert('Nome e email são obrigatórios!');
      return;
    }

    try {
      if (editCliente) {
        // Atualiza cliente existente
        await updateClient(editCliente.id, editCliente);
        setClients(prev =>
          prev.map(c => (c.id === editCliente.id ? { ...c, ...editCliente } : c))
        );
      } else {
        // Cria novo cliente
        await createClient(novoCliente);
        setClients(prev => [
          ...prev,
          {
            ...novoCliente,
            id: Date.now(), // ID temporário
            data_cadastro: new Date().toISOString(),
            ativo: true,
          },
        ]);
      }

      setShowDialog(false);
      setNovoCliente({ nome: '', email: '', telefone: '', cidade: '', estado: '' });
      setEditCliente(null); // Limpa edição após salvar
    } catch (e) {
      console.error('Erro ao salvar cliente:', e);
      alert('Falha ao salvar cliente!');
    }
  };

  const actionBodyTemplate = (rowData: Client) => (
    <div style={{ display: 'flex', gap: '20px' }}>
      <Button icon="pi pi-trash" className="p-button-danger" onClick={() => handleDelete(rowData)} />
      <Button
        icon="pi pi-pencil"
        className="p-button-success"
        onClick={() => {
          setEditCliente(rowData);
          setShowDialog(true);
        }}
      />
    </div>
  );

  const clienteForm = editCliente || novoCliente;

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
        <Button
          label="Adicionar"
          onClick={() => {
            setNovoCliente({ nome: '', email: '', telefone: '', cidade: '', estado: '' });
            setEditCliente(null);
            setShowDialog(true);
          }}
        />
      </div>

      <Dialog
        header={editCliente ? 'Editar Cliente' : 'Novo Cliente'}
        visible={showDialog}
        style={{ width: '400px' }}
        onHide={() => setShowDialog(false)}
      >
        <div className="p-fluid">
          <label>Nome</label>
          <InputText
            value={clienteForm.nome}
            onChange={e => {
              if (editCliente) setEditCliente({ ...editCliente, nome: e.target.value });
              else setNovoCliente({ ...novoCliente, nome: e.target.value });
            }}
          />

          <label>Email</label>
          <InputText
            value={clienteForm.email}
            onChange={e => {
              if (editCliente) setEditCliente({ ...editCliente, email: e.target.value });
              else setNovoCliente({ ...novoCliente, email: e.target.value });
            }}
          />

          <label>Telefone</label>
          <InputText
            value={clienteForm.telefone}
            onChange={e => {
              if (editCliente) setEditCliente({ ...editCliente, telefone: e.target.value });
              else setNovoCliente({ ...novoCliente, telefone: e.target.value });
            }}
          />

          <label>Cidade</label>
          <InputText
            value={clienteForm.cidade}
            onChange={e => {
              if (editCliente) setEditCliente({ ...editCliente, cidade: e.target.value });
              else setNovoCliente({ ...novoCliente, cidade: e.target.value });
            }}
          />

          <label>Estado</label>
          <InputText
            value={clienteForm.estado}
            onChange={e => {
              if (editCliente) setEditCliente({ ...editCliente, estado: e.target.value });
              else setNovoCliente({ ...novoCliente, estado: e.target.value });
            }}
          />

          <Button label="Salvar" className="p-mt-3" onClick={handleSave} />
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
