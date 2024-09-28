import { prisma } from "~/db/db.server";

export async function getBoards() {
  const boards = await prisma.board.findMany();
  return boards;
}

export async function getBoard(id: number) {
  const boards = await prisma.board.findUnique({
    where: {
      id: id,
    },
    include: {
      columns: {
        include: {
          items: {
            orderBy: {
              order: "asc",
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });
  return boards;
}

export async function createBoard({ name }: { name: string }) {
  const board = await prisma.board.create({
    data: {
      name,
    },
  });

  return board;
}

export async function deleteBoard(id: number) {
  const board = await prisma.board.delete({
    where: {
      id,
    },
  });

  return board;
}
