
export interface CRMEntry {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  description: string;
  reminderDate: string; // YYYY-MM-DD format
  createdAt: string; // ISO string
}

export type CRMEntryFormData = Omit<CRMEntry, 'id' | 'createdAt'>;
    