export class Case {
  id: number;
  lawFirmId: number;
  caseNumber: string;
  courtCaseNumber?: string;
  title: string;
  caseTypeId: number;
  description?: string;
  caseStatusId: number;
  courtTypeId?: number;
  filingDate: Date;
  primaryAttorneyId?: string;
  originatingAttorneyId?: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}
