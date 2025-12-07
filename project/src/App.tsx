import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { supabase } from './lib/supabase';
import type { Customer } from './lib/database.types';
import { CustomerForm } from './components/CustomerForm';
import { CustomerList } from './components/CustomerList';

function App() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingCustomer) {
        const { error } = await supabase
          .from('customers')
          .update({ ...formData, updated_at: new Date().toISOString() })
          .eq('id', editingCustomer.id);

        if (error) throw error;
        setEditingCustomer(null);
      } else {
        const { error } = await supabase
          .from('customers')
          .insert([formData]);

        if (error) throw error;
      }

      loadCustomers();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) return;

    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadCustomers();
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
    }
  };

  const handleCancel = () => {
    setEditingCustomer(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Gestão de Clientes</h1>
          </div>
          <p className="text-gray-600 ml-14">
            Gerencie seus clientes de forma simples e eficiente
          </p>
        </div>

        <CustomerForm
          customer={editingCustomer}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />

        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Total: {customers.length} {customers.length === 1 ? 'cliente' : 'clientes'}
          </h2>
        </div>

        <CustomerList
          customers={customers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default App;
