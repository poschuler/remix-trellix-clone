import { prisma } from "~/db/db.server";

export async function createColumn({
  id,
  name,
  boardId,
}: {
  id: string;
  name: string;
  boardId: number;
}) {
  const columnCounter = await prisma.column.count({
    where: {
      boardId,
    },
  });

  const column = await prisma.column.create({
    data: {
      id,
      boardId,
      name,
      order: columnCounter + 1,
    },
  });

  return column;
}

export async function deleteColumn(id: string) {
  const column = await prisma.column.delete({
    where: {
      id,
    },
  });

  return column;
}
