const API_BASE = 'http://localhost:5000/api';

// No token – cookies are sent automatically
const fetchJSON = async (url, options = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    credentials: 'include', // sends cookies automatically
  });
  const data = await res.json();
  if (!res.ok) {
    const msg = data.errors?.[0]?.msg || data.error || 'Request failed';
    throw new Error(msg);
  }
  return data;
};

const API = {
  // === Admin ===
  adminLogin: async (email, password) => {
    const data = await fetchJSON(`${API_BASE}/admin/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    localStorage.setItem('adminSession', JSON.stringify(data.admin));
    return data.admin;
  },
  adminLogout: () => {
    localStorage.removeItem('adminSession');
  },
  getAdminSession: () => JSON.parse(localStorage.getItem('adminSession') || 'null'),

  // === Members (Admin only) ===
  registerMember: async (memberData) => {
    return fetchJSON(`${API_BASE}/members/register`, {
      method: 'POST',
      body: JSON.stringify(memberData)
    });
  },
  getMembers: async () => {
    return fetchJSON(`${API_BASE}/members`);
  },
  // 👇 ADD THIS FUNCTION
  getMemberById: async (id) => {
    return fetchJSON(`${API_BASE}/members/${id}`);
  },
  updateMember: async (id, data) => {
    return fetchJSON(`${API_BASE}/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  deleteMember: async (id) => {
    return fetchJSON(`${API_BASE}/members/${id}`, {
      method: 'DELETE'
    });
  },
  toggleMemberActive: async (id) => {
    return fetchJSON(`${API_BASE}/members/${id}/toggle`, {
      method: 'PATCH'
    });
  },

  // === Member Login ===
  memberLogin: async (email, password) => {
    const data = await fetchJSON(`${API_BASE}/members/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    localStorage.setItem('memberSession', JSON.stringify(data.member));
    return data.member;
  },
  memberLogout: () => {
    localStorage.removeItem('memberSession');
  },
  getMemberSession: () => JSON.parse(localStorage.getItem('memberSession') || 'null'),

  // === Requests ===
  createRequest: async (requestData) => {
    return fetchJSON(`${API_BASE}/requests`, {
      method: 'POST',
      body: JSON.stringify(requestData)
    });
  },
  getRequestsByMember: async () => {
    return fetchJSON(`${API_BASE}/requests/me`);
  },
  updateRequestStatus: async (id, status) => {
    return fetchJSON(`${API_BASE}/requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },
  getRequestByCode: async (code) => {
    return fetchJSON(`${API_BASE}/requests/code/${code}`);
  },

  // === Images ===
  getImages: async () => {
    return fetchJSON(`${API_BASE}/images`);
  },
  updateImage: async (id, url) => {
    return fetchJSON(`${API_BASE}/images/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ url })
    });
  },

  // === Skills (static) ===
  getSkills: () => [
    { id: 'technical-writer', name: 'Technical Writer', icon: 'fa-pen-fancy', desc: 'Writes projects, scripts, reports, presentations & spreadsheets' },
    { id: 'web-developer', name: 'Website Developer', icon: 'fa-code', desc: 'Frontend, Backend & Fullstack development' },
    { id: 'app-developer', name: 'App Developer', icon: 'fa-mobile-screen-button', desc: 'Mobile & desktop application development' },
    { id: 'video-editor', name: 'Video Editor', icon: 'fa-film', desc: 'Professional video editing & post-production' },
    { id: 'graphics-developer', name: 'Graphics Developer', icon: 'fa-paintbrush', desc: 'Logo, brand identity & visual design' },
  ]
};

export default API;