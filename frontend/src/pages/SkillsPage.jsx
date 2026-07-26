import React, { useState, useEffect } from 'react';
import { Link } from '../App';
import API from '../services/api';

export default function SkillsPage() {
  const [members, setMembers] = useState([]);
  const skills = API.getSkills();

  useEffect(() => {
    API.getMembers().then(setMembers).catch(console.error);
  }, []);

  return (
    <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900 transition-colors">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Skills</h1>
      <p className="text-gray-500 dark:text-gray-400 mt-1">Select a skill to see available team members</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {skills.map(s => {
          const active = members.filter(m => m.skill === s.id && m.active);
          return (
            <Link
              key={s.id}
              to={`/members?skill=${s.id}`}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 card-hover border border-gray-100 dark:border-gray-700 shadow-sm transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xl flex-shrink-0">
                  <i className={`fas ${s.icon}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">{s.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.desc}</p>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-2 font-medium">
                    {active.length} active members
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}