export enum UserRole {
  PARTNER = 'PARTNER',
  ASSOCIATE = 'ASSOCIATE',
  PARALEGAL = 'PARALEGAL',
  ADMIN = 'ADMIN',
  SECRETARY = 'SECRETARY',
}

export class User {
  id: string;
  lawFirmId?: number;
  username: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  role: UserRole; // 'PARTNER', 'ASSOCIATE', 'PARALEGAL', 'ADMIN', 'SECRETARY'
  barNumber?: string;
  barRegistrationDate?: Date;
  phone?: string;
  isAttorney: boolean;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
