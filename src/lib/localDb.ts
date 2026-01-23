import { mockProperties } from "@/data/mockProperties";
import { mockReviews, type Review } from "@/data/mockReviews";
import type { Property } from "@/contexts/PropertiesContext";

const KEY_PREFIX = "ph:";
const KEY = {
  seeded: `${KEY_PREFIX}seeded`,
  users: `${KEY_PREFIX}users`,
  session: `${KEY_PREFIX}session`,
  properties: `${KEY_PREFIX}properties`,
  reviews: `${KEY_PREFIX}reviews`,
  leads: `${KEY_PREFIX}leads`,
  favorites: (userId: string) => `${KEY_PREFIX}favorites:${userId}`,
  comparisons: (userId: string) => `${KEY_PREFIX}comparisons:${userId}`,
  recentlyViewed: (userId: string) => `${KEY_PREFIX}recentlyViewed:${userId}`,
};

type UserRole = "admin" | "user" | "seller";

export interface LocalUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  provider?: "email";
  password: string; // demo only; stored in localStorage
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  provider?: "email";
}

export interface Lead {
  id: string;
  propertyId: string;
  propertyTitle: string;
  sellerId: string;
  sellerName: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  message?: string;
  status: "new" | "contacted" | "interested" | "not-interested" | "closed";
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

const listeners = new Set<() => void>();
export function subscribeLocalDb(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function emitChange() {
  for (const cb of listeners) cb();
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function read<T>(key: string, fallback: T): T {
  return safeParse<T>(localStorage.getItem(key), fallback);
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
  emitChange();
}

function nowIso() {
  return new Date().toISOString();
}

function genId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function ensureSeeded() {
  const already = localStorage.getItem(KEY.seeded);
  if (already === "1") return;

  // Seed properties + reviews
  write<Property[]>(KEY.properties, mockProperties);
  write<Review[]>(KEY.reviews, mockReviews);
  write<Lead[]>(KEY.leads, []);

  // Seed users (admin + demo seller)
  const users: LocalUser[] = [
    {
      id: "admin-1",
      email: "admin@local",
      name: "Local Admin",
      role: "admin",
      provider: "email",
      password: "admin123",
    },
    {
      id: "seller-1",
      email: "seller@local",
      name: "Local Seller",
      role: "seller",
      provider: "email",
      password: "seller123",
    },
  ];
  write<LocalUser[]>(KEY.users, users);

  localStorage.setItem(KEY.seeded, "1");
}

// -------------------------
// Auth
// -------------------------

export function getSession(): SessionUser | null {
  return read<SessionUser | null>(KEY.session, null);
}

export function setSession(user: SessionUser | null) {
  if (!user) {
    localStorage.removeItem(KEY.session);
    emitChange();
    return;
  }
  write(KEY.session, user);
}

export function listUsers(): LocalUser[] {
  return read<LocalUser[]>(KEY.users, []);
}

export function createUser(input: { email: string; password: string; name: string; role?: UserRole }) {
  const email = input.email.toLowerCase().trim();
  const users = listUsers();
  const exists = users.some((u) => u.email === email);
  if (exists) {
    return { ok: false as const, error: "User with this email already exists." };
  }
  const role: UserRole = input.role ?? "user";
  const user: LocalUser = {
    id: genId("user"),
    email,
    name: input.name.trim(),
    role,
    provider: "email",
    password: input.password,
  };
  write(KEY.users, [user, ...users]);
  const sessionUser: SessionUser = { id: user.id, email: user.email, name: user.name, role: user.role, provider: "email" };
  setSession(sessionUser);
  return { ok: true as const, user: sessionUser };
}

export function signInWithPassword(email: string, password: string) {
  const users = listUsers();
  const user = users.find((u) => u.email === email.toLowerCase().trim());
  if (!user || user.password !== password) {
    return { ok: false as const, error: "Invalid email or password." };
  }
  const sessionUser: SessionUser = { id: user.id, email: user.email, name: user.name, role: user.role, provider: "email" };
  setSession(sessionUser);
  return { ok: true as const, user: sessionUser };
}

export function signOut() {
  setSession(null);
}

// -------------------------
// Properties
// -------------------------

export function listProperties(): Property[] {
  return read<Property[]>(KEY.properties, []);
}

export function saveProperties(next: Property[]) {
  write<Property[]>(KEY.properties, next);
}

export function addPropertyLocal(property: Omit<Property, "id" | "approvalStatus" | "createdAt" | "updatedAt" | "views" | "enquiries">): Property {
  const next: Property = {
    ...property,
    id: genId("prop"),
    approvalStatus: "pending",
    createdAt: nowIso(),
    updatedAt: nowIso(),
    views: 0,
    enquiries: 0,
  };
  const properties = listProperties();
  saveProperties([next, ...properties]);
  return next;
}

export function updatePropertyLocal(propertyId: string, updates: Partial<Property>): Property | null {
  const properties = listProperties();
  let updated: Property | null = null;
  const next = properties.map((p) => {
    if (p.id !== propertyId) return p;
    updated = { ...p, ...updates, updatedAt: nowIso() };
    return updated;
  });
  saveProperties(next);
  return updated;
}

export function deletePropertyLocal(propertyId: string) {
  const properties = listProperties().filter((p) => p.id !== propertyId);
  saveProperties(properties);
}

// -------------------------
// Favorites / Comparison / Recently Viewed (per user)
// -------------------------

export function getFavorites(userId: string): string[] {
  return read<string[]>(KEY.favorites(userId), []);
}
export function setFavorites(userId: string, ids: string[]) {
  write(KEY.favorites(userId), ids);
}

export function getComparisons(userId: string): string[] {
  return read<string[]>(KEY.comparisons(userId), []);
}
export function setComparisons(userId: string, ids: string[]) {
  write(KEY.comparisons(userId), ids);
}

export function getRecentlyViewed(userId: string): string[] {
  return read<string[]>(KEY.recentlyViewed(userId), []);
}
export function setRecentlyViewed(userId: string, ids: string[]) {
  write(KEY.recentlyViewed(userId), ids);
}

// -------------------------
// Reviews
// -------------------------

export function listReviews(): Review[] {
  return read<Review[]>(KEY.reviews, []);
}
export function saveReviews(next: Review[]) {
  write(KEY.reviews, next);
}
export function addReviewLocal(input: Omit<Review, "id" | "date" | "helpful">): Review {
  const next: Review = {
    ...input,
    id: genId("rev"),
    date: new Date().toISOString().split("T")[0],
    helpful: 0,
  };
  saveReviews([next, ...listReviews()]);
  return next;
}
export function markReviewHelpful(reviewId: string): Review | null {
  const reviews = listReviews();
  let updated: Review | null = null;
  const next = reviews.map((r) => {
    if (r.id !== reviewId) return r;
    updated = { ...r, helpful: (r.helpful || 0) + 1 };
    return updated;
  });
  saveReviews(next);
  return updated;
}

// -------------------------
// Leads
// -------------------------

export function listLeads(): Lead[] {
  return read<Lead[]>(KEY.leads, []);
}

export function saveLeads(next: Lead[]) {
  write(KEY.leads, next);
}

export function addLeadLocal(input: Omit<Lead, "id" | "createdAt" | "updatedAt" | "status">): Lead {
  const lead: Lead = {
    ...input,
    id: genId("lead"),
    status: "new",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  saveLeads([lead, ...listLeads()]);
  return lead;
}

export function updateLeadLocal(leadId: string, updates: Partial<Pick<Lead, "status" | "notes">>): Lead | null {
  const leads = listLeads();
  let updated: Lead | null = null;
  const next = leads.map((l) => {
    if (l.id !== leadId) return l;
    updated = { ...l, ...updates, updatedAt: nowIso() };
    return updated;
  });
  saveLeads(next);
  return updated;
}

export function deleteLeadLocal(leadId: string) {
  saveLeads(listLeads().filter((l) => l.id !== leadId));
}


