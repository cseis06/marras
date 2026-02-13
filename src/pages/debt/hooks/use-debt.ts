import { useState, useMemo, useCallback } from 'react';
import type {
  ClientDebt,
  Transaction,
  CollectionNote,
  DebtFilters,
  DebtStats,
  DebtStatus,
} from '../types/Debt';
import {
  mockClients,
  mockTransactions,
  mockCollectionNotes,
  mockStats,
  getTopPayers,
  getTopDefaulters,
  generateClientChartData,
} from '../data/Debt';

const initialFilters: DebtFilters = {
  search: '',
  status: 'all',
  aging: 'all',
  startDate: null,
  endDate: null,
};

export const useDebt = () => {
  // Estados principales
  const [clients, setClients] = useState<ClientDebt[]>(mockClients);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [collectionNotes, setCollectionNotes] = useState<CollectionNote[]>(mockCollectionNotes);
  const [stats] = useState<DebtStats>(mockStats);
  const [filters, setFilters] = useState<DebtFilters>(initialFilters);

  // Estado del panel de detalle
  const [selectedClient, setSelectedClient] = useState<ClientDebt | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Filtrar clientes
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      // Filtro de búsqueda
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matches =
          client.name.toLowerCase().includes(searchTerm) ||
          client.code.toLowerCase().includes(searchTerm) ||
          client.phone.includes(searchTerm);
        if (!matches) return false;
      }

      // Filtro de estado
      if (filters.status !== 'all' && client.status !== filters.status) {
        return false;
      }

      // Filtro de antigüedad
      if (filters.aging !== 'all') {
        switch (filters.aging) {
          case '0-30':
            if (client.daysOverdue < 0 || client.daysOverdue > 30) return false;
            break;
          case '31-60':
            if (client.daysOverdue < 31 || client.daysOverdue > 60) return false;
            break;
          case '61-90':
            if (client.daysOverdue < 61 || client.daysOverdue > 90) return false;
            break;
          case '90+':
            if (client.daysOverdue <= 90) return false;
            break;
        }
      }

      return true;
    });
  }, [clients, filters]);

  // Top pagadores y morosos
  const topPayers = useMemo(() => getTopPayers(clients, 5), [clients]);
  const topDefaulters = useMemo(() => getTopDefaulters(clients, 5), [clients]);

  // Obtener transacciones de un cliente
  const getClientTransactions = useCallback(
    (clientId: string) => {
      return transactions
        .filter((t) => t.clientId === clientId)
        .sort((a, b) => b.date.getTime() - a.date.getTime());
    },
    [transactions]
  );

  // Obtener notas de gestión de un cliente
  const getClientNotes = useCallback(
    (clientId: string) => {
      return collectionNotes
        .filter((n) => n.clientId === clientId)
        .sort((a, b) => b.date.getTime() - a.date.getTime());
    },
    [collectionNotes]
  );

  // Obtener datos para el gráfico
  const getChartData = useCallback((clientId: string) => {
    return generateClientChartData(clientId);
  }, []);

  // Actualizar filtro individual
  const updateFilter = useCallback(
    <K extends keyof DebtFilters>(key: K, value: DebtFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  // Abrir detalle de cliente
  const openClientDetail = useCallback(
    (client: ClientDebt) => {
      setSelectedClient(client);
      setIsPanelOpen(true);
    },
    []
  );

  // Cerrar panel
  const closePanel = useCallback(() => {
    setIsPanelOpen(false);
    setTimeout(() => setSelectedClient(null), 300);
  }, []);

  // Agregar nota de gestión
  const addCollectionNote = useCallback(
    (note: Omit<CollectionNote, 'id'>) => {
      const newNote: CollectionNote = {
        ...note,
        id: `note-${Date.now()}`,
      };
      setCollectionNotes((prev) => [newNote, ...prev]);
    },
    []
  );

  // Registrar pago
  const registerPayment = useCallback(
    (clientId: string, amount: number, notes?: string) => {
      // Crear transacción de pago
      const newTransaction: Transaction = {
        id: `txn-${Date.now()}`,
        clientId,
        date: new Date(),
        type: 'payment',
        concept: notes || 'Pago recibido',
        amount,
        status: 'paid',
        daysOverdue: 0,
        dueDate: new Date(),
      };
      setTransactions((prev) => [newTransaction, ...prev]);

      // Actualizar cliente
      setClients((prev) =>
        prev.map((c) => {
          if (c.id === clientId) {
            const newDebt = Math.max(0, c.currentDebt - amount);
            const newStatus: DebtStatus = newDebt === 0 ? 'current' : c.status;
            return {
              ...c,
              currentDebt: newDebt,
              lastPayment: new Date(),
              status: newStatus,
              daysOverdue: newDebt === 0 ? 0 : c.daysOverdue,
            };
          }
          return c;
        })
      );

      // Actualizar cliente seleccionado si corresponde
      if (selectedClient?.id === clientId) {
        setSelectedClient((prev) => {
          if (!prev) return null;
          const newDebt = Math.max(0, prev.currentDebt - amount);
          const newStatus: DebtStatus = newDebt === 0 ? 'current' : prev.status;
          return {
            ...prev,
            currentDebt: newDebt,
            lastPayment: new Date(),
            status: newStatus,
            daysOverdue: newDebt === 0 ? 0 : prev.daysOverdue,
          };
        });
      }
    },
    [selectedClient]
  );

  // Cambiar estado de cliente
  const changeClientStatus = useCallback(
    (clientId: string, newStatus: DebtStatus) => {
      setClients((prev) =>
        prev.map((c) => (c.id === clientId ? { ...c, status: newStatus } : c))
      );

      if (selectedClient?.id === clientId) {
        setSelectedClient((prev) =>
          prev ? { ...prev, status: newStatus } : null
        );
      }
    },
    [selectedClient]
  );

  return {
    // Datos
    clients: filteredClients,
    allClients: clients,
    stats,
    topPayers,
    topDefaulters,
    filters,

    // Panel de detalle
    selectedClient,
    isPanelOpen,

    // Métodos de datos
    getClientTransactions,
    getClientNotes,
    getChartData,

    // Métodos de filtros
    updateFilter,
    clearFilters,

    // Métodos del panel
    openClientDetail,
    closePanel,

    // Métodos de acciones
    addCollectionNote,
    registerPayment,
    changeClientStatus,
  };
};