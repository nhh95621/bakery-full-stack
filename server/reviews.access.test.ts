import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createAnonymousContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("reviews.listMine", () => {
  it("rejects unauthenticated access before a user-scoped review query can run", async () => {
    const caller = appRouter.createCaller(createAnonymousContext());

    await expect(caller.reviews.listMine()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });
});
