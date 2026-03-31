import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGet = vi.fn();
const mockSetJSON = vi.fn();
const mockIsAuthorized = vi.fn();

vi.mock("@/lib/db", () => ({
  getEventsStore: () => ({
    get: mockGet,
    setJSON: mockSetJSON,
  }),
}));

vi.mock("@/lib/auth", () => ({
  isAuthorized: (...args: unknown[]) => mockIsAuthorized(...args),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockIsAuthorized.mockReturnValue(false);
});

const { GET, PATCH, DELETE } = await import("./route");

function makeRequest(method: string, body?: unknown) {
  return new Request("http://localhost/api/admin/events", {
    method,
    headers: { "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}),
  }) as unknown as import("next/server").NextRequest;
}

describe("GET /api/admin/events", () => {
  it("returns 401 without auth", async () => {
    const res = await GET(makeRequest("GET"));
    expect(res.status).toBe(401);
  });

  it("returns events list", async () => {
    mockIsAuthorized.mockReturnValue(true);
    mockGet.mockResolvedValue([
      { id: 1, name: "Event 1" },
      { id: 2, name: "Event 2" },
    ]);
    const res = await GET(makeRequest("GET"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveLength(2);
  });
});

describe("PATCH /api/admin/events", () => {
  it("updates event fields", async () => {
    mockIsAuthorized.mockReturnValue(true);
    mockGet.mockResolvedValue([
      { id: 1, name: "Old Name", year: 2000, type: "history" },
    ]);
    const res = await PATCH(makeRequest("PATCH", { id: 1, name: "New Name" }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.event.name).toBe("New Name");
    expect(mockSetJSON).toHaveBeenCalled();
  });

  it("returns 404 for missing event", async () => {
    mockIsAuthorized.mockReturnValue(true);
    mockGet.mockResolvedValue([]);
    const res = await PATCH(makeRequest("PATCH", { id: 999, name: "X" }));
    expect(res.status).toBe(404);
  });

  it("rejects invalid name", async () => {
    mockIsAuthorized.mockReturnValue(true);
    mockGet.mockResolvedValue([{ id: 1, name: "Test", year: 2000 }]);
    const res = await PATCH(makeRequest("PATCH", { id: 1, name: "" }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/name/i);
  });

  it("rejects invalid year", async () => {
    mockIsAuthorized.mockReturnValue(true);
    mockGet.mockResolvedValue([{ id: 1, name: "Test", year: 2000 }]);
    const res = await PATCH(makeRequest("PATCH", { id: 1, year: 0 }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/year/i);
  });

  it("rejects invalid type", async () => {
    mockIsAuthorized.mockReturnValue(true);
    mockGet.mockResolvedValue([{ id: 1, name: "Test", year: 2000 }]);
    const res = await PATCH(makeRequest("PATCH", { id: 1, type: "nonsense" }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/type/i);
  });

  it("rejects invalid month", async () => {
    mockIsAuthorized.mockReturnValue(true);
    mockGet.mockResolvedValue([{ id: 1, name: "Test", year: 2000 }]);
    const res = await PATCH(makeRequest("PATCH", { id: 1, month: 13 }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/month/i);
  });
});

describe("DELETE /api/admin/events", () => {
  it("removes event", async () => {
    mockIsAuthorized.mockReturnValue(true);
    mockGet.mockResolvedValue([
      { id: 1, name: "Event 1" },
      { id: 2, name: "Event 2" },
    ]);
    const res = await DELETE(makeRequest("DELETE", { id: 1 }));
    expect(res.status).toBe(200);
    expect(mockSetJSON).toHaveBeenCalledWith("all", [{ id: 2, name: "Event 2" }]);
  });

  it("returns 404 for missing event", async () => {
    mockIsAuthorized.mockReturnValue(true);
    mockGet.mockResolvedValue([]);
    const res = await DELETE(makeRequest("DELETE", { id: 999 }));
    expect(res.status).toBe(404);
  });
});
