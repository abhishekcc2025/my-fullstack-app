
import React from 'react';
import { CRMEntry } from '../types';
import { ExclamationTriangleIcon, XMarkIcon } from './icons';

interface TodayRemindersAlertProps {
  reminders: CRMEntry[];
  onClose: () => void;
}

const TodayRemindersAlert: React.FC<TodayRemindersAlertProps> = ({ reminders, onClose }) => {
  if (reminders.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-5 right-5 z-[100] w-full max-w-md p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 shadow-lg rounded-md" role="alert">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
        </div>
        <div className="ml-3 flex-grow">
          <p className="font-bold">Today's Reminders!</p>
          <p className="text-sm mb-2">The following contacts need your attention today:</p>
          <ul className="list-disc list-inside space-y-1 text-sm max-h-60 overflow-y-auto pr-2">
            {reminders.map(entry => (
              <li key={entry.id}>
                <strong>{entry.name}</strong>: {entry.description.substring(0,50)}{entry.description.length > 50 ? '...' : ''}
              </li>
            ))}
          </ul>
        </div>
        <button 
          onClick={onClose} 
          className="ml-auto -mx-1.5 -my-1.5 bg-yellow-100 text-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-400 p-1.5 hover:bg-yellow-200 inline-flex h-8 w-8 items-center justify-center"
          aria-label="Close"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TodayRemindersAlert;
    