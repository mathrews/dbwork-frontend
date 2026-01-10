import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import type { Telefone, Client, ClientCreate } from "../types/Client";
import {
  getClients,
  deleteClient,
  createClient,
  updateClient,
} from "../db_api/db_api";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

const ClientTablePage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [ativos, setAtivos] = useState<boolean>(true);
  const [showDialog, setShowDialog] = useState(false);
  const [novoCliente, setNovoCliente] = useState<ClientCreate>({
    nome: "",
    idade: undefined,
    cpf: "",
    email: "",
    endereco: "",
    cidade: "",
    estado: "",
    data_nascimento: "",
    telefones: [{telefone: "", tipo: ""}],
    ativo: true,
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
      console.error("Falha ao deletar:", e);
    }
  };

  const handleSave = async () => {
    const clienteForm = editCliente || novoCliente;

    if (!clienteForm.nome || !clienteForm.email) {
      alert("Nome e email são obrigatórios!");
      return;
    }

    try {
      if (editCliente) {
        // Atualiza cliente existente
        await updateClient(editCliente.id, editCliente);
        setClients((prev) =>
                   prev.map((c) =>
                            c.id === editCliente.id ? { ...c, ...editCliente } : c
                           )
                  );
      } else {
        // Cria novo cliente
        await createClient(novoCliente);
        setClients((prev) => [
          ...prev,
          {
            ...novoCliente,
            id: ((prev.length == 0) ? 0 :
                 clients.reduce((prev, current) =>
                                (prev && prev.id > current.id)
                                  ? prev : current).id + 1), // encontra o maior id até agora e incrementa
            ativo: true,
          },
        ]);
      }

      setShowDialog(false);
      setNovoCliente({
        nome: "",
        idade: undefined,
        cpf: "",
        email: "",
        endereco: "",
        cidade: "",
        estado: "",
        data_nascimento: "",
        telefones: [{telefone: "", tipo: ""}],
      });

      setEditCliente(null); // Limpa edição após salvar
    } catch (e) {
      console.error("Erro ao salvar cliente:", e);
      alert("Falha ao salvar cliente!");
    }
  };

  const actionBodyTemplate = (rowData: Client) => (
    <div style={{ display: "flex", gap: "20px" }}>
    <Button
    icon="pi pi-trash"
    className="p-button-danger"
    onClick={() => handleDelete(rowData)}
    />
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

  // depois substituir por um popup
  const telefoneBodyTemplate = (rowData: Client) => { console.log(rowData); return (
    <div>
      {rowData.telefones.map((t, idx) => (
        <div key={idx}>
          {t.telefone} ({t.tipo})
        </div>
      ))}
    </div>
  )};

  const ativoBodyTemplate = (rowData: Client) => { console.log(rowData); return (
    <div>
    {(rowData.ativo) ? "Sim" : "Não"}
    </div>
  )};

  const clienteForm = editCliente || novoCliente;

  // HANDLING DE TELEFONES
  function updateTelefones(telefones: Telefone[]) {
    if (editCliente) {
      setEditCliente({ ...editCliente, telefones });
    } else {
      setNovoCliente({ ...novoCliente, telefones });
    }
  }

  function handleTelefoneChange(idx: number, field: "telefone" | "tipo", value: string) {
    const novos = [...clienteForm.telefones];
    novos[idx] = { ...novos[idx], [field]: value };
    updateTelefones(novos);
  }

  function addTelefone() {
    updateTelefones([
      ...clienteForm.telefones,
      { telefone: "", tipo: "" }
    ])
  }

  function removeTelefone(idx: number) {
    const novos = clienteForm.telefones.filter((_, i) => i !== idx);
    updateTelefones((novos.length > 0) ? novos : [{telefone: "", tipo: ""}]);
  }


  return (
    <>
    <label>
    Apenas clientes ativos?
    <input
    type="checkbox"
    name="checkativos"
    checked={ativos}
    onChange={async (e) => setAtivos(e.target.checked)}
    />
    </label>

    <div
    style={{
      display: "flex",
      gap: "20px",
      height: "8rem",
      alignItems: "center",
    }}
    >
    <h1>Tabela de Clientes</h1>
    <Button
    label="Adicionar"
    onClick={() => {
      setNovoCliente({
        nome: "",
        idade: undefined,
        cpf: "",
        email: "",
        endereco: "",
        cidade: "",
        estado: "",
        data_nascimento: "",
        telefones: [{telefone: "", tipo: ""}],
      });

      setEditCliente(null);
      setShowDialog(true);
    }}
    />
    </div>

    <Dialog
    header={editCliente ? "Editar Cliente" : "Novo Cliente"}
    visible={showDialog}
    style={{ width: "400px" }}
    onHide={() => setShowDialog(false)}
    >
    <div className="p-fluid">
    <label>Nome</label>
    <InputText
    value={clienteForm.nome}
    onChange={(e) => {
      if (editCliente)
        setEditCliente({ ...editCliente, nome: e.target.value });
      else setNovoCliente({ ...novoCliente, nome: e.target.value });
    }}
    />

    <label>CPF</label>
    <InputText
    value={clienteForm.cpf}
    onChange={(e) => {
      if (editCliente)
        setEditCliente({ ...editCliente, cpf: e.target.value });
      else setNovoCliente({ ...novoCliente, cpf: e.target.value });
    }}
    />

    <label>Email</label>
    <InputText
    value={clienteForm.email}
    onChange={(e) => {
      if (editCliente)
        setEditCliente({ ...editCliente, email: e.target.value });
      else setNovoCliente({ ...novoCliente, email: e.target.value });
    }}
    />

    <label>Endereço</label>
    <InputText
    value={clienteForm.endereco}
    onChange={(e) => {
      if (editCliente)
        setEditCliente({ ...editCliente, endereco: e.target.value });
      else setNovoCliente({ ...novoCliente, endereco: e.target.value });
    }}
    />

    <label>Cidade</label>
    <InputText
    value={clienteForm.cidade}
    onChange={(e) => {
      if (editCliente)
        setEditCliente({ ...editCliente, cidade: e.target.value });
      else setNovoCliente({ ...novoCliente, cidade: e.target.value });
    }}
    />

    <label>Estado</label>
    <InputText
    value={clienteForm.estado}
    onChange={(e) => {
      if (editCliente)
        setEditCliente({ ...editCliente, estado: e.target.value });
      else setNovoCliente({ ...novoCliente, estado: e.target.value });
    }}
    />

    <label>Data de Nascimento</label>
    <InputText
    value={clienteForm.data_nascimento}
    onChange={(e) => {
      let birth = Number(new Date(e.target.value))
      let idade = ~~((Date.now() - birth) / (31557600000));

      if (editCliente)
        setEditCliente({
          ...editCliente,
          data_nascimento: e.target.value,
          idade: idade
        });
      else
        setNovoCliente({
          ...novoCliente,
          data_nascimento: e.target.value,
          idade: idade
        });
    }}
    />

    <label>Telefone</label>

    {clienteForm.telefones.map((tel, idx) => (
      <div
      key={idx}
      style={{
        display: "flex",
        gap: "0.5rem",
        alignItems: "center",
        marginBottom: "0.5rem",
      }}
      >
      <InputText
      placeholder="Telefone"
      value={tel.telefone}
      onChange={(e) => handleTelefoneChange(idx, "telefone", e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          addTelefone();
        }
      }}
      style={{ flex: 2 }}
      />

      <InputText
      placeholder="Tipo"
      value={tel.tipo}
      onChange={(e) => handleTelefoneChange(idx, "tipo", e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          addTelefone();
        }
      }}
      style={{ flex: 1 }}
      />

      <Button
      icon="pi pi-trash"
      className="p-button-text p-button-danger"
      onClick={() => removeTelefone(idx)}
      disabled={clienteForm.telefones.length === 1}
      />
      </div>

    ))}

    <label>Ativo?</label>
    <Checkbox
    checked={clienteForm.ativo!}
    onChange={(e) => {
      if (editCliente)
        setEditCliente({
          ...editCliente,
          ativo: e.checked!,
        });
        else
          setNovoCliente({
            ...novoCliente,
            ativo: e.checked,
        });
    }}
    />

    <Button label="Salvar" className="p-mt-3" onClick={handleSave} />
    </div>
    </Dialog>

    <DataTable
    value={clients}
    paginator
    rows={10}
    stripedRows
    tableStyle={{ minWidth: "50rem" }}
    >
    <Column field="id" header="ID" />
    <Column field="nome" header="Nome" />
    <Column field="idade" header="Idade" />
    <Column field="cpf" header="CPF" />
    <Column field="email" header="E-mail" />
    <Column body={telefoneBodyTemplate} header="Telefone" />
    <Column field="data_nascimento" header="Data de Nascimento" />
    <Column body={ativoBodyTemplate} header="Ativo?" />
    <Column field="endereco" header="Endereço" />
    <Column field="cidade" header="Cidade" />
    <Column field="estado" header="Estado" />
    <Column body={actionBodyTemplate} header="Ações" />
    </DataTable>
    </>
  );
};

export default ClientTablePage;
