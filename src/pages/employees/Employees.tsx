import { useMemo, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import {
  IconEdit,
  IconTrash,
  IconPlus,
  IconUsersGroup,
  IconArrowLeft,
  IconBriefcase,
  IconMoped,
  IconChefHat,
  IconSpeakerphone,
  IconCalculator,
} from '@tabler/icons-react';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ActionButtons from '../../components/ui/ActionButtons';
import SlidePanel from '../../components/ui/SlidePanel';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmployeeForm from './EmployeeForm';
import { employees as initialEmployees } from './data/Employees';
import type { Employee, EmployeeRole, ContractType, EmployeeStatus } from './types/Employee';
import { useNavigate } from 'react-router-dom';

const columnHelper = createColumnHelper<Employee>();

const statusConfig: Record<EmployeeStatus, { label: string; variant: 'success' | 'warning' | 'error' | 'neutral' }> = {
  activo: { label: 'Activo', variant: 'success' },
  inactivo: { label: 'Inactivo', variant: 'error' },
  vacaciones: { label: 'Vacaciones', variant: 'warning' },
  licencia: { label: 'Licencia', variant: 'neutral' },
};

const contractConfig: Record<ContractType, { label: string; variant: 'success' | 'neutral' }> = {
  empleado: { label: 'Empleado', variant: 'success' },
  freelancer: { label: 'Freelancer', variant: 'neutral' },
};

const roleConfig: Record<EmployeeRole, { label: string; icon: React.ReactNode }> = {
  cocinera: { label: 'Cocinera', icon: <IconChefHat size={16} className="text-orange-500" /> },
  delivery: { label: 'Delivery', icon: <IconMoped size={16} className="text-blue-500" /> },
  administracion: { label: 'Administración', icon: <IconBriefcase size={16} className="text-purple-500" /> },
  marketing: { label: 'Marketing', icon: <IconSpeakerphone size={16} className="text-pink-500" /> },
  contabilidad: { label: 'Contabilidad', icon: <IconCalculator size={16} className="text-emerald-500" /> },
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-PY', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export default function Employees() {
  const navigate = useNavigate();

  // Estado de datos
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);

  // Estado del SlidePanel
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado del ConfirmDialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handlers del SlidePanel
  const handleCreate = () => {
    setSelectedEmployee(null);
    setIsPanelOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedEmployee(null);
  };

  const handleSubmit = async (data: Omit<Employee, 'id'>) => {
    setIsSubmitting(true);

    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (selectedEmployee) {
      // Editar
      setEmployees((prev) =>
        prev.map((e) =>
          e.id === selectedEmployee.id ? { ...data, id: selectedEmployee.id } : e
        )
      );
    } else {
      // Crear
      const newEmployee: Employee = {
        ...data,
        id: `${Date.now()}`,
      };
      setEmployees((prev) => [newEmployee, ...prev]);
    }

    setIsSubmitting(false);
    handleClosePanel();
  };

  // Handlers del ConfirmDialog
  const handleDeleteClick = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;

    setIsDeleting(true);

    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 600));

    setEmployees((prev) => prev.filter((e) => e.id !== employeeToDelete.id));

    setIsDeleting(false);
    setIsDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  // Otros handlers
  const handleExport = () => {
    console.log('Exportar empleados');
    // TODO: descargar excel
  };

  const handleFilter = () => {
    console.log('Abrir filtros');
    // TODO: modal de filtros
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('document', {
        header: 'Cédula',
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      }),
      columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
        id: 'fullName',
        header: 'Nombre',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('role', {
        header: 'Rol',
        cell: (info) => {
          const role = info.getValue();
          const config = roleConfig[role];
          return (
            <span className="flex items-center gap-1.5">
              {config.icon}
              <span className="text-xs">{config.label}</span>
            </span>
          );
        },
      }),
      columnHelper.accessor('contractType', {
        header: 'Contrato',
        cell: (info) => {
          const type = info.getValue();
          const config = contractConfig[type];
          return <Badge variant={config.variant} size="xxs">{config.label}</Badge>;
        },
      }),
      columnHelper.accessor('salary', {
        header: 'Salario/Tarifa',
        cell: (info) => (
          <span className="text-xs text-gray-700">{formatCurrency(info.getValue())}</span>
        ),
      }),
      columnHelper.accessor('startDate', {
        header: 'Ingreso',
        cell: (info) => (
          <span className="text-xs text-gray-600">{formatDate(info.getValue())}</span>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'Estado',
        cell: (info) => {
          const status = info.getValue();
          const config = statusConfig[status];
          return <Badge variant={config.variant} size="xxs">{config.label}</Badge>;
        },
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
      {/* Header con botón crear */}
      <div className="flex items-center justify-between">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-4"
          >
            <IconArrowLeft size={20} />
            <span className="text-sm">Volver</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Gestiona a los Empleados</h1>
          <p className="text-sm text-gray-500 mt-1">
            Administra empleados y servicios contratados del negocio
          </p>
        </div>
        <Button
          variant="gradient"
          icon={<IconPlus size={18} />}
          onClick={handleCreate}
          className="max-w-50 text-sm!"
        >
          Nuevo Empleado
        </Button>
      </div>

      {/* Tabla */}
      <Table<Employee>
        title={<IconUsersGroup />}
        data={employees}
        columns={columns}
        searchPlaceholder="Buscar empleado..."
        onExport={handleExport}
        onFilter={handleFilter}
        pageSize={5}
      />

      {/* SlidePanel para Crear/Editar */}
      <SlidePanel
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        title={selectedEmployee ? 'Editar Empleado' : 'Nuevo Empleado'}
        width="w-full max-w-xl"
      >
        <EmployeeForm
          key={selectedEmployee?.id ?? 'new'}
          employee={selectedEmployee}
          onSubmit={handleSubmit}
          onCancel={handleClosePanel}
          loading={isSubmitting}
        />
      </SlidePanel>

      {/* ConfirmDialog para Eliminar */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Eliminar empleado"
        message={
          <>
            ¿Estás seguro de eliminar a{' '}
            <span className="font-semibold">
              {employeeToDelete?.firstName} {employeeToDelete?.lastName}
            </span>
            ? Esta acción no se puede deshacer.
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