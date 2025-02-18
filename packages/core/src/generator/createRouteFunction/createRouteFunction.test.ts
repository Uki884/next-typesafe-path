import path from "path";
import { describe, expect, it } from "vitest";
import { createScanner } from "../../scanner/createScanner";
import { createRouteFunction } from "./createRouteFunction";

const testDir = path.resolve("src/fixtures");

describe("createRouteFunction", () => {
  it("静的なルートを正しく生成する", () => {
    const scanner = createScanner({
      rules: {
        ignoreRoute: (segment) =>
          segment.startsWith("(") && segment.endsWith(")"),
        isDynamicRoute: (segment) =>
          segment.startsWith("[") && segment.endsWith("]"),
        isPage: (segment) => segment === "page.tsx" || segment === "page.ts",
      },
      baseDir: testDir,
    });
    const segments = scanner({});
    // console.log(segments);

    // console.log(result);

    // expect(result()).toBe('/users')
  });
});
