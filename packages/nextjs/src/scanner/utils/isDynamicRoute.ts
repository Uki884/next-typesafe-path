export const isDynamicRoute = (segment: string) => {
  // オプショナルキャッチオール [[...slug]]
  if (segment.startsWith("[[...") && segment.endsWith("]]")) {
    return "optional-catch-all";
  }
  // キャッチオール [...slug]
  if (segment.startsWith("[...") && segment.endsWith("]")) {
    return "catch-all";
  }
  // 通常の動的ルート [id]
  if (segment.startsWith("[") && segment.endsWith("]")) {
    return "dynamic";
  }
  return false;
};
