
import React from 'react';
import { CRMEntry } from '../types';
import { PencilIcon, TrashIcon, CalendarDaysIcon } from './icons';
import { getTodaysDateISO } from '../services/crmService';

interface CRMListItemProps {
  entry: CRMEntry;
  onEdit: (entry: CRMEntry) => void;
  onDelete: (id: string) => void;
}

const CRMListItem: React.FC<CRMListItemProps> = ({ entry, onEdit, onDelete }) => {
  const isTodayReminder = entry.reminderDate === getTodaysDateISO();
  const reminderDateObj = new Date(entry.reminderDate ); // Ensure correct date parsing
  const formattedReminderDate = reminderDateObj.toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <li className={`bg-white shadow-lg rounded-lg p-4 mb-4 transition-all duration-300 hover:shadow-xl ${isTodayReminder ? 'border-l-4 border-secondary' : 'border-l-4 border-transparent'}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex-grow mb-3 sm:mb-0">
          <h3 className={`text-xl font-semibold ${isTodayReminder ? 'text-secondary-dark' : 'text-primary-dark'}`}>{entry.name}</h3>
          {entry.company && <p className="text-sm text-gray-600">{entry.company}</p>}
          <p className="text-sm text-gray-700 mt-1">{entry.description}</p>
          <div className="flex items-center text-sm text-gray-500 mt-2">
            <CalendarDaysIcon className="w-4 h-4 mr-1.5 text-primary" />
            <span>Reminder: {formattedReminderDate}</span>
            {isTodayReminder && <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-secondary text-secondary-dark rounded-full">TODAY!</span>}
          </div>
        </div>
        <div className="flex-shrink-0 flex space-x-2 mt-2 sm:mt-0">
          <button
            onClick={() => onEdit(entry)}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors duration-150"
            aria-label="Edit"
          >
            <PencilIcon />
          </button>
          <button
            onClick={() => onDelete(entry.id)}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors duration-150"
            aria-label="Delete"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
      {(entry.email || entry.phone) && (
        <div className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-600 space-y-1">
          {entry.email && <p><strong>Email:</strong> {entry.email}</p>}
          {entry.phone && <p><strong>Phone:</strong> {entry.phone}</p>}
        </div>
      )}
    </li>
  );
};

export default CRMListItem;
    
