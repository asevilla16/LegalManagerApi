export class CaseType {
  id: number;
  name: string;
  code: string;
  category: string; //'CIVIL' | 'CRIMINAL' | 'FAMILY' | 'LABOR' | 'COMMERCIAL' | 'ADMINISTRATIVE' | 'TAX' | 'MIXED';
  statuteOfLimitationDays?: number;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
