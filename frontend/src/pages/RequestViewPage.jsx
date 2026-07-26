import React, { useState, useEffect } from 'react';
import { useRouter } from '../App';
import API from '../services/api';

export default function RequestViewPage() {
  const { route } = useRouter();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const code = route.split('/request/')[1]?.split('?')[0];

  useEffect(() => {
    if (code) {
      API.getRequestByCode(code)
        .then(data => {
          setRequest(data);
          setLoading(false);
        })
        .catch(err => {
          setError('Request not found or invalid code');
          setLoading(false);
        });
    } else {
      setError('No code provided');
      setLoading(false);
    }
  }, [code]);

  if (loading) {
    return (
      <div className="pt-20 max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 dark:text-gray-400">Loading request...</p>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="pt-20 max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8">
          <p className="text-red-600 dark:text-red-400">{error || 'Request not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Request Details</h1>
        <div className="space-y-4">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Client</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">{request.clientName}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{request.clientEmail}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Delivery</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">{request.deliveryDays} day{request.deliveryDays > 1 ? 's' : ''}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Price: ${request.price}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{request.description}</p>
          </div>
          {request.attachment && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Attachment</p>
              <p className="text-indigo-600 dark:text-indigo-400"><i className="fas fa-paperclip mr-1" /> File attached</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
            <p className="text-gray-600 dark:text-gray-300">{new Date(request.createdAt).toLocaleString()}</p>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Assigned to</p>
            <p className="font-medium text-gray-800 dark:text-gray-200">{request.memberName} ({request.memberEmail})</p>
          </div>
        </div>
      </div>
    </div>
  );
}