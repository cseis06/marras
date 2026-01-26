import { useState } from 'react';
import { IconPlus, IconTrash, IconMapPin } from '@tabler/icons-react';
import Input from '../../components/ui/FloatingInput';
import Select from '../../components/ui/Select';
import type { SelectOption } from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import type { Client, Location, DelinquencyStatus } from './types/Client';

interface ClientFormProps {
  client?: Client | null;
  onSubmit: (data: Omit<Client, 'id'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

const emptyLocation: Omit<Location, 'id'> = {
  alias: '',
  address: '',
  city: '',
  neighborhood: '',
  reference: '',
};

const delinquencyOptions: SelectOption[] = [
  { value: 'al_dia', label: 'Al día' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'atrasado', label: 'Atrasado' },
  { value: 'moroso', label: 'Moroso' },
];

const getInitialFormData = (client?: Client | null) => ({
  document: client?.document ?? '',
  firstName: client?.firstName ?? '',
  lastName: client?.lastName ?? '',
  phone: client?.phone ?? '',
  delinquencyStatus: client?.delinquencyStatus ?? 'al_dia' as DelinquencyStatus,
});

const getInitialLocations = (client?: Client | null): Omit<Location, 'id'>[] => {
  if (client?.locations?.length) {
    return client.locations.map(({ id, ...rest }) => rest);
  }
  return [{ ...emptyLocation }];
};

export default function ClientForm({ client, onSubmit, onCancel, loading }: ClientFormProps) {
  const [formData, setFormData] = useState(() => getInitialFormData(client));
  const [locations, setLocations] = useState(() => getInitialLocations(client));

  const isEditing = !!client;

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (index: number, field: string, value: string) => {
    setLocations((prev) =>
      prev.map((loc, i) => (i === index ? { ...loc, [field]: value } : loc))
    );
  };

  const addLocation = () => {
    if (locations.length < 4) {
      setLocations((prev) => [...prev, { ...emptyLocation }]);
    }
  };

  const removeLocation = (index: number) => {
    if (locations.length > 1) {
      setLocations((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const clientData: Omit<Client, 'id'> = {
      ...formData,
      locations: locations.map((loc, index) => ({
        ...loc,
        id: client?.locations[index]?.id || `temp-${Date.now()}-${index}`,
      })),
    };

    onSubmit(clientData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Datos personales */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Datos personales</h3>
        <div className="space-y-4">
          <Input
            label="Cédula"
            value={formData.document}
            onChange={(e) => handleChange('document', e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Nombre"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              required
            />
            <Input
              label="Apellido"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              required
            />
          </div>

          <Input
            label="Teléfono"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            required
          />

          <Select
            label="Estado de morosidad"
            options={delinquencyOptions}
            value={formData.delinquencyStatus}
            onChange={(value) => handleChange('delinquencyStatus', value)}
            name="delinquencyStatus"
            required
          />
        </div>
      </div>

      {/* Ubicaciones */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <IconMapPin size={16} />
            Ubicaciones ({locations.length}/4)
          </h3>
          {locations.length < 4 && (
            <button
              type="button"
              onClick={addLocation}
              className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <IconPlus size={14} />
              Agregar
            </button>
          )}
        </div>

        <div className="space-y-4">
          {locations.map((location, index) => (
            <div
              key={index}
              className={`border border-gray-300 rounded-lg relative ${locations.length > 1 ? 'px-4 pb-4 pt-12' : 'p-4' }`}
            >
              {locations.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLocation(index)}
                  className="absolute top-2 right-2 cursor-pointer p-2.5 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <IconTrash size={18} />
                </button>
              )}

              <div className="space-y-3">
                <Input
                  label="Alias (ej: Casa, Oficina)"
                  value={location.alias}
                  onChange={(e) => handleLocationChange(index, 'alias', e.target.value)}
                  required
                />

                <Input
                  label="Dirección"
                  value={location.address}
                  onChange={(e) => handleLocationChange(index, 'address', e.target.value)}
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Ciudad"
                    value={location.city}
                    onChange={(e) => handleLocationChange(index, 'city', e.target.value)}
                    required
                  />
                  <Input
                    label="Barrio"
                    value={location.neighborhood}
                    onChange={(e) => handleLocationChange(index, 'neighborhood', e.target.value)}
                    required
                  />
                </div>

                <Input
                  label="Referencia (opcional)"
                  value={location.reference || ''}
                  onChange={(e) => handleLocationChange(index, 'reference', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer con botones */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button
          type="button"
          variant="outlined"
          textColor="text-gray-600"
          bgColor="bg-gray-400"
          onClick={onCancel}
          disabled={loading}
          className="text-sm!"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="gradient"
          disabled={loading}
          className="text-sm!"
        >
          {loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear cliente'}
        </Button>
      </div>
    </form>
  );
}