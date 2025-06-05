
import React from 'react';
import { CRMEntry } from '../types';
import CRMListItem from './CRMListItem';

interface CRMListProps {
  entries: CRMEntry[];
  onEdit: (entry: CRMEntry) => void;
  onDelete: (id: string) => void;
}

const CRMList: React.FC<CRMListProps> = ({ entries, onEdit, onDelete }) => {
  if (entries.length === 0) {
    return <p className="text-center text-gray-500 py-8">No entries yet. Add one to get started!</p>;
  }

  // Sort entries by reminder date (soonest first), then by creation date (newest first if reminder dates are same)
  const sortedEntries = [...entries].sort((a, b) => {
    const dateA = new Date(a.reminderDate).getTime();
    const dateB = new Date(b.reminderDate).getTime();
    if (dateA !== dateB) {
      return dateA - dateB;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });


  return (
    <ul className="space-y-4">
      {sortedEntries.map(entry => (
        <CRMListItem
          key={entry.id}
          entry={entry}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};

export default CRMList;
    