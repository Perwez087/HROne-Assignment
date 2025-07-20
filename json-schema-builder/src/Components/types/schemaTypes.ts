export type FieldType = "string" | "number" | "nested";

export interface SchemaField {
  id: string;
  key: string;
  type: FieldType;
  children?: SchemaField[]; 
}
