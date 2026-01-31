import { IconRepeat, IconCalendarEvent } from '@tabler/icons-react';
import type { WeekDay } from './types/order';
import { weekDayLabels, weekDayShortLabels, ALL_WEEK_DAYS } from './types/order';
import Toggle from '../../components/ui/Toggle';
import DateInput from '../../components/ui/DateInput';

interface RecurrenceSelectorProps {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  selectedDays: WeekDay[];
  onDaysChange: (days: WeekDay[]) => void;
  startDate: string;
  onStartDateChange: (date: string) => void;
  endDate?: string;
  onEndDateChange: (date: string) => void;
  className?: string;
}

export default function RecurrenceSelector({
  enabled,
  onEnabledChange,
  selectedDays,
  onDaysChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  className = '',
}: RecurrenceSelectorProps) {
  const handleDayToggle = (day: WeekDay) => {
    if (selectedDays.includes(day)) {
      onDaysChange(selectedDays.filter((d) => d !== day));
    } else {
      onDaysChange([...selectedDays, day]);
    }
  };

  const handleSelectAll = () => {
    if (selectedDays.length === ALL_WEEK_DAYS.length) {
      onDaysChange([]);
    } else {
      onDaysChange([...ALL_WEEK_DAYS]);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={className}>
      {/* Toggle principal */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <IconRepeat size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-800">Pedido Recurrente</p>
            <p className="text-xs text-gray-500">
              Repetir automáticamente en días hábiles seleccionados
            </p>
          </div>
        </div>
        <Toggle
          checked={enabled}
          onChange={onEnabledChange}
          size="md"
        />
      </div>

      {/* Opciones de recurrencia */}
      {enabled && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-4">
          {/* Selector de días */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-700">
                Días de entrega
              </p>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                {selectedDays.length === ALL_WEEK_DAYS.length
                  ? 'Deseleccionar todos'
                  : 'Seleccionar todos'}
              </button>
            </div>
            
            <div className="flex gap-2">
              {ALL_WEEK_DAYS.map((day) => {
                const isSelected = selectedDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`
                      flex-1 py-2.5 px-1 rounded-lg text-sm font-medium transition-all duration-200
                      ${
                        isSelected
                          ? 'bg-blue-500 text-white shadow-sm'
                          : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }
                    `}
                    title={weekDayLabels[day]}
                  >
                    {weekDayShortLabels[day]}
                  </button>
                );
              })}
            </div>

            {selectedDays.length === 0 && (
              <p className="mt-2 text-xs text-red-500">
                Selecciona al menos un día
              </p>
            )}
          </div>

          {/* Fechas de inicio y fin */}
          <div className="grid grid-cols-2 gap-4">
            <DateInput
              label="Fecha de inicio"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              min={today}
              required
            />
            <DateInput
              label="Fecha de fin (opcional)"
              value={endDate || ''}
              onChange={(e) => onEndDateChange(e.target.value)}
              min={startDate || today}
              helperText="Dejar vacío para indefinido"
            />
          </div>

          {/* Resumen de recurrencia */}
          {selectedDays.length > 0 && startDate && (
            <div className="flex items-start gap-2 p-3 bg-white rounded-lg border border-blue-200">
              <IconCalendarEvent size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-600">
                <span className="font-medium text-gray-800">Resumen: </span>
                Se creará un pedido cada{' '}
                <span className="font-medium text-blue-700">
                  {selectedDays.length === ALL_WEEK_DAYS.length
                    ? 'día hábil'
                    : selectedDays.map((d) => weekDayLabels[d]).join(', ')}
                </span>
                {endDate ? (
                  <> hasta el <span className="font-medium">{new Date(endDate + 'T00:00:00').toLocaleDateString('es-PY')}</span></>
                ) : (
                  <> de forma indefinida</>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}