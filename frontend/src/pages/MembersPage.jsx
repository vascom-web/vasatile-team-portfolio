import React, { useState, useEffect } from 'react';
import { useRouter } from '../App';   // 👈 removed Link (not used)
import API from '../services/api';
import MemberCard from '../components/MemberCard';

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [skillFilter, setSkillFilter] = useState(null);
  const { route } = useRouter();
  const skills = API.getSkills();

  useEffect(() => {
    API.getMembers()
      .then(setMembers)
      .catch(console.error);
  }, []);

  useEffect(() => {
    const queryStart = route.indexOf('?');
    if (queryStart !== -1) {
      const queryString = route.substring(queryStart + 1);
      const params = new URLSearchParams(queryString);
      const skill = params.get('skill');
      setSkillFilter(skill);
    } else {
      setSkillFilter(null);
    }
  }, [route]);

  const filtered = skillFilter ? members.filter(m => m.skill === skillFilter) : members;
  const activeMembers = filtered.filter(m => m.active);
  const getSkillName = (id) => skills.find(s => s.id === id)?.name || id;

  return (
    <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team Members</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {activeMembers.length} active members {skillFilter ? `in ${getSkillName(skillFilter)}` : ''}
          </p>
        </div>
        {skillFilter && (
          <button
            onClick={() => {
              setSkillFilter(null);
              window.location.hash = '/members';
            }}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800"
          >
            Clear filter
          </button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {activeMembers.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400 dark:text-gray-500">
            No active members found for this skill.
          </div>
        ) : (
          activeMembers.map(m => {
            const skill = skills.find(s => s.id === m.skill);
            return <MemberCard key={m._id} member={m} skill={skill} />;
          })
        )}
      </div>
    </div>
  );
}