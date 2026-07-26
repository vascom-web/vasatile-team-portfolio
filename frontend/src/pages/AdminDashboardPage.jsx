import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useRouter } from '../App';
import API from '../services/api';
import AdminMemberForm from '../components/AdminMemberForm';
import ConfirmModal from '../components/ConfirmModal';
import PromptModal from '../components/PromptModal';

export default function AdminDashboardPage() {
  const { admin, logoutAdmin } = useAuth();
  const { addToast } = useToast();
  const { navigate } = useRouter();
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [images, setImages] = useState([]);

  // Modal states
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });
  const [promptModal, setPromptModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    initialValue: '',
    onConfirm: null
  });

  const refreshMembers = () => {
    API.getMembers().then(setMembers).catch(console.error);
  };
  const refreshImages = () => {
    API.getImages().then(setImages).catch(console.error);
  };

  useEffect(() => {
    if (!admin) navigate('/admin/login');
    else {
      refreshMembers();
      refreshImages();
    }
  }, [admin, navigate]);

  const handleRegister = async (formData) => {
    try {
      await API.registerMember(formData);
      addToast('Member registered successfully!', 'success');
      setShowForm(false);
      refreshMembers();
    } catch (err) { addToast(err.message, 'error'); }
  };

  const handleUpdate = async (formData) => {
    try {
      // Use editingMember._id instead of editingMember.id
      await API.updateMember(editingMember._id, formData);
      addToast('Member updated!', 'success');
      setEditingMember(null);
      setShowForm(false);
      refreshMembers();
    } catch (err) { addToast(err.message, 'error'); }
  };

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Member',
      message: 'Are you sure you want to delete this member? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await API.deleteMember(id);
          refreshMembers();
          addToast('Member deleted', 'info');
        } catch (err) { addToast(err.message, 'error'); }
        setConfirmModal({ ...confirmModal, isOpen: false });
      }
    });
  };

  const handleToggleActive = (id) => {
    API.toggleMemberActive(id)
      .then(() => {
        refreshMembers();
        addToast('Status toggled', 'info');
      })
      .catch(err => addToast(err.message, 'error'));
  };

  const handleImageUpdate = (id, currentUrl) => {
    setPromptModal({
      isOpen: true,
      title: 'Update Image URL',
      message: `Enter new URL for "${id}":`,
      initialValue: currentUrl,
      onConfirm: async (newUrl) => {
        if (newUrl && newUrl.trim()) {
          try {
            await API.updateImage(id, newUrl.trim());
            refreshImages();
            addToast('Image updated!', 'success');
          } catch (err) { addToast(err.message, 'error'); }
        }
        setPromptModal({ ...promptModal, isOpen: false });
      }
    });
  };

  const skills = API.getSkills();

  if (!admin) return null;

  return (
    <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your team members and images</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { setShowForm(true); setEditingMember(null); }} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition">
            <i className="fas fa-plus mr-1" /> Register Member
          </button>
          <button onClick={logoutAdmin} className="px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition">Logout</button>
        </div>
      </div>

      {showForm && (
        <AdminMemberForm
          initialData={editingMember || undefined}
          onSubmit={editingMember ? handleUpdate : handleRegister}
          onCancel={() => { setShowForm(false); setEditingMember(null); }}
          isEditing={!!editingMember}
        />
      )}

      <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300">
              <tr>
                <th className="px-4 py-3 text-left">Member</th>
                <th className="px-4 py-3 text-left">Skill</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Rate</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {members.map(m => {
                const skill = skills.find(s => s.id === m.skill);
                return (
                  <tr key={m._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <td className="px-4 py-3 flex items-center gap-3">
                      <img src={m.profileImage || 'https://i.pravatar.cc/300?img=' + m._id} alt={m.name} className="w-8 h-8 rounded-full object-cover" />
                      <span className="font-medium text-gray-800 dark:text-gray-200">{m.name}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{skill?.name || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">{m.email}</td>
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">${m.rate}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${m.active ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${m.active ? 'bg-green-500' : 'bg-gray-400'}`} />
                        {m.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingMember(m); setShowForm(true); }} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-xs font-medium">Edit</button>
                        <button onClick={() => handleToggleActive(m._id)} className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 text-xs font-medium">{m.active ? 'Deactivate' : 'Activate'}</button>
                        <button onClick={() => handleDelete(m._id)} className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-xs font-medium">Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {members.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400 dark:text-gray-500">No members registered yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Image Management</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Update images used across the site (hero, backgrounds, etc.)</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map(img => (
            <div key={img.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm">
              <img src={img.url} alt={img.id} className="w-full h-32 object-cover rounded-lg" />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-mono">{img.id}</p>
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="New image URL"
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-400 outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const url = e.target.value.trim();
                      if (url) {
                        API.updateImage(img.id, url)
                          .then(() => {
                            refreshImages();
                            addToast('Image updated!', 'success');
                          })
                          .catch(err => addToast(err.message, 'error'));
                        e.target.value = '';
                      }
                    }
                  }}
                />
                <button
                  onClick={() => handleImageUpdate(img.id, img.url)}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition"
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
      />

      {/* Prompt Modal */}
      <PromptModal
        isOpen={promptModal.isOpen}
        onClose={() => setPromptModal({ ...promptModal, isOpen: false })}
        onConfirm={promptModal.onConfirm}
        title={promptModal.title}
        message={promptModal.message}
        initialValue={promptModal.initialValue}
      />
    </div>
  );
}