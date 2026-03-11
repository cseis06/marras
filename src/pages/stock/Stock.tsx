import { useMemo, useState, useRef, useEffect } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import {
  IconHistory,
  IconEdit,
  IconTrash,
  IconPlus,
  IconPackage,
  IconArrowLeft,
  IconPackageImport,
  IconPackageExport,
  IconAlertTriangle,
} from '@tabler/icons-react';
import gsap from 'gsap';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ActionButtons from '../../components/ui/ActionButtons';
import SlidePanel from '../../components/ui/SlidePanel';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import StatCard from '../../components/ui/StatCard';
import StockForm from './components/StockForm';
import StockMovementForm from './components/StockMovementForm';
import StockMovementHistory from './components/StockMovementHistory';
import { stockItems as initialStockItems, stockMovements as initialMovements } from './data/Stock';
import type { StockItem, StockMovement, MovementType } from './types/Stock';
import { statusConfig, unitAbbreviations, calculateStockStatus } from './types/Stock';
import { useNavigate } from 'react-router-dom';

const columnHelper = createColumnHelper<StockItem>();

export default function Stock() {
  const navigate = useNavigate();

  // Refs para animaciones
  const containerRef = useRef<HTMLDivElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const createButtonRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  // Estado de datos
  const [stockItems, setStockItems] = useState<StockItem[]>(initialStockItems);
  const [movements, setMovements] = useState<StockMovement[]>(initialMovements);

  // Estado del SlidePanel para crear/editar producto
  const [isProductPanelOpen, setIsProductPanelOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<StockItem | null>(null);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);

  // Estado del SlidePanel para movimientos
  const [isMovementPanelOpen, setIsMovementPanelOpen] = useState(false);
  const [movementProduct, setMovementProduct] = useState<StockItem | null>(null);
  const [movementType, setMovementType] = useState<MovementType>('salida');
  const [isSubmittingMovement, setIsSubmittingMovement] = useState(false);

  // Estado del SlidePanel para historial
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false);
  const [historyProduct, setHistoryProduct] = useState<StockItem | null>(null);

  // Estado del ConfirmDialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<StockItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Animaciones de entrada
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Animación del botón "Volver"
      tl.fromTo(
        backButtonRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4 }
      );

      // Animación del header (título y descripción)
      tl.fromTo(
        headerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        '-=0.2'
      );

      // Animación del botón "Nuevo Producto"
      tl.fromTo(
        createButtonRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.4 },
        '-=0.3'
      );

      // Animación de las cards (stagger)
      tl.fromTo(
        cardsRef.current?.children || [],
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.08 },
        '-=0.2'
      );

      // Animación de la tabla
      tl.fromTo(
        tableRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.2'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Estadísticas calculadas
  const stats = useMemo(() => {
    const total = stockItems.length;
    const disponible = stockItems.filter((i) => i.status === 'disponible').length;
    const bajo = stockItems.filter((i) => i.status === 'bajo').length;
    const critico = stockItems.filter((i) => i.status === 'critico').length;
    const agotado = stockItems.filter((i) => i.status === 'agotado').length;
    const valorTotal = stockItems.reduce(
      (sum, item) => sum + item.costPerUnit * item.currentQuantity,
      0
    );

    return { total, disponible, bajo, critico, agotado, valorTotal };
  }, [stockItems]);

  // Handlers del SlidePanel de producto
  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setIsProductPanelOpen(true);
  };

  const handleEditProduct = (product: StockItem) => {
    setSelectedProduct(product);
    setIsProductPanelOpen(true);
  };

  const handleCloseProductPanel = () => {
    setIsProductPanelOpen(false);
    setSelectedProduct(null);
  };

  const handleSubmitProduct = async (
    data: Omit<StockItem, 'id' | 'status' | 'lastUpdated' | 'createdAt'>
  ) => {
    setIsSubmittingProduct(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const now = new Date().toISOString();
    const status = calculateStockStatus(data.currentQuantity, data.minQuantity);

    if (selectedProduct) {
      // Editar
      setStockItems((prev) =>
        prev.map((item) =>
          item.id === selectedProduct.id
            ? { ...data, id: selectedProduct.id, status, lastUpdated: now, createdAt: item.createdAt }
            : item
        )
      );
    } else {
      // Crear
      const newProduct: StockItem = {
        ...data,
        id: `${Date.now()}`,
        status,
        lastUpdated: now,
        createdAt: now,
      };
      setStockItems((prev) => [newProduct, ...prev]);
    }

    setIsSubmittingProduct(false);
    handleCloseProductPanel();
  };

  // Handlers del SlidePanel de movimiento
  const handleOpenMovement = (product: StockItem, type: MovementType) => {
    setMovementProduct(product);
    setMovementType(type);
    setIsMovementPanelOpen(true);
  };

  const handleCloseMovementPanel = () => {
    setIsMovementPanelOpen(false);
    setMovementProduct(null);
  };

  const handleSubmitMovement = async (data: Omit<StockMovement, 'id' | 'createdAt'>) => {
    setIsSubmittingMovement(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    const now = new Date().toISOString();

    // Crear el movimiento
    const newMovement: StockMovement = {
      ...data,
      id: `m${Date.now()}`,
      createdAt: now,
    };
    setMovements((prev) => [newMovement, ...prev]);

    // Actualizar el stock del producto
    setStockItems((prev) =>
      prev.map((item) => {
        if (item.id === data.stockItemId) {
          const newQuantity =
            data.type === 'entrada'
              ? item.currentQuantity + data.quantity
              : Math.max(0, item.currentQuantity - data.quantity);

          return {
            ...item,
            currentQuantity: newQuantity,
            status: calculateStockStatus(newQuantity, item.minQuantity),
            lastUpdated: now,
          };
        }
        return item;
      })
    );

    setIsSubmittingMovement(false);
    handleCloseMovementPanel();
  };

  // Handlers del SlidePanel de historial
  const handleViewHistory = (product: StockItem) => {
    setHistoryProduct(product);
    setIsHistoryPanelOpen(true);
  };

  const handleCloseHistoryPanel = () => {
    setIsHistoryPanelOpen(false);
    setHistoryProduct(null);
  };

  // Handlers del ConfirmDialog
  const handleDeleteClick = (product: StockItem) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    setStockItems((prev) => prev.filter((item) => item.id !== productToDelete.id));
    // También eliminar movimientos asociados
    setMovements((prev) => prev.filter((m) => m.stockItemId !== productToDelete.id));

    setIsDeleting(false);
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  // Otros handlers
  const handleExport = () => {
    console.log('Exportar stock');
    // TODO: descargar excel
  };

  const handleFilter = () => {
    console.log('Abrir filtros');
    // TODO: modal de filtros
  };

  // Formatear moneda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Definición de columnas
  const columns = useMemo(
    () => [
      columnHelper.accessor('code', {
        header: 'Código',
        cell: (info) => (
          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('name', {
        header: 'Producto',
        cell: (info) => (
          <div>
            <p className="font-medium text-gray-800">{info.getValue()}</p>
            {info.row.original.category && (
              <p className="text-xs text-gray-500">{info.row.original.category}</p>
            )}
          </div>
        ),
      }),
      columnHelper.accessor('currentQuantity', {
        header: 'Cantidad',
        cell: (info) => {
          const item = info.row.original;
          return (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800">
                {info.getValue()}
              </span>
              <span className="text-xs text-gray-500">
                {unitAbbreviations[item.unit]}
              </span>
              {item.currentQuantity <= item.minQuantity && item.currentQuantity > 0 && (
                <IconAlertTriangle size={14} className="text-yellow-500" />
              )}
            </div>
          );
        },
      }),
      columnHelper.accessor('minQuantity', {
        header: 'Mínimo',
        cell: (info) => {
          const item = info.row.original;
          return (
            <span className="text-sm text-gray-500">
              {info.getValue()} {unitAbbreviations[item.unit]}
            </span>
          );
        },
      }),
      columnHelper.accessor('costPerUnit', {
        header: 'Costo unit.',
        cell: (info) => (
          <span className="text-sm">{formatCurrency(info.getValue())}</span>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'Estado',
        cell: (info) => {
          const status = info.getValue();
          const config = statusConfig[status];
          return (
            <Badge variant={config.variant} size="xxs">
              {config.label}
            </Badge>
          );
        },
      }),
      columnHelper.display({
        id: 'movements',
        header: 'Movimiento',
        cell: (info) => (
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleOpenMovement(info.row.original, 'entrada')}
              className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
              title="Registrar entrada"
            >
              <IconPackageImport size={16} />
            </button>
            <button
              onClick={() => handleOpenMovement(info.row.original, 'salida')}
              className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              title="Registrar salida"
              disabled={info.row.original.currentQuantity <= 0}
            >
              <IconPackageExport size={16} />
            </button>
          </div>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Acciones',
        cell: (info) => (
          <ActionButtons
            actions={[
              {
                icon: <IconHistory size={18} />,
                onClick: () => handleViewHistory(info.row.original),
                label: 'Ver historial',
              },
              {
                icon: <IconEdit size={18} />,
                onClick: () => handleEditProduct(info.row.original),
                label: 'Editar',
              },
              {
                icon: <IconTrash size={18} />,
                onClick: () => handleDeleteClick(info.row.original),
                label: 'Eliminar',
                variant: 'danger',
              },
            ]}
          />
        ),
      }),
    ],
    []
  );

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {/* Header con botón crear - responsive */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        {/* Header con título y botón volver */}
        <div>
          <button
            ref={backButtonRef}
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-3 sm:mb-4 opacity-0"
          >
            <IconArrowLeft size={20} />
            <span className="text-sm">Volver</span>
          </button>
          <div ref={headerRef} className="opacity-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Gestión de Stock</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Administra el inventario, registra entradas y salidas de productos
            </p>
          </div>
        </div>

        {/* Botón de crear - responsive */}
        <div ref={createButtonRef} className="opacity-0 flex-shrink-0">
          <Button
            variant="gradient"
            icon={<IconPlus size={18} />}
            onClick={handleCreateProduct}
            className="w-full sm:w-auto text-sm!"
          >
            <span className="sm:inline">Nuevo Producto</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards - responsive grid */}
      <div 
        ref={cardsRef} 
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6"
      >
        <div className="opacity-0 col-span-1">
          <StatCard
            title="Total Productos"
            value={stats.total}
            icon={<IconPackage size={20} />}
            variant="default"
          />
        </div>
        <div className="opacity-0 col-span-1">
          <StatCard
            title="Disponible"
            value={stats.disponible}
            icon={<IconPackage size={20} />}
            variant="success"
          />
        </div>
        <div className="opacity-0 col-span-1">
          <StatCard
            title="Stock Bajo"
            value={stats.bajo}
            icon={<IconAlertTriangle size={20} />}
            variant="warning"
          />
        </div>
        <div className="opacity-0 col-span-1">
          <StatCard
            title="Crítico"
            value={stats.critico}
            icon={<IconAlertTriangle size={20} />}
            variant="error"
          />
        </div>
        <div className="opacity-0 col-span-1">
          <StatCard
            title="Agotado"
            value={stats.agotado}
            icon={<IconPackageExport size={20} />}
            variant="default"
          />
        </div>
        {/* Comentado: <div className="opacity-0 col-span-2 md:col-span-1">
          <StatCard
            title="Valor Total"
            value={formatCurrency(stats.valorTotal)}
            icon={<IconPackage size={20} />}
            variant="info"
          />
        </div> */}
      </div>

      {/* Tabla */}
      <div ref={tableRef} className="opacity-0">
        <Table<StockItem>
          title={<IconPackage />}
          data={stockItems}
          columns={columns}
          searchPlaceholder="Buscar producto..."
          onExport={handleExport}
          onFilter={handleFilter}
          pageSize={10}
        />
      </div>

      {/* SlidePanel para Crear/Editar Producto */}
      <SlidePanel
        isOpen={isProductPanelOpen}
        onClose={handleCloseProductPanel}
        title={selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}
        width="w-full max-w-xl"
      >
        <StockForm
          key={selectedProduct?.id ?? 'new'}
          item={selectedProduct}
          onSubmit={handleSubmitProduct}
          onCancel={handleCloseProductPanel}
          loading={isSubmittingProduct}
        />
      </SlidePanel>

      {/* SlidePanel para Movimientos */}
      <SlidePanel
        isOpen={isMovementPanelOpen}
        onClose={handleCloseMovementPanel}
        title={movementType === 'entrada' ? 'Registrar Entrada' : 'Registrar Salida'}
        width="w-full max-w-md"
      >
        {movementProduct && (
          <StockMovementForm
            key={`${movementProduct.id}-${movementType}`}
            item={movementProduct}
            onSubmit={handleSubmitMovement}
            onCancel={handleCloseMovementPanel}
            loading={isSubmittingMovement}
            initialType={movementType}
          />
        )}
      </SlidePanel>

      {/* SlidePanel para Historial */}
      <SlidePanel
        isOpen={isHistoryPanelOpen}
        onClose={handleCloseHistoryPanel}
        title="Historial de Movimientos"
        width="w-full max-w-lg"
      >
        {historyProduct && (
          <StockMovementHistory item={historyProduct} movements={movements} />
        )}
      </SlidePanel>

      {/* ConfirmDialog para Eliminar */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Eliminar producto"
        message={
          <>
            ¿Estás seguro de eliminar{' '}
            <span className="font-semibold">{productToDelete?.name}</span>? Esta acción eliminará
            también todo el historial de movimientos asociado.
          </>
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}