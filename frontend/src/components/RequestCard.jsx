import React from 'react';
import { Link } from '../App';  // ✅ import Link for navigation
import { useToast } from '../contexts/ToastContext';
import API from '../services/api';

export default function RequestCard({ request, onUpdate }) {
  const { addToast } = useToast();

  const daysLeft = Math.max(0, Math.ceil(
    (new Date(request.createdAt).getTime() + request.deliveryDays * 86400000 - Date.now()) / 86400000
  ));

  const handleStatusUpdate = (status) => {
    API.updateRequestStatus(request._id, status)
      .then(() => {
        onUpdate();
        addToast(`Request ${status}`, 'success');
      })
      .catch(err => addToast(err.message, 'error'));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm card-hover transition-colors">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-lg">
              {request.code}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              request.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
              request.status === 'in-progress' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
              'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
            }`}>
              {request.status}
            </span>
          </div>
          <p className="font-medium text-gray-800 dark:text-gray-200 mt-2">Client: {request.clientName}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{request.clientEmail}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-wrap">{request.description}</p>
          {request.attachment && (
            <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
              <i className="fas fa-paperclip mr-1" /> Attachment included
            </p>
          )}
        </div>
        <div className="text-right text-sm">
          <p className="font-medium text-gray-700 dark:text-gray-300">${request.price}</p>
          <p className="text-gray-500 dark:text-gray-400">Due in {daysLeft} day{daysLeft !== 1 ? 's' : ''}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {new Date(request.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex flex-wrap gap-3">
        {request.status === 'pending' && (
          <button
            onClick={() => handleStatusUpdate('in-progress')}
            className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition"
          >
            Start Work
          </button>
        )}
        {(request.status === 'pending' || request.status === 'in-progress') && (
          <button
            onClick={() => handleStatusUpdate('completed')}
            className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition"
          >
            Complete
          </button>
        )}
        {/* ✅ View Details link */}
        <Link
          to={`/request/${request.code}`}
          className="px-4 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}