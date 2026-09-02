export type ShiftStatus = 'filled' | 'open';

export type Shift = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  role: string;
  location: string;
  employeeId: string | null;
  employeeName: string | null;
  status: ShiftStatus;
  swappable: boolean;
};

export type CreateShiftInput = Omit<Shift, 'id'>;

export type Employee = {
  id: string;
  name: string;
  role: string;
  timezone: string;
  department: string;
};

export type Weekday = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export type Availability = {
  id: string;
  employeeId: string;
  week: string;
  availableDays: Weekday[];
  timezone: string;
};

export type SwapRequestStatus = 'approved' | 'pending' | 'rejected';

export type SwapRequest = {
  id: string;
  shiftId: string;
  requestedByEmployeeId: string;
  requestedToEmployeeId: string | null;
  status: SwapRequestStatus;
  createdAt: string;
};

export type CreateSwapRequestInput = Omit<
  SwapRequest,
  'createdAt' | 'id' | 'status'
>;
