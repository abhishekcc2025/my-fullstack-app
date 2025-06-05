
import React, { useState, useEffect } from 'react';
import { CRMEntry, CRMEntryFormData } from '../types';
import { getTodaysDateISO } from '../services/crmService';

interface CRMFormProps {
  onSubmit: (entryData: CRMEntryFormData) => void;
  onCancel: () => void;
  initialData?: CRMEntry;
  isSubmitting?: boolean; // New prop
}

const CRMForm: React.FC<CRMFormProps> = ({ onSubmit, onCancel, initialData, isSubmitting }) => {
  const [formData, setFormData] = useState<CRMEntryFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    description: '',
    reminderDate: getTodaysDateISO(),
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email || '',
        phone: initialData.phone || '',
        company: initialData.company || '',
        description: initialData.description,
        reminderDate: initialData.reminderDate,
      });
    } else {
       // Reset to default for new entry
       setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        description: '',
        reminderDate: getTodaysDateISO(),
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.reminderDate) {
      alert('Name, Description, and Reminder Date are required.');
      return;
    }
    if (isSubmitting) return; // Prevent multiple submissions
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-neutral-dark mb-6">
          {initialData ? 'Edit Entry' : 'Add New Entry'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-50"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-50"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={isSubmitting}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-50"
            />
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
            <input
              type="text"
              name="company"
              id="company"
              value={formData.company}
              onChange={handleChange}
              disabled={isSubmitting}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-50"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              required
              disabled={isSubmitting}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-50"
            />
          </div>
          <div>
            <label htmlFor="reminderDate" className="block text-sm font-medium text-gray-700">Next Reminder Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              name="reminderDate"
              id="reminderDate"
              value={formData.reminderDate}
              onChange={handleChange}
              required
              min={getTodaysDateISO()} 
              disabled={isSubmitting}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-50"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-neutral-light hover:bg-neutral rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {isSubmitting ? (initialData ? 'Saving...' : 'Adding...') : (initialData ? 'Save Changes' : 'Add Entry')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CRMForm;
