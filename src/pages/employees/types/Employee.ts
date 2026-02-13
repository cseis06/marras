export type EmployeeRole = 
  | 'cocinera' 
  | 'delivery' 
  | 'administracion' 
  | 'marketing' 
  | 'contabilidad';

export type ContractType = 'empleado' | 'freelancer';

export type EmployeeStatus = 'activo' | 'inactivo' | 'vacaciones' | 'licencia';

export interface Employee {
  id: string;
  document: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  role: EmployeeRole;
  contractType: ContractType;
  startDate: string; // ISO date string
  salary: number; // Guaraníes - salario mensual o tarifa por servicio
  status: EmployeeStatus;
  schedule?: string; // Ej: "Lun-Vie 8:00-16:00"
  notes?: string;
}