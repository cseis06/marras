import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconFileExport,
  IconBell,
  IconArrowLeft,
} from '@tabler/icons-react';
import { useDebt } from './hooks/use-debt';
import { DebtStats } from './components/DebtStats';
import { TopPayers } from './components/TopPayers';
import { TopDefaulter } from './components/TopDefaulter';
import { DebtTable } from './components/DebtTable';
import { ClientDetailPanel } from './components/ClientDetailPanel';
import type { ClientDebt } from './types/Debt';
import Button from '../../components/ui/Button';

export const DebtPage = () => {
  const {
    clients,
    allClients,
    stats,
    topPayers,
    topDefaulters,
    filters,
    selectedClient,
    isPanelOpen,
    getClientTransactions,
    getClientNotes,
    getChartData,
    updateFilter,
    clearFilters,
    openClientDetail,
    closePanel,
    addCollectionNote,
    registerPayment,
  } = useDebt();

  
  const navigate = useNavigate();

  // Manejar clic en rankings
  const handleViewClientFromRanking = useCallback(
    (clientId: string) => {
      const client = allClients.find((c) => c.id === clientId);
      if (client) {
        openClientDetail(client);
      }
    },
    [allClients, openClientDetail]
  );

  // Manejar pago desde tabla (abre el panel en tab acciones)
  const handleRegisterPaymentFromTable = useCallback(
    (client: ClientDebt) => {
      openClientDetail(client);
      // El usuario navegará al tab de acciones manualmente
    },
    [openClientDetail]
  );

  // Manejar recordatorio (por ahora solo abre el panel)
  const handleSendReminder = useCallback(
    (client: ClientDebt) => {
      openClientDetail(client);
      // Futuro: abrir modal de envío de recordatorio
    },
    [openClientDetail]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div className="mb-6">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-4"
              >
                <IconArrowLeft size={20} />
                <span className="text-sm">Volver</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Historial de Morosidad</h1>
              <p className="text-sm text-gray-500 mt-1">
                  Gestiona los pagos pendientes y el comportamiento de pago de tus clientes
              </p>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3">
              <Button variant='outlined' className="text-sm" textColor="text-gray-600"  bgColor="bg-gray-400">
                <IconFileExport size={18} />
                Exportar
              </Button>
              <Button variant='gradient' className="text-sm">
                <IconBell size={18} />
                Recordatorios
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Estadísticas */}
        <DebtStats stats={stats} />

        {/* Rankings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopPayers
            payers={topPayers}
            onViewClient={handleViewClientFromRanking}
          />
          <TopDefaulter
            defaulters={topDefaulters}
            onViewClient={handleViewClientFromRanking}
          />
        </div>

        {/* Tabla principal con filtros integrados */}
        <DebtTable
          clients={clients}
          filters={filters}
          onViewDetail={openClientDetail}
          onRegisterPayment={handleRegisterPaymentFromTable}
          onSendReminder={handleSendReminder}
          onUpdateFilter={updateFilter}
          onClearFilters={clearFilters}
        />
      </div>

      {/* Panel de detalle */}
      {selectedClient && (
        <ClientDetailPanel
          client={selectedClient}
          isOpen={isPanelOpen}
          onClose={closePanel}
          transactions={getClientTransactions(selectedClient.id)}
          notes={getClientNotes(selectedClient.id)}
          chartData={getChartData(selectedClient.id)}
          onRegisterPayment={(amount, notes) =>
            registerPayment(selectedClient.id, amount, notes)
          }
          onAddNote={addCollectionNote}
        />
      )}
    </div>
  );
};