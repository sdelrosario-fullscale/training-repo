import { createApiClient, Fetcher } from '../apiClient';
import { CreateShiftInput, Employee, Shift } from '../models';

function createResponse(status: number, body: unknown): Response {
  return {
    json: jest.fn().mockResolvedValue(body),
    ok: status >= 200 && status < 300,
    status,
  } as unknown as Response;
}

describe('apiClient', () => {
  const baseUrl = 'http://localhost:3001';
  let fetcher: jest.MockedFunction<Fetcher>;

  beforeEach(() => {
    fetcher = jest.fn() as jest.MockedFunction<Fetcher>;
  });

  it('returns a typed GET response', async () => {
    const employee: Employee = {
      id: 'e1',
      name: 'Maria Santos',
      role: 'Front Desk',
      timezone: 'Asia/Manila',
      department: 'Operations',
    };
    fetcher.mockResolvedValue(createResponse(200, employee));
    const client = createApiClient(baseUrl, fetcher);

    const result = await client.get<Employee>('/employees/e1');

    expect(fetcher).toHaveBeenCalledWith(`${baseUrl}/employees/e1`, {
      method: 'GET',
    });
    expect(result).toEqual({ ok: true, data: employee, status: 200 });
  });

  it('serializes a typed POST body and returns its typed response', async () => {
    const input: CreateShiftInput = {
      date: '2026-08-12',
      startTime: '06:00',
      endTime: '14:00',
      role: 'Front Desk',
      location: 'Main Office',
      employeeId: null,
      employeeName: null,
      status: 'open',
      swappable: false,
    };
    const shift: Shift = { id: 's6', ...input };
    fetcher.mockResolvedValue(createResponse(201, shift));
    const client = createApiClient(baseUrl, fetcher);

    const result = await client.post<Shift, CreateShiftInput>('/shifts', input);

    expect(fetcher).toHaveBeenCalledWith(`${baseUrl}/shifts`, {
      body: JSON.stringify(input),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
    expect(result).toEqual({ ok: true, data: shift, status: 201 });
  });

  it('returns a typed HTTP error', async () => {
    fetcher.mockResolvedValue(
      createResponse(422, { message: 'Shift data is invalid' }),
    );
    const client = createApiClient(baseUrl, fetcher);

    const result = await client.get<Shift>('/shifts/missing');

    if (result.ok || result.error.kind !== 'http') {
      throw new Error('Expected an HTTP error');
    }

    expect(result.error.status).toBe(422);
    expect(result.error.message).toBe('Shift data is invalid');
  });

  it('returns a typed network error', async () => {
    fetcher.mockRejectedValue(new Error('Connection refused'));
    const client = createApiClient(baseUrl, fetcher);

    const result = await client.get<Employee[]>('/employees');

    if (result.ok || result.error.kind !== 'network') {
      throw new Error('Expected a network error');
    }

    expect(result.error).toEqual({
      kind: 'network',
      message: 'Connection refused',
    });
  });

  it('returns a typed decode error for invalid success data', async () => {
    const response = createResponse(200, null);
    (response.json as jest.Mock).mockRejectedValue(new SyntaxError('Invalid'));
    fetcher.mockResolvedValue(response);
    const client = createApiClient(baseUrl, fetcher);

    const result = await client.get<Employee[]>('/employees');

    if (result.ok || result.error.kind !== 'decode') {
      throw new Error('Expected a decode error');
    }

    expect(result.error).toEqual({
      kind: 'decode',
      message: 'Response body was not valid JSON',
      status: 200,
    });
  });
});
