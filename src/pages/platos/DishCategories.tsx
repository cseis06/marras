import { useState, useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconCategory,
  IconArrowLeft,
} from '@tabler/icons-react';
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

  // Data state
  const [categories, setCategories] = useState<DishCategory[]>(initialCategories);

  // UI state
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<DishCategory | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<DishCategory | null>(null);
  const [loading, setLoading] = useState(false);

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
                className="cursor-pointer group-hover:ring-2 group-hover:ring-offset-1 group-hover:ring-gray-300 transition-all"
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
    <div className="max-w-7xl mx-auto px-4 sm:px-2 lg:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-4"
            >
              <IconArrowLeft size={20} />
              <span className="text-sm">Volver</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Gestiona las Categorías de Platos</h1>
            <p className="text-sm text-gray-500 mt-1">
              Puedes crear, editar o eliminar o ver información de las categorías de platos
            </p>
          </div>
        </div>
        <Button
          variant="gradient"
          icon={<IconPlus size={18} />}
          onClick={handleCreate}
          className='max-w-50 text-sm!'
        >
          Nueva Categoría
        </Button>
      </div>

      {/* Tabla */}
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

      {/* Slide Panel para Crear/Editar */}
      <SlidePanel
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        title={selectedCategory ? 'Editar Categoría' : 'Nueva Categoría'}
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