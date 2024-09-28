import { eq } from "drizzle-orm";
import { db } from "~/db/db.server";
import { columns } from "~/db/scheme/schema.server";

export async function createColumn({
  id,
  name,
  boardId,
}: {
  id: string;
  name: string;
  boardId: number;
}) {
  const columnCounterQuery = await db
    .select()
    .from(columns)
    .where(eq(columns.boardId, boardId));

  const columnCounter = columnCounterQuery.length;

  const [column] = await db
    .insert(columns)
    .values({
      id,
      boardId,
      name,
      order: columnCounter + 1,
    })
    .returning();

  return column;
}

export async function deleteColumn(id: string) {
  const [column] = await db
    .delete(columns)
    .where(eq(columns.id, id))
    .returning();
    
  return column;
}
