import React, { useState, useEffect } from 'react';
import { Link, useRouter } from '../App';
import { useToast } from '../contexts/ToastContext';
import API from '../services/api';

export default function MemberDetailPage() {
  const { route } = useRouter();
  const { addToast } = useToast();
  const id = route.split('/member/')[1]?.split('?')[0];
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deliveryDays, setDeliveryDays] = useState(3);
  const [description, setDescription] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientTelegramChatId, setClientTelegramChatId] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [requestCode, setRequestCode] = useState('');

  useEffect(() => {
    // ✅ Use the dedicated endpoint instead of filtering all members
    API.getMemberById(id)
      .then(member => {
        setMember(member);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const skills = API.getSkills();
  const skill = member ? skills.find(s => s.id === member.skill) : null;
  const baseRate = member?.rate || 20;
  const price = (baseRate / deliveryDays).toFixed(2);

  if (loading) return <div className="pt-20 text-center text-gray-500 dark:text-gray-400">Loading...</div>;

  if (!member) {
    return (
      <div className="pt-20 max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">Member not found</h2>
        <Link to="/members" className="text-indigo-600 dark:text-indigo-400 mt-4 inline-block">← Back to team</Link>
      </div>
    );
  }

  if (!member.active) {
    return (
      <div className="pt-20 max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">This member is currently inactive</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Please choose another team member.</p>
        <Link to="/members" className="text-indigo-600 dark:text-indigo-400 mt-4 inline-block">← Back to team</Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientTelegramChatId || !description) {
      addToast('Please fill in all required fields', 'error');
      return;
    }
    try {
      const req = await API.createRequest({
        memberId: member._id,
        memberEmail: member.email,
        memberName: member.name,
        skill: member.skill,
        clientName,
        clientEmail,
        clientTelegramChatId,
        description,
        deliveryDays,
        price: parseFloat(price),
        attachment: attachment ? 'sample.png' : null,
      });
      setRequestCode(req.code);
      setSubmitted(true);
      addToast(`Request sent! Code: ${req.code}`, 'success');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  if (submitted) {
    return (
      <div className="pt-20 max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-8">
          <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center text-green-600 dark:text-green-300 text-3xl">
            <i className="fas fa-check" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-4">Request Sent!</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Your request has been sent to <strong>{member.name}</strong>.
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mt-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Request Code</p>
            <p className="text-xl font-mono font-bold text-indigo-600 dark:text-indigo-400">{requestCode}</p>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            A confirmation has been sent to your Telegram and email. The team member will contact you soon.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Delivery expected in <strong>{deliveryDays} day{deliveryDays > 1 ? 's' : ''}</strong>.
          </p>
          <Link to="/" className="inline-block mt-6 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/members" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium">
        ← Back to team
      </Link>

      <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-6">
            <img
              src={member.profileImage || 'https://i.pravatar.cc/300?img=' + member._id}
              alt={member.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-indigo-100 dark:border-indigo-800"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{member.name}</h1>
              <p className="text-indigo-600 dark:text-indigo-400 font-medium">{skill?.name || 'General'}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{member.bio || 'Professional team member'}</p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Hire {member.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Base rate: <strong className="text-gray-700 dark:text-gray-300">${baseRate}</strong> per day (pro-rated by delivery time)
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Delivery days */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Delivery in days</label>
              <div className="flex flex-wrap gap-3">
                {[1, 2, 3, 5, 7, 10].map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDeliveryDays(d)}
                    className={`px-4 py-2 rounded-xl border text-sm font-medium transition ${
                      deliveryDays === d
                        ? 'bg-indigo-600 text-white border-indigo-600 dark:bg-indigo-500 dark:border-indigo-400'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500'
                    }`}
                  >
                    {d} day{d > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Price: <strong className="text-gray-700 dark:text-gray-300">${price}</strong> (${baseRate} / {deliveryDays} days)
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Describe your project *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-800 outline-none transition"
                placeholder="Tell us what you need, how you want it, and any special instructions..."
                required
              />
            </div>

            {/* Attachment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Attach a sample or image (optional)</label>
              <input
                type="file"
                onChange={(e) => setAttachment(e.target.files[0])}
                className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-indigo-50 dark:file:bg-indigo-900/30 file:text-indigo-700 dark:file:text-indigo-300 file:font-medium hover:file:bg-indigo-100 dark:hover:file:bg-indigo-800/30 transition"
                accept="image/*"
              />
            </div>

            {/* Client Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name *</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-800 outline-none transition"
                placeholder="John Doe"
                required
              />
            </div>

            {/* Client Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Email *</label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-800 outline-none transition"
                placeholder="john@example.com"
                required
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">We'll send a confirmation to this email.</p>
            </div>

            {/* 👇 Client Telegram Chat ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Telegram Chat ID *</label>
              <input
                type="text"
                value={clientTelegramChatId}
                onChange={(e) => setClientTelegramChatId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-800 outline-none transition"
                placeholder="e.g., 123456789"
                required
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Get your Chat ID by messaging @userinfobot on Telegram.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-primary text-white rounded-xl font-semibold hover:shadow-lg transition shadow-md"
            >
              <i className="fas fa-paper-plane mr-2" /> Send Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}