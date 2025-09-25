export class Client {
  id: number;
  lawFirmId: number;
  clientType: string; // 'INDIVIDUAL', 'CORPORATE', 'GOVERNMENT'

  // Individual client fields
  firstName?: string;
  lastName?: string;
  middleName?: string;
  identityDocument?: string;
  birthDate?: Date;
  gender?: string;

  // Corporate client fields
  companyName?: string;
  taxId?: string;
  registrationNumber?: string;
  legalRepresentative?: string;

  // Common fields
  address?: string;
  city?: string;
  department?: string;
  postalCode?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  occupation?: string;

  isActive: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
}
