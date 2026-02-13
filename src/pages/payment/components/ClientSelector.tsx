import { useState, useRef, useEffect } from 'react';
import { IconSearch, IconUser, IconX, IconAlertTriangle } from '@tabler/icons-react';
import type { Client } from '../../clients/types/Client';
import Badge from '../../../components/ui/Badge';

interface ClientSelectorProps {
  clients: Client[];
  selectedClient: Client | null;
  onSelect: (client: Client | null) => void;
  placeholder?: string;
  className?: string;
}

// Configuración de estados de morosidad
const delinquencyConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'neutral' }> = {
  al_dia: { label: 'Al día', variant: 'success' },
  pendiente: { label: 'Pendiente', variant: 'warning' },
  atrasado: { label: 'Atrasado', variant: 'error' },
  moroso: { label: 'Moroso', variant: 'error' },
};

export default function ClientSelector({
  clients,
  selectedClient,
  onSelect,
  placeholder = 'Buscar cliente por nombre o cédula...',
  className = '',
}: ClientSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filtrar clientes según término de búsqueda
  const filteredClients = clients.filter((client) => {
    const term = searchTerm.toLowerCase();
    const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
    const document = client.document.replace(/\./g, '').toLowerCase();
    return fullName.includes(term) || document.includes(term.replace(/\./g, ''));
  });

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset highlighted index cuando cambian los resultados
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredClients.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handleSelectClient = (client: Client) => {
    onSelect(client);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleClearSelection = () => {
    onSelect(null);
    setSearchTerm('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => 
          prev < filteredClients.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredClients[highlightedIndex]) {
          handleSelectClient(filteredClients[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  // Si hay cliente seleccionado, mostrar tarjeta
  if (selectedClient) {
    const config = delinquencyConfig[selectedClient.delinquencyStatus];
    const showWarning = selectedClient.delinquencyStatus === 'atrasado' || 
                        selectedClient.delinquencyStatus === 'moroso';

    return (
      <div className={`relative ${className}`}>
        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md">
              {selectedClient.firstName[0]}{selectedClient.lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-800">
                  {selectedClient.firstName} {selectedClient.lastName}
                </h3>
                <Badge variant={config.variant} size="xxs">
                  {config.label}
                </Badge>
                {showWarning && (
                  <IconAlertTriangle size={16} className="text-amber-500" />
                )}
              </div>
              <p className="text-sm text-gray-500">
                CI: {selectedClient.document} • Tel: {selectedClient.phone}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClearSelection}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Cambiar cliente"
          >
            <IconX size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input de búsqueda */}
      <div className="relative">
        <IconSearch 
          size={20} 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" 
        />
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl 
                     text-gray-800 placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                     transition-all duration-200"
        />
      </div>

      {/* Dropdown de resultados */}
      {isOpen && searchTerm && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto">
          {filteredClients.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <IconUser size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No se encontraron clientes</p>
            </div>
          ) : (
            <ul className="py-2">
              {filteredClients.map((client, index) => {
                const config = delinquencyConfig[client.delinquencyStatus];
                const isHighlighted = index === highlightedIndex;
                
                return (
                  <li key={client.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectClient(client)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={`w-full px-4 py-3 flex items-center gap-3 transition-colors
                        ${isHighlighted ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {client.firstName[0]}{client.lastName[0]}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800">
                            {client.firstName} {client.lastName}
                          </span>
                          <Badge variant={config.variant} size="xxs">
                            {config.label}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-500">
                          CI: {client.document}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}