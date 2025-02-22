export const isIgnoreRoute = (segment: string) => {
  return segment === "_app.tsx" || segment === "_document.tsx" || segment === "api" || segment === "layout.tsx";
};