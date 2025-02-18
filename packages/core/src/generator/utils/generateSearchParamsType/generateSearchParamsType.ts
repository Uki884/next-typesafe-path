import { Project } from "ts-morph";

export const generateSearchParamsType = (
  path: string,
  typeName = "SearchParams",
) => {
  try {
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(path);
    const searchParamsType: Record<string, string> = {};

    const typeAlias = sourceFile.getTypeAlias(typeName);
    if (!typeAlias) {
      throw new Error(`Type alias "${typeName}" not found in ${path}`);
    }

    const properties = typeAlias.getType().getProperties();

    for (const prop of properties) {
      const propName = prop.getName();
      const propType = prop.getTypeAtLocation(typeAlias).getText();
      const isOptional = prop.isOptional();
      searchParamsType[`${propName}${isOptional ? "?" : ""}`] = propType;
    }

    return searchParamsType;
  } catch (error) {
    console.error(`Error processing type "${typeName}" in ${path}:`, error);
    throw error;
  }
};
