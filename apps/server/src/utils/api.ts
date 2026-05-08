export type ApiDocument<T extends { id: string }> = T & {
  _id: string;
};

export type InsertOneResult = {
  acknowledged: true;
  insertedId: string;
};

export type DeleteOneResult = {
  acknowledged: true;
  deletedCount: number;
};

export type UpdateOneResult = {
  acknowledged: true;
  matchedCount: number;
  modifiedCount: number;
  upsertedCount: 0;
  upsertedId: null;
};

export const withMongoId = <T extends { id: string }>(
  row: T,
): ApiDocument<T> => ({
  ...row,
  _id: row.id,
});

export const withMongoIds = <T extends { id: string }>(
  rows: T[],
): ApiDocument<T>[] => rows.map(withMongoId);

export const toInsertOneResult = (rows: { id: string }[]): InsertOneResult => {
  const inserted = rows[0];
  if (!inserted) {
    throw new Error("Insert did not return an id");
  }

  return {
    acknowledged: true,
    insertedId: inserted.id,
  };
};

export const toDeleteOneResult = (deletedCount: number): DeleteOneResult => ({
  acknowledged: true,
  deletedCount,
});

export const toUpdateOneResult = (updatedCount: number): UpdateOneResult => ({
  acknowledged: true,
  matchedCount: updatedCount,
  modifiedCount: updatedCount,
  upsertedCount: 0,
  upsertedId: null,
});

export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "Unknown error";
