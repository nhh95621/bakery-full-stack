import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TRPCError } from "@trpc/server";
import type { TrpcContext } from "../../backend/_core/context";

vi.mock("../../backend/db", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../backend/db")>();
  return {
    ...actual,
    getOrderById: vi.fn(),
    getOrderItems: vi.fn(),
  };
});

import { getOrderById, getOrderItems } from "../../backend/db";
import { appRouter } from "../../backend/routers";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(userId: number, role: AuthenticatedUser["role"] = "user"): TrpcContext {
  return {
    user: {
      id: userId,
      openId: `member-${userId}`,
      email: `member-${userId}@example.com`,
      name: "Boulangerie Member",
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("orders.get access control", () => {
  beforeEach(() => {
    vi.mocked(getOrderById).mockReset();
    vi.mocked(getOrderItems).mockReset();
  });

  afterEach(() => vi.clearAllMocks());

  it("rejects a member trying to inspect another member's order", async () => {
    vi.mocked(getOrderById).mockResolvedValue({ id: 88, userId: 99 } as never);

    const caller = appRouter.createCaller(createContext(17));

    await expect(caller.orders.get({ id: 88 })).rejects.toMatchObject<Partial<TRPCError>>({
      code: "FORBIDDEN",
    });
    expect(getOrderItems).not.toHaveBeenCalled();
  });

  it("returns the order and its items to its owner", async () => {
    vi.mocked(getOrderById).mockResolvedValue({ id: 88, userId: 17, status: "shipped" } as never);
    vi.mocked(getOrderItems).mockResolvedValue([{ id: 2, productName: "Tarte Citron" }] as never);

    const caller = appRouter.createCaller(createContext(17));
    const result = await caller.orders.get({ id: 88 });

    expect(result).toMatchObject({ id: 88, userId: 17, status: "shipped" });
    expect(result.items).toEqual([{ id: 2, productName: "Tarte Citron" }]);
  });
});
