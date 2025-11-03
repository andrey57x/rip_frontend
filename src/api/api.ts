import axios from "axios";
import { USE_MOCK } from "../config/config";
import type { Reaction } from "../types/models";
import mockReactions from "../mock/reactions.json";
import axiosInstance from "./axiosInstance";

type Filters = {
  reaction_title?: string;
  limit?: number;
  offset?: number;
};

export async function getReactions(
  filters?: Filters,
  signal?: AbortSignal
): Promise<Reaction[]> {
  if (USE_MOCK) {
    return Promise.resolve(mockReactions as Reaction[]);
  }

  try {
    const response = await axiosInstance.get<Reaction[]>("/reactions", {
      params: filters,
      signal: signal,
    });
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
      return [];
    }
    throw new Error("Server responded with an error");
  }
}

export async function getReaction(
  id: number | string,
  signal?: AbortSignal
): Promise<Reaction | null> {
  if (USE_MOCK) {
    const found =
      (mockReactions as Reaction[]).find((r) => String(r.id) === String(id)) ||
      null;
    return Promise.resolve(found);
  }

  try {
    const response = await axiosInstance.get<Reaction>(`/reactions/${id}`, {
      signal,
    });
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
      return null;
    }
    throw new Error("Server responded with an error");
  }
}

export async function getCartInfo(
  signal?: AbortSignal
): Promise<{ id: number; reactions_count: number; cart_icon?: string }> {
  try {
    const response = await axiosInstance.get<{
      id: number;
      reactions_count: number;
      cart_icon?: string;
    }>("/mass-calculations/mass-calculation-cart-icon", { signal });
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
      return { id: -1, reactions_count: 0 };
    }
    throw new Error("Server responded with an error");
  }
}

export interface UserCredentials {
  login: string;
  password?: string;
}

interface AuthResponse {
  token: string;
}

export async function login(
  credentials: UserCredentials
): Promise<AuthResponse> {
  const response = await axiosInstance.post<AuthResponse>(
    "/users/sign-in",
    credentials
  );
  return response.data;
}

export async function register(credentials: UserCredentials): Promise<void> {
  await axiosInstance.post("/users/sign-up", credentials);
}

export async function logout(): Promise<void> {
  await axiosInstance.post("/users/sign-out");
}

interface ReactionWithOutput {
  reaction: Reaction;
  output_mass: number;
  input_mass: number;
}

export interface MassCalculationDetails {
  calculation: {
    id: number;
    status: string;
    date_create: string;
    output_koef?: number;
  };
  reactions: ReactionWithOutput[];
  total_reactions_count: number;
  completed_reactions_count: number;
}

export interface MassCalculationInList {
  id: number;
  status: string;
  date_create: string;
  creator_login: string;
}

export interface HistoryFilters {
  "from-date"?: string;
  "to-date"?: string;
  status?: string;
}

export async function addReactionToDraft(reactionId: number): Promise<void> {
  await axiosInstance.post(`/reactions/${reactionId}/add-to-calculation`);
}

export async function fetchCalculationById(
  calculationId: number
): Promise<MassCalculationDetails> {
  const response = await axiosInstance.get<MassCalculationDetails>(
    `/mass-calculations/${calculationId}`
  );
  return response.data;
}

export async function fetchCalculationsHistory(
  filters?: HistoryFilters
): Promise<MassCalculationInList[]> {
  const response = await axiosInstance.get<MassCalculationInList[]>(
    "/mass-calculations",
    { params: filters }
  );
  return response.data;
}

export async function removeReactionFromDraft(
  calculationId: number,
  reactionId: number
): Promise<void> {
  await axiosInstance.delete(
    `/reaction-calculations/${calculationId}/${reactionId}`
  );
}

export async function confirmDraft(calculationId: number): Promise<void> {
  await axiosInstance.put(`/mass-calculations/${calculationId}/form`);
}

export async function moderateCalculation(
  id: number,
  status: "completed" | "rejected"
): Promise<MassCalculationInList> {
  const response = await axiosInstance.put(
    `/mass-calculations/${id}/moderate`,
    { status }
  );
  return response.data;
}

export async function deleteCalculation(id: number): Promise<void> {
  await axiosInstance.delete(`/mass-calculations/${id}`);
}

export async function updateCalculationKoef(
  id: number,
  output_koef: number
): Promise<void> {
  await axiosInstance.put(`/mass-calculations/${id}`, { output_koef });
}

export interface UpdateMassPayload {
  calculationId: number;
  reactionId: number;
  output_mass: number;
}

export async function updateReactionMass(
  payload: UpdateMassPayload
): Promise<void> {
  await axiosInstance.put(
    `/reaction-calculations/${payload.calculationId}/${payload.reactionId}`,
    { output_mass: payload.output_mass }
  );
}

export interface UpdateProfilePayload {
  id: string;
  data: {
    login?: string;
    password?: string;
  };
}

export async function updateProfile(
  payload: UpdateProfilePayload
): Promise<void> {
  await axiosInstance.put(`/users/${payload.id}/profile`, payload.data);
}

export interface UserProfile {
  login: string;
  isModerator: boolean;
}

export async function getProfile(id: string): Promise<UserProfile> {
  const response = await axiosInstance.get(`/users/${id}/profile`);
  return response.data;
}
