// Simple JSON-file data store. Seed data is materialized into /data on first
// access; all reads/writes go through this module so it can be swapped for
// MySQL/D1 later without touching the API routes.
const fs = require('fs');
const path = require('path');
const seed = require('./seed');

const DATA_DIR = path.join(process.cwd(), 'data');

function fileFor(name) {
  return path.join(DATA_DIR, `${name}.json`);
}

function ensure(name) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const file = fileFor(name);
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(seed[name], null, 2), 'utf8');
  }
}

function read(name) {
  ensure(name);
  return JSON.parse(fs.readFileSync(fileFor(name), 'utf8'));
}

function write(name, rows) {
  ensure(name);
  fs.writeFileSync(fileFor(name), JSON.stringify(rows, null, 2), 'utf8');
}

function nextId(rows) {
  return rows.reduce((max, r) => Math.max(max, r.id), 0) + 1;
}

// ---------- Properties ----------

function listProperties(filters = {}) {
  let rows = read('properties');

  if (filters.q) {
    const q = String(filters.q).toLowerCase();
    rows = rows.filter((p) =>
      [p.title, p.city, p.locality, p.type, p.description]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }
  if (filters.city) rows = rows.filter((p) => p.city === filters.city);
  if (filters.type) rows = rows.filter((p) => p.type === filters.type);
  if (filters.listingType) rows = rows.filter((p) => p.listingType === filters.listingType);
  if (filters.status) {
    rows = rows.filter((p) =>
      filters.status === 'available'
        ? p.status === 'available' || p.status === 'active'
        : p.status === filters.status
    );
  }
  if (filters.agentId) rows = rows.filter((p) => p.agentId === Number(filters.agentId));
  if (filters.beds) rows = rows.filter((p) => p.beds >= Number(filters.beds));
  if (filters.minPrice) rows = rows.filter((p) => p.price >= Number(filters.minPrice));
  if (filters.maxPrice) rows = rows.filter((p) => p.price <= Number(filters.maxPrice));
  if (filters.featured) rows = rows.filter((p) => p.featured);

  const sort = filters.sort || 'newest';
  const sorters = {
    newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    'area-desc': (a, b) => b.area - a.area,
    popular: (a, b) => b.views - a.views,
  };
  rows.sort(sorters[sort] || sorters.newest);

  return rows;
}

function getProperty(id) {
  return read('properties').find((p) => p.id === Number(id)) || null;
}

function createProperty(data) {
  const rows = read('properties');
  const property = {
    id: nextId(rows),
    title: '',
    description: '',
    type: 'Apartment',
    listingType: 'sale',
    price: 0,
    area: 0,
    beds: 0,
    baths: 0,
    furnishing: 'Unfurnished',
    city: '',
    locality: '',
    address: '',
    lat: null,
    lng: null,
    images: [],
    amenities: [],
    agentId: null,
    status: 'available',
    featured: false,
    views: 0,
    ...data,
    createdAt: new Date().toISOString(),
  };
  rows.push(property);
  write('properties', rows);
  return property;
}

function updateProperty(id, data) {
  const rows = read('properties');
  const idx = rows.findIndex((p) => p.id === Number(id));
  if (idx === -1) return null;
  // id and createdAt are immutable
  const { id: _id, createdAt: _c, ...rest } = data;
  rows[idx] = { ...rows[idx], ...rest };
  write('properties', rows);
  return rows[idx];
}

function deleteProperty(id) {
  const rows = read('properties');
  const remaining = rows.filter((p) => p.id !== Number(id));
  if (remaining.length === rows.length) return false;
  write('properties', remaining);
  return true;
}

function incrementViews(id) {
  const rows = read('properties');
  const idx = rows.findIndex((p) => p.id === Number(id));
  if (idx === -1) return;
  rows[idx].views += 1;
  write('properties', rows);
}

// ---------- Agents ----------

function listAgents() {
  return read('agents');
}

function getAgent(id) {
  return read('agents').find((a) => a.id === Number(id)) || null;
}

// ---------- Leads ----------

function listLeads(filters = {}) {
  let rows = read('leads');
  if (filters.agentId) rows = rows.filter((l) => l.agentId === Number(filters.agentId));
  if (filters.status) rows = rows.filter((l) => l.status === filters.status);
  if (filters.propertyId) rows = rows.filter((l) => l.propertyId === Number(filters.propertyId));
  rows.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return rows;
}

function createLead(data) {
  const rows = read('leads');
  const now = new Date().toISOString();
  const lead = {
    id: nextId(rows),
    propertyId: null,
    agentId: null,
    name: '',
    phone: '',
    email: '',
    message: '',
    interest: 'info',
    status: 'new',
    notes: '',
    ...data,
    createdAt: now,
    updatedAt: now,
  };
  rows.push(lead);
  write('leads', rows);
  return lead;
}

function updateLead(id, data) {
  const rows = read('leads');
  const idx = rows.findIndex((l) => l.id === Number(id));
  if (idx === -1) return null;
  const { id: _id, createdAt: _c, ...rest } = data;
  rows[idx] = { ...rows[idx], ...rest, updatedAt: new Date().toISOString() };
  write('leads', rows);
  return rows[idx];
}

function deleteLead(id) {
  const rows = read('leads');
  const remaining = rows.filter((l) => l.id !== Number(id));
  if (remaining.length === rows.length) return false;
  write('leads', remaining);
  return true;
}

module.exports = {
  listProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  incrementViews,
  listAgents,
  getAgent,
  listLeads,
  createLead,
  updateLead,
  deleteLead,
};
