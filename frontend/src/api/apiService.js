/**
 * API Szolgáltatás - Backend kommunikáció
 */

const PHP_API_URL = import.meta.env.VITE_API_URL || 'http://localhost/frobacksql/backend/api';
const CS_API_URL = import.meta.env.VITE_API_URL_CS || 'http://localhost:5156/api';
const PHP_BASE_URL = PHP_API_URL.replace(/\/backend\/api\/?$/, '');

const USE_CS_PRODUCTS = import.meta.env.VITE_USE_CS_PRODUCTS === 'true';
const USE_CS_CATEGORIES = import.meta.env.VITE_USE_CS_CATEGORIES === 'true';
const USE_CS_ADMIN_USERS = import.meta.env.VITE_USE_CS_ADMIN_USERS === 'true';

const rawAdminAllowlist = (import.meta.env.VITE_ADMIN_ALLOWLIST || '').split(',');
const allowedAdminValues = new Set(
  rawAdminAllowlist.map((v) => v.trim().toLowerCase()).filter(Boolean)
);

const hasAdminFlag = (user) => user?.admin === 1 || user?.admin === true || user?.admin === '1';
const ADMIN_SECRET = 'Admin123';
const getAdminSecret = () => sessionStorage.getItem('adminSecret') || ADMIN_SECRET;

export const isAllowedAdminUser = (user) => {
  if (!hasAdminFlag(user)) return false;
  if (allowedAdminValues.size === 0) return true;
  const candidates = [user?.email, user?.felhasznalonev, user?.id?.toString()]
    .map((v) => v?.toLowerCase()).filter(Boolean);
  return candidates.some((value) => allowedAdminValues.has(value));
};

export const resolveMediaUrl = (value) => {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  const normalized = value.startsWith('/') ? value : `/${value}`;
  return `${PHP_BASE_URL}${normalized}`;
};

const enforceAdminAccess = () => {
  const user = authAPI.getStoredUser();
  if (!isAllowedAdminUser(user)) throw new Error('Nincs admin jogosultság');
};

const withAdminHeaders = (headers = {}) => {
  const merged = { ...headers };
  const adminSecret = getAdminSecret();
  if (adminSecret) merged['X-Admin-Secret'] = adminSecret;
  return merged;
};

const adminFetch = async (url, options = {}) => {
  const response = await fetch(url, options);
  const contentType = response.headers.get('content-type') || '';
  const rawText = await response.text();
  let data = null;
  if (contentType.includes('application/json') && rawText) {
    try { data = JSON.parse(rawText); }
    catch (err) { throw new Error(`Válasz értelmezési hiba: ${err.message}`); }
  } else { data = rawText || null; }
  if (!response.ok) {
    const message = data?.message || `HTTP error ${response.status}`;
    const err = new Error(message);
    err.status = response.status;
    err.body = data;
    throw err;
  }
  return data;
};

const getHeaders = (isForm = false) => {
  const headers = {};
  if (!isForm) headers['Content-Type'] = 'application/json';
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

// ==================== AUTH ====================
export const authAPI = {
  async login(identifier, password) {
    const response = await fetch(`${PHP_API_URL}/auth.php/login`, {
      method: 'POST', headers: getHeaders(),
      body: JSON.stringify({ identifier, password })
    });
    const data = await response.json();
    if (response.ok && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user || {}));
      if (data.user && hasAdminFlag(data.user)) {
        sessionStorage.setItem('adminSecret', ADMIN_SECRET);
      }
    }
    return data;
  },
  async register(payload) {
    const response = await fetch(`${PHP_API_URL}/auth.php/register`, {
      method: 'POST', headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (response.ok && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user || {}));
    }
    return data;
  },
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('adminSecret');
  },
  async getCurrentUser() {
    const response = await fetch(`${PHP_API_URL}/auth.php/me`, { headers: getHeaders() });
    return await response.json();
  },
  async checkAuth() {
    const response = await fetch(`${PHP_API_URL}/auth.php/check-auth`, { headers: getHeaders() });
    return await response.json();
  },
  getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  isAdmin() {
    return isAllowedAdminUser(this.getStoredUser());
  }
};

// ==================== TERMÉKEK ====================
export const productsAPI = {
  async getAll(page = 1, limit = 20) {
    if (USE_CS_PRODUCTS) {
      const response = await fetch(`${CS_API_URL}/Termekek`);
      return await response.json();
    }
    const response = await fetch(`${PHP_API_URL}/products.php?page=${page}&limit=${limit}`);
    return await response.json();
  },
  async getById(id) {
    if (USE_CS_PRODUCTS) {
      const response = await fetch(`${CS_API_URL}/Termekek/${id}`);
      return await response.json();
    }
    const response = await fetch(`${PHP_API_URL}/products.php?id=${id}`);
    return await response.json();
  },
  async search(query) {
    // C# API-ban jelenleg nincs dedikált kereső endpoint, marad PHP.
    const response = await fetch(`${PHP_API_URL}/products.php/search?q=${encodeURIComponent(query)}`);
    return await response.json();
  },
  async getByCategory(kategoria, alkategoria = '') {
    // C# API-ban jelenleg nincs category query endpoint, marad PHP.
    let url = `${PHP_API_URL}/products.php/category?kategoria=${kategoria}`;
    if (alkategoria) url += `&alkategoria=${alkategoria}`;
    const response = await fetch(url);
    return await response.json();
  }
};

// ==================== KATEGÓRIÁK ====================
export const categoriesAPI = {
  async getAll() {
    if (USE_CS_CATEGORIES) {
      const response = await fetch(`${CS_API_URL}/Kategoriak`);
      return await response.json();
    }
    const response = await fetch(`${PHP_API_URL}/categories.php`);
    return await response.json();
  },
  async getSubcategories(kategoria_id) {
    // C# API-ban nincs külön subcategories endpoint, marad PHP.
    const response = await fetch(`${PHP_API_URL}/categories.php/subcategories?kategoria_id=${kategoria_id}`);
    return await response.json();
  }
};

// ==================== RENDELÉSEK ====================
export const ordersAPI = {
  async create(orderData) {
    const response = await fetch(`${PHP_API_URL}/orders.php/create`, {
      method: 'POST', headers: getHeaders(),
      body: JSON.stringify(orderData)
    });
    return await response.json();
  },
  async getMyOrders() {
    const response = await fetch(`${PHP_API_URL}/orders.php/my-orders`, { headers: getHeaders() });
    return await response.json();
  },
  async getById(id) {
    const response = await fetch(`${PHP_API_URL}/orders.php/${id}`, { headers: getHeaders() });
    return await response.json();
  }
};

// ==================== VÉLEMÉNYEK ====================
export const reviewsAPI = {
  async getByProduct(termek_id) {
    const response = await fetch(`${PHP_API_URL}/reviews.php/product/${termek_id}`);
    return await response.json();
  },
  async getAll() {
    const response = await fetch(`${PHP_API_URL}/reviews.php/all`);
    return await response.json();
  },
  async getWallPosts() {
    const response = await fetch(`${PHP_API_URL}/reviews.php/wall`, { headers: getHeaders() });
    return await response.json();
  },
  async createWallPost(szoveg) {
    const response = await fetch(`${PHP_API_URL}/reviews.php/wall`, {
      method: 'POST', headers: getHeaders(),
      body: JSON.stringify({ szoveg })
    });
    if (!response.ok) { const data = await response.json(); throw new Error(data.message || 'Hiba'); }
    return await response.json();
  },
  async deleteWallPost(postId) {
    const response = await fetch(`${PHP_API_URL}/reviews.php/wall/${postId}`, {
      method: 'DELETE', headers: withAdminHeaders(getHeaders())
    });
    if (!response.ok) { const data = await response.json(); throw new Error(data.message || 'Hiba'); }
    return await response.json();
  },
  async create(reviewData) {
    const response = await fetch(`${PHP_API_URL}/reviews.php`, {
      method: 'POST', headers: getHeaders(),
      body: JSON.stringify(reviewData)
    });
    if (!response.ok) { const data = await response.json(); throw new Error(data.message || 'Hiba'); }
    return await response.json();
  },
  async markHelpful(review_id, helpful = true) {
    const response = await fetch(`${PHP_API_URL}/reviews.php/${review_id}/helpful`, {
      method: 'PUT', headers: getHeaders(),
      body: JSON.stringify({ helpful })
    });
    return await response.json();
  },
  async deleteReview(reviewId) {
    enforceAdminAccess();
    const response = await fetch(`${PHP_API_URL}/reviews.php/review/${reviewId}`, {
      method: 'DELETE', headers: withAdminHeaders(getHeaders())
    });
    if (!response.ok) { const data = await response.json(); throw new Error(data.message || 'Hiba'); }
    return await response.json();
  },
  async getBannedWords() {
    const response = await fetch(`${PHP_API_URL}/reviews.php/banned-words`, { headers: getHeaders() });
    return await response.json();
  },
  async addBannedWord(szo) {
    enforceAdminAccess();
    const response = await fetch(`${PHP_API_URL}/reviews.php/banned-words`, {
      method: 'POST', headers: withAdminHeaders(getHeaders()),
      body: JSON.stringify({ szo })
    });
    if (!response.ok) { const data = await response.json(); throw new Error(data.message || 'Hiba'); }
    return await response.json();
  },
  async deleteBannedWord(wordId) {
    enforceAdminAccess();
    const response = await fetch(`${PHP_API_URL}/reviews.php/banned-words/${wordId}`, {
      method: 'DELETE', headers: withAdminHeaders(getHeaders())
    });
    if (!response.ok) { const data = await response.json(); throw new Error(data.message || 'Hiba'); }
    return await response.json();
  }
};

// ==================== ADMIN - TERMÉKEK ====================
export const adminProductsAPI = {
  async getAll() {
    enforceAdminAccess();
    return await adminFetch(`${PHP_API_URL}/admin/products.php`, { headers: withAdminHeaders(getHeaders()) });
  },
  async getById(id) {
    enforceAdminAccess();
    return await adminFetch(`${PHP_API_URL}/admin/products.php?id=${id}`, { headers: withAdminHeaders(getHeaders()) });
  },
  async create(productData) {
    enforceAdminAccess();
    return await adminFetch(`${PHP_API_URL}/admin/products.php`, {
      method: 'POST', headers: withAdminHeaders(getHeaders()),
      body: JSON.stringify(productData)
    });
  },
  async update(id, productData) {
    enforceAdminAccess();
    return await adminFetch(`${PHP_API_URL}/admin/products.php`, {
      method: 'POST', headers: withAdminHeaders(getHeaders()),
      body: JSON.stringify({ ...productData, id: Number(id), _method: 'PUT' })
    });
  },
  async delete(id) {
    enforceAdminAccess();
    return await adminFetch(`${PHP_API_URL}/admin/products.php`, {
      method: 'POST', headers: withAdminHeaders(getHeaders()),
      body: JSON.stringify({ id: Number(id), _method: 'DELETE' })
    });
  }
};

// ==================== ADMIN - FELHASZNÁLÓK ====================
export const adminUsersAPI = {
  async getAll() {
    enforceAdminAccess();
    if (USE_CS_ADMIN_USERS) {
      return await adminFetch(`${CS_API_URL}/Felhasznalok`, { headers: withAdminHeaders(getHeaders()) });
    }
    return await adminFetch(`${PHP_API_URL}/admin/users.php`, { headers: withAdminHeaders(getHeaders()) });
  },
  async setBanStatus(id, tiltva, tiltas_oka = '') {
    enforceAdminAccess();
    return await adminFetch(`${PHP_API_URL}/admin/users.php`, {
      method: 'POST',
      headers: withAdminHeaders(getHeaders()),
      body: JSON.stringify({
        id: Number(id),
        _method: 'PUT',
        tiltva: tiltva ? 1 : 0,
        tiltas_oka
      })
    });
  },
  async toggleAdmin(id, admin) {
    enforceAdminAccess();
    return await adminFetch(`${PHP_API_URL}/admin/users.php/${id}/admin`, {
      method: 'PUT',
      headers: withAdminHeaders(getHeaders()),
      body: JSON.stringify({ admin: admin ? 1 : 0 })
    });
  },
  async deleteUser(id) {
    enforceAdminAccess();
    return await adminFetch(`${PHP_API_URL}/admin/users.php/${id}`, {
      method: 'DELETE',
      headers: withAdminHeaders(getHeaders())
    });
  },
  async searchUsers(query) {
    enforceAdminAccess();
    return await adminFetch(`${PHP_API_URL}/admin/users.php/search?q=${encodeURIComponent(query)}`, {
      headers: withAdminHeaders(getHeaders())
    });
  },
  async getStats() {
    enforceAdminAccess();
    return await adminFetch(`${PHP_API_URL}/admin/users.php/stats`, {
      headers: withAdminHeaders(getHeaders())
    });
  },
  async getUserOrders(userId) {
    enforceAdminAccess();
    return await adminFetch(`${PHP_API_URL}/admin/users.php/${userId}/orders`, {
      headers: withAdminHeaders(getHeaders())
    });
  }
};

// ==================== ADMIN - RENDELÉSEK ====================
export const adminOrdersAPI = {
  async getAll() {
    enforceAdminAccess();
    return await adminFetch(`${PHP_API_URL}/admin/orders.php`, { headers: withAdminHeaders(getHeaders()) });
  },
  async getById(id) {
    enforceAdminAccess();
    return await adminFetch(`${PHP_API_URL}/admin/orders.php/${id}`, { headers: withAdminHeaders(getHeaders()) });
  },
  async updateStatus(id, statusz) {
    enforceAdminAccess();
    return await adminFetch(`${PHP_API_URL}/admin/orders.php/${id}`, {
      method: 'PUT', headers: withAdminHeaders(getHeaders()),
      body: JSON.stringify({ statusz })
    });
  },
  async delete(id) {
    enforceAdminAccess();
    return await adminFetch(`${PHP_API_URL}/admin/orders.php/${id}`, {
      method: 'DELETE', headers: withAdminHeaders(getHeaders())
    });
  },
  getInvoiceUrl(id) { return `${PHP_API_URL}/admin/orders.php/${id}/invoice`; }
};

// ==================== ADMIN - KÉP FELTÖLTÉS ====================
export const uploadAPI = {
  async uploadImage(file) {
    enforceAdminAccess();
    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch(`${PHP_API_URL}/upload.php`, {
      method: 'POST', headers: withAdminHeaders(getHeaders(true)),
      body: formData
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Kép feltöltése sikertelen');
    }
    return data;
  }
};

// ==================== ADMIN - KATEGÓRIÁK ====================
export const adminCategoriesAPI = {
  async getAll() {
    enforceAdminAccess();
    return await adminFetch(`${PHP_API_URL}/admin/categories.php`, { headers: withAdminHeaders(getHeaders()) });
  },
  async createCategory(data) {
    enforceAdminAccess();
    return await adminFetch(`${PHP_API_URL}/admin/categories.php`, {
      method: 'POST', headers: withAdminHeaders(getHeaders()),
      body: JSON.stringify(data)
    });
  },
  async createSubcategory(data) {
    enforceAdminAccess();
    return await adminFetch(`${PHP_API_URL}/admin/categories.php/subcategory`, {
      method: 'POST', headers: withAdminHeaders(getHeaders()),
      body: JSON.stringify(data)
    });
  },
  async deleteCategory(id) {
    enforceAdminAccess();
    return await adminFetch(`${PHP_API_URL}/admin/categories.php/${id}`, {
      method: 'DELETE', headers: withAdminHeaders(getHeaders())
    });
  },
  async updateSubcategory(id, data) {
    enforceAdminAccess();
    return await adminFetch(`${PHP_API_URL}/admin/categories.php/subcategory/${id}`, {
      method: 'PUT', headers: withAdminHeaders(getHeaders()),
      body: JSON.stringify(data)
    });
  },
  async deleteSubcategory(id) {
    enforceAdminAccess();
    return await adminFetch(`${PHP_API_URL}/admin/categories.php/subcategory/${id}`, {
      method: 'DELETE', headers: withAdminHeaders(getHeaders())
    });
  }
};

// ==================== ÜZENETEK ====================
export const messagesAPI = {
  async getConversations() {
    const response = await fetch(`${PHP_API_URL}/messages.php`, { headers: getHeaders() });
    return await response.json();
  },
  async getConversation(userId) {
    const response = await fetch(`${PHP_API_URL}/messages.php/conversation/${userId}`, { headers: getHeaders() });
    return await response.json();
  },
  async send(fogado_id, uzenet) {
    const response = await fetch(`${PHP_API_URL}/messages.php`, {
      method: 'POST', headers: getHeaders(),
      body: JSON.stringify({ fogado_id, uzenet })
    });
    return await response.json();
  },
  async getUnreadCount() {
    const response = await fetch(`${PHP_API_URL}/messages.php/unread`, { headers: getHeaders() });
    return await response.json();
  }
};

// ==================== KUPONOK ====================
export const couponsAPI = {
  async getLoyaltyCoupon() {
    const response = await fetch(`${PHP_API_URL}/coupons.php/loyalty`);
    return await response.json();
  },
  async validate(kod) {
    const response = await fetch(`${PHP_API_URL}/coupons.php/validate/${kod}`, { headers: getHeaders() });
    return await response.json();
  },
  async apply(kupon_kod, osszeg) {
    const response = await fetch(`${PHP_API_URL}/coupons.php/apply`, {
      method: 'POST', headers: getHeaders(),
      body: JSON.stringify({ kupon_kod, osszeg })
    });
    return await response.json();
  },
  async getMyCoupons() {
    const response = await fetch(`${PHP_API_URL}/coupons.php/my`, { headers: getHeaders() });
    return await response.json();
  },
  async getAll() {
    enforceAdminAccess();
    const response = await fetch(`${PHP_API_URL}/coupons.php`, { headers: withAdminHeaders(getHeaders()) });
    return await response.json();
  },
  async create(couponData) {
    enforceAdminAccess();
    const response = await fetch(`${PHP_API_URL}/coupons.php`, {
      method: 'POST', headers: withAdminHeaders(getHeaders()),
      body: JSON.stringify(couponData)
    });
    if (!response.ok) { const data = await response.json(); throw new Error(data.message || 'Hiba'); }
    return await response.json();
  },
  async update(id, couponData) {
    enforceAdminAccess();
    const response = await fetch(`${PHP_API_URL}/coupons.php/${id}`, {
      method: 'PUT', headers: withAdminHeaders(getHeaders()),
      body: JSON.stringify(couponData)
    });
    if (!response.ok) { const data = await response.json(); throw new Error(data.message || 'Hiba'); }
    return await response.json();
  },
  async delete(id) {
    enforceAdminAccess();
    const response = await fetch(`${PHP_API_URL}/coupons.php/${id}`, {
      method: 'DELETE', headers: withAdminHeaders(getHeaders())
    });
    if (!response.ok) { const data = await response.json(); throw new Error(data.message || 'Hiba'); }
    return await response.json();
  }
};
