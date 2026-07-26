import React, { useState, useEffect } from 'react';
import API from '../services/api';

const defaultForm = {
  name: '',
  email: '',
  password: '',
  telegramChatId: '',          // 👈 changed from whatsapp
  skill: 'technical-writer',
  bio: '',
  rate: 20,
  active: true,
  profileImage: 'https://i.pravatar.cc/300?img=' + Math.floor(Math.random() * 70)
};

export default function AdminMemberForm({ initialData, onSubmit, onCancel, isEditing }) {
  const skills = API.getSkills();
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...defaultForm,
        ...initialData,
        name: initialData.name || '',
        email: initialData.email || '',
        password: '',
        telegramChatId: initialData.telegramChatId || '',   // 👈 changed
        skill: initialData.skill || 'technical-writer',
        bio: initialData.bio || '',
        rate: initialData.rate ?? 20,
        active: initialData.active !== undefined ? initialData.active : true,
        profileImage: initialData.profileImage || defaultForm.profileImage
      });
    } else {
      setForm({
        ...defaultForm,
        password: 'pass123',
        telegramChatId: '',                                  // 👈 changed
        skill: 'technical-writer',
        profileImage: 'https://i.pravatar.cc/300?img=' + Math.floor(Math.random() * 70)
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 transition-colors">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          {isEditing ? 'Edit Member' : 'Register New Member'}
        </h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name *</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-400 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email *</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-400 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password *</label>
            <input type="text" name="password" value={form.password} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-400 outline-none" required={!isEditing} placeholder={isEditing ? 'Leave blank to keep current' : 'pass123'} />
          </div>
          {/* 👇 Telegram Chat ID field (replaces WhatsApp) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Telegram Chat ID *</label>
            <input
              type="text"
              name="telegramChatId"
              value={form.telegramChatId}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-400 outline-none"
              placeholder="e.g., 123456789"
              required
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Get your Chat ID by messaging @userinfobot on Telegram.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Skill *</label>
            <select name="skill" value={form.skill} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-400 outline-none">
              {skills.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
            <textarea name="bio" value={form.bio} onChange={handleChange} rows={2} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-400 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rate ($/day)</label>
            <input type="number" name="rate" value={form.rate} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-400 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Profile Image URL</label>
            <input type="text" name="profileImage" value={form.profileImage} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-400 outline-none" placeholder="https://..." />
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <input type="checkbox" name="active" checked={form.active} onChange={handleChange} className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Active
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition">
              {isEditing ? 'Update' : 'Register'}
            </button>
            <button type="button" onClick={onCancel} className="flex-1 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}