// Shared, browser-only domain helpers. These fixtures are not a security or backend implementation.
const time = () => new Date().toISOString();

export const workspaceGrants = {
  Customer: ['customer'],
  Admin: ['admin', 'orders', 'store', 'warehouse', 'inventory', 'delivery', 'reporting', 'notifications', 'support', 'procurement', 'returns'],
  'Super Admin': ['admin', 'orders', 'store', 'warehouse', 'inventory', 'delivery', 'reporting', 'notifications', 'support', 'procurement', 'returns'],
  'Central Admin': ['admin', 'orders', 'store', 'warehouse', 'inventory', 'delivery', 'reporting', 'notifications', 'support', 'procurement', 'returns'],
  'Order operator': ['orders', 'returns', 'support'],
  Pharmacist: ['pharmacy'],
  'Licensed Pharmacist': ['pharmacy'],
  'Store worker': ['store', 'inventory'],
  'Store Staff': ['store', 'inventory'],
  'Store Manager': ['store', 'inventory'],
  'Warehouse worker': ['warehouse'],
  'Warehouse Staff': ['warehouse'],
  'Warehouse Manager': ['warehouse', 'procurement'],
  Dispatcher: ['delivery'],
  'Delivery/Ops Manager': ['delivery'],
  Rider: ['rider'],
  'Delivery Rider': ['rider'],
  Finance: ['finance', 'reporting'],
  'Finance Manager': ['finance', 'reporting'],
  'Finance Executive': ['finance'],
  'Finance approver': ['finance', 'reporting'],
  'Report viewer': ['reporting'],
  Auditor: ['audit'],
  Support: ['support'],
  Procurement: ['procurement'],
  'Catalog Manager': ['admin'],
  'CMS Manager': ['admin']
};

export const demoIdentities = {
  'admin@example.test': { id: 'USR-DEMO-ADMIN', role: 'Admin' },
  'super.admin@example.test': { id: 'USR-DEMO-SUPER-ADMIN', role: 'Super Admin' },
  'central.admin@example.test': { id: 'USR-DEMO-CENTRAL-ADMIN', role: 'Central Admin' },
  'demo.admin@example.test': { id: 'USR-DEMO-ADMIN', role: 'Admin' },
  'order.operator@example.test': { id: 'USR-DEMO-ORDER-OPS', role: 'Order operator' },
  'pharmacist@example.test': { id: 'USR-DEMO-PHARMACIST', role: 'Pharmacist' },
  'licensed.pharmacist@example.test': { id: 'USR-DEMO-LICENSED-PHARMACIST', role: 'Licensed Pharmacist' },
  'store@example.test': { id: 'USR-DEMO-STORE', role: 'Store worker' },
  'store.manager@example.test': { id: 'USR-DEMO-STORE-MANAGER', role: 'Store Manager' },
  'store.staff@example.test': { id: 'USR-DEMO-STORE-STAFF', role: 'Store Staff' },
  'warehouse@example.test': { id: 'USR-DEMO-WAREHOUSE', role: 'Warehouse worker' },
  'warehouse.manager@example.test': { id: 'USR-DEMO-WAREHOUSE-MANAGER', role: 'Warehouse Manager' },
  'inventory@example.test': { id: 'USR-DEMO-INVENTORY', role: 'Inventory Operator' },
  'dispatcher@example.test': { id: 'USR-DEMO-DISPATCH', role: 'Dispatcher' },
  'delivery.ops@example.test': { id: 'USR-DEMO-DELIVERY-OPS', role: 'Delivery/Ops Manager' },
  'finance@example.test': { id: 'USR-DEMO-FINANCE', role: 'Finance' },
  'finance.manager@example.test': { id: 'USR-DEMO-FINANCE-MANAGER', role: 'Finance Manager' },
  'finance.executive@example.test': { id: 'USR-DEMO-FINANCE-EXEC', role: 'Finance Executive' },
  'finance.approver@example.test': { id: 'USR-DEMO-FINANCE-APPROVER', role: 'Finance approver' },
  'support@example.test': { id: 'USR-DEMO-SUPPORT', role: 'Support' },
  'auditor@example.test': { id: 'USR-DEMO-AUDITOR', role: 'Auditor' },
  'reports@example.test': { id: 'USR-DEMO-REPORTS', role: 'Report viewer' },
  'catalog@example.test': { id: 'USR-DEMO-CATALOG', role: 'Catalog Manager' },
  'cms@example.test': { id: 'USR-DEMO-CMS', role: 'CMS Manager' },
  'procurement@example.test': { id: 'USR-DEMO-PROCUREMENT', role: 'Procurement' }
};

export function establishSession(state, { identityId, role, method, workspace, mfaVerified = false, riderId = null }) {
  const permitted = workspaceGrants[role] || [];
  state.role = role;
  state.identitySession = {
    id: `SES-DEMO-${Date.now()}`,
    identityId,
    role,
    method,
    mfaVerified,
    riderId,
    permittedWorkspaces: [...permitted],
    activeWorkspace: workspace,
    stepUpVerifiedFor: [],
    location: state.location,
    createdAt: time(),
    status: 'Active (local simulation)'
  };
  return state.identitySession;
}

export function revokeSession(state, reason = 'Signed out') {
  if (state.identitySession) {
    state.identitySession.status = 'Revoked (local simulation)';
    state.identitySession.revokedAt = time();
    state.identitySession.revocationReason = reason;
  }
  state.identitySession = null;
}

export function recordEvent(state, { type, reference, summary, recipient = 'Customer', channel = 'In-app' }) {
  state.domainEvents ||= [];
  const id = `EVT-DEMO-${String(state.domainEvents.length + 1).padStart(4, '0')}`;
  const event = { id, type, reference, summary, recipient, channel, status: 'Queued (simulation)', attempts: 0, createdAt: time() };
  state.domainEvents.unshift(event);
  state.domainEvents = state.domainEvents.slice(0, 100);
  state.notification = { ...(state.notification || {}), eventId: id, status: event.status, attempts: event.attempts, channel };
  return event;
}

export function appendHistory(record, message) {
  record.history ||= [];
  record.history.unshift({ time: time(), message });
}
