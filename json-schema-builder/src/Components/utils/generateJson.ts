import type { SchemaField } from "../types/schemaTypes";

export const generateJsonPreview = (fields: SchemaField[]): Record<string, any> => {
  const result: Record<string, any> = {};

  fields.forEach((field) => {
    if (!field.key.trim()) return;

    if (field.type === "nested" && field.children) {
      result[field.key] = generateJsonPreview(field.children);
    } else if (field.type === "string") {
      result[field.key] = "string value";
    } else if (field.type === "number") {
      result[field.key] = 0;
    }
  });

  return result;
};
