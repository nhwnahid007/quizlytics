export type DbJsonPrimitive = string | number | boolean | null;
export type DbJsonValue =
  | DbJsonPrimitive
  | DbJsonValue[]
  | { [key: string]: DbJsonValue };
