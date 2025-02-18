import path from "path";
import { describe, expect, it } from "vitest";
import { createScanner } from "./createScanner";
const testDir = path.resolve("src/fixtures");

describe("createScanner", () => {
  it("should parse segments", async () => {
    const scaner = createScanner({
      rules: {
        ignoreRoute: (segment) =>
          segment.startsWith("(") && segment.endsWith(")"),
        isDynamicRoute: (segment) =>
          segment.startsWith("[") && segment.endsWith("]"),
        isPage: (segment) => segment === "page.tsx" || segment === "page.ts",
      },
      baseDir: testDir,
    });

    const result = scaner();
    const withRouteSegments = result.map((r) => ({
      functionName: r.functionName,
      urlPath: r.urlPath,
      searchParamsType: r.searchParamsType,
    }));

    expect(withRouteSegments).toEqual([
      {
        functionName: "usersIdCamelCaseCamelCaseId",
        urlPath: "/users/${usersId}/camelCase/${camelCaseCamelCaseId}/",
        searchParamsType: { page: "string | number" },
      },
      {
        functionName: "usersIdKebabCaseKebabId",
        urlPath: "/users/${usersId}/kebab-case/${kebabCaseKebabId}/",
        searchParamsType: { page: "string | number" },
      },
      {
        functionName: "usersId",
        urlPath: "/users/${usersId}/",
        searchParamsType: { id: "string | number" },
      },
      {
        functionName: "usersArray",
        urlPath: "/users/array/",
        searchParamsType: {
          "categoryIds[]": "string[]",
          "serviceIds[]": "number[]",
        },
      },
      {
        functionName: "usersDuplicateIdIdNestedId",
        urlPath:
          "/users/duplicate/${duplicateId}/${duplicateId}/nested/${nestedId}/",
        searchParamsType: { page: "number" },
      },
      {
        functionName: "usersNestedYearMonth",
        urlPath: "/users/nested/${nestedYear}/${nestedMonth}/",
        searchParamsType: { page: "number" },
      },
      {
        functionName: "users",
        urlPath: "/users/",
        searchParamsType: { "page?": "number" },
      },
    ]);
  });
});
