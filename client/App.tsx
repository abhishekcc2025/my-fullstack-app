
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import CRMList from './components/CRMList';
import CRMForm from './components/CRMForm';
import TodayRemindersAlert from './components/TodayRemindersAlert';
import { PlusIcon, ExclamationTriangleIcon } from './components/icons';
import { CRMEntry, CRMEntryFormData } from './types';
import * as crmService from './services/crmService';

const App: React.FC = () => {
  const [entries, setEntries] = useState<CRMEntry[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingEntry, setEditingEntry] = useState<CRMEntry | null>(null);
  const [todaysReminders, setTodaysReminders] = useState<CRMEntry[]>([]);
  const [showTodaysRemindersAlert, setShowTodaysRemindersAlert] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadEntries = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const loadedEntries = await crmService.getEntries();
      setEntries(loadedEntries);
    } catch (err: any) {
      console.error("Failed to load entries:", err);
      setError(err.message || "Failed to load entries. Please ensure the backend server is running and accessible.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  useEffect(() => {
    // This effect runs after entries are loaded or changed
    if (!isLoading && !error) { // Only calculate reminders if entries are successfully loaded
        const currentTodaysReminders = crmService.getTodaysReminders(entries);
        setTodaysReminders(currentTodaysReminders);
        if (currentTodaysReminders.length > 0) {
        setShowTodaysRemindersAlert(true);
        } else {
        setShowTodaysRemindersAlert(false);
        }
    } else {
        // If loading or error, clear reminders
        setTodaysReminders([]);
        setShowTodaysRemindersAlert(false);
    }
  }, [entries, isLoading, error]);

  const handleFormSubmit = async (entryData: CRMEntryFormData) => {
    setIsSubmitting(true);
    setError(null);
    let success = false;
    try {
      if (editingEntry) {
        const updated = await crmService.updateEntry(editingEntry.id, entryData);
        if (updated) success = true;
      } else {
        const added = await crmService.addEntry(entryData);
        if (added) success = true;
      }

      if (success) {
        await loadEntries(); // Reload all entries
        setShowForm(false);
        setEditingEntry(null);
      } else {
        // This case might not be reached if crmService throws on failure
        setError(`Failed to ${editingEntry ? 'update' : 'add'} entry. The server might be down or the request was invalid.`);
      }
    } catch (err: any) {
      console.error("Failed to submit form:", err);
      setError(err.message || `An unexpected error occurred while ${editingEntry ? 'updating' : 'adding'} the entry. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditEntry = (entry: CRMEntry) => {
    setEditingEntry(entry);
    setError(null); // Clear previous errors
    setShowForm(true);
  };

  const handleDeleteEntry = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setError(null);
      // Optionally set a specific deleting state for the item
      try {
        const success = await crmService.deleteEntry(id);
        if (success) {
          await loadEntries(); // Reload all entries
        } else {
          // This case might not be reached if crmService throws on failure
          setError("Failed to delete entry. Please try again.");
        }
      } catch (err: any) {
        console.error("Failed to delete entry:", err);
        setError(err.message || "An unexpected error occurred while deleting. Please try again.");
      }
    }
  };

  const openAddForm = () => {
    setEditingEntry(null);
    setError(null); // Clear previous errors
    setShowForm(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {showTodaysRemindersAlert && todaysReminders.length > 0 && (
        <TodayRemindersAlert 
          reminders={todaysReminders} 
          onClose={() => setShowTodaysRemindersAlert(false)} 
        />
      )}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-neutral-dark">Contacts</h1>
          <button
            onClick={openAddForm}
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out flex items-center space-x-2 disabled:opacity-50"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add New Entry</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow" role="alert">
            <div className="flex">
              <div className="py-1"><ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-3" /></div>
              <div>
                <p className="font-bold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {isLoading && <p className="text-center text-gray-500 py-10 text-lg">Loading entries...</p>}
        
        {!isLoading && !error && entries.length === 0 && (
             <p className="text-center text-gray-500 py-10 text-lg">No entries yet. Add one to get started or check if the backend is connected!</p>
        )}

        {!isLoading && !error && entries.length > 0 && (
          <CRMList entries={entries} onEdit={handleEditEntry} onDelete={handleDeleteEntry} />
        )}

        {showForm && (
          <CRMForm
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingEntry(null);
              setError(null); // Clear error when closing form
            }}
            initialData={editingEntry || undefined}
            isSubmitting={isSubmitting} // Pass submitting state to form
          />
        )}
      </main>
      <footer className="bg-neutral-dark text-center text-neutral-light py-4 mt-auto">
        <p>&copy; {new Date().getFullYear()} Simple CRM. Data managed via API.</p>
      </footer>
    </div>
  );
};

export default App;
