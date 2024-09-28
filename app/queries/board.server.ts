import { asc, eq } from "drizzle-orm";
import { db } from "~/db/db.server";
import { boards, columns, items } from "~/db/scheme/schema.server";

export async function getBoards() {
  const boardsResult = await db.query.boards.findMany({
    with: {
      columns: {
        orderBy: [asc(columns.order)],
        with: {
          items: {
            orderBy: [asc(items.order)],
          },
        },
      },
    },
  });
  return boardsResult;
}

export async function getBoard(id: number) {
  const boardsResult = await db.query.boards.findFirst({
    where: (boards, { eq }) => eq(boards.id, id),
    with: {
      columns: {
        orderBy: [asc(columns.order)],
        with: {
          items: {
            orderBy: [asc(items.order)],
          },
        },
      },
    },
  });
  return boardsResult;
}

export async function createBoard({ name }: { name: string }) {
  const [board] = await db.insert(boards).values({ name }).returning();
  return board;
}

export async function deleteBoard(id: number) {
  const [board] = await db.delete(boards).where(eq(boards.id, id)).returning();
  return board;
}
