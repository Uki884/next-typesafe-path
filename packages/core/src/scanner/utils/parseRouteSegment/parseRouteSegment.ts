import { RouteSegment } from "../../../types";
import {
  capitalizeFirstLetter,
  isKebabCase,
  toCamelCase,
} from "../../../utils";
import { RouteRule } from "../../createScanner";

export const parseRouteSegment = ({
  segment,
  parentSegment,
  rules,
}: {
  segment: string;
  parentSegment?: string;
  rules: RouteRule;
}): RouteSegment | null => {
  if (rules.ignoreRoute(segment)) {
    return null;
  }

  if (!rules.isDynamicRoute(segment)) {
    return {
      original: segment,
      parsed: segment,
      isDynamic: false,
      isPage: rules.isPage(segment),
      paramName: "",
      parentSegment,
    };
  }

  const rawParamName = segment.slice(1, -1);

  const paramName = getParamName({ parentSegment, segment });

  return {
    original: segment,
    parsed: rawParamName,
    isDynamic: true,
    isPage: rules.isPage(segment),
    paramName,
    parentSegment,
  };
};

const getParamName = ({
  segment,
  parentSegment,
}: {
  segment: string;
  parentSegment?: string;
}) => {
  const rawParamName = segment.slice(1, -1);
  const paramName = isKebabCase(rawParamName)
    ? toCamelCase(rawParamName)
    : rawParamName;

  if (!parentSegment) {
    return paramName;
  }

  const parentName = isKebabCase(parentSegment)
    ? toCamelCase(parentSegment)
    : parentSegment;
  return `${parentName}${capitalizeFirstLetter(paramName)}`;
};
