import { v4 as uuid } from "uuid";
import type { SchemaField } from "../types/schemaTypes";

export const createDefaultField = (): SchemaField => ({
  id: uuid(),
  key: "",    
  type: "string",     
});
