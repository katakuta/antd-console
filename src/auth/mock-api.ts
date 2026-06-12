/**
 * Mock API — fake data generators and simulated API endpoints.
 *
 * All functions return Promises with simulated network latency.
 * Data is stored in memory (resets on page refresh).
 * Replace these with real API calls when connecting to a backend.
 */

import type { UserInfo } from './core';

// ── Helpers ──

function delay(ms?: number): Promise<void> {
  const msActual = ms ?? 200 + Math.random() * 600;
  return new Promise((r) => setTimeout(r, msActual));
}

function clone<T>(data: T): T {
  return JSON.parse(JSON.stringify(data)) as T;
}

// ── Seed data: names ──

const FIRST_NAMES = [
  'Alice', 'Bob', 'Charlie', 'Diana', 'Edward', 'Fiona', 'George', 'Hannah',
  'Ivan', 'Julia', 'Kevin', 'Linda', 'Michael', 'Nancy', 'Oscar', 'Patricia',
  'Quentin', 'Rachel', 'Samuel', 'Tina', 'Uma', 'Victor', 'Wendy', 'Xavier',
];

const LAST_NAMES = [
  'Anderson', 'Brown', 'Clark', 'Davis', 'Evans', 'Foster', 'Garcia', 'Harris',
  'Irwin', 'Johnson', 'King', 'Lee', 'Miller', 'Nelson', 'Owen', 'Parker',
  'Quinn', 'Roberts', 'Smith', 'Taylor', 'Upton', 'Vance', 'Wilson', 'Young',
];

const CITIES = [
  'New York', 'London', 'Tokyo', 'Berlin', 'Paris', 'Sydney', 'Toronto',
  'Singapore', 'Dubai', 'Amsterdam', 'Seoul', 'Stockholm', 'Mumbai', 'São Paulo',
];

const ROLES = ['Admin', 'Editor', 'Viewer', 'Manager', 'Developer'];

const PRODUCT_NAMES = [
  'Pro Laptop 15"', 'Wireless Mouse', 'Mechanical Keyboard', 'USB-C Hub',
  '4K Monitor 27"', 'Webcam Pro', 'Standing Desk', 'Ergonomic Chair',
  'Noise Canceling Headphones', 'Smart Speaker', 'External SSD 1TB',
  'Drawing Tablet', 'Document Scanner', 'NAS Storage', 'WiFi Router AX',
];

const TASK_TITLES = [
  'Review quarterly report', 'Update user documentation', 'Fix login page bug',
  'Deploy v2.1 to staging', 'Design new onboarding flow', 'Optimize database queries',
  'Write unit tests for API', 'Update dependencies', 'Setup CI/CD pipeline',
  'Create user feedback survey', 'Implement dark mode toggle', 'Audit security logs',
];

const ACTIVITY_ACTIONS = [
  'logged in', 'created a record', 'updated settings', 'deleted an entry',
  'exported data', 'changed password', 'invited a team member', 'archived a project',
  'approved a request', 'commented on a task',
];

// ── Seed Data Stores (in-memory) ──

export interface DemoUser {
  id: number;
  name: string;
  email: string;
  role: string;
  city: string;
  status: 'Active' | 'Inactive' | 'Pending';
  createdAt: string;
}

export interface DemoProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  rating: number;
}

export interface DemoTask {
  id: number;
  title: string;
  assignee: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Todo' | 'In Progress' | 'Done';
  dueDate: string;
}

export interface DemoActivity {
  id: number;
  user: string;
  action: string;
  target: string;
  timestamp: string;
}

function generateUsers(count: number): DemoUser[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[i % LAST_NAMES.length]}`,
    email: `${FIRST_NAMES[i % FIRST_NAMES.length].toLowerCase()}.${LAST_NAMES[i % LAST_NAMES.length].toLowerCase()}@example.com`,
    role: ROLES[i % ROLES.length],
    city: CITIES[i % CITIES.length],
    status: (['Active', 'Active', 'Active', 'Inactive', 'Pending'] as const)[i % 5],
    createdAt: new Date(2025, 0, 1 + i).toISOString().split('T')[0],
  }));
}

function generateProducts(count: number): DemoProduct[] {
  const categories = ['Electronics', 'Furniture', 'Audio', 'Storage', 'Accessories'];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: PRODUCT_NAMES[i % PRODUCT_NAMES.length],
    category: categories[i % categories.length],
    price: Math.round((50 + Math.random() * 950) * 100) / 100,
    stock: Math.floor(Math.random() * 200),
    status: (() => {
      const s = Math.floor(Math.random() * 200);
      if (s === 0) return 'Out of Stock' as const;
      if (s < 20) return 'Low Stock' as const;
      return 'In Stock' as const;
    })(),
    rating: Math.round((3 + Math.random() * 2) * 10) / 10,
  }));
}

function generateTasks(count: number): DemoTask[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: TASK_TITLES[i % TASK_TITLES.length],
    assignee: `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[(i + 3) % LAST_NAMES.length]}`,
    priority: (['High', 'Medium', 'Medium', 'Low'] as const)[i % 4],
    status: (['Todo', 'In Progress', 'In Progress', 'Done'] as const)[i % 4],
    dueDate: new Date(2025, 5, 1 + i * 3).toISOString().split('T')[0],
  }));
}

function generateActivities(count: number): DemoActivity[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    user: `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[(i + 5) % LAST_NAMES.length]}`,
    action: ACTIVITY_ACTIONS[i % ACTIVITY_ACTIONS.length],
    target: ['Project Alpha', 'Dashboard', 'Settings', 'User Profile', 'Report'][i % 5],
    timestamp: new Date(Date.now() - i * 3600000 * (1 + Math.random() * 5)).toISOString(),
  }));
}

// ── Initialize stores ──

let usersStore = generateUsers(56);
let productsStore = generateProducts(48);
let tasksStore = generateTasks(34);
let activitiesStore = generateActivities(60);

// ── Mock API: Auth ──

export async function mockLogin(data: { email: string; password: string }): Promise<{
  data: { token: string; email: string; firstName: string; lastName: string };
}> {
  await delay(500);
  if (!data.email || !data.password) {
    throw new Error('Email and password are required.');
  }
  // Accept any email/password in demo mode
  const namePart = data.email.split('@')[0];
  return {
    data: {
      token: `mock_token_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      email: data.email,
      firstName: namePart.charAt(0).toUpperCase() + namePart.slice(1),
      lastName: 'Demo',
    },
  };
}

export async function completeLogin(args: {
  inputUserName: string;
  token: string;
  loginPayload: Record<string, unknown>;
  redirect?: string;
  params?: Record<string, unknown>;
}): Promise<void> {
  const { setToken, setUserInfo, buildUserInfoFromLogin, saveLastPagePath, getLastPagePath } =
    await import('./core');
  setToken(args.token);
  const userInfo = buildUserInfoFromLogin(args.loginPayload, args.inputUserName);
  setUserInfo(userInfo);

  // Simulate redirect
  await delay(200);
  const target = args.redirect ?? getLastPagePath();
  saveLastPagePath(target);
  window.location.href = target;
}

export async function mockSendVerificationCode(_data: { email: string }): Promise<void> {
  await delay(400);
}

export async function mockResetPassword(_data: {
  email: string;
  verificationCode: string;
  password: string;
}): Promise<{ ok: boolean; reason?: string }> {
  await delay(600);
  // Accept any code starting with "123" or "0000"
  if (_data.verificationCode.startsWith('123') || _data.verificationCode === '000000') {
    return { ok: true };
  }
  return { ok: false, reason: 'invalid_code' };
}

// ── Mock API: Users CRUD ──

export async function mockGetUsers(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  status?: string;
}): Promise<{ data: DemoUser[]; total: number }> {
  await delay();
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 10;
  let filtered = clone(usersStore);

  if (params?.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter(
      (u) => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s),
    );
  }
  if (params?.role) {
    filtered = filtered.filter((u) => u.role === params.role);
  }
  if (params?.status) {
    filtered = filtered.filter((u) => u.status === params.status);
  }

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return { data, total };
}

export async function mockCreateUser(user: Omit<DemoUser, 'id' | 'createdAt'>): Promise<DemoUser> {
  await delay(400);
  const newUser: DemoUser = {
    ...user,
    id: Math.max(0, ...usersStore.map((u) => u.id)) + 1,
    createdAt: new Date().toISOString().split('T')[0],
  };
  usersStore = [newUser, ...usersStore];
  return clone(newUser);
}

export async function mockUpdateUser(
  id: number,
  updates: Partial<DemoUser>,
): Promise<DemoUser> {
  await delay(300);
  const idx = usersStore.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error('User not found');
  usersStore[idx] = { ...usersStore[idx], ...updates };
  return clone(usersStore[idx]);
}

export async function mockDeleteUser(id: number): Promise<void> {
  await delay(300);
  usersStore = usersStore.filter((u) => u.id !== id);
}

// ── Mock API: Products CRUD ──

export async function mockGetProducts(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  status?: string;
}): Promise<{ data: DemoProduct[]; total: number }> {
  await delay();
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 12;
  let filtered = clone(productsStore);

  if (params?.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(s));
  }
  if (params?.category) {
    filtered = filtered.filter((p) => p.category === params.category);
  }
  if (params?.status) {
    filtered = filtered.filter((p) => p.status === params.status);
  }

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  return { data: filtered.slice(start, start + pageSize), total };
}

// ── Mock API: Tasks CRUD ──

export async function mockGetTasks(params?: {
  page?: number;
  pageSize?: number;
  status?: string;
  priority?: string;
}): Promise<{ data: DemoTask[]; total: number }> {
  await delay();
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 10;
  let filtered = clone(tasksStore);

  if (params?.status) {
    filtered = filtered.filter((t) => t.status === params.status);
  }
  if (params?.priority) {
    filtered = filtered.filter((t) => t.priority === params.priority);
  }

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  return { data: filtered.slice(start, start + pageSize), total };
}

export async function mockUpdateTask(
  id: number,
  updates: Partial<DemoTask>,
): Promise<DemoTask> {
  await delay(200);
  const idx = tasksStore.findIndex((t) => t.id === id);
  if (idx === -1) throw new Error('Task not found');
  tasksStore[idx] = { ...tasksStore[idx], ...updates };
  return clone(tasksStore[idx]);
}

// ── Mock API: Activities ──

export async function mockGetActivities(params?: {
  page?: number;
  pageSize?: number;
}): Promise<{ data: DemoActivity[]; total: number }> {
  await delay();
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 20;
  const total = activitiesStore.length;
  const start = (page - 1) * pageSize;
  return {
    data: clone(activitiesStore.slice(start, start + pageSize)),
    total,
  };
}

// ── Mock API: Dashboard Stats ──

export async function mockGetDashboardStats(): Promise<{
  totalUsers: number;
  activeUsers: number;
  revenue: number;
  orders: number;
  userGrowth: Array<{ month: string; value: number }>;
  revenueByCategory: Array<{ name: string; value: number }>;
  recentUsers: DemoUser[];
}> {
  await delay(300);
  return {
    totalUsers: 2847,
    activeUsers: 1243,
    revenue: 48250,
    orders: 856,
    userGrowth: [
      { month: 'Jan', value: 400 },
      { month: 'Feb', value: 600 },
      { month: 'Mar', value: 800 },
      { month: 'Apr', value: 1100 },
      { month: 'May', value: 1400 },
      { month: 'Jun', value: 1700 },
      { month: 'Jul', value: 2000 },
      { month: 'Aug', value: 2300 },
      { month: 'Sep', value: 2500 },
      { month: 'Oct', value: 2600 },
      { month: 'Nov', value: 2750 },
      { month: 'Dec', value: 2847 },
    ],
    revenueByCategory: [
      { name: 'Electronics', value: 18500 },
      { name: 'Furniture', value: 12400 },
      { name: 'Audio', value: 8200 },
      { name: 'Storage', value: 5500 },
      { name: 'Accessories', value: 3650 },
    ],
    recentUsers: clone(usersStore.slice(0, 5)),
  };
}

// ── Mock API: Table Demo Records ──

export interface DemoRecord {
  id: number;
  name: string;
  category: string;
  status: 'Active' | 'Inactive' | 'Pending';
  priority: 'High' | 'Medium' | 'Low';
  createdAt: string;
  updatedAt: string;
  description: string;
}

let recordsStore: DemoRecord[] = Array.from({ length: 35 }, (_, i) => ({
  id: i + 1,
  name: `Record #${i + 1} - ${PRODUCT_NAMES[i % PRODUCT_NAMES.length]}`,
  category: ['Electronics', 'Furniture', 'Audio', 'Storage'][i % 4],
  status: (['Active', 'Active', 'Inactive', 'Pending'] as const)[i % 4],
  priority: (['High', 'Medium', 'Low'] as const)[i % 3],
  createdAt: new Date(2024, 6, 1 + i * 5).toISOString().split('T')[0],
  updatedAt: new Date(2025, 3, 1 + i * 3).toISOString().split('T')[0],
  description: `Description for record #${i + 1}. This is a sample entry for demonstration purposes.`,
}));

export async function mockGetRecords(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  category?: string;
}): Promise<{ data: DemoRecord[]; total: number }> {
  await delay();
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 10;
  let filtered = clone(recordsStore);

  if (params?.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter(
      (r) => r.name.toLowerCase().includes(s) || r.description.toLowerCase().includes(s),
    );
  }
  if (params?.status) {
    filtered = filtered.filter((r) => r.status === params.status);
  }
  if (params?.category) {
    filtered = filtered.filter((r) => r.category === params.category);
  }

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  return { data: filtered.slice(start, start + pageSize), total };
}

export async function mockCreateRecord(
  record: Omit<DemoRecord, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<DemoRecord> {
  await delay(400);
  const newRecord: DemoRecord = {
    ...record,
    id: Math.max(0, ...recordsStore.map((r) => r.id)) + 1,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
  };
  recordsStore = [newRecord, ...recordsStore];
  return clone(newRecord);
}

export async function mockUpdateRecord(
  id: number,
  updates: Partial<DemoRecord>,
): Promise<DemoRecord> {
  await delay(300);
  const idx = recordsStore.findIndex((r) => r.id === id);
  if (idx === -1) throw new Error('Record not found');
  recordsStore[idx] = {
    ...recordsStore[idx],
    ...updates,
    updatedAt: new Date().toISOString().split('T')[0],
  };
  return clone(recordsStore[idx]);
}

export async function mockDeleteRecord(id: number): Promise<void> {
  await delay(300);
  recordsStore = recordsStore.filter((r) => r.id !== id);
}

// ── Re-export for convenience ──

export { FIRST_NAMES, LAST_NAMES, ROLES, CITIES, PRODUCT_NAMES };

// ── Notifications ──

export interface DemoNotification {
  id: number;
  icon: string; // lucide icon name
  title: string;
  description: string;
  timestamp: string; // ISO string
  read: boolean;
}

const NOTIF_TEMPLATES: Array<{ icon: string; title: string; description: string }> = [
  { icon: 'UserPlus', title: 'New user registered', description: 'Alice Anderson created an account' },
  { icon: 'FileText', title: 'Report generated', description: 'Monthly sales report is ready for review' },
  { icon: 'AlertTriangle', title: 'Storage warning', description: 'Disk usage exceeded 80% threshold' },
  { icon: 'CheckCircle', title: 'Deployment successful', description: 'v2.3.1 deployed to production' },
  { icon: 'Bell', title: 'Scheduled maintenance', description: 'Server maintenance in 2 days' },
  { icon: 'DollarSign', title: 'Payment received', description: 'Invoice #4829 paid — $2,450.00' },
  { icon: 'Users', title: 'Team invitation', description: 'You have been invited to "Engineering" team' },
  { icon: 'Star', title: 'Milestone reached', description: 'Project Alpha hit 1,000 commits' },
  { icon: 'MessageCircle', title: 'New comment', description: 'Bob commented on "Q3 Planning" document' },
  { icon: 'Zap', title: 'Update available', description: 'Console Frame v1.1.0 is available' },
];

let notifIdCounter = 30;

function generateNotifications(count: number): DemoNotification[] {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => {
    const tpl = NOTIF_TEMPLATES[i % NOTIF_TEMPLATES.length];
    return {
      id: notifIdCounter--,
      icon: tpl.icon,
      title: tpl.title,
      description: tpl.description,
      timestamp: new Date(now - i * 900000 - Math.random() * 3600000).toISOString(),
      read: i >= 5, // first 5 unread, rest read
    };
  });
}

let notificationsStore = generateNotifications(20);

export async function mockGetNotifications(): Promise<DemoNotification[]> {
  await delay(250);
  return clone(notificationsStore);
}

export async function mockMarkAllRead(): Promise<void> {
  await delay(150);
  notificationsStore = notificationsStore.map((n) => ({ ...n, read: true }));
}

export async function mockMarkOneRead(id: number): Promise<void> {
  await delay(100);
  const found = notificationsStore.find((n) => n.id === id);
  if (found) found.read = true;
}

// ── Profile ──

export interface DemoProfile {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  roles: string[];
  language: string;
  country: string;
  city: string;
  company: string;
  department: string;
  phone: string;
  timezone: string;
  activeStatus: string;
  loginTime: number;
  createdAt: string;
  lastPasswordChange: string;
  twoFactorEnabled: boolean;
  sessionCount: number;
  permissions: string[];
}

const MOCK_PROFILE: DemoProfile = {
  firstName: 'Alex',
  lastName: 'Morgan',
  email: 'alex.morgan@consoleframe.dev',
  userName: 'alexmorgan',
  roles: ['Admin', 'Developer'],
  language: 'English',
  country: 'United States',
  city: 'San Francisco',
  company: 'Console Frame Inc.',
  department: 'Engineering',
  phone: '+1 (415) 555-0192',
  timezone: 'America/Los_Angeles (UTC-8)',
  activeStatus: 'ACTIVE',
  loginTime: Date.now(),
  createdAt: '2024-09-15T08:00:00Z',
  lastPasswordChange: '2025-05-20T14:30:00Z',
  twoFactorEnabled: true,
  sessionCount: 3,
  permissions: ['user.read', 'user.write', 'product.read', 'product.write', 'task.read', 'task.write', 'system.admin', 'settings.write'],
};

export async function mockGetProfile(): Promise<DemoProfile> {
  await delay(300);
  return clone(MOCK_PROFILE);
}
