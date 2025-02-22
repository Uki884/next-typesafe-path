export const isRouteGroup = (segment: string) => {
  return segment.startsWith("(") && segment.endsWith(")");
};
