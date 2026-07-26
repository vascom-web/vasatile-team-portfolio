import React from 'react';
import { Link } from '../App';

export default function SkillCard({ skill, memberCount }) {
  return (
    <Link to={`/members?skill=${skill.id}`} className="bg-white rounded-2xl p-6 text-center card-hover border border-gray-100">
      <div className="w-12 h-12 mx-auto bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 text-xl">
        <i className={`fas ${skill.icon}`} />
      </div>
      <h3 className="font-semibold text-gray-800 mt-3">{skill.name}</h3>
      <p className="text-xs text-gray-400 mt-1">{memberCount} active</p>
    </Link>
  );
}