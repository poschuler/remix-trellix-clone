import { prisma } from "~/db/db.server";

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
  const column = await prisma.item.create({
    data: {
      id,
      columnId,
      content,
      order,
    },
  });

  return column;
}

export async function deleteItem(id: string) {
  const column = await prisma.item.delete({
    where: {
      id,
    },
  });

  return column;
}

export async function updateItemColumn(
  id: string,
  columnId: string,
  order: number
) {
  const column = await prisma.item.update({
    where: {
      id,
    },
    data: {
      columnId,
      order,
    },
  });
  return column;
}
