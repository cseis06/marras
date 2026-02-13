import { useState } from 'react';
import {
  IconCash,
  IconNote,
  IconPhone,
  IconBrandWhatsapp,
  IconMail,
  IconWalk,
  IconDots,
  IconPlus,
  IconCalendar,
  IconCheck,
  IconX,
  IconClock,
  IconAlertCircle,
} from '@tabler/icons-react';
import type { CollectionNote, ClientDebt } from '../types/Debt';

interface ActionsTabProps {
  client: ClientDebt;
  notes: CollectionNote[];
  onRegisterPayment: (amount: number, notes?: string) => void;
  onAddNote: (note: Omit<CollectionNote, 'id'>) => void;
}

type NoteType = 'call' | 'visit' | 'whatsapp' | 'email' | 'other';
type NoteResult = 'successful' | 'no_response' | 'payment_promise' | 'rejected';

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

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('es-PY', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const formatDateShort = (date: Date): string => {
  return new Intl.DateTimeFormat('es-PY', {
    day: '2-digit',
    month: 'short',
  }).format(date);
};

const getNoteTypeIcon = (type: NoteType) => {
  const iconProps = { size: 16 };
  switch (type) {
    case 'call':
      return <IconPhone {...iconProps} className="text-blue-600" />;
    case 'whatsapp':
      return <IconBrandWhatsapp {...iconProps} className="text-green-600" />;
    case 'email':
      return <IconMail {...iconProps} className="text-purple-600" />;
    case 'visit':
      return <IconWalk {...iconProps} className="text-orange-600" />;
    default:
      return <IconDots {...iconProps} className="text-gray-600" />;
  }
};

const getResultIcon = (result: NoteResult) => {
  const iconProps = { size: 14 };
  switch (result) {
    case 'successful':
      return <IconCheck {...iconProps} className="text-green-600" />;
    case 'no_response':
      return <IconClock {...iconProps} className="text-gray-500" />;
    case 'payment_promise':
      return <IconCalendar {...iconProps} className="text-blue-600" />;
    case 'rejected':
      return <IconX {...iconProps} className="text-red-600" />;
  }
};

const getResultLabel = (result: NoteResult): string => {
  const labels: Record<NoteResult, string> = {
    successful: 'Exitoso',
    no_response: 'Sin respuesta',
    payment_promise: 'Compromiso de pago',
    rejected: 'Rechazado',
  };
  return labels[result];
};

const noteTypes: { value: NoteType; label: string; icon: React.ReactNode }[] = [
  { value: 'call', label: 'Llamada', icon: <IconPhone size={18} /> },
  { value: 'whatsapp', label: 'WhatsApp', icon: <IconBrandWhatsapp size={18} /> },
  { value: 'email', label: 'Email', icon: <IconMail size={18} /> },
  { value: 'visit', label: 'Visita', icon: <IconWalk size={18} /> },
  { value: 'other', label: 'Otro', icon: <IconDots size={18} /> },
];

const resultOptions: { value: NoteResult; label: string }[] = [
  { value: 'successful', label: 'Exitoso' },
  { value: 'no_response', label: 'Sin respuesta' },
  { value: 'payment_promise', label: 'Compromiso de pago' },
  { value: 'rejected', label: 'Rechazado' },
];

export const ActionsTab = ({
  client,
  notes,
  onRegisterPayment,
  onAddNote,
}: ActionsTabProps) => {
  // Estado para registrar pago
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');

  // Estado para agregar nota
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteType, setNoteType] = useState<NoteType>('call');
  const [noteDescription, setNoteDescription] = useState('');
  const [noteResult, setNoteResult] = useState<NoteResult>('no_response');

  const handleRegisterPayment = () => {
    const amount = parseInt(paymentAmount.replace(/\D/g, ''));
    if (amount > 0) {
      onRegisterPayment(amount, paymentNotes || undefined);
      setPaymentAmount('');
      setPaymentNotes('');
      setShowPaymentForm(false);
    }
  };

  const handleAddNote = () => {
    if (noteDescription.trim()) {
      onAddNote({
        clientId: client.id,
        date: new Date(),
        type: noteType,
        description: noteDescription,
        result: noteResult,
        createdBy: 'Usuario Actual', // En producción vendría del contexto de auth
      });
      setNoteDescription('');
      setNoteType('call');
      setNoteResult('no_response');
      setShowNoteForm(false);
    }
  };

  const formatAmountInput = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue) {
      return new Intl.NumberFormat('es-PY').format(parseInt(numericValue));
    }
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Acciones rápidas */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-900">Acciones</h4>

        {/* Botón registrar pago */}
        {!showPaymentForm ? (
          <button
            onClick={() => setShowPaymentForm(true)}
            disabled={client.currentDebt === 0}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IconCash size={20} />
            Registrar Pago
          </button>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-sm font-medium text-green-800">Registrar Pago</h5>
              <button
                onClick={() => setShowPaymentForm(false)}
                className="text-green-600 hover:text-green-800"
              >
                <IconX size={18} />
              </button>
            </div>

            <div className="text-xs text-green-700 flex items-center gap-1">
              <IconAlertCircle size={14} />
              Deuda actual: {formatCurrency(client.currentDebt)}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Monto (Gs.)
              </label>
              <input
                type="text"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(formatAmountInput(e.target.value))}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Observaciones (opcional)
              </label>
              <input
                type="text"
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                placeholder="Ej: Pago en efectivo"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <button
              onClick={handleRegisterPayment}
              disabled={!paymentAmount}
              className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar Pago
            </button>
          </div>
        )}

        {/* Botón agregar nota */}
        {!showNoteForm ? (
          <button
            onClick={() => setShowNoteForm(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <IconNote size={20} />
            Agregar Nota de Gestión
          </button>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-sm font-medium text-gray-800">Nueva Nota de Gestión</h5>
              <button
                onClick={() => setShowNoteForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <IconX size={18} />
              </button>
            </div>

            {/* Tipo de nota */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Tipo de contacto
              </label>
              <div className="flex gap-2 flex-wrap">
                {noteTypes.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setNoteType(t.value)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      noteType === t.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {t.icon}
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                value={noteDescription}
                onChange={(e) => setNoteDescription(e.target.value)}
                rows={3}
                placeholder="Describe el resultado de la gestión..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>

            {/* Resultado */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Resultado
              </label>
              <div className="grid grid-cols-2 gap-2">
                {resultOptions.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setNoteResult(r.value)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      noteResult === r.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAddNote}
              disabled={!noteDescription.trim()}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <IconPlus size={18} />
              Guardar Nota
            </button>
          </div>
        )}
      </div>

      {/* Historial de gestiones */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">
          Historial de Gestiones
        </h4>

        {notes.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <IconNote size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">
              No hay notas de gestión registradas
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-white border border-gray-200 rounded-lg p-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    {getNoteTypeIcon(note.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-medium text-gray-900 capitalize">
                        {note.type === 'call' ? 'Llamada' : 
                         note.type === 'visit' ? 'Visita' :
                         note.type === 'whatsapp' ? 'WhatsApp' :
                         note.type === 'email' ? 'Email' : 'Otro'}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {formatDate(note.date)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 mt-1">
                      {note.description}
                    </p>

                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                        {getResultIcon(note.result)}
                        {getResultLabel(note.result)}
                      </span>

                      {note.nextFollowUp && (
                        <span className="inline-flex items-center gap-1 text-xs text-blue-600">
                          <IconCalendar size={12} />
                          Seguimiento: {formatDateShort(note.nextFollowUp)}
                        </span>
                      )}

                      <span className="text-xs text-gray-400">
                        Por: {note.createdBy}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};