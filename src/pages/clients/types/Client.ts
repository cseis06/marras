export interface Location {
  id: string;
  alias: string;
  address: string;
  city: string;
  neighborhood: string;
  reference?: string;
}

export type DelinquencyStatus = 'al_dia' | 'pendiente' | 'atrasado' | 'moroso';

export interface Client {
  id: string;
  document: string;
  firstName: string;
  lastName: string;
  phone: string;
  locations: Location[];
  delinquencyStatus: DelinquencyStatus;
}