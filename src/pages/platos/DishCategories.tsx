import { useState, useMemo, useRef, useEffect } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconCategory,
  IconArrowLeft,
} from '@tabler/icons-react';
import gsap from 'gsap';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import ActionButtons from '../../components/ui/ActionButtons';
import SlidePanel from '../../components/ui/SlidePanel';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Button from '../../components/ui/Button';
import DishCategoryForm from './components/DishCategoryForm';
import { dishCategories as initialCategories } from './data/DishCategories';
import type { DishCategory, DishCategoryFormData } from './types/DishCategory';

const columnHelper = createColumnHelper<DishCategory>();

// Formatea precio en guaraníes
const formatPrice = (value: number): string => {
  return new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function DishCategories() {
  
  const navigate = useNavigate();

  // Refs para animaciones
  const containerRef = useRef<HTMLDivElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const createButtonRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  // Data state
  const [categories, setCategories] = useState<DishCategory[]>(initialCategories);

  // UI state
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<DishCategory | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<DishCategory | null>(null);
  const [loading, setLoading] = useState(false);

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

      // Animación del botón "Nueva Categoría"
      tl.fromTo(
        createButtonRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.4 },
        '-=0.3'
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

  // Listas para validación de unicidad
  const existingCodes = useMemo(() => categories.map((c) => c.codigo), [categories]);
  const existingNames = useMemo(() => categories.map((c) => c.nombre), [categories]);

  // Handlers
  const handleCreate = () => {
    setSelectedCategory(null);
    setIsPanelOpen(true);
  };

  const handleEdit = (category: DishCategory) => {
    setSelectedCategory(category);
    setIsPanelOpen(true);
  };

  const handleDeleteClick = (category: DishCategory) => {
    setCategoryToDelete(category);
    setIsConfirmOpen(true);
  };

  const handleToggleEstado = (category: DishCategory) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === category.id
          ? { ...c, estado: !c.estado, updatedAt: new Date().toISOString() }
          : c
      )
    );
  };

  const handleSubmit = async (data: DishCategoryFormData) => {
    setLoading(true);

    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (selectedCategory) {
      // Editar
      setCategories((prev) =>
        prev.map((c) =>
          c.id === selectedCategory.id
            ? { ...c, ...data, updatedAt: new Date().toISOString() }
            : c
        )
      );
    } else {
      // Crear
      const newCategory: DishCategory = {
        id: String(Date.now()),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCategories((prev) => [...prev, newCategory]);
    }

    setLoading(false);
    setIsPanelOpen(false);
    setSelectedCategory(null);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id));

    setLoading(false);
    setIsConfirmOpen(false);
    setCategoryToDelete(null);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedCategory(null);
  };

  // Definición de columnas
  const columns = useMemo(
    () => [
      columnHelper.accessor('codigo', {
        header: 'Código',
        cell: (info) => (
          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
            {info.getValue()}
          </span>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor('nombre', {
        header: 'Nombre',
        cell: (info) => (
          <span className="font-medium text-gray-800">{info.getValue()}</span>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor('precioBase', {
        header: 'Precio Base',
        cell: (info) => (
          <span className="text-gray-700 tabular-nums">
            {formatPrice(info.getValue())}
          </span>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor('estado', {
        header: 'Estado',
        cell: (info) => {
          const isActive = info.getValue();
          const category = info.row.original;
          return (
            <button
              onClick={() => handleToggleEstado(category)}
              className="group"
              title="Click para cambiar estado"
            >
              <Badge
                variant={isActive ? 'success' : 'neutral'}
                size="xs"
                className="text-xs cursor-pointer group-hover:ring-1 group-hover:ring-offset-1 group-hover:ring-gray-300 transition-all"
              >
                {isActive ? 'Activo' : 'Inactivo'}
              </Badge>
            </button>
          );
        },
        enableSorting: true,
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Acciones',
        cell: (info) => (
          <ActionButtons
            actions={[
              {
                icon: <IconEdit size={18} />,
                onClick: () => handleEdit(info.row.original),
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
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-3 sm:mb-4 opacity-0"
          >
            <IconArrowLeft size={20} />
            <span className="text-sm">Volver</span>
          </button>
          <div ref={headerRef} className="opacity-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Gestiona las Categorías de Platos
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Puedes crear, editar, eliminar o ver información de las categorías de platos
            </p>
          </div>
        </div>
        
        {/* Botón de crear - responsive */}
        <div ref={createButtonRef} className="opacity-0 flex-shrink-0">
          <Button
            variant="gradient"
            icon={<IconPlus size={18} />}
            onClick={handleCreate}
            className="w-full sm:w-auto text-sm!"
          >
            <span className="sm:inline">Nueva Categoría</span>
          </Button>
        </div>
      </div>

      {/* Tabla */}
      <div ref={tableRef} className="opacity-0">
        <Table
          title={<IconCategory />}
          data={categories}
          columns={columns}
          searchable
          searchPlaceholder="Buscar por nombre o código..."
          exportable
          filterable
          pageSize={5}
        />
      </div>

      {/* Slide Panel para Crear/Editar */}
      <SlidePanel
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        title={selectedCategory ? 'Editar Categoría' : 'Nueva Categoría'}
        width="w-full max-w-xl"
      >
        <DishCategoryForm
          category={selectedCategory}
          existingCodes={existingCodes}
          existingNames={existingNames}
          onSubmit={handleSubmit}
          onCancel={handleClosePanel}
          loading={loading}
        />
      </SlidePanel>

      {/* Confirm Dialog para Eliminar */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setCategoryToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Eliminar categoría"
        message={
          <>
            ¿Estás seguro de eliminar la categoría{' '}
            <strong>"{categoryToDelete?.nombre}"</strong>?
            <br />
            <span className="text-gray-500 text-sm">
              Esta acción no se puede deshacer.
            </span>
          </>
        }
        confirmText="Eliminar"
        variant="danger"
        loading={loading}
      />
    </div>
  );
}