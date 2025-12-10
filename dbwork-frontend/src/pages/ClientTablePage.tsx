import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

interface Client {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    data_signup: string;
    active: boolean;
    city: string;
    estate: string;
}

const ClientTablePage = () => {

    const [clients, setClients] = useState<Client[]>([
        { id: 1, name: 'Jorge', email: 'email@example.com', phoneNumber: "99 99999-9999", data_signup: "2025-12-10T14:30:00.000Z", active: true, city: "Fortaleza", estate: "CE" },
        { id: 2, name: 'Matt', email: 'email@example.com', phoneNumber: "99 99999-9999", data_signup: "2025-12-10T14:30:00.000Z", active: true, city: "Fortaleza", estate: "CE" },
    ]);

    const handleDelete = (rowData: Client) => {
        console.log('Deleting:', rowData.id);
        setClients(clients.filter(p => p.id !== rowData.id));
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
                <Column field="name" header="Name"></Column>
                <Column field="email" header="Email"></Column>
                <Column field="phoneNumber" header="Phone Number"></Column>
                <Column field="data_signup" header="SignUp Data"></Column>
                <Column field="active" header="Is Active?"></Column>
                <Column field="city" header="City"></Column>
                <Column field="estate" header="Estate"></Column>
                <Column body={actionBodyTemplate} header="Actions" />
            </DataTable>
        </>
    )
}

export default ClientTablePage