
import { CRMEntry, CRMEntryFormData } from '../types';
// LOCAL_STORAGE_KEY is no longer used
// import { LOCAL_STORAGE_KEY } from '../constants';

const API_BASE_URL = 'https://crm-backend-d8ll.onrender.com'; // Replace with your actual API base URL if different

export const getEntries = async (): Promise<CRMEntry[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/entries`);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error fetching entries: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to fetch entries: ${response.status} ${errorText || response.statusText}`);
    }
    return await response.json() as CRMEntry[];
  } catch (error) {
    console.error("Error in getEntries:", error);
    // Propagate error to be handled by UI
    throw error;
  }
};

// saveEntries function is removed as data is managed by the backend

export const addEntry = async (entryData: CRMEntryFormData): Promise<CRMEntry | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/entries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entryData),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error adding entry: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to add entry: ${response.status} ${errorText || response.statusText}`);
    }
    return await response.json() as CRMEntry;
  } catch (error) {
    console.error("Error in addEntry:", error);
    throw error;
  }
};

export const updateEntry = async (id: string, entryData: CRMEntryFormData): Promise<CRMEntry | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/entries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entryData),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error updating entry ${id}: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to update entry ${id}: ${response.status} ${errorText || response.statusText}`);
    }
    return await response.json() as CRMEntry;
  } catch (error) {
    console.error(`Error in updateEntry for ${id}:`, error);
    throw error;
  }
};

export const deleteEntry = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/entries/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error deleting entry ${id}: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to delete entry ${id}: ${response.status} ${errorText || response.statusText}`);
    }
    // Assuming backend returns 200/204 on successful deletion
    return true; 
  } catch (error) {
    console.error(`Error in deleteEntry for ${id}:`, error);
    throw error;
  }
};

export const getTodaysDateISO = (): string => {
  return new Date().toISOString().split('T')[0];
}

// getTodaysReminders will operate on data fetched from the backend
export const getTodaysReminders = (entries: CRMEntry[]): CRMEntry[] => {
  const today = getTodaysDateISO();
  return entries.filter(entry => entry.reminderDate === today);
};
