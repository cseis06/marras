import { useState, useMemo } from 'react';
import {
  IconUser,
  IconChefHat,
  IconMotorbike,
  IconMapPin,
  IconNotes,
  IconArrowLeft,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

// Componentes reutilizables
import SearchInput, { type SearchOption } from '../../components/ui/SearchInput';
import DateInput from '../../components/ui/DateInput';
import Select from '../../components/ui/Select';
import TextArea from '../../components/ui/TextArea';

// Componentes específicos
import CategoryQuantitySelector from './CategoryQuantitySelector';
import OrderSummary from './OrderSummary';
import RecurrenceSelector from './RecurrenceSelector';

// Datos
import { clients } from '../clients/data/Clients';
import { dishCategories } from '../platos/data/DishCategories';
import { chefs, deliveryPersons, PACKAGING_FEE, DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from './data/order';

// Tipos
import type { Client, Location } from '../clients/types/Client';
import type { OrderItem, DiscountCode, Chef, DeliveryPerson, WeekDay, RecurrenceConfig } from './types/order';

// Helpers para badges de morosidad
const delinquencyBadges: Record<string, { text: string; variant: 'success' | 'warning' | 'error' | 'neutral' }> = {
  al_dia: { text: 'Al día', variant: 'success' },
  pendiente: { text: 'Pendiente', variant: 'warning' },
  atrasado: { text: 'Atrasado', variant: 'error' },
  moroso: { text: 'Moroso', variant: 'error' },
};

// Generar número de pedido
const generateOrderNumber = () => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${year}${month}-${random}`;
};

export default function CreateOrderPage() {
  const navigate = useNavigate();
  const [orderNumber] = useState(generateOrderNumber);

  // Estado del formulario
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [selectedChef, setSelectedChef] = useState<Chef | null>(null);
  const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState<DeliveryPerson | null>(null);
  const [notes, setNotes] = useState('');
  const [discount, setDiscount] = useState<{ code: string; amount: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado de recurrencia
  const [recurrenceEnabled, setRecurrenceEnabled] = useState(false);
  const [recurrenceDays, setRecurrenceDays] = useState<WeekDay[]>([]);
  const [recurrenceStartDate, setRecurrenceStartDate] = useState('');
  const [recurrenceEndDate, setRecurrenceEndDate] = useState('');

  // Convertir clientes a opciones de búsqueda
  const clientOptions: SearchOption[] = useMemo(
    () =>
      clients.map((client) => ({
        id: client.id,
        label: `${client.firstName} ${client.lastName}`,
        sublabel: `${client.document} • ${client.phone}`,
        badge: delinquencyBadges[client.delinquencyStatus],
        icon: <IconUser size={18} />,
        data: client,
      })),
    []
  );

  // Convertir chefs a opciones de búsqueda
  const chefOptions: SearchOption[] = useMemo(
    () =>
      chefs
        .filter((chef) => chef.disponible)
        .map((chef) => ({
          id: chef.id,
          label: chef.nombre,
          sublabel: chef.especialidad,
          icon: <IconChefHat size={18} />,
          data: chef,
        })),
    []
  );

  // Convertir repartidores a opciones de búsqueda
  const deliveryOptions: SearchOption[] = useMemo(
    () =>
      deliveryPersons
        .filter((dp) => dp.disponible)
        .map((dp) => ({
          id: dp.id,
          label: dp.nombre,
          sublabel: `${dp.zona}`,
          icon: <IconMotorbike size={18} />,
          data: dp,
        })),
    []
  );

  // Opciones de ubicación del cliente seleccionado
  const locationOptions = useMemo(() => {
    if (!selectedClient) return [];
    return selectedClient.locations.map((loc) => ({
      value: loc.id,
      label: `${loc.alias} - ${loc.address}`,
      icon: <IconMapPin size={16} />,
    }));
  }, [selectedClient]);

  // Cálculos de precios
  const subtotal = useMemo(
    () => selectedItems.reduce((acc, item) => acc + item.subtotal, 0),
    [selectedItems]
  );

  const packagingFee = selectedItems.length > 0 ? PACKAGING_FEE : 0;
  
  const deliveryFee = useMemo(() => {
    if (selectedItems.length === 0) return 0;
    return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  }, [subtotal, selectedItems.length]);

  const total = subtotal + packagingFee + deliveryFee - (discount?.amount || 0);

  // Configuración de recurrencia para pasar al summary
  const recurrenceConfig: RecurrenceConfig | undefined = recurrenceEnabled && recurrenceDays.length > 0 && recurrenceStartDate
    ? {
        enabled: true,
        days: recurrenceDays,
        startDate: recurrenceStartDate,
        endDate: recurrenceEndDate || undefined,
      }
    : undefined;

  // Handlers
  const handleClientSelect = (option: SearchOption | null) => {
    if (option) {
      const client = option.data as Client;
      setSelectedClient(client);
      // Si tiene solo una ubicación, seleccionarla automáticamente
      if (client.locations.length === 1) {
        setSelectedLocation(client.locations[0]);
      } else {
        setSelectedLocation(null);
      }
    } else {
      setSelectedClient(null);
      setSelectedLocation(null);
    }
  };

  const handleLocationChange = (locationId: string) => {
    if (selectedClient) {
      const location = selectedClient.locations.find((loc) => loc.id === locationId);
      setSelectedLocation(location || null);
    }
  };

  const handleChefSelect = (option: SearchOption | null) => {
    setSelectedChef(option ? (option.data as Chef) : null);
  };

  const handleDeliveryPersonSelect = (option: SearchOption | null) => {
    setSelectedDeliveryPerson(option ? (option.data as DeliveryPerson) : null);
  };

  const handleApplyDiscount = (code: DiscountCode, amount: number) => {
    setDiscount({ code: code.code, amount });
  };

  const handleRemoveDiscount = () => {
    setDiscount(null);
  };

  const handleRecurrenceEnabledChange = (enabled: boolean) => {
    setRecurrenceEnabled(enabled);
    if (enabled && !recurrenceStartDate) {
      // Si se activa y no hay fecha de inicio, usar la fecha de entrega o hoy
      setRecurrenceStartDate(deliveryDate || new Date().toISOString().split('T')[0]);
    }
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    
    // Simular envío
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Aquí iría la lógica real de crear el pedido
    console.log('Pedido confirmado:', {
      orderNumber,
      clientId: selectedClient?.id,
      locationId: selectedLocation?.id,
      deliveryDate,
      items: selectedItems,
      chefId: selectedChef?.id,
      deliveryPersonId: selectedDeliveryPerson?.id,
      notes,
      discount,
      subtotal,
      packagingFee,
      deliveryFee,
      total,
      status: 'confirmed',
      recurrence: recurrenceConfig,
    });

    setIsSubmitting(false);
    // navigate('/orders'); // Descomentar cuando exista la ruta
    alert('¡Pedido creado exitosamente!');
  };

  const handleSaveDraft = () => {
    console.log('Guardando borrador...');
    alert('Borrador guardado');
  };

  // Fecha mínima: hoy
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-4"
          >
            <IconArrowLeft size={20} />
            <span className="text-sm">Volver</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Crear Nuevo Pedido</h1>
          <p className="text-sm text-gray-500 mt-1">
            Configura los detalles del pedido y las asignaciones.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Columna izquierda - Formulario */}
          <div className="flex-1 space-y-8">
            {/* Sección 1: Cliente y Logística */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-full text-sm font-semibold">
                  1
                </span>
                <h2 className="text-lg font-semibold text-gray-800">
                  Cliente y Logística
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <SearchInput
                  label="Buscar Cliente"
                  options={clientOptions}
                  value={
                    selectedClient
                      ? clientOptions.find((opt) => opt.id === selectedClient.id) || null
                      : null
                  }
                  onChange={handleClientSelect}
                  placeholder="Nombre o documento..."
                  icon={<IconUser size={20} />}
                  required
                />

                <DateInput
                  label="Fecha de Entrega"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  min={today}
                  required
                />

                <Select
                  label="Ubicación de Entrega"
                  options={locationOptions}
                  value={selectedLocation?.id || ''}
                  onChange={handleLocationChange}
                  placeholder="Seleccionar ubicación"
                  icon={<IconMapPin size={18} />}
                  disabled={!selectedClient}
                  required
                />
              </div>
            </section>

            {/* Sección 2: Categorías de Platos */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-full text-sm font-semibold">
                  2
                </span>
                <h2 className="text-lg font-semibold text-gray-800">
                  Categorías de Platos
                </h2>
              </div>

              <CategoryQuantitySelector
                categories={dishCategories}
                selectedItems={selectedItems}
                onChange={setSelectedItems}
              />
            </section>

            {/* Sección 3: Recurrencia */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-full text-sm font-semibold">
                  3
                </span>
                <h2 className="text-lg font-semibold text-gray-800">
                  Programación
                </h2>
              </div>

              <RecurrenceSelector
                enabled={recurrenceEnabled}
                onEnabledChange={handleRecurrenceEnabledChange}
                selectedDays={recurrenceDays}
                onDaysChange={setRecurrenceDays}
                startDate={recurrenceStartDate}
                onStartDateChange={setRecurrenceStartDate}
                endDate={recurrenceEndDate}
                onEndDateChange={setRecurrenceEndDate}
              />
            </section>

            {/* Sección 4: Asignaciones */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-full text-sm font-semibold">
                  4
                </span>
                <h2 className="text-lg font-semibold text-gray-800">
                  Asignaciones
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SearchInput
                  label="Asignar Chef"
                  options={chefOptions}
                  value={
                    selectedChef
                      ? chefOptions.find((opt) => opt.id === selectedChef.id) || null
                      : null
                  }
                  onChange={handleChefSelect}
                  placeholder="Buscar chefs disponibles..."
                  icon={<IconChefHat size={20} />}
                  emptyMessage="No hay chefs disponibles"
                />

                <SearchInput
                  label="Asignar Repartidor"
                  options={deliveryOptions}
                  value={
                    selectedDeliveryPerson
                      ? deliveryOptions.find((opt) => opt.id === selectedDeliveryPerson.id) || null
                      : null
                  }
                  onChange={handleDeliveryPersonSelect}
                  placeholder="Buscar repartidores activos..."
                  icon={<IconMotorbike size={20} />}
                  emptyMessage="No hay repartidores disponibles"
                />
              </div>
            </section>

            {/* Sección 5: Notas del Pedido */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-full text-sm font-semibold">
                  5
                </span>
                <h2 className="text-lg font-semibold text-gray-800">
                  Notas del Pedido
                </h2>
              </div>

              <TextArea
                label="Notas adicionales"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Alergias, instrucciones especiales, códigos de acceso..."
                icon={<IconNotes size={20} />}
                rows={3}
              />
            </section>
          </div>

          {/* Columna derecha - Resumen */}
          <div className="lg:w-96">
            <div className="sticky top-8">
              <OrderSummary
                orderNumber={orderNumber}
                client={selectedClient}
                location={selectedLocation}
                deliveryDate={deliveryDate}
                items={selectedItems}
                subtotal={subtotal}
                packagingFee={packagingFee}
                deliveryFee={deliveryFee}
                discount={discount}
                total={total}
                recurrence={recurrenceConfig}
                onApplyDiscount={handleApplyDiscount}
                onRemoveDiscount={handleRemoveDiscount}
                onConfirm={handleConfirm}
                onSaveDraft={handleSaveDraft}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}