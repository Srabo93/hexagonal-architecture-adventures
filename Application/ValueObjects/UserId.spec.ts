import { describe, expect, it } from "bun:test";

import { UserId } from "./UserId.ts";

describe("UserId Value Object", () => {
  it("should throw error for empty ID", () => {
    expect(() => UserId.parse("")).toThrow("no uuid provided");
  });
});

