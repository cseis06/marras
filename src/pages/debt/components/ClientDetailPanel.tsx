import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  IconX,
  IconPhone,
  IconMail,
  IconMapPin,
  IconChartLine,
  IconReceipt,
  IconSettings,
} from '@tabler/icons-react';
import {
  getStatusLabel,
  getStatusVariant,
  getScoreLabel,
  getScoreVariant,
  getFullName,
} from '../types/Debt';
import type { ClientDebt, Transaction, CollectionNote } from '../types/Debt';
import { SummaryTab } from './SummaryTab';
import { TransactionsTab } from './TransactionsTab';
import { ActionsTab } from './ActionsTab';

interface ClientDetailPanelProps {
  client: ClientDebt;
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  notes: CollectionNote[];
  chartData: { month: string; purchases: number; payments: number; overdue: number }[];
  onRegisterPayment: (amount: number, notes?: string) => void;
  onAddNote: (note: Omit<CollectionNote, 'id'>) => void;
}

type TabType = 'summary' | 'transactions' | 'actions';

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'summary', label: 'Resumen', icon: <IconChartLine size={18} /> },
  { id: 'transactions', label: 'Movimientos', icon: <IconReceipt size={18} /> },
  { id: 'actions', label: 'Acciones', icon: <IconSettings size={18} /> },
];

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace('PYG', 'Gs.');
};

const getBadgeClasses = (variant: 'success' | 'warning' | 'danger'): string => {
  const base = 'px-3 py-1 rounded-full text-sm font-medium';
  switch (variant) {
    case 'success':
      return `${base} bg-green-100 text-green-700`;
    case 'warning':
      return `${base} bg-yellow-100 text-yellow-700`;
    case 'danger':
      return `${base} bg-red-100 text-red-700`;
  }
};

export const ClientDetailPanel = ({
  client,
  isOpen,
  onClose,
  transactions,
  notes,
  chartData,
  onRegisterPayment,
  onAddNote,
}: ClientDetailPanelProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );

      gsap.fromTo(
        panelRef.current,
        { x: '100%' },
        { x: '0%', duration: 0.4, ease: 'power2.out' }
      );
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 });
    gsap.to(panelRef.current, {
      x: '100%',
      duration: 0.3,
      ease: 'power2.in',
      onComplete: onClose,
    });
  };

  if (!isOpen) return null;

  const scoreVariant = getScoreVariant(client.score);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/40"
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative w-full max-w-lg bg-white shadow-xl flex flex-col h-full"
      >
        {/* Header */}
        <div className="flex-shrink-0 border-b border-gray-200">
          <div className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-900">
                    {getFullName(client)}
                  </h2>
                  <span
                    className={getBadgeClasses(getStatusVariant(client.status))}
                  >
                    {getStatusLabel(client.status)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{client.code}</p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <IconX size={20} />
              </button>
            </div>

            {/* Info de contacto */}
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <IconPhone size={16} className="text-gray-400" />
                {client.phone}
              </div>
              <div className="flex items-center gap-1.5">
                <IconMail size={16} className="text-gray-400" />
                {client.email}
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-600">
              <IconMapPin size={16} className="text-gray-400" />
              {client.address}
            </div>

            {/* Score y deuda rápido */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Score:</span>
                <span
                  className={`font-bold ${
                    scoreVariant === 'success'
                      ? 'text-green-600'
                      : scoreVariant === 'warning'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}
                >
                  {client.score}
                </span>
                <span className="text-xs text-gray-400">
                  ({getScoreLabel(client.score)})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Deuda:</span>
                <span
                  className={`font-bold ${
                    client.currentDebt > 0 ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {formatCurrency(client.currentDebt)}
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-t border-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'summary' && (
            <SummaryTab client={client} chartData={chartData} />
          )}
          {activeTab === 'transactions' && (
            <TransactionsTab transactions={transactions} />
          )}
          {activeTab === 'actions' && (
            <ActionsTab
              client={client}
              notes={notes}
              onRegisterPayment={onRegisterPayment}
              onAddNote={onAddNote}
            />
          )}
        </div>
      </div>
    </div>
  );
};