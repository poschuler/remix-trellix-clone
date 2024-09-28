import { eq } from "drizzle-orm";
import { db } from "~/db/db.server";
import { items } from "~/db/scheme/schema.server";

export async function createItem({
  id,
  content,
  order,
  columnId,
}: {
  id: string;
  content: string;
  order: number;
  columnId: string;
}) {
  const [column] = await db
    .insert(items)
    .values({
      id,
      columnId,
      content,
      order,
    })
    .returning();

  return column;
}

export async function deleteItem(id: string) {
  const [column] = await db.delete(items).where(eq(items.id, id)).returning();

  return column;
}

export async function updateItemColumn(
  id: string,
  columnId: string,
  order: number
) {
  const [column] = await db
    .update(items)
    .set({
      columnId,
      order,
    })
    .where(eq(items.id, id))
    .returning();

  return column;
}
