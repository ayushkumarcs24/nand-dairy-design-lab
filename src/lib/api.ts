import { QueryClient } from "@tanstack/react-query";

const API_BASE_URL = "http://localhost:4000/api";

export const queryClient = new QueryClient();

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const data = (await res.json()) as { message?: string };
      if (data?.message) message = data.message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as unknown as T;
  return (await res.json()) as T;
}

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: "OWNER" | "SAMITI" | "FARMER" | "DISTRIBUTOR" | "LOGISTICS";
}

export async function loginApi(params: {
  email: string;
  password: string;
  expectedRole?: AuthUser["role"];
}): Promise<AuthUser> {
  return apiFetch<AuthUser>("/auth/login", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export async function logoutApi(): Promise<void> {
  await apiFetch<void>("/auth/logout", { method: "POST" });
}

export async function getMe(): Promise<AuthUser> {
  return apiFetch<AuthUser>("/auth/me", { method: "GET" });
}

export interface FarmerDashboardSummary {
  totalMilk: number;
  totalEarnings: number;
  avgFat: number;
  avgSnf: number;
  entries: Array<{
    id: number;
    date: string;
    session: "MORNING" | "EVENING";
    quantityLitre: number;
    fat: number;
    snf: number;
    totalAmount: number;
  }>;
}

export async function getFarmerDashboardSummary(): Promise<FarmerDashboardSummary> {
  return apiFetch<FarmerDashboardSummary>("/farmer/dashboard-summary", {
    method: "GET",
  });
}

export async function createMilkEntry(input: {
  session: "MORNING" | "EVENING";
  quantityLitre: number;
  fat: number;
  snf: number;
}): Promise<void> {
  await apiFetch("/farmer/milk-entries", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export interface OwnerDashboardSummary {
  samitiCount: number;
  productCount: number;
  distributors: number;
  orders: number;
  milkEntries: number;
}

export async function getOwnerDashboardSummary(): Promise<OwnerDashboardSummary> {
  return apiFetch<OwnerDashboardSummary>("/owner/dashboard-summary", {
    method: "GET",
  });
}

export interface OwnerSamitiSummary {
  id: number;
  name: string;
  code: string;
  location: string;
  contactName: string;
  contactEmail: string;
  latestMonth: number | null;
  latestYear: number | null;
  latestTotalMilk: number;
  latestTotalPayout: number;
}

export async function getOwnerSamitis(): Promise<OwnerSamitiSummary[]> {
  return apiFetch<OwnerSamitiSummary[]>("/owner/samitis", { method: "GET" });
}

export interface OwnerDistributorSummary {
  id: number;
  name: string;
  email: string;
  totalOrders: number;
  totalValue: number;
}

export async function getOwnerDistributors(): Promise<OwnerDistributorSummary[]> {
  return apiFetch<OwnerDistributorSummary[]>("/owner/distributors", { method: "GET" });
}
