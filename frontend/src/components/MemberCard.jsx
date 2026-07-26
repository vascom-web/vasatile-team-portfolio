import React from 'react';
import { Link } from '../App';

export default function MemberCard({ member, skill }) {
  return (
    <Link to={`/member/${member._id}`} className="bg-white rounded-2xl card-hover border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-4">
          <img
            src={member.profileImage || 'https://i.pravatar.cc/300?img=' + member._id}
            alt={member.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-800 truncate">{member.name}</h3>
            <p className="text-sm text-indigo-600">{skill?.name || 'General'}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${member.active ? 'bg-green-500 active-dot' : 'bg-gray-300'}`} />
              <span className="text-xs text-gray-500">{member.active ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-3 line-clamp-2">{member.bio || 'Professional team member'}</p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700">${member.rate || 20}/day</span>
          <span className="text-indigo-600 font-medium">Hire →</span>
        </div>
      </div>
    </Link>
  );
}