import { apiClient, ApiClient } from './apiClient';
import {
  Availability,
  CreateShiftInput,
  CreateSwapRequestInput,
  Employee,
  Shift,
  SwapRequest,
} from './models';

export type ShiftFilters = {
  date?: string;
  employeeId?: string;
};

function buildShiftPath(filters: ShiftFilters): string {
  const query: string[] = [];

  if (filters.date !== undefined) {
    query.push(`date=${encodeURIComponent(filters.date)}`);
  }

  if (filters.employeeId !== undefined) {
    query.push(`employeeId=${encodeURIComponent(filters.employeeId)}`);
  }

  return query.length === 0 ? '/shifts' : `/shifts?${query.join('&')}`;
}

export function createWorkforceApi(client: ApiClient) {
  return {
    getShifts: (filters: ShiftFilters = {}) =>
      client.get<Shift[]>(buildShiftPath(filters)),
    getShift: (id: string) => client.get<Shift>(`/shifts/${id}`),
    createShift: (input: CreateShiftInput) =>
      client.post<Shift, CreateShiftInput>('/shifts', input),
    getEmployees: () => client.get<Employee[]>('/employees'),
    getEmployee: (id: string) => client.get<Employee>(`/employees/${id}`),
    getAvailability: (week: string, timezone: string) =>
      client.get<Availability[]>(
        `/availability?week=${encodeURIComponent(
          week,
        )}&timezone=${encodeURIComponent(timezone)}`,
      ),
    createSwapRequest: (input: CreateSwapRequestInput) =>
      client.post<SwapRequest, CreateSwapRequestInput>('/swap-requests', input),
  };
}

export const workforceApi = createWorkforceApi(apiClient);
