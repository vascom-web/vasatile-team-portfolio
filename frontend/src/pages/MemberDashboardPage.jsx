import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from '../App';
import API from '../services/api';
import RequestCard from '../components/RequestCard';

export default function MemberDashboardPage() {
  const { member, logoutMember } = useAuth();
  const { navigate } = useRouter();
  const [requests, setRequests] = useState([]);

  // 🔁 Refresh requests function – stable because it's wrapped in useCallback
  const refreshRequests = useCallback(() => {
    if (member) {
      API.getRequestsByMember()
        .then(setRequests)
        .catch(console.error);
    }
  }, [member]);

  // 🔄 Fetch requests on mount and when member/navigate changes
  useEffect(() => {
    if (!member) {
      navigate('/member/login');
    } else {
      refreshRequests();
    }
  }, [member, navigate, refreshRequests]);

  if (!member) return null;

  return (
    <div className="pt-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome, {member.name}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Here are your assigned requests
          </p>
        </div>
        <button
          onClick={() => {
            logoutMember();
            window.location.hash = '/';
          }}
          className="px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition"
        >
          Logout
        </button>
      </div>

      <div className="mt-8 space-y-4">
        {requests.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 text-center text-gray-400 dark:text-gray-500">
            <i className="fas fa-inbox text-3xl block mb-3" />
            No requests assigned yet. Check back later.
          </div>
        ) : (
          requests.map((req) => (
            <RequestCard
              key={req._id}
              request={req}
              onUpdate={refreshRequests}
            />
          ))
        )}
      </div>
    </div>
  );
}