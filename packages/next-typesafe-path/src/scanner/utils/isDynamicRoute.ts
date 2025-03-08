export const isDynamicRoute = (segment: string) => {
  // optional catch-all [[...slug]]
  if (segment.startsWith("[[...") && segment.endsWith("]]")) {
    return "optional-catch-all";
  }
  // catch-all [...slug]
  if (segment.startsWith("[...") && segment.endsWith("]")) {
    return "catch-all";
  }
  // normal dynamic route [id]
  if (segment.startsWith("[") && segment.endsWith("]")) {
    return "dynamic";
  }
  return false;
};
