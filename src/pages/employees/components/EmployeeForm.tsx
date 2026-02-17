import { useState } from 'react';
import Input from '../../../components/ui/FloatingInput';
import Select from '../../../components/ui/Select';
import TextArea from '../../../components/ui/TextArea';
import CurrencyInput from '../../../components/ui/CurrencyInput';
import DateInput from '../../../components/ui/DateInput';
import Button from '../../../components/ui/Button';
import type { SelectOption } from '../../../components/ui/Select';
import type { Employee, EmployeeRole, ContractType, EmployeeStatus } from '../types/Employee';

interface EmployeeFormProps {
  employee?: Employee | null;
  onSubmit: (data: Omit<Employee, 'id'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

const roleOptions: SelectOption[] = [
  { value: 'cocinera', label: 'Cocinera' },
  { value: 'delivery', label: 'Delivery' },
  { value: 'administracion', label: 'Administración' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'contabilidad', label: 'Contabilidad' },
];

const contractOptions: SelectOption[] = [
  { value: 'empleado', label: 'Empleado' },
  { value: 'freelancer', label: 'Freelancer / Servicio' },
];

const statusOptions: SelectOption[] = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
  { value: 'vacaciones', label: 'Vacaciones' },
  { value: 'licencia', label: 'Licencia' },
];

const getInitialFormData = (employee?: Employee | null) => ({
  document: employee?.document ?? '',
  firstName: employee?.firstName ?? '',
  lastName: employee?.lastName ?? '',
  phone: employee?.phone ?? '',
  email: employee?.email ?? '',
  role: employee?.role ?? ('cocinera' as EmployeeRole),
  contractType: employee?.contractType ?? ('empleado' as ContractType),
  startDate: employee?.startDate ?? new Date().toISOString().split('T')[0],
  salary: employee?.salary ?? 0,
  status: employee?.status ?? ('activo' as EmployeeStatus),
  schedule: employee?.schedule ?? '',
  notes: employee?.notes ?? '',
});

export default function EmployeeForm({ employee, onSubmit, onCancel, loading }: EmployeeFormProps) {
  const [formData, setFormData] = useState(() => getInitialFormData(employee));

  const isEditing = !!employee;
  const isFreelancer = formData.contractType === 'freelancer';

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const employeeData: Omit<Employee, 'id'> = {
      document: formData.document,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      email: formData.email,
      role: formData.role,
      contractType: formData.contractType,
      startDate: formData.startDate,
      salary: formData.salary,
      status: formData.status,
      ...(formData.schedule && { schedule: formData.schedule }),
      ...(formData.notes && { notes: formData.notes }),
    };

    onSubmit(employeeData);
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

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Teléfono"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      {/* Información laboral */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Información laboral</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Rol"
              options={roleOptions}
              value={formData.role}
              onChange={(value) => handleChange('role', value)}
              name="role"
              required
            />
            <Select
              label="Tipo de contrato"
              options={contractOptions}
              value={formData.contractType}
              onChange={(value) => handleChange('contractType', value)}
              name="contractType"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <DateInput
              label="Fecha de ingreso"
              value={formData.startDate}
              onChange={(value) => handleChange('startDate', value)}
              required
            />
            <Select
              label="Estado"
              options={statusOptions}
              value={formData.status}
              onChange={(value) => handleChange('status', value)}
              name="status"
              required
            />
          </div>

          <CurrencyInput
            label={isFreelancer ? 'Tarifa mensual (Gs.)' : 'Salario mensual (Gs.)'}
            value={formData.salary}
            onChange={(value) => handleChange('salary', value)}
            required
          />

          {!isFreelancer && (
            <Input
              label="Horario (ej: Lun-Sáb 8:00-16:00)"
              value={formData.schedule}
              onChange={(e) => handleChange('schedule', e.target.value)}
            />
          )}
        </div>
      </div>

      {/* Notas */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Observaciones</h3>
        <TextArea
          label="Notas adicionales"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={3}
        />
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
          {loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear empleado'}
        </Button>
      </div>
    </form>
  );
}